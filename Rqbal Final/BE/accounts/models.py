from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils.translation import gettext_lazy as _

class Course(models.Model):
    code = models.CharField(max_length=20, verbose_name=_("كود المادة"))
    title = models.CharField(max_length=100, verbose_name=_("اسم المادة"))
    credit_hours = models.IntegerField(verbose_name=_("عدد الساعات المعتمدة"))
    department = models.CharField(max_length=100, verbose_name=_("القسم"))
    level = models.CharField(max_length=50, verbose_name=_("المستوى"))
    
    class Meta:
        verbose_name = _("المادة الدراسية")
        verbose_name_plural = _("المواد الدراسية")
    
    def __str__(self):
        return f"{self.code} - {self.title}"


class CustomUser(AbstractUser):
    USER_TYPE_CHOICES = (
        ('admin', _('مدير')),
        ('professor', _('أستاذ')),
        ('assistant', _('مساعد')),
        ('student', _('طالب')),
    )

    user_type = models.CharField(
        max_length=10, 
        choices=USER_TYPE_CHOICES, 
        default='admin',
        verbose_name=_("نوع المستخدم")
    )
    password_reset_token = models.CharField(max_length=64, null=True, blank=True)
    password_reset_token_created = models.DateTimeField(null=True, blank=True)

    def get_profile(self):
        """
        Returns the profile associated with this user based on their user_type
        """
        try:
            if self.user_type == 'admin':
                return self.admin_profile
            elif self.user_type == 'professor':
                return self.professor_profile
            elif self.user_type == 'assistant':
                return self.assistant_profile
            elif self.user_type == 'student':
                return self.student_profile
            return None
        except (AdminProfile.DoesNotExist, ProfessorProfile.DoesNotExist,
                AssistantProfile.DoesNotExist, StudentProfile.DoesNotExist):
            return None

    @property
    def full_name(self):
        """Return the user's full name based on their profile type"""
        profile = self.get_profile()
        if profile:
            return profile.full_name
        return self.get_full_name() or self.username

    class Meta:
        verbose_name = _("مستخدم")
        verbose_name_plural = _("المستخدمون")


class AdminProfile(models.Model):
    class AdminRole(models.TextChoices):
        SUPER_ADMIN = 'super_admin', _('مدير عام')
        ACADEMIC_ADMIN = 'academic_admin', _('مدير أكاديمي')
        FINANCE_ADMIN = 'finance_admin', _('مدير مالي')
        STUDENT_AFFAIRS = 'student_affairs', _('شؤون الطلاب')
        REGISTRAR = 'registrar', _('مسجل')
        IT_ADMIN = 'it_admin', _('مدير نظم معلومات')

    user = models.OneToOneField(
        'CustomUser', 
        on_delete=models.CASCADE,
        verbose_name=_("المستخدم"),
        related_name='admin_profile'
    )
    full_name = models.CharField(max_length=255, verbose_name=_("الاسم الكامل"))
    phone_number = models.CharField(max_length=15, blank=True, null=True, verbose_name=_("رقم الهاتف"))
    mobile_number = models.CharField(max_length=15, blank=True, null=True, verbose_name=_("رقم الجوال"))
    email = models.EmailField(blank=True, null=True, verbose_name=_("البريد الإلكتروني"))
    role = models.CharField(
        max_length=50,
        choices=AdminRole.choices,
        default=AdminRole.ACADEMIC_ADMIN,
        verbose_name=_("الدور الإداري")
    )
    department = models.CharField(max_length=100, blank=True, null=True, verbose_name=_("القسم"))
    image = models.ImageField(
        upload_to='admin/profile_images/',
        blank=True, 
        null=True,
        verbose_name=_("صورة الشخصية")
    )
    is_active = models.BooleanField(default=True, verbose_name=_("نشط"))
    can_manage_users = models.BooleanField(default=False, verbose_name=_("يمكنه إدارة المستخدمين"))
    can_manage_content = models.BooleanField(default=False, verbose_name=_("يمكنه إدارة المحتوى"))
    notes = models.TextField(blank=True, null=True, verbose_name=_("ملاحظات"))
    created_at = models.DateTimeField(auto_now_add=True, verbose_name=_("تاريخ الإنشاء"))
    updated_at = models.DateTimeField(auto_now=True, verbose_name=_("تاريخ التحديث"))

    class Meta:
        verbose_name = _("ملف المدير")
        verbose_name_plural = _("ملفات المديرين")
        ordering = ['-created_at']

    def __str__(self):
        return self.full_name or f"{self.get_role_display()} ({self.user.username})"


