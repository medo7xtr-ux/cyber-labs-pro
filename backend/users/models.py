# users/models.py
from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    # معلومات إضافية
    bio = models.TextField(blank=True)
    avatar = models.ImageField(upload_to='avatars/', null=True, blank=True)
    github_url = models.URLField(blank=True)
    linkedin_url = models.URLField(blank=True)
    website = models.URLField(blank=True)
    country = models.CharField(max_length=100, blank=True)
    job_title = models.CharField(max_length=200, blank=True)
    
    # الإحصائيات
    total_points = models.IntegerField(default=0)
    rank = models.IntegerField(default=9999)
    streak_days = models.IntegerField(default=0)
    last_active = models.DateTimeField(auto_now=True)
    
    # الإعدادات
    email_notifications = models.BooleanField(default=True)
    show_on_leaderboard = models.BooleanField(default=True)
    theme = models.CharField(max_length=20, default='dark', choices=[
        ('dark', 'داكن'),
        ('light', 'فاتح'),
        ('auto', 'تلقائي')
    ])
    
    class Meta:
        ordering = ['-total_points']

# ملاحظة: لا داعي لتعريف Achievement و UserActivity هنا الآن
# يمكن إضافتهما لاحقاً