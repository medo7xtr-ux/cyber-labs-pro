# labs/models.py
from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

# ========================
# نموذج المعمل (Lab)
# ========================
class Lab(models.Model):
    """نموذج يمثل معمل تعليمي"""
    
    # اختيارات مستوى الصعوبة
    DIFFICULTY_CHOICES = [
        ('beginner', 'مبتدئ'),
        ('intermediate', 'متوسط'),
        ('advanced', 'متقدم'),
        ('expert', 'خبير'),
    ]
    
    # اختيارات التصنيفات
    CATEGORY_CHOICES = [
        ('web_security', 'أمن الويب'),
        ('network_security', 'أمن الشبكات'),
        ('cryptography', 'التشفير'),
        ('digital_forensics', 'التحقيق الجنائي الرقمي'),
        ('reverse_engineering', 'الهندسة العكسية'),
        ('malware_analysis', 'تحليل البرمجيات الخبيثة'),
        ('social_engineering', 'الهندسة الاجتماعية'),
        ('iot_security', 'أمن إنترنت الأشياء'),
    ]
    
    # الحقول الأساسية
    title = models.CharField(max_length=200, verbose_name='عنوان المعمل')
    slug = models.SlugField(max_length=200, unique=True, verbose_name='الرابط')
    description = models.TextField(verbose_name='الوصف')
    overview = models.TextField(verbose_name='نظرة عامة', blank=True)
    learning_objectives = models.TextField(verbose_name='أهداف التعلم', blank=True)
    
    # التصنيف والصعوبة
    category = models.CharField(
        max_length=100, 
        choices=CATEGORY_CHOICES,
        default='web_security',  # أو أي قيمة افتراضية مناسبة
        verbose_name='التصنيف'
    )
    
    difficulty = models.CharField(
        max_length=20, 
        choices=DIFFICULTY_CHOICES, 
        verbose_name='مستوى الصعوبة',
        default='beginner'  # قيمة افتراضية: مبتدئ
    )
    
    # النقاط والتقدير
    points = models.IntegerField(default=100, verbose_name='النقاط')
    estimated_time = models.IntegerField(default=60, verbose_name='الوقت المقدر (دقيقة)')
    
    # الملفات والوسائط
    thumbnail = models.ImageField(upload_to='labs/thumbnails/', null=True, blank=True,
                                 verbose_name='الصورة المصغرة')
    lab_guide = models.FileField(upload_to='labs/guides/', null=True, blank=True,
                                verbose_name='دليل المعمل')
    starter_files = models.FileField(upload_to='labs/starter_files/', null=True, blank=True,
                                    verbose_name='ملفات البدء')
    solution_file = models.FileField(upload_to='labs/solutions/', null=True, blank=True,
                                    verbose_name='ملف الحل')
    
    # الإعدادات
    is_premium = models.BooleanField(default=False, verbose_name='مميز')
    is_active = models.BooleanField(default=True, verbose_name='نشط')
    requires_vm = models.BooleanField(default=False, verbose_name='يتطلب جهاز افتراضي')
    vm_image = models.CharField(max_length=200, blank=True, verbose_name='صورة الجهاز الافتراضي')
    
    # إحصائيات
    views = models.IntegerField(default=0, verbose_name='عدد المشاهدات')
    completions = models.IntegerField(default=0, verbose_name='عدد الإكمالات')
    average_score = models.FloatField(default=0, verbose_name='متوسط النقاط')
    
    # التواريخ
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='تاريخ الإنشاء')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='آخر تحديث')
    published_at = models.DateTimeField(null=True, blank=True, verbose_name='تاريخ النشر')
    
    class Meta:
        verbose_name = 'معمل'
        verbose_name_plural = 'المعامل'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['category']),
            models.Index(fields=['difficulty']),
            models.Index(fields=['is_active']),
        ]
    
    def __str__(self):
        return self.title
    
    def get_challenge_count(self):
        """عدد التحديات في المعمل"""
        return self.challenges.count()
    
    def get_average_completion_time(self):
        """متوسط وقت الإكمال"""
        from django.db.models import Avg
        result = self.submissions.filter(status='completed').aggregate(
            avg_time=Avg('completion_time')
        )
        return result['avg_time'] or 0