class ProfessorProfile(models.Model):
    class AcademicRank(models.TextChoices):
        PROFESSOR = 'professor', _('أستاذ')
        ASSOCIATE_PROFESSOR = 'associate_professor', _('أستاذ مشارك')
        ASSISTANT_PROFESSOR = 'assistant_professor', _('أستاذ مساعد')
        LECTURER = 'lecturer', _('محاضر')
        TEACHING_ASSISTANT = 'teaching_assistant', _('معيد')

    user = models.OneToOneField(
        'CustomUser', 
        on_delete=models.CASCADE, 
        verbose_name=_("المستخدم"),
        related_name='professor_profile'
    )
    full_name = models.CharField(max_length=255, verbose_name=_("الاسم الكامل"))
    phone_number = models.CharField(max_length=15, blank=True, null=True, verbose_name=_("رقم الهاتف"))
    mobile_number = models.CharField(max_length=15, blank=True, null=True, verbose_name=_("رقم الجوال"))
    email = models.EmailField(blank=True, null=True, verbose_name=_("البريد الإلكتروني"))
    academic_rank = models.CharField(
        max_length=50,
        choices=AcademicRank.choices,
        default=AcademicRank.LECTURER,
        verbose_name=_("الرتبة الأكاديمية")
    )
    specialization = models.CharField(max_length=100, blank=True, null=True, verbose_name=_("التخصص"))
    department = models.CharField(max_length=100, blank=True, null=True, verbose_name=_("القسم"))
    college = models.CharField(max_length=100, blank=True, null=True, verbose_name=_("الكلية"))
    university = models.CharField(max_length=100, blank=True, null=True, verbose_name=_("الجامعة"))
    image = models.ImageField(upload_to='professors/images/', blank=True, null=True, verbose_name=_("الصورة"))
    cv = models.FileField(upload_to='professors/cvs/', blank=True, null=True, verbose_name=_("السيرة الذاتية"))
    address = models.TextField(blank=True, null=True, verbose_name=_("العنوان"))
    bio = models.TextField(blank=True, null=True, verbose_name=_("السيرة الذاتية المختصرة"))
    is_active = models.BooleanField(default=True, verbose_name=_("نشط"))
    joined_date = models.DateField(blank=True, null=True, verbose_name=_("تاريخ الانضمام"))
    created_at = models.DateTimeField(auto_now_add=True, verbose_name=_("تاريخ الإنشاء"))
    updated_at = models.DateTimeField(auto_now=True, verbose_name=_("تاريخ التحديث"))

    # Add new relationships
    courses_taught = models.ManyToManyField(
        Course,
        through='CourseTeaching',
        related_name='professors',
        verbose_name=_("المقررات التي يدرسها")
    )
    
    supervised_students = models.ManyToManyField(
        'StudentProfile',
        through='StudentSupervision',
        related_name='supervisors',
        verbose_name=_("الطلاب المشرف عليهم")
    )

    class Meta:
        verbose_name = _("ملف الأستاذ")
        verbose_name_plural = _("ملفات الأساتذة")
        ordering = ['-created_at']

    def __str__(self):
        return self.full_name or f"{self.get_academic_rank_display()} ({self.user.username})"


