# backend/notifications/apps.py
from django.db import models

class Notification(models.Model):
    TYPES = [
        ('lab_completed', 'إكمال معمل'),
        ('new_challenge', 'تحدي جديد'),
        ('forum_reply', 'رد على مشاركتك'),
        ('achievement', 'إنجاز جديد'),
        ('system', 'إشعار نظام')
    ]
    
    user = models.ForeignKey('users.User', on_delete=models.CASCADE)
    notification_type = models.CharField(max_length=50, choices=TYPES)
    title = models.CharField(max_length=200)
    message = models.TextField()
    is_read = models.BooleanField(default=False)
    data = models.JSONField(default=dict)  # بيانات إضافية
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']