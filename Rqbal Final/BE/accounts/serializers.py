from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from .models import AdminProfile, ProfessorProfile, AssistantProfile, StudentProfile, Course, CourseTeaching, CourseAssistance, CourseEnrollment, ClassRoom, TimeSlot, StudySchedule, ScheduleChange

User = get_user_model()

class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = ('username', 'password', 'password2', 'email', 'first_name', 'last_name', 'user_type')
        extra_kwargs = {
            'first_name': {'required': True},
            'last_name': {'required': True},
            'email': {'required': True},
            'user_type': {'required': True}
        }

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Password fields didn't match."})
        return attrs

    def create(self, validated_data):
        validated_data.pop('password2')
        user = User.objects.create_user(**validated_data)
        return user

class UserLoginSerializer(serializers.Serializer):
    username = serializers.CharField(required=True)
    password = serializers.CharField(required=True, write_only=True)

class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True, validators=[validate_password])
    new_password2 = serializers.CharField(required=True)

    def validate(self, attrs):
        if attrs['new_password'] != attrs['new_password2']:
            raise serializers.ValidationError({"new_password": "Password fields didn't match."})
        return attrs

class ResetPasswordEmailSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True)

class ResetPasswordSerializer(serializers.Serializer):
    token = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True, validators=[validate_password])
    new_password2 = serializers.CharField(required=True)

    def validate(self, attrs):
        if attrs['new_password'] != attrs['new_password2']:
            raise serializers.ValidationError({"new_password": "Password fields didn't match."})
        return attrs

class AdminProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = AdminProfile
        exclude = ('user',)
        read_only_fields = ('created_at', 'updated_at')

class ProfessorProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProfessorProfile
        exclude = ('user',)
        read_only_fields = ('created_at', 'updated_at')

class AssistantProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = AssistantProfile
        exclude = ('user',)
        read_only_fields = ('created_at', 'updated_at')

class StudentProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = StudentProfile
        exclude = ('user',)

class UserProfileSerializer(serializers.ModelSerializer):
    profile = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name', 'user_type', 'profile')
        read_only_fields = ('id', 'user_type')

    def get_profile(self, obj):
        profile = obj.get_profile()
        if profile:
            if obj.user_type == 'admin':
                return AdminProfileSerializer(profile).data
            elif obj.user_type == 'professor':
                return ProfessorProfileSerializer(profile).data
            elif obj.user_type == 'assistant':
                return AssistantProfileSerializer(profile).data
            elif obj.user_type == 'student':
                return StudentProfileSerializer(profile).data
        return None 

class AdminUserManagementSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=False, validators=[validate_password])
    profile_data = serializers.JSONField(write_only=True, required=False)
    profile = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ('id', 'username', 'password', 'email', 'first_name', 'last_name', 
                 'user_type', 'is_active', 'profile_data', 'profile')
        read_only_fields = ('id',)
        extra_kwargs = {
            'username': {'required': False},  # Make username optional for updates
        }

    def get_profile(self, obj):
        profile = obj.get_profile()
        if profile:
            if obj.user_type == 'professor':
                return ProfessorProfileSerializer(profile).data
            elif obj.user_type == 'assistant':
                return AssistantProfileSerializer(profile).data
            elif obj.user_type == 'student':
                return StudentProfileSerializer(profile).data
        return None

    def validate(self, attrs):
        # Make username and password required only for create operations
        if not self.instance:  # This is a create operation
            if not attrs.get('username'):
                raise serializers.ValidationError({'username': 'Username is required when creating a user.'})
            if not attrs.get('password'):
                raise serializers.ValidationError({'password': 'Password is required when creating a user.'})
        return attrs

    def create(self, validated_data):
        profile_data = validated_data.pop('profile_data', {})
        password = validated_data.pop('password')
        user = User.objects.create(**validated_data)
        user.set_password(password)
        user.save()

        # Wait a bit for the signal to create the profile
        from django.db import transaction
        transaction.on_commit(lambda: self._update_profile(user, profile_data))
        
        return user

    def update(self, instance, validated_data):
        profile_data = validated_data.pop('profile_data', None)
        password = validated_data.pop('password', None)
        
        # Update user fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        
        if password:
            instance.set_password(password)
        
        instance.save()

        # Update profile if profile_data is provided
        if profile_data:
            self._update_profile(instance, profile_data)

        return instance

    def _update_profile(self, user, profile_data):
        if not profile_data:
            return
            
        profile = user.get_profile()
        if profile:
            for attr, value in profile_data.items():
                setattr(profile, attr, value)
            profile.save()

class CourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = ('id', 'code', 'title', 'credit_hours', 'department', 'level')

class CourseTeachingSerializer(serializers.ModelSerializer):
    professor_name = serializers.CharField(source='professor.full_name', read_only=True)
    course_title = serializers.CharField(source='course.title', read_only=True)

    class Meta:
        model = CourseTeaching
        fields = ('id', 'professor', 'professor_name', 'course', 'course_title', 
                 'semester', 'year', 'is_primary_instructor')

class CourseAssistanceSerializer(serializers.ModelSerializer):
    assistant_name = serializers.CharField(source='assistant.full_name', read_only=True)
    professor_name = serializers.CharField(source='professor.full_name', read_only=True)
    course_title = serializers.CharField(source='course.title', read_only=True)

    class Meta:
        model = CourseAssistance
        fields = ('id', 'assistant', 'assistant_name', 'course', 'course_title',
                 'professor', 'professor_name', 'semester', 'year', 'responsibilities')

class CourseEnrollmentSerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(source='student.full_name', read_only=True)
    course_title = serializers.CharField(source='course.title', read_only=True)

    class Meta:
        model = CourseEnrollment
        fields = ('id', 'student', 'student_name', 'course', 'course_title',
                 'semester', 'year', 'grade', 'status', 'notes',
                 'enrollment_date', 'last_updated')
        read_only_fields = ('enrollment_date', 'last_updated')

class CourseDetailSerializer(serializers.ModelSerializer):
    teachers = CourseTeachingSerializer(source='courseteaching_set', many=True, read_only=True)
    assistants = CourseAssistanceSerializer(source='courseassistance_set', many=True, read_only=True)
    enrollments = CourseEnrollmentSerializer(source='courseenrollment_set', many=True, read_only=True)

    class Meta:
        model = Course
        fields = ('id', 'code', 'title', 'credit_hours', 'department', 'level',
                 'teachers', 'assistants', 'enrollments')

class ClassRoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = ClassRoom
        fields = ('id', 'name', 'building', 'floor', 'capacity', 'room_type',
                 'has_projector', 'has_computer', 'notes')

class TimeSlotSerializer(serializers.ModelSerializer):
    class Meta:
        model = TimeSlot
        fields = ('id', 'start_time', 'end_time', 'slot_type', 'is_active',
                 'created_at', 'updated_at')
        read_only_fields = ('created_at', 'updated_at')

    def validate(self, data):
        if 'start_time' in data and 'end_time' in data:
            if data['start_time'] >= data['end_time']:
                raise serializers.ValidationError({
                    'end_time': 'End time must be later than start time'
                })
        return data