# ========================
# نموذج التحدي (Challenge)
# ========================

class Challenge(models.Model):
    """نموذج يمثل تحدي داخل المعمل"""
    
    # أنواع الإجابة
    ANSWER_TYPE_CHOICES = [
        ('text', 'نص'),
        ('code', 'كود'),
        ('file', 'ملف'),
        ('flag', 'علم'),
        ('multiple_choice', 'اختيار متعدد'),
        ('code_output', 'مخرجات الكود'),
    ]
    
    # مستويات التحدي
    CHALLENGE_LEVEL_CHOICES = [
        ('easy', 'سهل'),
        ('medium', 'متوسط'),
        ('hard', 'صعب'),
    ]
    
    # الحقول الأساسية
    lab = models.ForeignKey(Lab, on_delete=models.CASCADE, related_name='challenges',
                           verbose_name='المعمل')
    title = models.CharField(max_length=200, verbose_name='عنوان التحدي')
    description = models.TextField(verbose_name='وصف التحدي')
    instructions = models.TextField(verbose_name='التعليمات', blank=True)
    hint = models.TextField(verbose_name='تلميح', blank=True)
    solution_hint = models.TextField(verbose_name='تلميح الحل', blank=True)
    
    # نوع التحدي
    challenge_type = models.CharField(max_length=20, default='regular', 
                                     verbose_name='نوع التحدي')
    answer_type = models.CharField(max_length=20, choices=ANSWER_TYPE_CHOICES,
                                  verbose_name='نوع الإجابة')
    level = models.CharField(max_length=20, choices=CHALLENGE_LEVEL_CHOICES,
                            default='medium', verbose_name='مستوى التحدي')
    
    # الإجابة الصحيحة
    correct_answer = models.TextField(verbose_name='الإجابة الصحيحة')
    correct_code = models.TextField(blank=True, verbose_name='الكود الصحيح')
    expected_output = models.TextField(blank=True, verbose_name='المخرجات المتوقعة')
    multiple_choices = models.JSONField(null=True, blank=True, verbose_name='خيارات متعددة')
    
    # النقاط والترتيب
    points = models.IntegerField(default=10, verbose_name='النقاط')
    order = models.IntegerField(default=0, verbose_name='الترتيب')
    
    # الملفات
    starter_code = models.FileField(upload_to='challenges/code/', null=True, blank=True,
                                   verbose_name='كود البدء')
    test_cases = models.FileField(upload_to='challenges/tests/', null=True, blank=True,
                                 verbose_name='حالات الاختبار')
    attachments = models.FileField(upload_to='challenges/attachments/', null=True, blank=True,
                                  verbose_name='المرفقات')
    
    # إحصائيات
    attempts = models.IntegerField(default=0, verbose_name='عدد المحاولات')
    success_rate = models.FloatField(default=0, verbose_name='نسبة النجاح')
    
    # التواريخ
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='تاريخ الإنشاء')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='آخر تحديث')
    
    class Meta:
        verbose_name = 'تحدي'
        verbose_name_plural = 'التحديات'
        ordering = ['order']
        unique_together = ['lab', 'order']
    
    def __str__(self):
        return f"{self.lab.title} - {self.title}"
    
    def get_submission_count(self):
        """عدد التسليمات لهذا التحدي"""
        return self.submissions.count()
    
    def get_successful_submissions(self):
        """عدد التسليمات الناجحة"""
        return self.submissions.filter(status='correct').count()


# ========================
# نموذج التسليم (Submission)
# ========================

