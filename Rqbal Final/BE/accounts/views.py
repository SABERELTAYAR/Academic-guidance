from django.shortcuts import render, get_object_or_404
from rest_framework import generics, status, permissions, viewsets
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.decorators import action
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model, authenticate
from django.core.mail import send_mail
from django.conf import settings
from django.utils.crypto import get_random_string
from django.utils import timezone
from datetime import timedelta
from .serializers import (
    UserRegistrationSerializer, UserLoginSerializer, UserProfileSerializer,
    ChangePasswordSerializer, ResetPasswordEmailSerializer, ResetPasswordSerializer,
    AdminProfileSerializer, ProfessorProfileSerializer,
    AssistantProfileSerializer, StudentProfileSerializer,
    AdminUserManagementSerializer, CourseSerializer, CourseDetailSerializer,
    CourseTeachingSerializer, CourseAssistanceSerializer, CourseEnrollmentSerializer,
    ClassRoomSerializer, TimeSlotSerializer, StudyScheduleSerializer, ScheduleChangeSerializer,
    ProfessorCourseSerializer, AssistantCourseSerializer, ProfessorScheduleSerializer, AssistantScheduleSerializer,
    CourseEnrollmentDetailsSerializer, StudyScheduleEnrollmentSerializer,
    StudentCourseEnrollmentSerializer, StudentScheduleSerializer
)
from .models import (
    AdminProfile, ProfessorProfile, AssistantProfile, StudentProfile,
    Course, CourseTeaching, CourseAssistance, CourseEnrollment,
    ClassRoom, TimeSlot, StudySchedule, ScheduleChange
)

User = get_user_model()

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (permissions.AllowAny,)
    serializer_class = UserRegistrationSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        
        refresh = RefreshToken.for_user(user)
        
        return Response({
            'user': UserProfileSerializer(user).data,
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        }, status=status.HTTP_201_CREATED)

class LoginView(APIView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request):
        serializer = UserLoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        user = authenticate(
            username=serializer.validated_data['username'],
            password=serializer.validated_data['password']
        )
        
        if user:
            refresh = RefreshToken.for_user(user)
            return Response({
                'user': UserProfileSerializer(user).data,
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            })
        
        return Response(
            {'error': 'Invalid credentials'},
            status=status.HTTP_401_UNAUTHORIZED
        )