class AssistantProfile(models.Model):
    class AssistantType(models.TextChoices):
        TEACHING = 'teaching', _("مساعد تدريس")
        RESEARCH = 'research', _("مساعد بحث")
        LAB = 'lab', _("مساعد معمل")
        ADMIN = 'admin', _("مساعد إداري")

    user = models.OneToOneField(
        'CustomUser', 
        on_delete=models.CASCADE, 
        verbose_name=_("المستخدم"),
        related_name='assistant_profile'
    )
    full_name = models.CharField(max_length=255, verbose_name=_("الاسم الكامل"))
    phone_number = models.CharField(max_length=15, blank=True, null=True, verbose_name=_("رقم الهاتف"))
    mobile_number = models.CharField(max_length=15, blank=True, null=True, verbose_name=_("رقم الجوال"))
    email = models.EmailField(blank=True, null=True, verbose_name=_("البريد الإلكتروني"))
    assistant_type = models.CharField(
        max_length=50,
        choices=AssistantType.choices,
        default=AssistantType.TEACHING,
        verbose_name=_("نوع المساعد")
    )
    professor = models.ForeignKey(
        ProfessorProfile,
        on_delete=models.SET_NULL,
        blank=True,
        null=True,
        related_name='assistants',
        verbose_name=_("الأستاذ المشرف")
    )
    department = models.CharField(max_length=100, blank=True, null=True, verbose_name=_("القسم"))
    college = models.CharField(max_length=100, blank=True, null=True, verbose_name=_("الكلية"))
    image = models.ImageField(upload_to='assistants/images/', blank=True, null=True, verbose_name=_("الصورة"))
    address = models.TextField(blank=True, null=True, verbose_name=_("العنوان"))
    qualifications = models.TextField(blank=True, null=True, verbose_name=_("المؤهلات"))
    is_active = models.BooleanField(default=True, verbose_name=_("نشط"))
    joined_date = models.DateField(blank=True, null=True, verbose_name=_("تاريخ الانضمام"))
    created_at = models.DateTimeField(auto_now_add=True, verbose_name=_("تاريخ الإنشاء"))
    updated_at = models.DateTimeField(auto_now=True, verbose_name=_("تاريخ التحديث"))

    supported_courses = models.ManyToManyField(
        Course,
        through='CourseAssistance',
        related_name='assistants',
        verbose_name=_("المقررات المساعدة فيها")
    )
    
    supported_students = models.ManyToManyField(
        'StudentProfile',
        through='StudentSupport',
        related_name='support_assistants',
        verbose_name=_("الطلاب المساعد لهم")
    )

    class Meta:
        verbose_name = _("ملف المساعد")
        verbose_name_plural = _("ملفات المساعدين")
        ordering = ['-created_at']

    def __str__(self):
        return self.full_name or f"{self.get_assistant_type_display()} ({self.user.username})"