class Submission(models.Model):
    """نموذج يمثل تسليم تحدي من قبل مستخدم"""
    
    # حالات التسليم
    STATUS_CHOICES = [
        ('pending', 'قيد المراجعة'),
        ('correct', 'صحيح'),
        ('incorrect', 'غير صحيح'),
        ('partial', 'صحيح جزئياً'),
        ('timeout', 'انتهى الوقت'),
        ('error', 'خطأ في التنفيذ'),
    ]
    
    # الحقول الأساسية
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='lab_submissions',
                            verbose_name='المستخدم')
    lab = models.ForeignKey(Lab, on_delete=models.CASCADE, related_name='submissions',
                           verbose_name='المعمل')
    challenge = models.ForeignKey(Challenge, on_delete=models.CASCADE, related_name='submissions',
                                 verbose_name='التحدي')
    
    # الإجابة
    answer = models.TextField(verbose_name='الإجابة')
    code = models.TextField(blank=True, verbose_name='الكود المقدم')
    file = models.FileField(upload_to='submissions/files/', null=True, blank=True,
                           verbose_name='الملف المرفوع')
    
    # النتيجة
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending',
                             verbose_name='الحالة')
    score = models.IntegerField(default=0, verbose_name='الدرجة')
    is_correct = models.BooleanField(default=False, verbose_name='هل الإجابة صحيحة؟')
    
    # وقت التنفيذ
    execution_time = models.FloatField(null=True, blank=True, verbose_name='وقت التنفيذ (ثانية)')
    completion_time = models.IntegerField(null=True, blank=True, verbose_name='وقت الإكمال (ثانية)')
    
    # التقييم التلقائي
    test_results = models.JSONField(null=True, blank=True, verbose_name='نتائج الاختبارات')
    output = models.TextField(blank=True, verbose_name='المخرجات')
    errors = models.TextField(blank=True, verbose_name='الأخطاء')
    
    # المراجعة
    reviewed_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True,
                                   related_name='reviewed_submissions', verbose_name='المراجع')
    review_notes = models.TextField(blank=True, verbose_name='ملاحظات المراجعة')
    review_score = models.IntegerField(null=True, blank=True, verbose_name='درجة المراجعة')
    
    # التواريخ
    submitted_at = models.DateTimeField(auto_now_add=True, verbose_name='تاريخ التسليم')
    reviewed_at = models.DateTimeField(null=True, blank=True, verbose_name='تاريخ المراجعة')
    
    class Meta:
        verbose_name = 'تسليم'
        verbose_name_plural = 'التسليمات'
        ordering = ['-submitted_at']
        unique_together = ['user', 'challenge']
        indexes = [
            models.Index(fields=['user', 'lab']),
            models.Index(fields=['status']),
            models.Index(fields=['submitted_at']),
        ]
    
    def __str__(self):
        return f"تسليم {self.user.username} - {self.challenge.title}"
    
    def save(self, *args, **kwargs):
        # تحديث إحصائيات التحدي عند الحفظ
        if self.pk is None:  # إذا كان تسليم جديد
            self.challenge.attempts += 1
            if self.status == 'correct':
                self.challenge.success_rate = (
                    self.challenge.get_successful_submissions() / self.challenge.attempts * 100
                )
            self.challenge.save()
        
        super().save(*args, **kwargs)


# ========================
# نموذج تقدم المستخدم (UserLabProgress)
# ========================