class StudyScheduleSerializer(serializers.ModelSerializer):
    professor_name = serializers.CharField(source='professor.full_name', read_only=True)
    course_title = serializers.CharField(source='course.title', read_only=True)
    classroom_name = serializers.CharField(source='classroom.name', read_only=True)
    time_slot_display = serializers.CharField(source='time_slot.__str__', read_only=True)
    enrolled_count = serializers.IntegerField(source='get_enrolled_count', read_only=True)
    is_full = serializers.BooleanField(source='is_full', read_only=True)

    class Meta:
        model = StudySchedule
        fields = ('id', 'course', 'course_title', 'professor', 'professor_name',
                 'assistants', 'classroom', 'classroom_name', 'day', 'time_slot',
                 'time_slot_display', 'semester', 'academic_year', 'enrolled_students',
                 'max_students', 'enrolled_count', 'is_full', 'is_active', 'notes',
                 'created_by', 'created_at', 'updated_at')
        read_only_fields = ('created_by', 'created_at', 'updated_at')

    def validate(self, data):
        # Validate classroom capacity
        if 'classroom' in data and 'max_students' in data:
            if data['classroom'].capacity < data['max_students']:
                raise serializers.ValidationError({
                    'max_students': 'Maximum students exceeds classroom capacity'
                })

        # Validate schedule conflicts for classroom
        conflicts = StudySchedule.objects.filter(
            classroom=data.get('classroom', self.instance.classroom if self.instance else None),
            day=data.get('day', self.instance.day if self.instance else None),
            time_slot=data.get('time_slot', self.instance.time_slot if self.instance else None),
            semester=data.get('semester', self.instance.semester if self.instance else None),
            academic_year=data.get('academic_year', self.instance.academic_year if self.instance else None)
        )
        if self.instance:
            conflicts = conflicts.exclude(pk=self.instance.pk)
        if conflicts.exists():
            raise serializers.ValidationError({
                'time_slot': 'This time slot is already booked for this classroom'
            })

        # Validate schedule conflicts for professor
        conflicts = StudySchedule.objects.filter(
            professor=data.get('professor', self.instance.professor if self.instance else None),
            day=data.get('day', self.instance.day if self.instance else None),
            time_slot=data.get('time_slot', self.instance.time_slot if self.instance else None),
            semester=data.get('semester', self.instance.semester if self.instance else None),
            academic_year=data.get('academic_year', self.instance.academic_year if self.instance else None)
        )
        if self.instance:
            conflicts = conflicts.exclude(pk=self.instance.pk)
        if conflicts.exists():
            raise serializers.ValidationError({
                'time_slot': 'This time slot is already booked for this professor'
            })

        return data

    def create(self, validated_data):
        request = self.context.get('request')
        if request and request.user.user_type == 'admin':
            validated_data['created_by'] = request.user.admin_profile
        return super().create(validated_data)

class ScheduleChangeSerializer(serializers.ModelSerializer):
    schedule_info = serializers.CharField(source='schedule.__str__', read_only=True)
    new_time_slot_display = serializers.CharField(source='new_time_slot.__str__', read_only=True)
    new_classroom_name = serializers.CharField(source='new_classroom.name', read_only=True)
    new_professor_name = serializers.CharField(source='new_professor.full_name', read_only=True)

    class Meta:
        model = ScheduleChange
        fields = ('id', 'schedule', 'schedule_info', 'change_type', 'new_date',
                 'new_time_slot', 'new_time_slot_display', 'new_classroom',
                 'new_classroom_name', 'new_professor', 'new_professor_name',
                 'reason', 'created_by', 'created_at', 'notification_sent')
        read_only_fields = ('created_by', 'created_at', 'notification_sent')

    def validate(self, data):
        change_type = data.get('change_type')
        
        # Validate required fields based on change type
        if change_type == 'reschedule':
            if not data.get('new_date') and not data.get('new_time_slot'):
                raise serializers.ValidationError({
                    'new_date': 'Either new date or new time slot is required for reschedule'
                })
        elif change_type == 'room_change':
            if not data.get('new_classroom'):
                raise serializers.ValidationError({
                    'new_classroom': 'New classroom is required for room change'
                })
        elif change_type == 'professor_change':
            if not data.get('new_professor'):
                raise serializers.ValidationError({
                    'new_professor': 'New professor is required for professor change'
                })

        return data

    def create(self, validated_data):
        request = self.context.get('request')
        if request and request.user.user_type == 'admin':
            validated_data['created_by'] = request.user.admin_profile
        return super().create(validated_data)

