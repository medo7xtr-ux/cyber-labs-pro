from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()


class ReportCategory(models.Model):
    """فئات التقارير"""
    name = models.CharField(max_length=100, verbose_name='اسم الفئة')
    description = models.TextField(blank=True, verbose_name='الوصف')
    icon = models.CharField(max_length=50, blank=True, verbose_name='الأيقونة')
    order = models.IntegerField(default=0, verbose_name='الترتيب')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='تاريخ الإنشاء')
    
    class Meta:
        verbose_name = 'فئة تقارير'
        verbose_name_plural = 'فئات التقارير'
        ordering = ['order', 'name']
    
    def __str__(self):
        return self.name


class ReportType(models.Model):
    """أنواع التقارير"""
    name = models.CharField(max_length=100, verbose_name='اسم النوع')
    description = models.TextField(blank=True, verbose_name='الوصف')
    category = models.ForeignKey(ReportCategory, on_delete=models.CASCADE,
                                related_name='types', verbose_name='الفئة')
    severity_level = models.IntegerField(default=1, choices=[(1, 'منخفض'), (2, 'متوسط'), (3, 'مرتفع')],
                                        verbose_name='مستوى الخطورة')
    sla_days = models.IntegerField(default=3, verbose_name='مدة الاستجابة (أيام)')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='تاريخ الإنشاء')
    
    class Meta:
        verbose_name = 'نوع تقرير'
        verbose_name_plural = 'أنواع التقارير'
        ordering = ['category', 'severity_level']
    
    def __str__(self):
        return f"{self.name} ({self.get_severity_level_display()})"


class Report(models.Model):
    """التقارير"""
    STATUS_CHOICES = [
        ('pending', 'قيد الانتظار'),
        ('in_progress', 'قيد المعالجة'),
        ('resolved', 'تم الحل'),
        ('rejected', 'مرفوض'),
        ('closed', 'مغلق'),
    ]
    
    PRIORITY_CHOICES = [
        ('low', 'منخفض'),
        ('medium', 'متوسط'),
        ('high', 'مرتفع'),
        ('critical', 'حرج'),
    ]
    
    title = models.CharField(max_length=200, verbose_name='عنوان التقرير')
    description = models.TextField(verbose_name='وصف التقرير')
    type = models.ForeignKey(ReportType, on_delete=models.CASCADE,
                            related_name='reports', verbose_name='نوع التقرير')
    category = models.ForeignKey(ReportCategory, on_delete=models.SET_NULL,
                                null=True, related_name='reports', verbose_name='الفئة')
    reporter = models.ForeignKey(User, on_delete=models.CASCADE,
                                related_name='submitted_reports', verbose_name='المبلغ')
    assigned_to = models.ForeignKey(User, on_delete=models.SET_NULL,
                                   null=True, blank=True, related_name='assigned_reports',
                                   verbose_name='المسؤول عن المعالجة')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES,
                             default='pending', verbose_name='الحالة')
    priority = models.CharField(max_length=20, choices=PRIORITY_CHOICES,
                               default='medium', verbose_name='الأولوية')
    severity = models.IntegerField(default=1, choices=[(1, 'منخفض'), (2, 'متوسط'), (3, 'مرتفع')],
                                  verbose_name='الخطورة')
    
    # معلومات إضافية
    evidence_files = models.FileField(upload_to='reports/evidence/', null=True, blank=True,
                                     verbose_name='ملفات الإثبات')
    location = models.CharField(max_length=200, blank=True, verbose_name='الموقع')
    ip_address = models.GenericIPAddressField(null=True, blank=True, verbose_name='عنوان IP')
    
    # توقيتات
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='تاريخ الإبلاغ')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='آخر تحديث')
    resolved_at = models.DateTimeField(null=True, blank=True, verbose_name='تاريخ الحل')
    due_date = models.DateTimeField(null=True, blank=True, verbose_name='تاريخ الاستحقاق')
    
    # تتبع
    view_count = models.IntegerField(default=0, verbose_name='عدد المشاهدات')
    is_public = models.BooleanField(default=False, verbose_name='عام')
    
    class Meta:
        verbose_name = 'تقرير'
        verbose_name_plural = 'التقارير'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.title} ({self.get_status_display()})"
    
    def save(self, *args, **kwargs):
        # حساب تاريخ الاستحقاق بناءً على SLA
        if not self.due_date and self.type:
            from django.utils import timezone
            from datetime import timedelta
            self.due_date = timezone.now() + timedelta(days=self.type.sla_days)
        super().save(*args, **kwargs)


class ReportComment(models.Model):
    """تعليقات على التقارير"""
    report = models.ForeignKey(Report, on_delete=models.CASCADE,
                              related_name='comments', verbose_name='التقرير')
    author = models.ForeignKey(User, on_delete=models.CASCADE,
                              related_name='report_comments', verbose_name='المعلق')
    content = models.TextField(verbose_name='محتوى التعليق')
    is_internal = models.BooleanField(default=False, verbose_name='تعليق داخلي')
    attachments = models.FileField(upload_to='reports/comments/', null=True, blank=True,
                                  verbose_name='المرفقات')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='تاريخ التعليق')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='آخر تحديث')
    
    class Meta:
        verbose_name = 'تعليق تقرير'
        verbose_name_plural = 'تعليقات التقارير'
        ordering = ['created_at']
    
    def __str__(self):
        return f"تعليق بواسطة {self.author.username}"


class ReportStatusHistory(models.Model):
    """تاريخ حالة التقرير"""
    report = models.ForeignKey(Report, on_delete=models.CASCADE,
                              related_name='status_history', verbose_name='التقرير')
    old_status = models.CharField(max_length=20, verbose_name='الحالة السابقة')
    new_status = models.CharField(max_length=20, verbose_name='الحالة الجديدة')
    changed_by = models.ForeignKey(User, on_delete=models.SET_NULL,
                                  null=True, verbose_name='تم التغيير بواسطة')
    reason = models.TextField(blank=True, verbose_name='سبب التغيير')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='تاريخ التغيير')
    
    class Meta:
        verbose_name = 'تاريخ حالة التقرير'
        verbose_name_plural = 'تاريخ حالات التقارير'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.report.title}: {self.old_status} → {self.new_status}"