class UserLabProgress(models.Model):
    """تقدم المستخدم في المعمل"""
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='lab_progress',
                            verbose_name='المستخدم')
    lab = models.ForeignKey(Lab, on_delete=models.CASCADE, related_name='user_progress',
                           verbose_name='المعمل')
    
    # حالة التقدم
    is_started = models.BooleanField(default=False, verbose_name='بدء المعمل')
    is_completed = models.BooleanField(default=False, verbose_name='معمل مكتمل')
    completion_percentage = models.FloatField(default=0, verbose_name='نسبة الإكمال')
    
    # التحديات المكتملة
    completed_challenges = models.ManyToManyField(Challenge, blank=True,
                                                 verbose_name='التحديات المكتملة',
                                                 related_name='completed_by')
    
    # النقاط والدرجات
    total_score = models.IntegerField(default=0, verbose_name='مجموع النقاط')
    max_possible_score = models.IntegerField(default=0, verbose_name='أقصى درجة ممكنة')
    
    # الوقت
    started_at = models.DateTimeField(null=True, blank=True, verbose_name='تاريخ البدء')
    completed_at = models.DateTimeField(null=True, blank=True, verbose_name='تاريخ الإكمال')
    total_time_spent = models.IntegerField(default=0, verbose_name='إجمالي الوقت المستغرق (ثانية)')
    
    # المحاولات
    attempt_count = models.IntegerField(default=0, verbose_name='عدد المحاولات')
    
    # التواريخ
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='تاريخ الإنشاء')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='آخر تحديث')
    
    class Meta:
        verbose_name = 'تقدم المستخدم في المعمل'
        verbose_name_plural = 'تقدم المستخدمين في المعامل'
        unique_together = ['user', 'lab']
        indexes = [
            models.Index(fields=['user', 'is_completed']),
            models.Index(fields=['completion_percentage']),
        ]
    
    def __str__(self):
        return f"{self.user.username} - {self.lab.title}"
    
    def update_progress(self):
        """تحديث تقدم المستخدم"""
        total_challenges = self.lab.challenges.count()
        completed_count = self.completed_challenges.count()
        
        if total_challenges > 0:
            self.completion_percentage = (completed_count / total_challenges) * 100
        
        self.is_completed = self.completion_percentage >= 100
        
        if self.is_completed and not self.completed_at:
            from django.utils import timezone
            self.completed_at = timezone.now()
        
        self.save()


# ========================
# نموذج تقييم المعمل (LabReview)
# ========================

class LabReview(models.Model):
    """تقييمات المستخدمين للمعامل"""
    
    RATING_CHOICES = [
        (1, '⭐'),
        (2, '⭐⭐'),
        (3, '⭐⭐⭐'),
        (4, '⭐⭐⭐⭐'),
        (5, '⭐⭐⭐⭐⭐'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='lab_reviews',
                            verbose_name='المستخدم')
    lab = models.ForeignKey(Lab, on_delete=models.CASCADE, related_name='reviews',
                           verbose_name='المعمل')
    
    # التقييم
    rating = models.IntegerField(choices=RATING_CHOICES, verbose_name='التقييم')
    comment = models.TextField(verbose_name='التعليق', blank=True)
    
    # الجوانب
    difficulty_rating = models.IntegerField(choices=RATING_CHOICES, verbose_name='تقييم الصعوبة')
    content_quality = models.IntegerField(choices=RATING_CHOICES, verbose_name='جودة المحتوى')
    usefulness = models.IntegerField(choices=RATING_CHOICES, verbose_name='الفائدة')
    
    # الموافقة
    is_approved = models.BooleanField(default=True, verbose_name='مقبول')
    helpful_count = models.IntegerField(default=0, verbose_name='عدد المفيد')
    
    # التواريخ
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='تاريخ التقييم')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='آخر تحديث')
    
    class Meta:
        verbose_name = 'تقييم معمل'
        verbose_name_plural = 'تقييمات المعامل'
        unique_together = ['user', 'lab']
        ordering = ['-created_at']
    
    def __str__(self):
        return f"تقييم {self.user.username} لـ {self.lab.title}"


# ========================
# نموذج إحصائيات المعمل (LabStatistics)
# ========================

