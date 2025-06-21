from django.urls import path, include
from rest_framework_simplejwt.views import TokenRefreshView
from rest_framework.routers import DefaultRouter
from .views import (
    RegisterView, LoginView, ProfileView,
    ChangePasswordView, ResetPasswordEmailView, ResetPasswordView,
    AdminUserManagementViewSet, CourseViewSet, CourseTeachingViewSet,
    CourseAssistanceViewSet, CourseEnrollmentViewSet, ClassRoomViewSet,
    TimeSlotViewSet, StudyScheduleViewSet, ScheduleChangeViewSet,
    ProfessorCourseViewSet, AssistantCourseViewSet,
    ProfessorScheduleViewSet, AssistantScheduleViewSet,
    ProfessorCourseEnrollmentViewSet, AssistantCourseEnrollmentViewSet,
    ProfessorScheduleEnrollmentViewSet, AssistantScheduleEnrollmentViewSet,
    StudentCourseEnrollmentViewSet, AvailableCoursesViewSet,
    StudentScheduleViewSet, CourseSchedulesViewSet
)

app_name = 'accounts'

# Create a router for viewsets
router = DefaultRouter()

# Admin routes
router.register(r'admin/users', AdminUserManagementViewSet, basename='admin-users')
router.register(r'admin/courses', CourseViewSet, basename='admin-courses')
router.register(r'admin/course-teaching', CourseTeachingViewSet, basename='admin-course-teaching')
router.register(r'admin/course-assistance', CourseAssistanceViewSet, basename='admin-course-assistance')
router.register(r'admin/course-enrollment', CourseEnrollmentViewSet, basename='admin-course-enrollment')
router.register(r'admin/classrooms', ClassRoomViewSet, basename='admin-classrooms')
router.register(r'admin/time-slots', TimeSlotViewSet, basename='admin-time-slots')
router.register(r'admin/schedules', StudyScheduleViewSet, basename='admin-schedules')
router.register(r'admin/schedule-changes', ScheduleChangeViewSet, basename='admin-schedule-changes')

# Professor routes
router.register(r'professor/courses', ProfessorCourseViewSet, basename='professor-courses')
router.register(r'professor/schedules', ProfessorScheduleViewSet, basename='professor-schedules')
router.register(r'professor/course-enrollments', ProfessorCourseEnrollmentViewSet, basename='professor-course-enrollments')
router.register(r'professor/schedule-enrollments', ProfessorScheduleEnrollmentViewSet, basename='professor-schedule-enrollments')

# Assistant routes
router.register(r'assistant/courses', AssistantCourseViewSet, basename='assistant-courses')
router.register(r'assistant/schedules', AssistantScheduleViewSet, basename='assistant-schedules')
router.register(r'assistant/course-enrollments', AssistantCourseEnrollmentViewSet, basename='assistant-course-enrollments')
router.register(r'assistant/schedule-enrollments', AssistantScheduleEnrollmentViewSet, basename='assistant-schedule-enrollments')

# Student routes
router.register(r'student/enrollments', StudentCourseEnrollmentViewSet, basename='student-enrollments')
router.register(r'student/available-courses', AvailableCoursesViewSet, basename='student-available-courses')
router.register(r'student/schedules', StudentScheduleViewSet, basename='student-schedules')
router.register(r'student/course-schedules', CourseSchedulesViewSet, basename='student-course-schedules')

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('profile/', ProfileView.as_view(), name='profile'),
    path('change-password/', ChangePasswordView.as_view(), name='change_password'),
    path('reset-password-email/', ResetPasswordEmailView.as_view(), name='reset_password_email'),
    path('reset-password/<str:token>/', ResetPasswordView.as_view(), name='reset_password'),
    path('', include(router.urls)),
] 