class StudentProfile(models.Model):
    user = models.OneToOneField(
        'CustomUser', 
        on_delete=models.CASCADE, 
        verbose_name=_("المستخدم"),
        related_name='student_profile'
    )
    full_name = models.CharField(max_length=100, verbose_name="الاسم الكامل")
    job = models.CharField(max_length=100, blank=True, null=True, verbose_name="الوظيفة")
    discount_reason = models.CharField(max_length=255, blank=True, null=True, verbose_name="سبب الخصم")
    is_guardian = models.BooleanField(default=False, verbose_name="هل هو ولي أمر")
    relationship_degree = models.CharField(max_length=100, blank=True, null=True, verbose_name="درجة القرابة")
    city = models.CharField(max_length=100, blank=True, null=True, verbose_name="المدينة")
    address = models.TextField(blank=True, null=True, verbose_name="العنوان")
    nationality = models.CharField(max_length=100, blank=True, null=True, verbose_name="الجنسية")
    mother_name = models.CharField(max_length=100, blank=True, null=True, verbose_name="اسم الأم")
    home_phone = models.CharField(max_length=20, blank=True, null=True, verbose_name="هاتف المنزل")
    mobile = models.CharField(max_length=20, blank=True, null=True, verbose_name="الجوال")
    fax = models.CharField(max_length=20, blank=True, null=True, verbose_name="الفاكس")

    # Contact information
    email = models.EmailField(blank=True, null=True, verbose_name="البريد الإلكتروني")
    alternative_email = models.EmailField(blank=True, null=True, verbose_name="بريد إلكتروني بديل")
    phone_number = models.CharField(max_length=20, blank=True, null=True, verbose_name="رقم الهاتف")
    whatsapp = models.CharField(max_length=20, blank=True, null=True, verbose_name="واتساب")
    facebook = models.URLField(blank=True, null=True, verbose_name="فيسبوك")
    telegram = models.CharField(max_length=100, blank=True, null=True, verbose_name="تيليجرام")
    instagram = models.CharField(max_length=100, blank=True, null=True, verbose_name="إنستجرام")

    # Family Info
    father_name = models.CharField(max_length=100, blank=True, null=True, verbose_name="اسم الأب")
    father_education = models.CharField(max_length=100, blank=True, null=True, verbose_name="تعليم الأب")
    father_job = models.CharField(max_length=100, blank=True, null=True, verbose_name="وظيفة الأب")
    father_phone = models.CharField(max_length=20, blank=True, null=True, verbose_name="هاتف الأب")
    father_whatsapp = models.CharField(max_length=20, blank=True, null=True, verbose_name="واتساب الأب")
    
    mother_education = models.CharField(max_length=100, blank=True, null=True, verbose_name="تعليم الأم")
    mother_job = models.CharField(max_length=100, blank=True, null=True, verbose_name="وظيفة الأم")
    mother_phone = models.CharField(max_length=20, blank=True, null=True, verbose_name="هاتف الأم")
    mother_whatsapp = models.CharField(max_length=20, blank=True, null=True, verbose_name="واتساب الأم")

    guardian_name = models.CharField(max_length=100, blank=True, null=True, verbose_name="اسم الولي")
    guardian_relationship = models.CharField(max_length=100, blank=True, null=True, verbose_name="صلة القرابة")
    guardian_job = models.CharField(max_length=100, blank=True, null=True, verbose_name="وظيفة الولي")
    guardian_phone = models.CharField(max_length=20, blank=True, null=True, verbose_name="هاتف الولي")
    guardian_whatsapp = models.CharField(max_length=20, blank=True, null=True, verbose_name="واتساب الولي")

    # Study info
    joining_year = models.CharField(max_length=10, blank=True, null=True, verbose_name="عام الالتحاق")
    school_ar = models.CharField(max_length=255, blank=True, null=True, verbose_name="المدرسة (عربي)")
    school_en = models.CharField(max_length=255, blank=True, null=True, verbose_name="المدرسة (إنجليزي)")
    degree = models.CharField(max_length=255, blank=True, null=True, verbose_name="الدرجة العلمية")
    graduation_year = models.CharField(max_length=10, blank=True, null=True, verbose_name="عام التخرج")
    degree_round = models.CharField(max_length=50, blank=True, null=True, verbose_name="دورة التخرج")
    total_grades = models.CharField(max_length=10, blank=True, null=True, verbose_name="المجموع الكلي")
    exam_number = models.CharField(max_length=50, blank=True, null=True, verbose_name="رقم الجلوس")
    acceptance_type = models.CharField(max_length=100, blank=True, null=True, verbose_name="نوع القبول")
    issue_number = models.CharField(max_length=50, blank=True, null=True, verbose_name="رقم الإصدار")
    computer_serial = models.CharField(max_length=50, blank=True, null=True, verbose_name="الرقم التسلسلي")
    second_language = models.CharField(max_length=50, blank=True, null=True, verbose_name="اللغة الثانية")
    cumulative_gpa = models.FloatField(blank=True, null=True, verbose_name="المعدل التراكمي")
    percentage = models.FloatField(blank=True, null=True, verbose_name="النسبة المئوية")

    # Previous qualification info
    previous_degree = models.CharField(max_length=255, blank=True, null=True, verbose_name="الشهادة السابقة")
    previous_degree_round = models.CharField(max_length=100, blank=True, null=True, verbose_name="دورة الشهادة السابقة")
    previous_graduation_year = models.CharField(max_length=10, blank=True, null=True, verbose_name="عام التخرج السابق")
    transfer_approval_date = models.DateField(blank=True, null=True, verbose_name="تاريخ موافقة النقل")
    transfer_approval_number = models.CharField(max_length=100, blank=True, null=True, verbose_name="رقم موافقة النقل")
    transfer_from = models.CharField(max_length=255, blank=True, null=True, verbose_name="الانتقال من")

    # Educational info
    college = models.CharField(max_length=100, blank=True, null=True, verbose_name="الكلية")
    program = models.CharField(max_length=100, blank=True, null=True, verbose_name="البرنامج")
    level = models.CharField(max_length=50, blank=True, null=True, verbose_name="المستوى")
    credit_hours = models.IntegerField(blank=True, null=True, verbose_name="عدد الساعات")
    previous_year_gpa = models.FloatField(blank=True, null=True, verbose_name="معدل العام السابق")
    previous_year_grade = models.CharField(max_length=50, blank=True, null=True, verbose_name="تقدير العام السابق")
    
    # Graduation project info
    arabic_project_title = models.CharField(max_length=255, blank=True, null=True, verbose_name="مشروع التخرج بالعربي")
    english_project_title = models.CharField(max_length=255, blank=True, null=True, verbose_name="مشروع التخرج بالإنجليزي")
    
    # Medical and literacy info
    medical_report = models.TextField(blank=True, null=True, verbose_name="الكشف الطبي")
    literacy_status = models.CharField(max_length=100, blank=True, null=True, verbose_name="محو الأمية")

    enrolled_courses = models.ManyToManyField(
        Course,
        through='CourseEnrollment',
        related_name='enrolled_students',
        verbose_name=_("المقررات المسجلة")
    )

    # Additional academic relationships
    academic_advisor = models.ForeignKey(
        ProfessorProfile,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='advisees',
        verbose_name=_("المستشار الأكاديمي")
    )

    class Meta:
        verbose_name = "الملف الشخصي للطالب"
        verbose_name_plural = "الملفات الشخصية للطلاب"

    def __str__(self):
        return self.full_name