class ProfileView(generics.RetrieveUpdateAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = UserProfileSerializer

    def get_object(self):
        return self.request.user

    def get_profile_serializer(self):
        user_type = self.request.user.user_type
        if user_type == 'admin':
            return AdminProfileSerializer
        elif user_type == 'professor':
            return ProfessorProfileSerializer
        elif user_type == 'assistant':
            return AssistantProfileSerializer
        elif user_type == 'student':
            return StudentProfileSerializer
        return None

    def update(self, request, *args, **kwargs):
        # Update user data
        user_data = {}
        for field in ['email', 'first_name', 'last_name']:
            if field in request.data:
                user_data[field] = request.data[field]
        
        if user_data:
            user_serializer = self.get_serializer(
                request.user,
                data=user_data,
                partial=True
            )
            user_serializer.is_valid(raise_exception=True)
            user_serializer.save()

        # Update profile data if provided
        profile = request.user.get_profile()
        if profile and 'profile' in request.data:
            profile_serializer = self.get_profile_serializer()(
                profile,
                data=request.data['profile'],
                partial=True
            )
            profile_serializer.is_valid(raise_exception=True)
            profile_serializer.save()

        # Return updated user data
        return Response(self.get_serializer(request.user).data)

class ChangePasswordView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request):
        serializer = ChangePasswordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        # Check old password
        if not request.user.check_password(serializer.validated_data['old_password']):
            return Response(
                {'error': 'Wrong password.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Set new password
        request.user.set_password(serializer.validated_data['new_password'])
        request.user.save()

        return Response({'message': 'Password changed successfully.'})

class ResetPasswordEmailView(APIView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request):
        serializer = ResetPasswordEmailSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        try:
            user = User.objects.get(email=serializer.validated_data['email'])
            
            # Generate password reset token
            token = get_random_string(64)
            user.password_reset_token = token
            user.password_reset_token_created = timezone.now()
            user.save()

            # Send reset password email
            reset_url = f"{settings.FRONTEND_URL}/reset-password/{token}"
            send_mail(
                'Reset Your Password',
                f'Click the following link to reset your password: {reset_url}',
                settings.DEFAULT_FROM_EMAIL,
                [user.email],
                fail_silently=False,
            )

            return Response({'message': 'Password reset email sent.'})
        except User.DoesNotExist:
            return Response(
                {'error': 'User with this email does not exist.'},
                status=status.HTTP_404_NOT_FOUND
            )

class ResetPasswordView(APIView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request):
        serializer = ResetPasswordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        try:
            user = User.objects.get(
                password_reset_token=serializer.validated_data['token'],
                password_reset_token_created__gte=timezone.now() - timedelta(hours=24)
            )

            # Set new password
            user.set_password(serializer.validated_data['new_password'])
            user.password_reset_token = None
            user.password_reset_token_created = None
            user.save()

            return Response({'message': 'Password reset successfully.'})
        except User.DoesNotExist:
            return Response(
                {'error': 'Invalid or expired token.'},
                status=status.HTTP_400_BAD_REQUEST
            )

class IsAdminUser(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.user_type == 'admin'

class AdminUserManagementViewSet(viewsets.ModelViewSet):
    """
    ViewSet for admin to manage users (professor, assistant, student)
    """
    queryset = User.objects.exclude(user_type='admin')
    serializer_class = AdminUserManagementSerializer
    permission_classes = [IsAdminUser]

    def get_queryset(self):
        queryset = super().get_queryset()
        user_type = self.request.query_params.get('user_type', None)
        if user_type:
            queryset = queryset.filter(user_type=user_type)
        return queryset

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return Response(
            self.get_serializer(user).data,
            status=status.HTTP_201_CREATED
        )

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return Response(self.get_serializer(user).data)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        # Instead of deleting, we can deactivate the user
        instance.is_active = False
        instance.save()
        return Response(status=status.HTTP_204_NO_CONTENT)

class CourseViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing courses
    """
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    permission_classes = [IsAdminUser]

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return CourseDetailSerializer
        return CourseSerializer

    def get_queryset(self):
        queryset = Course.objects.all()
        department = self.request.query_params.get('department', None)
        level = self.request.query_params.get('level', None)
        
        if department:
            queryset = queryset.filter(department=department)
        if level:
            queryset = queryset.filter(level=level)
            
        return queryset

class CourseTeachingViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing course teaching assignments
    """
    queryset = CourseTeaching.objects.all()
    serializer_class = CourseTeachingSerializer
    permission_classes = [IsAdminUser]

    def get_queryset(self):
        queryset = CourseTeaching.objects.all()
        course = self.request.query_params.get('course', None)
        professor = self.request.query_params.get('professor', None)
        semester = self.request.query_params.get('semester', None)
        year = self.request.query_params.get('year', None)

        if course:
            queryset = queryset.filter(course_id=course)
        if professor:
            queryset = queryset.filter(professor_id=professor)
        if semester:
            queryset = queryset.filter(semester=semester)
        if year:
            queryset = queryset.filter(year=year)

        return queryset

class CourseAssistanceViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing course assistance assignments
    """
    queryset = CourseAssistance.objects.all()
    serializer_class = CourseAssistanceSerializer
    permission_classes = [IsAdminUser]

    def get_queryset(self):
        queryset = CourseAssistance.objects.all()
        course = self.request.query_params.get('course', None)
        assistant = self.request.query_params.get('assistant', None)
        professor = self.request.query_params.get('professor', None)
        semester = self.request.query_params.get('semester', None)
        year = self.request.query_params.get('year', None)

        if course:
            queryset = queryset.filter(course_id=course)
        if assistant:
            queryset = queryset.filter(assistant_id=assistant)
        if professor:
            queryset = queryset.filter(professor_id=professor)
        if semester:
            queryset = queryset.filter(semester=semester)
        if year:
            queryset = queryset.filter(year=year)

        return queryset

class CourseEnrollmentViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing course enrollments
    """
    queryset = CourseEnrollment.objects.all()
    serializer_class = CourseEnrollmentSerializer
    permission_classes = [IsAdminUser]

    def get_queryset(self):
        queryset = CourseEnrollment.objects.all()
        course = self.request.query_params.get('course', None)
        student = self.request.query_params.get('student', None)
        status = self.request.query_params.get('status', None)
        semester = self.request.query_params.get('semester', None)
        year = self.request.query_params.get('year', None)

        if course:
            queryset = queryset.filter(course_id=course)
        if student:
            queryset = queryset.filter(student_id=student)
        if status:
            queryset = queryset.filter(status=status)
        if semester:
            queryset = queryset.filter(semester=semester)
        if year:
            queryset = queryset.filter(year=year)

        return queryset

class ClassRoomViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing classrooms
    """
    queryset = ClassRoom.objects.all()
    serializer_class = ClassRoomSerializer
    permission_classes = [IsAdminUser]

    def get_queryset(self):
        queryset = ClassRoom.objects.all()
        building = self.request.query_params.get('building', None)
        room_type = self.request.query_params.get('room_type', None)
        has_projector = self.request.query_params.get('has_projector', None)
        has_computer = self.request.query_params.get('has_computer', None)

        if building:
            queryset = queryset.filter(building=building)
        if room_type:
            queryset = queryset.filter(room_type=room_type)
        if has_projector is not None:
            queryset = queryset.filter(has_projector=has_projector.lower() == 'true')
        if has_computer is not None:
            queryset = queryset.filter(has_computer=has_computer.lower() == 'true')

        return queryset

class TimeSlotViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing time slots
    """
    queryset = TimeSlot.objects.all()
    serializer_class = TimeSlotSerializer
    permission_classes = [IsAdminUser]

    def get_queryset(self):
        queryset = TimeSlot.objects.all()
        slot_type = self.request.query_params.get('slot_type', None)
        is_active = self.request.query_params.get('is_active', None)

        if slot_type:
            queryset = queryset.filter(slot_type=slot_type)
        if is_active is not None:
            queryset = queryset.filter(is_active=is_active.lower() == 'true')

        return queryset.order_by('start_time')

class StudyScheduleViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing study schedules
    """
    queryset = StudySchedule.objects.all()
    serializer_class = StudyScheduleSerializer
    permission_classes = [IsAdminUser]

    def get_queryset(self):
        queryset = StudySchedule.objects.all()
        course = self.request.query_params.get('course', None)
        professor = self.request.query_params.get('professor', None)
        classroom = self.request.query_params.get('classroom', None)
        day = self.request.query_params.get('day', None)
        semester = self.request.query_params.get('semester', None)
        academic_year = self.request.query_params.get('academic_year', None)
        is_active = self.request.query_params.get('is_active', None)

        if course:
            queryset = queryset.filter(course_id=course)
        if professor:
            queryset = queryset.filter(professor_id=professor)
        if classroom:
            queryset = queryset.filter(classroom_id=classroom)
        if day:
            queryset = queryset.filter(day=day)
        if semester:
            queryset = queryset.filter(semester=semester)
        if academic_year:
            queryset = queryset.filter(academic_year=academic_year)
        if is_active is not None:
            queryset = queryset.filter(is_active=is_active.lower() == 'true')

        return queryset.order_by('semester', 'day', 'time_slot')

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user.admin_profile)

class ScheduleChangeViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing schedule changes
    """
    queryset = ScheduleChange.objects.all()
    serializer_class = ScheduleChangeSerializer
    permission_classes = [IsAdminUser]

    def get_queryset(self):
        queryset = ScheduleChange.objects.all()
        schedule = self.request.query_params.get('schedule', None)
        change_type = self.request.query_params.get('change_type', None)
        notification_sent = self.request.query_params.get('notification_sent', None)

        if schedule:
            queryset = queryset.filter(schedule_id=schedule)
        if change_type:
            queryset = queryset.filter(change_type=change_type)
        if notification_sent is not None:
            queryset = queryset.filter(notification_sent=notification_sent.lower() == 'true')

        return queryset.order_by('-created_at')

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user.admin_profile)

class IsProfessor(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.user_type == 'professor'

class IsAssistant(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.user_type == 'assistant'

class ProfessorCourseViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet for professors to view their courses
    """
    serializer_class = ProfessorCourseSerializer
    permission_classes = [IsProfessor]

    def get_queryset(self):
        professor_profile = get_object_or_404(ProfessorProfile, user=self.request.user)
        queryset = CourseTeaching.objects.filter(professor=professor_profile)
        
        semester = self.request.query_params.get('semester', None)
        year = self.request.query_params.get('year', None)
        is_primary = self.request.query_params.get('is_primary', None)

        if semester:
            queryset = queryset.filter(semester=semester)
        if year:
            queryset = queryset.filter(year=year)
        if is_primary is not None:
            queryset = queryset.filter(is_primary_instructor=is_primary.lower() == 'true')

        return queryset.select_related('course')

class AssistantCourseViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet for assistants to view their courses
    """
    serializer_class = AssistantCourseSerializer
    permission_classes = [IsAssistant]

    def get_queryset(self):
        assistant_profile = get_object_or_404(AssistantProfile, user=self.request.user)
        queryset = CourseAssistance.objects.filter(assistant=assistant_profile)
        
        semester = self.request.query_params.get('semester', None)
        year = self.request.query_params.get('year', None)
        professor = self.request.query_params.get('professor', None)

        if semester:
            queryset = queryset.filter(semester=semester)
        if year:
            queryset = queryset.filter(year=year)
        if professor:
            queryset = queryset.filter(professor_id=professor)

        return queryset.select_related('course', 'professor')

class ProfessorScheduleViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet for professors to view their schedules
    """
    serializer_class = ProfessorScheduleSerializer
    permission_classes = [IsProfessor]

    def get_queryset(self):
        professor_profile = get_object_or_404(ProfessorProfile, user=self.request.user)
        queryset = StudySchedule.objects.filter(professor=professor_profile)
        
        semester = self.request.query_params.get('semester', None)
        academic_year = self.request.query_params.get('academic_year', None)
        day = self.request.query_params.get('day', None)
        is_active = self.request.query_params.get('is_active', None)

        if semester:
            queryset = queryset.filter(semester=semester)
        if academic_year:
            queryset = queryset.filter(academic_year=academic_year)
        if day:
            queryset = queryset.filter(day=day)
        if is_active is not None:
            queryset = queryset.filter(is_active=is_active.lower() == 'true')

        return queryset.select_related('course', 'classroom', 'time_slot').prefetch_related('assistants')

class AssistantScheduleViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet for assistants to view their schedules
    """
    serializer_class = AssistantScheduleSerializer
    permission_classes = [IsAssistant]

    def get_queryset(self):
        assistant_profile = get_object_or_404(AssistantProfile, user=self.request.user)
        queryset = StudySchedule.objects.filter(assistants=assistant_profile)
        
        semester = self.request.query_params.get('semester', None)
        academic_year = self.request.query_params.get('academic_year', None)
        day = self.request.query_params.get('day', None)
        professor = self.request.query_params.get('professor', None)
        is_active = self.request.query_params.get('is_active', None)

        if semester:
            queryset = queryset.filter(semester=semester)
        if academic_year:
            queryset = queryset.filter(academic_year=academic_year)
        if day:
            queryset = queryset.filter(day=day)
        if professor:
            queryset = queryset.filter(professor_id=professor)
        if is_active is not None:
            queryset = queryset.filter(is_active=is_active.lower() == 'true')

        return queryset.select_related('course', 'professor', 'classroom', 'time_slot')

class ProfessorCourseEnrollmentViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet for professors to view enrollments in their courses
    """
    serializer_class = CourseEnrollmentDetailsSerializer
    permission_classes = [IsProfessor]

    def get_queryset(self):
        professor_profile = get_object_or_404(ProfessorProfile, user=self.request.user)
        # Get all courses taught by the professor
        teaching_courses = CourseTeaching.objects.filter(professor=professor_profile).values_list('course', flat=True)
        
        queryset = CourseEnrollment.objects.filter(course__in=teaching_courses)
        
        # Filter parameters
        course = self.request.query_params.get('course', None)
        semester = self.request.query_params.get('semester', None)
        year = self.request.query_params.get('year', None)
        status = self.request.query_params.get('status', None)

        if course:
            queryset = queryset.filter(course_id=course)
        if semester:
            queryset = queryset.filter(semester=semester)
        if year:
            queryset = queryset.filter(year=year)
        if status:
            queryset = queryset.filter(status=status)

        return queryset.select_related('student', 'student__user', 'course')

class AssistantCourseEnrollmentViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet for assistants to view enrollments in their courses
    """
    serializer_class = CourseEnrollmentDetailsSerializer
    permission_classes = [IsAssistant]

    def get_queryset(self):
        assistant_profile = get_object_or_404(AssistantProfile, user=self.request.user)
        # Get all courses assisted by the assistant
        assisting_courses = CourseAssistance.objects.filter(assistant=assistant_profile).values_list('course', flat=True)
        
        queryset = CourseEnrollment.objects.filter(course__in=assisting_courses)
        
        # Filter parameters
        course = self.request.query_params.get('course', None)
        semester = self.request.query_params.get('semester', None)
        year = self.request.query_params.get('year', None)
        status = self.request.query_params.get('status', None)

        if course:
            queryset = queryset.filter(course_id=course)
        if semester:
            queryset = queryset.filter(semester=semester)
        if year:
            queryset = queryset.filter(year=year)
        if status:
            queryset = queryset.filter(status=status)

        return queryset.select_related('student', 'student__user', 'course')

class ProfessorScheduleEnrollmentViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet for professors to view enrollments in their scheduled classes
    """
    serializer_class = StudyScheduleEnrollmentSerializer
    permission_classes = [IsProfessor]

    def get_queryset(self):
        professor_profile = get_object_or_404(ProfessorProfile, user=self.request.user)
        queryset = StudySchedule.objects.filter(professor=professor_profile)
        
        # Filter parameters
        course = self.request.query_params.get('course', None)
        semester = self.request.query_params.get('semester', None)
        academic_year = self.request.query_params.get('academic_year', None)
        day = self.request.query_params.get('day', None)
        is_active = self.request.query_params.get('is_active', None)

        if course:
            queryset = queryset.filter(course_id=course)
        if semester:
            queryset = queryset.filter(semester=semester)
        if academic_year:
            queryset = queryset.filter(academic_year=academic_year)
        if day:
            queryset = queryset.filter(day=day)
        if is_active is not None:
            queryset = queryset.filter(is_active=is_active.lower() == 'true')

        return queryset.select_related(
            'course', 'classroom', 'time_slot'
        ).prefetch_related(
            'enrolled_students', 'enrolled_students__user'
        )

class AssistantScheduleEnrollmentViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet for assistants to view enrollments in their scheduled classes
    """
    serializer_class = StudyScheduleEnrollmentSerializer
    permission_classes = [IsAssistant]

    def get_queryset(self):
        assistant_profile = get_object_or_404(AssistantProfile, user=self.request.user)
        queryset = StudySchedule.objects.filter(assistants=assistant_profile)
        
        # Filter parameters
        course = self.request.query_params.get('course', None)
        semester = self.request.query_params.get('semester', None)
        academic_year = self.request.query_params.get('academic_year', None)
        day = self.request.query_params.get('day', None)
        professor = self.request.query_params.get('professor', None)
        is_active = self.request.query_params.get('is_active', None)

        if course:
            queryset = queryset.filter(course_id=course)
        if semester:
            queryset = queryset.filter(semester=semester)
        if academic_year:
            queryset = queryset.filter(academic_year=academic_year)
        if day:
            queryset = queryset.filter(day=day)
        if professor:
            queryset = queryset.filter(professor_id=professor)
        if is_active is not None:
            queryset = queryset.filter(is_active=is_active.lower() == 'true')

        return queryset.select_related(
            'course', 'professor', 'classroom', 'time_slot'
        ).prefetch_related(
            'enrolled_students', 'enrolled_students__user'
        )

class IsStudent(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.user_type == 'student'

class StudentCourseEnrollmentViewSet(viewsets.ModelViewSet):
    """
    ViewSet for students to manage their course enrollments
    """
    serializer_class = StudentCourseEnrollmentSerializer
    permission_classes = [IsStudent]
    http_method_names = ['get', 'post', 'delete']  # Only allow GET, POST, and DELETE methods

    def get_queryset(self):
        student_profile = get_object_or_404(StudentProfile, user=self.request.user)
        queryset = CourseEnrollment.objects.filter(student=student_profile)
        
        # Filter parameters
        course = self.request.query_params.get('course', None)
        semester = self.request.query_params.get('semester', None)
        year = self.request.query_params.get('year', None)
        status = self.request.query_params.get('status', None)

        if course:
            queryset = queryset.filter(course_id=course)
        if semester:
            queryset = queryset.filter(semester=semester)
        if year:
            queryset = queryset.filter(year=year)
        if status:
            queryset = queryset.filter(status=status)

        return queryset.select_related('course')

    def perform_destroy(self, instance):
        # Instead of deleting, update status to 'dropped'
        instance.status = 'dropped'
        instance.save()

        # Remove student from all related schedules
        StudySchedule.objects.filter(
            course=instance.course,
            semester=instance.semester,
            academic_year=instance.year
        ).filter(enrolled_students=instance.student).first().enrolled_students.remove(instance.student)

class AvailableCoursesViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet for students to view available courses for enrollment
    """
    serializer_class = CourseSerializer
    permission_classes = [IsStudent]

    def get_queryset(self):
        student_profile = get_object_or_404(StudentProfile, user=self.request.user)
        
        # Get current enrollments to exclude
        current_enrollments = CourseEnrollment.objects.filter(
            student=student_profile,
            status='active'
        ).values_list('course_id', flat=True)

        # Get courses that have active schedules with available slots
        available_courses = Course.objects.filter(
            schedules__is_active=True,
            schedules__semester=self.request.query_params.get('semester'),
            schedules__academic_year=self.request.query_params.get('year')
        ).exclude(
            id__in=current_enrollments
        ).distinct()

        department = self.request.query_params.get('department', None)
        level = self.request.query_params.get('level', None)

        if department:
            available_courses = available_courses.filter(department=department)
        if level:
            available_courses = available_courses.filter(level=level)

        return available_courses

class StudentScheduleViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet for students to view their course schedules
    """
    serializer_class = StudentScheduleSerializer
    permission_classes = [IsStudent]

    def get_queryset(self):
        queryset = StudySchedule.objects.filter(
            enrolled_students=self.request.user.studentprofile
        )

        semester = self.request.query_params.get('semester')
        academic_year = self.request.query_params.get('academic_year')
        is_active = self.request.query_params.get('is_active')
        
        if semester:
            queryset = queryset.filter(semester=semester)
        if academic_year:
            queryset = queryset.filter(academic_year=academic_year)
        if is_active is not None:
            queryset = queryset.filter(is_active=is_active.lower() == 'true')

        return queryset.select_related(
            'course', 'professor', 'classroom', 'time_slot'
        ).prefetch_related('assistants')

class CourseSchedulesViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet for students to view available schedules for a specific course
    """
    serializer_class = StudentScheduleSerializer
    permission_classes = [IsStudent]

    def get_queryset(self):
        course_id = self.request.query_params.get('course')
        if not course_id:
            return StudySchedule.objects.none()

        queryset = StudySchedule.objects.filter(
            course_id=course_id,
            is_active=True
        )

        semester = self.request.query_params.get('semester')
        academic_year = self.request.query_params.get('academic_year')
        
        if semester:
            queryset = queryset.filter(semester=semester)
        if academic_year:
            queryset = queryset.filter(academic_year=academic_year)

        return queryset.select_related(
            'course', 'professor', 'classroom', 'time_slot'
        ).prefetch_related('assistants')