class ProfessorCourseSerializer(serializers.ModelSerializer):
    course_details = CourseSerializer(source='course', read_only=True)
    semester_display = serializers.CharField(source='get_semester_display', read_only=True)

    class Meta:
        model = CourseTeaching
        fields = ('id', 'course', 'course_details', 'semester', 'semester_display',
                 'year', 'is_primary_instructor')
        read_only_fields = ('id', 'course', 'semester', 'year', 'is_primary_instructor')

class AssistantCourseSerializer(serializers.ModelSerializer):
    course_details = CourseSerializer(source='course', read_only=True)
    professor_name = serializers.CharField(source='professor.full_name', read_only=True)
    semester_display = serializers.CharField(source='get_semester_display', read_only=True)

    class Meta:
        model = CourseAssistance
        fields = ('id', 'course', 'course_details', 'professor', 'professor_name',
                 'semester', 'semester_display', 'year')
        read_only_fields = ('id', 'course', 'professor', 'semester', 'year')

class ProfessorScheduleSerializer(serializers.ModelSerializer):
    course_title = serializers.CharField(source='course.title', read_only=True)
    classroom_name = serializers.CharField(source='classroom.name', read_only=True)
    time_slot_display = serializers.CharField(source='time_slot.__str__', read_only=True)
    day_display = serializers.CharField(source='get_day_display', read_only=True)
    semester_display = serializers.CharField(source='get_semester_display', read_only=True)
    enrolled_count = serializers.IntegerField(source='get_enrolled_count', read_only=True)
    assistants_names = serializers.SerializerMethodField()

    class Meta:
        model = StudySchedule
        fields = ('id', 'course', 'course_title', 'classroom', 'classroom_name',
                 'day', 'day_display', 'time_slot', 'time_slot_display',
                 'semester', 'semester_display', 'academic_year', 'enrolled_count',
                 'max_students', 'assistants', 'assistants_names', 'notes')
        read_only_fields = fields

    def get_assistants_names(self, obj):
        return [assistant.full_name for assistant in obj.assistants.all()]

class AssistantScheduleSerializer(serializers.ModelSerializer):
    course_title = serializers.CharField(source='course.title', read_only=True)
    professor_name = serializers.CharField(source='professor.full_name', read_only=True)
    classroom_name = serializers.CharField(source='classroom.name', read_only=True)
    time_slot_display = serializers.CharField(source='time_slot.__str__', read_only=True)
    day_display = serializers.CharField(source='get_day_display', read_only=True)
    semester_display = serializers.CharField(source='get_semester_display', read_only=True)
    enrolled_count = serializers.IntegerField(source='get_enrolled_count', read_only=True)

    class Meta:
        model = StudySchedule
        fields = ('id', 'course', 'course_title', 'professor', 'professor_name',
                 'classroom', 'classroom_name', 'day', 'day_display',
                 'time_slot', 'time_slot_display', 'semester', 'semester_display',
                 'academic_year', 'enrolled_count', 'max_students', 'notes')
        read_only_fields = fields 

class EnrolledStudentSerializer(serializers.ModelSerializer):
    full_name = serializers.CharField(read_only=True)
    email = serializers.EmailField(source='user.email', read_only=True)
    username = serializers.CharField(source='user.username', read_only=True)

    class Meta:
        model = StudentProfile
        fields = ('id', 'username', 'full_name', 'email', 'student_id', 'department', 'level')
        read_only_fields = fields