class LabStatistics(models.Model):
    """إحصائيات المعمل"""
    
    lab = models.OneToOneField(Lab, on_delete=models.CASCADE, related_name='statistics',
                              verbose_name='المعمل')
    
    # الإحصائيات الأساسية
    total_views = models.IntegerField(default=0, verbose_name='إجمالي المشاهدات')
    total_starts = models.IntegerField(default=0, verbose_name='إجمالي البدء')
    total_completions = models.IntegerField(default=0, verbose_name='إجمالي الإكمالات')
    total_submissions = models.IntegerField(default=0, verbose_name='إجمالي التسليمات')
    
    # متوسطات
    average_rating = models.FloatField(default=0, verbose_name='متوسط التقييم')
    average_completion_time = models.FloatField(default=0, verbose_name='متوسط وقت الإكمال')
    average_score = models.FloatField(default=0, verbose_name='متوسط الدرجات')
    
    # النسب
    completion_rate = models.FloatField(default=0, verbose_name='نسبة الإكمال')
    success_rate = models.FloatField(default=0, verbose_name='نسبة النجاح')
    dropout_rate = models.FloatField(default=0, verbose_name='نسبة الانسحاب')
    
    # تحديث
    last_calculated = models.DateTimeField(auto_now=True, verbose_name='آخر حساب')
    
    class Meta:
        verbose_name = 'إحصائيات معمل'
        verbose_name_plural = 'إحصائيات المعامل'
    
    def __str__(self):
        return f"إحصائيات {self.lab.title}"
    
    def calculate_statistics(self):
        """حساب جميع الإحصائيات"""
        from django.db.models import Avg, Count
        
        # حساب الإحصائيات الأساسية
        self.total_starts = self.lab.user_progress.filter(is_started=True).count()
        self.total_completions = self.lab.user_progress.filter(is_completed=True).count()
        self.total_submissions = self.lab.submissions.count()
        
        # حساب المتوسطات
        if self.lab.reviews.filter(is_approved=True).exists():
            self.average_rating = self.lab.reviews.filter(
                is_approved=True
            ).aggregate(avg=Avg('rating'))['avg'] or 0
        
        # حساب النسب
        if self.total_starts > 0:
            self.completion_rate = (self.total_completions / self.total_starts) * 100
        
        self.save()


# ========================
# إشارات (Signals) - يمكن إضافتها في ملف signals.py منفصل
# ========================

"""
# في ملف labs/signals.py
from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from .models import Lab, LabStatistics, Submission, Challenge

@receiver(post_save, sender=Lab)
def create_lab_statistics(sender, instance, created, **kwargs):
    if created:
        LabStatistics.objects.create(lab=instance)

@receiver(post_save, sender=Submission)
def update_challenge_statistics(sender, instance, **kwargs):
    instance.challenge.save()  # سيؤدي إلى تحديث إحصائيات التحدي

@receiver(post_save, sender=LabReview)
def update_lab_rating(sender, instance, **kwargs):
    if instance.lab.statistics:
        instance.lab.statistics.calculate_statistics()
"""

print("✅ تم تحميل نماذج المعامل بنجاح!")
# ========================
# نموذج الإشعارات (Notification)
# ========================

class Notification(models.Model):
    """نموذج يمثل إشعار للمستخدم"""
    
    TYPES = [
        ('info', 'معلومات'),
        ('success', 'نجاح'),
        ('warning', 'تحذير'),
        ('error', 'خطأ'),
        ('achievement', 'إنجاز'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notifications')
    title = models.CharField(max_length=200)
    message = models.TextField()
    type = models.CharField(max_length=20, choices=TYPES, default='info')
    is_read = models.BooleanField(default=False)
    link = models.CharField(max_length=255, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user.username} - {self.title}"


# ========================
# نموذج الملف الشخصي المطور (UserProfile)
# ========================

class UserProfile(models.Model):
    """نموذج يمثل بيانات إضافية للمستخدم"""
    
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    bio = models.TextField(blank=True, null=True)
    avatar = models.ImageField(upload_to='avatars/', blank=True, null=True)
    total_points = models.IntegerField(default=0)
    rank = models.IntegerField(default=0)
    completed_labs_count = models.IntegerField(default=0)
    streak_days = models.IntegerField(default=0)
    last_activity = models.DateTimeField(auto_now=True)
    
    # تفضيلات
    is_public = models.BooleanField(default=True)
    receive_emails = models.BooleanField(default=True)

    def __str__(self):
        return self.user.username

    def update_stats(self):
        """تحديث إحصائيات المستخدم"""
        self.completed_labs_count = Submission.objects.filter(
            user=self.user, 
            status='correct'
        ).values('lab').distinct().count()
        
        self.total_points = Submission.objects.filter(
            user=self.user, 
            status='correct'
        ).aggregate(total=models.Sum('score'))['total'] or 0
        
        self.save()