#####################################################################

# Intermediate models for many-to-many relationships
class CourseTeaching(models.Model):
    professor = models.ForeignKey(
        ProfessorProfile, 
        on_delete=models.CASCADE,
        verbose_name=_("الأستاذ")
    )
    course = models.ForeignKey(
        Course, 
        on_delete=models.CASCADE,
        verbose_name=_("المقرر")
    )
    semester = models.CharField(
        max_length=50, 
        verbose_name=_("الفصل الدراسي")
    )
    year = models.CharField(
        max_length=4, 
        verbose_name=_("السنة")
    )
    is_primary_instructor = models.BooleanField(
        default=True, 
        verbose_name=_("المدرس الرئيسي")
    )
    
    class Meta:
        verbose_name = _("تدريس المقرر")
        verbose_name_plural = _("تدريس المقررات")
        unique_together = ('professor', 'course', 'semester', 'year')

    def __str__(self):
        return f"{self.professor.full_name} - {self.course.title} ({self.semester} {self.year})"

class CourseAssistance(models.Model):
    assistant = models.ForeignKey(
        AssistantProfile, 
        on_delete=models.CASCADE,
        verbose_name=_("المساعد")
    )
    course = models.ForeignKey(
        Course, 
        on_delete=models.CASCADE,
        verbose_name=_("المقرر")
    )
    professor = models.ForeignKey(
        ProfessorProfile, 
        on_delete=models.CASCADE,
        verbose_name=_("الأستاذ المشرف")
    )
    semester = models.CharField(
        max_length=50, 
        verbose_name=_("الفصل الدراسي")
    )
    year = models.CharField(
        max_length=4, 
        verbose_name=_("السنة")
    )
    responsibilities = models.TextField(
        blank=True, 
        null=True, 
        verbose_name=_("المسؤوليات")
    )
    
    class Meta:
        verbose_name = _("مساعدة في المقرر")
        verbose_name_plural = _("المساعدة في المقررات")
        unique_together = ('assistant', 'course', 'semester', 'year')

    def __str__(self):
        return f"{self.assistant.full_name} - {self.course.title} ({self.semester} {self.year})"

