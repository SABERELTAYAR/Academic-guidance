from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.utils.translation import gettext_lazy as _
from .models import (
    CustomUser, AdminProfile, ProfessorProfile, AssistantProfile, StudentProfile,
    Course, CourseTeaching, CourseAssistance, CourseEnrollment,
    StudentSupervision, StudentSupport, ClassRoom, StudySchedule, ScheduleChange,
    TimeSlot
)

@admin.register(CustomUser)
class CustomUserAdmin(UserAdmin):
    list_display = ('username', 'email', 'first_name', 'last_name', 'user_type', 'is_staff')
    list_filter = ('user_type', 'is_staff', 'is_active')
    search_fields = ('username', 'email', 'first_name', 'last_name')
    ordering = ('username',)
    
    fieldsets = (
        (None, {'fields': ('username', 'password')}),
        (_('المعلومات الشخصية'), {'fields': ('first_name', 'last_name', 'email', 'user_type')}),
        (_('الصلاحيات'), {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        (_('تواريخ مهمة'), {'fields': ('last_login', 'date_joined')}),
    )
    
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('username', 'email', 'password1', 'password2', 'user_type'),
        }),
    )

@admin.register(AdminProfile)
class AdminProfileAdmin(admin.ModelAdmin):
    list_display = ('full_name', 'role', 'department', 'is_active')
    list_filter = ('role', 'is_active', 'can_manage_users', 'can_manage_content')
    search_fields = ('full_name', 'email', 'phone_number', 'department')
    ordering = ('-created_at',)

class CourseTeachingInline(admin.TabularInline):
    model = CourseTeaching
    extra = 1

class StudentSupervisionInline(admin.TabularInline):
    model = StudentSupervision
    extra = 1

@admin.register(ProfessorProfile)
class ProfessorProfileAdmin(admin.ModelAdmin):
    list_display = ('full_name', 'academic_rank', 'department', 'college', 'is_active')
    list_filter = ('academic_rank', 'department', 'college', 'is_active')
    search_fields = ('full_name', 'email', 'specialization', 'department')
    ordering = ('-created_at',)
    inlines = [CourseTeachingInline, StudentSupervisionInline]

class CourseAssistanceInline(admin.TabularInline):
    model = CourseAssistance
    extra = 1

class StudentSupportInline(admin.TabularInline):
    model = StudentSupport
    extra = 1

@admin.register(AssistantProfile)
class AssistantProfileAdmin(admin.ModelAdmin):
    list_display = ('full_name', 'assistant_type', 'department', 'professor', 'is_active')
    list_filter = ('assistant_type', 'department', 'is_active')
    search_fields = ('full_name', 'email', 'department', 'professor__full_name')
    ordering = ('-created_at',)
    inlines = [CourseAssistanceInline, StudentSupportInline]

class CourseEnrollmentInline(admin.TabularInline):
    model = CourseEnrollment
    extra = 1

@admin.register(StudentProfile)
class StudentProfileAdmin(admin.ModelAdmin):
    list_display = ('full_name', 'college', 'program', 'level', 'cumulative_gpa')
    list_filter = ('college', 'program', 'level', 'joining_year')
    search_fields = ('full_name', 'email', 'mobile')
    ordering = ('full_name',)
    inlines = [CourseEnrollmentInline]
    fieldsets = (
        ('معلومات أساسية', {
            'fields': ('user', 'full_name', 'nationality', 'email', 'mobile')
        }),
        ('معلومات العائلة', {
            'fields': ('father_name', 'mother_name', 'guardian_name', 'guardian_relationship')
        }),
        ('معلومات أكاديمية', {
            'fields': ('college', 'program', 'level', 'credit_hours', 'cumulative_gpa')
        }),
        ('معلومات التواصل', {
            'fields': ('address', 'city', 'phone_number', 'whatsapp')
        }),
    )

class CourseTeachingInline(admin.TabularInline):
    model = CourseTeaching
    extra = 1

class CourseAssistanceInline(admin.TabularInline):
    model = CourseAssistance
    extra = 1

class CourseEnrollmentInline(admin.TabularInline):
    model = CourseEnrollment
    extra = 1

@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = ('code', 'title', 'credit_hours', 'department', 'level')
    list_filter = ('department', 'level', 'credit_hours')
    search_fields = ('code', 'title', 'department')
    ordering = ('code',)
    inlines = [CourseTeachingInline, CourseAssistanceInline, CourseEnrollmentInline]

@admin.register(CourseTeaching)
class CourseTeachingAdmin(admin.ModelAdmin):
    list_display = ('professor', 'course', 'semester', 'year', 'is_primary_instructor')
    list_filter = ('semester', 'year', 'is_primary_instructor')
    search_fields = ('professor__full_name', 'course__title', 'course__code')
    ordering = ('-year', 'semester')
    
    fieldsets = (
        (_('معلومات التدريس'), {
            'fields': ('professor', 'course', 'is_primary_instructor')
        }),
        (_('الفترة الدراسية'), {
            'fields': ('semester', 'year')
        }),
    )

@admin.register(CourseAssistance)
class CourseAssistanceAdmin(admin.ModelAdmin):
    list_display = ('assistant', 'course', 'professor', 'semester', 'year')
    list_filter = ('semester', 'year', 'professor')
    search_fields = ('assistant__full_name', 'course__title', 'professor__full_name')
    ordering = ('-year', 'semester')
    
    fieldsets = (
        (_('معلومات المساعدة'), {
            'fields': ('assistant', 'course', 'professor')
        }),
        (_('الفترة الدراسية'), {
            'fields': ('semester', 'year')
        }),
        (_('تفاصيل إضافية'), {
            'fields': ('responsibilities',)
        }),
    )