class CourseEnrollmentDetailsSerializer(serializers.ModelSerializer):
    student = EnrolledStudentSerializer(read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    course_title = serializers.CharField(source='course.title', read_only=True)
    course_code = serializers.CharField(source='course.code', read_only=True)

    class Meta:
        model = CourseEnrollment
        fields = ('id', 'student', 'course_title', 'course_code', 'semester', 
                 'year', 'grade', 'status', 'status_display', 'enrollment_date', 
                 'last_updated', 'notes')
        read_only_fields = fields

class StudyScheduleEnrollmentSerializer(serializers.ModelSerializer):
    enrolled_students = EnrolledStudentSerializer(many=True, read_only=True)
    course_title = serializers.CharField(source='course.title', read_only=True)
    course_code = serializers.CharField(source='course.code', read_only=True)
    classroom_name = serializers.CharField(source='classroom.name', read_only=True)
    time_slot_display = serializers.CharField(source='time_slot.__str__', read_only=True)
    day_display = serializers.CharField(source='get_day_display', read_only=True)
    enrolled_count = serializers.IntegerField(source='get_enrolled_count', read_only=True)

    class Meta:
        model = StudySchedule
        fields = ('id', 'course_code', 'course_title', 'classroom_name', 
                 'day', 'day_display', 'time_slot_display', 'semester', 
                 'academic_year', 'enrolled_students', 'enrolled_count', 
                 'max_students', 'is_active')
        read_only_fields = fields 

class StudentCourseEnrollmentSerializer(serializers.ModelSerializer):
    course_title = serializers.CharField(source='course.title', read_only=True)
    course_code = serializers.CharField(source='course.code', read_only=True)
    credit_hours = serializers.IntegerField(source='course.credit_hours', read_only=True)
    department = serializers.CharField(source='course.department', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)

    class Meta:
        model = CourseEnrollment
        fields = ('id', 'course', 'course_title', 'course_code', 'credit_hours',
                 'department', 'semester', 'year', 'grade', 'status',
                 'status_display', 'enrollment_date', 'last_updated', 'notes')
        read_only_fields = ('id', 'grade', 'enrollment_date', 'last_updated')

    def validate(self, data):
        request = self.context.get('request')
        if not request or not request.user.user_type == 'student':
            raise serializers.ValidationError("Only students can enroll in courses")

        # Check if student is already enrolled in this course for the same semester and year
        student_profile = request.user.student_profile
        if CourseEnrollment.objects.filter(
            student=student_profile,
            course=data['course'],
            semester=data['semester'],
            year=data['year']
        ).exists():
            raise serializers.ValidationError("You are already enrolled in this course for the specified semester")

        # Check if the course has available slots in any schedule
        has_available_schedule = StudySchedule.objects.filter(
            course=data['course'],
            semester=data['semester'],
            academic_year=data['year'],
            is_active=True
        ).filter(enrolled_students__isnull=True).exists()

        if not has_available_schedule:
            raise serializers.ValidationError("No available schedules for this course in the specified semester")

        return data

    def create(self, validated_data):
        request = self.context.get('request')
        validated_data['student'] = request.user.student_profile
        validated_data['status'] = 'active'
        return super().create(validated_data)

class StudentScheduleSerializer(serializers.ModelSerializer):
    course_title = serializers.CharField(source='course.title', read_only=True)
    course_code = serializers.CharField(source='course.code', read_only=True)
    professor_name = serializers.CharField(source='professor.full_name', read_only=True)
    classroom_name = serializers.CharField(source='classroom.name', read_only=True)
    classroom_building = serializers.CharField(source='classroom.building', read_only=True)
    time_slot_display = serializers.CharField(source='time_slot.__str__', read_only=True)
    day_display = serializers.CharField(source='get_day_display', read_only=True)
    semester_display = serializers.CharField(source='get_semester_display', read_only=True)
    assistants_names = serializers.SerializerMethodField()

    class Meta:
        model = StudySchedule
        fields = ('id', 'course', 'course_title', 'course_code', 'professor',
                 'professor_name', 'classroom_name', 'classroom_building',
                 'day', 'day_display', 'time_slot_display', 'semester',
                 'semester_display', 'academic_year', 'assistants_names',
                 'is_active', 'notes')
        read_only_fields = fields

    def get_assistants_names(self, obj):
        return [assistant.full_name for assistant in obj.assistants.all()] 