class CourseEnrollment(models.Model):
    ENROLLMENT_STATUS = [
        ('active', _('نشط')),
        ('dropped', _('منسحب')),
        ('completed', _('مكتمل')),
        ('failed', _('راسب')),
        ('incomplete', _('غير مكتمل')),
    ]

    student = models.ForeignKey(
        StudentProfile, 
        on_delete=models.CASCADE,
        verbose_name=_("الطالب")
    )
    course = models.ForeignKey(
        Course, 
        on_delete=models.CASCADE,
        verbose_name=_("المقرر")
    )
    semester = models.CharField(
        max_length=50, 
        verbose_name=_("الفصل الدراسي")
    )
    year = models.CharField(
        max_length=4, 
        verbose_name=_("السنة")
    )
    grade = models.CharField(
        max_length=2, 
        blank=True, 
        null=True, 
        verbose_name=_("الدرجة")
    )
    status = models.CharField(
        max_length=20, 
        choices=ENROLLMENT_STATUS,
        default='active', 
        verbose_name=_("الحالة")
    )
    enrollment_date = models.DateTimeField(
        auto_now_add=True,
        verbose_name=_("تاريخ التسجيل")
    )
    last_updated = models.DateTimeField(
        auto_now=True,
        verbose_name=_("آخر تحديث")
    )
    notes = models.TextField(
        blank=True, 
        null=True,
        verbose_name=_("ملاحظات")
    )
    
    class Meta:
        verbose_name = _("تسجيل في مقرر")
        verbose_name_plural = _("التسجيل في المقررات")
        unique_together = ('student', 'course', 'semester', 'year')
        ordering = ['-year', 'semester']

    def __str__(self):
        return f"{self.student.full_name} - {self.course.title} ({self.semester} {self.year})"

class StudentSupervision(models.Model):
    professor = models.ForeignKey(ProfessorProfile, on_delete=models.CASCADE)
    student = models.ForeignKey(StudentProfile, on_delete=models.CASCADE)
    supervision_type = models.CharField(max_length=50, verbose_name=_("نوع الإشراف"))
    start_date = models.DateField(verbose_name=_("تاريخ البدء"))
    end_date = models.DateField(blank=True, null=True, verbose_name=_("تاريخ الانتهاء"))
    is_active = models.BooleanField(default=True, verbose_name=_("نشط"))
    
    class Meta:
        verbose_name = _("إشراف أكاديمي")
        verbose_name_plural = _("إشرافات أكاديمية")

class StudentSupport(models.Model):
    assistant = models.ForeignKey(AssistantProfile, on_delete=models.CASCADE)
    student = models.ForeignKey(StudentProfile, on_delete=models.CASCADE)
    support_type = models.CharField(max_length=50, verbose_name=_("نوع الدعم"))
    start_date = models.DateField(verbose_name=_("تاريخ البدء"))
    end_date = models.DateField(blank=True, null=True, verbose_name=_("تاريخ الانتهاء"))
    notes = models.TextField(blank=True, null=True, verbose_name=_("ملاحظات"))
    
    class Meta:
        verbose_name = _("دعم طلابي")
        verbose_name_plural = _("دعم طلابي")

