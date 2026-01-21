from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()


class TutorialCategory(models.Model):
    """فئات الدروس التعليمية"""
    name = models.CharField(max_length=100, verbose_name='اسم الفئة')
    description = models.TextField(blank=True, verbose_name='الوصف')
    icon = models.CharField(max_length=50, blank=True, verbose_name='الأيقونة')
    color = models.CharField(max_length=20, default='#3498db', verbose_name='اللون')
    order = models.IntegerField(default=0, verbose_name='الترتيب')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='تاريخ الإنشاء')
    
    class Meta:
        verbose_name = 'فئة دروس'
        verbose_name_plural = 'فئات الدروس'
        ordering = ['order', 'name']
    
    def __str__(self):
        return self.name


class Tutorial(models.Model):
    """الدروس التعليمية"""
    LEVEL_CHOICES = [
        ('beginner', 'مبتدئ'),
        ('intermediate', 'متوسط'),
        ('advanced', 'متقدم'),
    ]
    
    STATUS_CHOICES = [
        ('draft', 'مسودة'),
        ('published', 'منشور'),
        ('archived', 'مؤرشف'),
    ]
    
    title = models.CharField(max_length=200, verbose_name='العنوان')
    slug = models.SlugField(max_length=200, unique=True, verbose_name='الرابط')
    description = models.TextField(verbose_name='الوصف')
    content = models.TextField(verbose_name='المحتوى')
    category = models.ForeignKey(TutorialCategory, on_delete=models.CASCADE,
                                related_name='tutorials', verbose_name='الفئة')
    author = models.ForeignKey(User, on_delete=models.CASCADE,
                              related_name='tutorials', verbose_name='المؤلف')
    level = models.CharField(max_length=20, choices=LEVEL_CHOICES,
                            default='beginner', verbose_name='المستوى')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES,
                             default='draft', verbose_name='الحالة')
    estimated_time = models.IntegerField(default=30, verbose_name='الوقت المقدر (دقيقة)')
    views = models.IntegerField(default=0, verbose_name='المشاهدات')
    likes = models.IntegerField(default=0, verbose_name='الإعجابات')
    thumbnail = models.ImageField(upload_to='tutorials/thumbnails/', null=True, blank=True,
                                 verbose_name='الصورة المصغرة')
    video_url = models.URLField(blank=True, verbose_name='رابط الفيديو')
    attachments = models.FileField(upload_to='tutorials/attachments/', null=True, blank=True,
                                  verbose_name='المرفقات')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='تاريخ الإنشاء')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='آخر تحديث')
    published_at = models.DateTimeField(null=True, blank=True, verbose_name='تاريخ النشر')
    
    class Meta:
        verbose_name = 'درس'
        verbose_name_plural = 'الدروس'
        ordering = ['-created_at']
    
    def __str__(self):
        return self.title
    
    def save(self, *args, **kwargs):
        if self.status == 'published' and not self.published_at:
            from django.utils import timezone
            self.published_at = timezone.now()
        super().save(*args, **kwargs)


class TutorialSection(models.Model):
    """أقسام الدرس"""
    tutorial = models.ForeignKey(Tutorial, on_delete=models.CASCADE,
                                related_name='sections', verbose_name='الدرس')
    title = models.CharField(max_length=200, verbose_name='عنوان القسم')
    content = models.TextField(verbose_name='محتوى القسم')
    order = models.IntegerField(default=0, verbose_name='الترتيب')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='تاريخ الإنشاء')
    
    class Meta:
        verbose_name = 'قسم درس'
        verbose_name_plural = 'أقسام الدروس'
        ordering = ['order']
    
    def __str__(self):
        return f"{self.tutorial.title} - {self.title}"


class UserTutorialProgress(models.Model):
    """تقدم المستخدم في الدروس"""
    user = models.ForeignKey(User, on_delete=models.CASCADE,
                            related_name='tutorial_progress', verbose_name='المستخدم')
    tutorial = models.ForeignKey(Tutorial, on_delete=models.CASCADE,
                                related_name='user_progress', verbose_name='الدرس')
    completed_sections = models.JSONField(default=list, verbose_name='الأقسام المكتملة')
    is_completed = models.BooleanField(default=False, verbose_name='مكتمل')
    completion_date = models.DateTimeField(null=True, blank=True, verbose_name='تاريخ الإكمال')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='تاريخ البدء')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='آخر تحديث')
    
    class Meta:
        unique_together = ['user', 'tutorial']
        verbose_name = 'تقدم المستخدم'
        verbose_name_plural = 'تقدم المستخدمين'
    
    def __str__(self):
        return f"{self.user.username} - {self.tutorial.title}"