# users/admin.py
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.utils.translation import gettext_lazy as _
from .models import User

# إعدادات عرض User في Admin
class UserAdmin(BaseUserAdmin):
    # الحقول التي تظهر في صفحة تعديل المستخدم
    fieldsets = (
        (None, {'fields': ('username', 'password')}),
        (_('معلومات شخصية'), {
            'fields': ('first_name', 'last_name', 'email', 'bio', 'avatar', 
                      'github_url', 'linkedin_url', 'website', 'country', 'job_title')
        }),
        (_('الصلاحيات'), {
            'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions'),
        }),
        (_('تواريخ مهمة'), {'fields': ('last_login', 'date_joined')}),
        (_('الإحصائيات'), {'fields': ('total_points', 'rank', 'streak_days', 'last_active')}),
        (_('الإعدادات'), {'fields': ('email_notifications', 'show_on_leaderboard', 'theme')}),
    )
    
    # الحقول التي تظهر عند إضافة مستخدم جديد
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('username', 'email', 'password1', 'password2'),
        }),
    )
    
    # الحقول التي تظهر في قائمة المستخدمين
    list_display = ('username', 'email', 'first_name', 'last_name', 
                   'is_staff', 'total_points', 'rank')
    
    # الفلاتر في الشريط الجانبي
    list_filter = ('is_staff', 'is_superuser', 'is_active', 'groups')
    
    # حقول البحث
    search_fields = ('username', 'first_name', 'last_name', 'email')
    
    # الترتيب
    ordering = ('-total_points',)
    
    # العلاقات الأفقية
    filter_horizontal = ('groups', 'user_permissions',)

# تسجيل نموذج User مع الإعدادات المخصصة
admin.site.register(User, UserAdmin)