class ClassRoom(models.Model):
    name = models.CharField(max_length=100, verbose_name=_("اسم القاعة"))
    building = models.CharField(max_length=100, verbose_name=_("المبنى"))
    floor = models.CharField(max_length=50, verbose_name=_("الطابق"))
    capacity = models.IntegerField(verbose_name=_("السعة"))
    room_type = models.CharField(
        max_length=50,
        choices=[
            ('lecture', _('قاعة محاضرات')),
            ('lab', _('معمل')),
            ('seminar', _('قاعة ندوات')),
        ],
        verbose_name=_("نوع القاعة")
    )
    has_projector = models.BooleanField(default=False, verbose_name=_("يوجد جهاز عرض"))
    has_computer = models.BooleanField(default=False, verbose_name=_("يوجد حاسوب"))
    notes = models.TextField(blank=True, null=True, verbose_name=_("ملاحظات"))

    class Meta:
        verbose_name = _("قاعة دراسية")
        verbose_name_plural = _("القاعات الدراسية")

    def __str__(self):
        return f"{self.name} - {self.building}"

class TimeSlot(models.Model):
    start_time = models.TimeField(verbose_name=_("وقت البداية"))
    end_time = models.TimeField(verbose_name=_("وقت النهاية"))
    slot_type = models.CharField(
        max_length=20,
        choices=[
            ('lecture', _('محاضرة')),
            ('lab', _('معمل')),
            ('office_hours', _('ساعات مكتبية')),
            ('seminar', _('ندوة')),
        ],
        default='lecture',
        verbose_name=_("نوع الموعد")
    )
    is_active = models.BooleanField(default=True, verbose_name=_("نشط"))
    created_at = models.DateTimeField(auto_now_add=True, verbose_name=_("تاريخ الإنشاء"))
    updated_at = models.DateTimeField(auto_now=True, verbose_name=_("تاريخ التحديث"))

    class Meta:
        verbose_name = _("موعد")
        verbose_name_plural = _("المواعيد")
        ordering = ['start_time']
        unique_together = ['start_time', 'end_time']

    def __str__(self):
        return f"{self.start_time.strftime('%I:%M %p')} - {self.end_time.strftime('%I:%M %p')}"

    def clean(self):
        from django.core.exceptions import ValidationError
        if self.start_time >= self.end_time:
            raise ValidationError(_("وقت البداية يجب أن يكون قبل وقت النهاية"))

