# backend/subscriptions/models.py
from django.db import models
from django.utils.translation import gettext_lazy as _

class SubscriptionPlan(models.Model):
    PERIOD_CHOICES = [
        ('monthly', 'شهري'),
        ('quarterly', 'ربع سنوي'),
        ('yearly', 'سنوي'),
        ('lifetime', 'مدى الحياة'),
    ]
    
    name = models.CharField(_('اسم الخطة'), max_length=100)
    description = models.TextField(_('الوصف'))
    price = models.DecimalField(_('السعر'), max_digits=10, decimal_places=2)
    period = models.CharField(_('الفترة'), max_length=20, choices=PERIOD_CHOICES)
    stripe_price_id = models.CharField(_('معرف Stripe للسعر'), max_length=100, blank=True)
    features = models.JSONField(_('الميزات'), default=list)
    is_active = models.BooleanField(_('نشط'), default=True)
    order = models.IntegerField(_('الترتيب'), default=0)
    
    class Meta:
        verbose_name = _('خطة اشتراك')
        verbose_name_plural = _('خطط الاشتراك')
        ordering = ['order']
    
    def __str__(self):
        return f'{self.name} - {self.price} ريال/{self.get_period_display()}'

class UserSubscription(models.Model):
    STATUS_CHOICES = [
        ('active', 'نشط'),
        ('canceled', 'ملغي'),
        ('past_due', 'متأخر'),
        ('unpaid', 'غير مدفوع'),
        ('trialing', 'تجريبي'),
    ]
    
    user = models.OneToOneField('users.User', on_delete=models.CASCADE, related_name='subscription')
    plan = models.ForeignKey(SubscriptionPlan, on_delete=models.SET_NULL, null=True)
    status = models.CharField(_('الحالة'), max_length=20, choices=STATUS_CHOICES, default='trialing')
    stripe_customer_id = models.CharField(_('معرف Stripe للعميل'), max_length=100, blank=True)
    stripe_subscription_id = models.CharField(_('معرف Stripe للاشتراك'), max_length=100, blank=True)
    current_period_start = models.DateTimeField(null=True, blank=True)
    current_period_end = models.DateTimeField(null=True, blank=True)
    trial_end = models.DateTimeField(null=True, blank=True)
    canceled_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        verbose_name = _('اشتراك المستخدم')
        verbose_name_plural = _('اشتراكات المستخدمين')
    
    def __str__(self):
        return f'{self.user.username} - {self.plan.name if self.plan else "لا يوجد"}'
    
    @property
    def is_active(self):
        return self.status == 'active' or self.status == 'trialing'