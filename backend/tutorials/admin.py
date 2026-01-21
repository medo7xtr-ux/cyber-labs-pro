from django.contrib import admin
from django.utils.html import format_html
from .models import TutorialCategory, Tutorial, TutorialSection, UserTutorialProgress


@admin.register(TutorialCategory)
class TutorialCategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'description', 'color_display', 'tutorials_count', 'order', 'created_at']
    list_filter = ['created_at']
    search_fields = ['name', 'description']
    list_editable = ['order']
    readonly_fields = ['created_at']
    
    def tutorials_count(self, obj):
        return obj.tutorials.count()
    tutorials_count.short_description = 'عدد الدروس'
    
    def color_display(self, obj):
        return format_html(
            '<span style="display: inline-block; width: 20px; height: 20px; '
            f'background-color: {obj.color}; border-radius: 3px;"></span>'
        )
    color_display.short_description = 'اللون'


@admin.register(Tutorial)
class TutorialAdmin(admin.ModelAdmin):
    list_display = ['title', 'category', 'author', 'level', 'status', 
                   'views', 'likes', 'sections_count', 'created_at']
    list_filter = ['category', 'level', 'status', 'created_at']
    search_fields = ['title', 'description', 'content', 'author__username']
    readonly_fields = ['views', 'likes', 'sections_count_display', 'created_at', 
                      'updated_at', 'published_at']
    list_editable = ['status']
    prepopulated_fields = {'slug': ('title',)}
    fieldsets = (
        ('المعلومات الأساسية', {
            'fields': ('title', 'slug', 'description', 'content', 'category', 'author')
        }),
        ('التصنيف والإعدادات', {
            'fields': ('level', 'status', 'estimated_time', 'thumbnail', 
                      'video_url', 'attachments')
        }),
        ('الإحصائيات', {
            'fields': ('views', 'likes', 'sections_count_display')
        }),
        ('التواريخ', {
            'fields': ('created_at', 'updated_at', 'published_at')
        }),
    )
    
    def sections_count(self, obj):
        return obj.sections.count()
    sections_count.short_description = 'عدد الأقسام'
    
    def sections_count_display(self, obj):
        return obj.sections.count()
    sections_count_display.short_description = 'عدد الأقسام'


@admin.register(TutorialSection)
class TutorialSectionAdmin(admin.ModelAdmin):
    list_display = ['tutorial', 'title', 'order', 'created_at']
    list_filter = ['tutorial', 'created_at']
    search_fields = ['title', 'content', 'tutorial__title']
    list_editable = ['order']
    readonly_fields = ['created_at']


@admin.register(UserTutorialProgress)
class UserTutorialProgressAdmin(admin.ModelAdmin):
    list_display = ['user', 'tutorial', 'is_completed', 'completion_date', 'created_at']
    list_filter = ['is_completed', 'created_at']
    search_fields = ['user__username', 'tutorial__title']
    readonly_fields = ['created_at', 'updated_at', 'completion_date']
    
    def save_model(self, request, obj, form, change):
        if obj.is_completed and not obj.completion_date:
            from django.utils import timezone
            obj.completion_date = timezone.now()
        super().save_model(request, obj, form, change)