class StudySchedule(models.Model):
    DAYS_OF_WEEK = [
        ('saturday', _('السبت')),
        ('sunday', _('الأحد')),
        ('monday', _('الاثنين')),
        ('tuesday', _('الثلاثاء')),
        ('wednesday', _('الأربعاء')),
        ('thursday', _('الخميس')),
    ]

    SEMESTER_CHOICES = [
        ('first', _('الفصل الأول')),
        ('second', _('الفصل الثاني')),
        ('summer', _('الفصل الصيفي')),
    ]

    course = models.ForeignKey(
        Course, 
        on_delete=models.CASCADE,
        related_name='schedules',
        verbose_name=_("المقرر")
    )
    professor = models.ForeignKey(
        ProfessorProfile,
        on_delete=models.CASCADE,
        related_name='teaching_schedules',
        verbose_name=_("الأستاذ")
    )
    assistants = models.ManyToManyField(
        AssistantProfile,
        related_name='assisting_schedules',
        blank=True,
        verbose_name=_("المساعدون")
    )
    classroom = models.ForeignKey(
        ClassRoom,
        on_delete=models.CASCADE,
        related_name='schedules',
        verbose_name=_("القاعة")
    )
    day = models.CharField(
        max_length=20,
        choices=DAYS_OF_WEEK,
        verbose_name=_("اليوم")
    )
    time_slot = models.ForeignKey(
        TimeSlot,
        on_delete=models.PROTECT,
        related_name='schedules',
        verbose_name=_("الموعد")
    )
    semester = models.CharField(
        max_length=20,
        choices=SEMESTER_CHOICES,
        verbose_name=_("الفصل الدراسي")
    )
    academic_year = models.CharField(
        max_length=9,
        verbose_name=_("العام الدراسي"),
        help_text=_("مثال: 2023-2024")
    )
    enrolled_students = models.ManyToManyField(
        StudentProfile,
        related_name='class_schedules',
        blank=True,
        verbose_name=_("الطلاب المسجلون")
    )
    max_students = models.IntegerField(
        verbose_name=_("الحد الأقصى للطلاب"),
        help_text=_("الحد الأقصى لعدد الطلاب المسموح به في هذا الموعد")
    )
    is_active = models.BooleanField(
        default=True,
        verbose_name=_("نشط")
    )
    created_by = models.ForeignKey(
        AdminProfile,
        on_delete=models.SET_NULL,
        null=True,
        related_name='created_schedules',
        verbose_name=_("تم الإنشاء بواسطة")
    )
    created_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name=_("تاريخ الإنشاء")
    )
    updated_at = models.DateTimeField(
        auto_now=True,
        verbose_name=_("تاريخ التحديث")
    )
    notes = models.TextField(
        blank=True,
        null=True,
        verbose_name=_("ملاحظات")
    )

    class Meta:
        verbose_name = _("جدول دراسي")
        verbose_name_plural = _("الجداول الدراسية")
        ordering = ['semester', 'day', 'time_slot']
        # Ensure no scheduling conflicts
        unique_together = [
            ('classroom', 'day', 'time_slot', 'semester', 'academic_year'),
            ('professor', 'day', 'time_slot', 'semester', 'academic_year'),
        ]

    def __str__(self):
        return f"{self.course.title} - {self.get_day_display()} {self.time_slot}"

    def clean(self):
        from django.core.exceptions import ValidationError
        # Check if classroom capacity is sufficient
        if self.classroom.capacity < self.max_students:
            raise ValidationError({
                'max_students': _('عدد الطلاب المسموح به يتجاوز سعة القاعة')
            })

    def get_enrolled_count(self):
        return self.enrolled_students.count()

    def is_full(self):
        return self.get_enrolled_count() >= self.max_students

class ScheduleChange(models.Model):
    CHANGE_TYPES = [
        ('cancellation', _('إلغاء')),
        ('reschedule', _('إعادة جدولة')),
        ('room_change', _('تغيير القاعة')),
        ('professor_change', _('تغيير الأستاذ')),
    ]

    schedule = models.ForeignKey(
        StudySchedule,
        on_delete=models.CASCADE,
        related_name='changes',
        verbose_name=_("الجدول الدراسي")
    )
    change_type = models.CharField(
        max_length=20,
        choices=CHANGE_TYPES,
        verbose_name=_("نوع التغيير")
    )
    new_date = models.DateField(
        blank=True,
        null=True,
        verbose_name=_("التاريخ الجديد")
    )
    new_time_slot = models.ForeignKey(
        TimeSlot,
        on_delete=models.SET_NULL,
        blank=True,
        null=True,
        related_name='schedule_changes',
        verbose_name=_("الموعد الجديد")
    )
    new_classroom = models.ForeignKey(
        ClassRoom,
        on_delete=models.SET_NULL,
        blank=True,
        null=True,
        related_name='schedule_changes',
        verbose_name=_("القاعة الجديدة")
    )
    new_professor = models.ForeignKey(
        ProfessorProfile,
        on_delete=models.SET_NULL,
        blank=True,
        null=True,
        related_name='schedule_changes',
        verbose_name=_("الأستاذ الجديد")
    )
    reason = models.TextField(
        verbose_name=_("سبب التغيير")
    )
    created_by = models.ForeignKey(
        AdminProfile,
        on_delete=models.SET_NULL,
        null=True,
        related_name='schedule_changes',
        verbose_name=_("تم الإنشاء بواسطة")
    )
    created_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name=_("تاريخ الإنشاء")
    )
    notification_sent = models.BooleanField(
        default=False,
        verbose_name=_("تم إرسال الإشعار")
    )

    class Meta:
        verbose_name = _("تغيير في الجدول")
        verbose_name_plural = _("تغييرات الجدول")
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.get_change_type_display()} - {self.schedule}"