@admin.register(CourseEnrollment)
class CourseEnrollmentAdmin(admin.ModelAdmin):
    list_display = ('student', 'course', 'semester', 'year', 'grade', 'status')
    list_filter = ('semester', 'year', 'status', 'grade')
    search_fields = ('student__full_name', 'course__title', 'course__code')
    ordering = ('-year', 'semester')
    
    fieldsets = (
        (_('معلومات التسجيل'), {
            'fields': ('student', 'course')
        }),
        (_('الفترة الدراسية'), {
            'fields': ('semester', 'year')
        }),
        (_('النتيجة'), {
            'fields': ('grade', 'status')
        }),
        (_('معلومات إضافية'), {
            'fields': ('notes', 'enrollment_date', 'last_updated')
        }),
    )
    readonly_fields = ('enrollment_date', 'last_updated')

@admin.register(StudentSupervision)
class StudentSupervisionAdmin(admin.ModelAdmin):
    list_display = ('professor', 'student', 'supervision_type', 'start_date', 'is_active')
    list_filter = ('supervision_type', 'is_active')
    search_fields = ('professor__full_name', 'student__full_name')
    ordering = ('-start_date',)

@admin.register(StudentSupport)
class StudentSupportAdmin(admin.ModelAdmin):
    list_display = ('assistant', 'student', 'support_type', 'start_date')
    list_filter = ('support_type',)
    search_fields = ('assistant__full_name', 'student__full_name')
    ordering = ('-start_date',)

@admin.register(ClassRoom)
class ClassRoomAdmin(admin.ModelAdmin):
    list_display = ('name', 'building', 'floor', 'room_type', 'capacity', 'has_projector', 'has_computer')
    list_filter = ('building', 'room_type', 'has_projector', 'has_computer')
    search_fields = ('name', 'building')
    ordering = ('building', 'floor', 'name')

class ScheduleChangeInline(admin.TabularInline):
    model = ScheduleChange
    extra = 0
    readonly_fields = ('created_at', 'created_by')
    fields = ('change_type', 'new_date', 'new_time_slot', 'new_classroom', 'new_professor', 'reason', 'notification_sent')

@admin.register(TimeSlot)
class TimeSlotAdmin(admin.ModelAdmin):
    list_display = ('__str__', 'slot_type', 'is_active')
    list_filter = ('slot_type', 'is_active')
    search_fields = ('start_time', 'end_time')
    ordering = ('start_time',)
    readonly_fields = ('created_at', 'updated_at')
    
    fieldsets = (
        (_('معلومات الموعد'), {
            'fields': ('start_time', 'end_time', 'slot_type', 'is_active')
        }),
        (_('معلومات النظام'), {
            'fields': ('created_at', 'updated_at')
        }),
    )

@admin.register(StudySchedule)
class StudyScheduleAdmin(admin.ModelAdmin):
    list_display = ('course', 'professor', 'day', 'time_slot', 'classroom', 'semester', 'academic_year', 'is_active')
    list_filter = ('semester', 'academic_year', 'day', 'is_active', 'professor', 'course', 'time_slot__slot_type')
    search_fields = ('course__title', 'professor__full_name', 'classroom__name')
    filter_horizontal = ('assistants', 'enrolled_students')
    readonly_fields = ('created_at', 'updated_at', 'created_by')
    inlines = [ScheduleChangeInline]
    
    fieldsets = (
        (_('معلومات أساسية'), {
            'fields': ('course', 'professor', 'classroom', 'assistants')
        }),
        (_('توقيت المحاضرة'), {
            'fields': ('day', 'time_slot', 'semester', 'academic_year')
        }),
        (_('الطلاب'), {
            'fields': ('enrolled_students', 'max_students')
        }),
        (_('معلومات إضافية'), {
            'fields': ('is_active', 'notes', 'created_by', 'created_at', 'updated_at')
        }),
    )

    def save_model(self, request, obj, form, change):
        if not obj.created_by:
            obj.created_by = request.user.admin_profile
        super().save_model(request, obj, form, change)

@admin.register(ScheduleChange)
class ScheduleChangeAdmin(admin.ModelAdmin):
    list_display = ('schedule', 'change_type', 'new_date', 'new_time_slot', 'created_at', 'notification_sent')
    list_filter = ('change_type', 'notification_sent', 'created_at', 'new_time_slot__slot_type')
    search_fields = ('schedule__course__title', 'reason')
    readonly_fields = ('created_at', 'created_by')
    
    fieldsets = (
        (_('معلومات التغيير'), {
            'fields': ('schedule', 'change_type', 'reason')
        }),
        (_('التفاصيل الجديدة'), {
            'fields': ('new_date', 'new_time_slot', 'new_classroom', 'new_professor')
        }),
        (_('الإشعارات'), {
            'fields': ('notification_sent',)
        }),
        (_('معلومات النظام'), {
            'fields': ('created_by', 'created_at')
        }),
    )

    def save_model(self, request, obj, form, change):
        if not obj.created_by:
            obj.created_by = request.user.adminprofile
        super().save_model(request, obj, form, change)
