# labs/admin.py
from django.contrib import admin
from django.utils.html import format_html
from .models import (
    Lab, Challenge, Submission, 
    UserLabProgress, LabReview, LabStatistics
)


@admin.register(Lab)
class LabAdmin(admin.ModelAdmin):
    list_display = ['title', 'category', 'difficulty', 'points', 
                   'is_active', 'views', 'completions', 'created_at']
    list_filter = ['category', 'difficulty', 'is_active', 'is_premium', 'created_at']
    search_fields = ['title', 'description', 'overview']
    readonly_fields = ['views', 'completions', 'average_score', 'created_at', 
                      'updated_at', 'published_at', 'challenges_count']
    list_editable = ['is_active']
    prepopulated_fields = {'slug': ('title',)}
    fieldsets = (
        ('المعلومات الأساسية', {
            'fields': ('title', 'slug', 'description', 'overview', 
                      'learning_objectives', 'category', 'difficulty')
        }),
        ('النقاط والوقت', {
            'fields': ('points', 'estimated_time')
        }),
        ('الوسائط', {
            'fields': ('thumbnail', 'lab_guide', 'starter_files', 
                      'solution_file', 'vm_image')
        }),
        ('الإعدادات', {
            'fields': ('is_premium', 'is_active', 'requires_vm')
        }),
        ('الإحصائيات', {
            'fields': ('views', 'completions', 'average_score', 'challenges_count')
        }),
        ('التواريخ', {
            'fields': ('created_at', 'updated_at', 'published_at')
        }),
    )
    
    def challenges_count(self, obj):
        return obj.challenges.count()
    challenges_count.short_description = 'عدد التحديات'


@admin.register(Challenge)
class ChallengeAdmin(admin.ModelAdmin):
    list_display = ['lab', 'title', 'answer_type', 'level', 'points', 
                   'order', 'attempts', 'success_rate']
    list_filter = ['lab', 'answer_type', 'level', 'created_at']
    search_fields = ['title', 'description', 'instructions', 'correct_answer']
    readonly_fields = ['attempts', 'success_rate', 'created_at', 'updated_at']
    list_editable = ['order', 'points']
    fieldsets = (
        ('المعلومات الأساسية', {
            'fields': ('lab', 'title', 'description', 'instructions')
        }),
        ('نوع التحدي', {
            'fields': ('challenge_type', 'answer_type', 'level')
        }),
        ('الإجابة', {
            'fields': ('correct_answer', 'correct_code', 'expected_output',
                      'multiple_choices', 'hint', 'solution_hint')
        }),
        ('النقاط والترتيب', {
            'fields': ('points', 'order')
        }),
        ('الملفات', {
            'fields': ('starter_code', 'test_cases', 'attachments')
        }),
        ('الإحصائيات', {
            'fields': ('attempts', 'success_rate')
        }),
        ('التواريخ', {
            'fields': ('created_at', 'updated_at')
        }),
    )


@admin.register(Submission)
class SubmissionAdmin(admin.ModelAdmin):
    list_display = ['user', 'lab', 'challenge', 'status',  # استخدم الحقل الفعلي
                'is_correct', 'submitted_at']
    list_editable = ['status']
    list_filter = ['status', 'lab', 'challenge', 'is_correct', 'submitted_at']
    search_fields = ['user__username', 'answer', 'code', 'output']
    readonly_fields = ['submitted_at', 'reviewed_at', 'test_results', 'output', 'errors']
    
    fieldsets = (
        ('المعلومات الأساسية', {
            'fields': ('user', 'lab', 'challenge')
        }),
        ('الإجابة', {
            'fields': ('answer', 'code', 'file')
        }),
        ('النتيجة', {
            'fields': ('status', 'is_correct', 'execution_time', 
                      'completion_time')
        }),
        ('التقييم التلقائي', {
            'fields': ('test_results', 'output', 'errors')
        }),
        ('المراجعة', {
            'fields': ('reviewed_by', 'review_notes', 'review_score')
        }),
        ('التواريخ', {
            'fields': ('submitted_at', 'reviewed_at')
        }),
    )
    
    def status_display(self, obj):
        colors = {
            'pending': 'orange',
            'correct': 'green',
            'incorrect': 'red',
            'partial': 'blue',
            'timeout': 'gray',
            'error': 'darkred'
        }
        color = colors.get(obj.status, 'black')
        return format_html(
            '<span style="color: {}; font-weight: bold;">{}</span>',
            color,
            obj.get_status_display()
        )
    status_display.short_description = 'الحالة'


@admin.register(UserLabProgress)
class UserLabProgressAdmin(admin.ModelAdmin):
    list_display = ['user', 'lab', 'is_completed', 'completion_percentage', 
                   'total_score', 'started_at', 'updated_at']
    list_filter = ['is_completed', 'lab', 'created_at']
    search_fields = ['user__username', 'lab__title']
    readonly_fields = ['created_at', 'updated_at', 'completed_at', 'total_time_spent']
    fieldsets = (
        ('المستخدم والمعمل', {
            'fields': ('user', 'lab')
        }),
        ('حالة التقدم', {
            'fields': ('is_started', 'is_completed', 'completion_percentage')
        }),
        ('التحديات المكتملة', {
            'fields': ('completed_challenges',)
        }),
        ('الدرجات', {
            'fields': ('total_score', 'max_possible_score')
        }),
        ('الوقت', {
            'fields': ('started_at', 'completed_at', 'total_time_spent')
        }),
        ('المحاولات', {
            'fields': ('attempt_count',)
        }),
        ('التواريخ', {
            'fields': ('created_at', 'updated_at')
        }),
    )


@admin.register(LabReview)
class LabReviewAdmin(admin.ModelAdmin):
    list_display = ['user', 'lab', 'rating_stars', 'difficulty_rating', 
                   'content_quality', 'is_approved', 'created_at']
    list_filter = ['rating', 'is_approved', 'created_at']
    search_fields = ['user__username', 'lab__title', 'comment']
    readonly_fields = ['created_at', 'updated_at']
    list_editable = ['is_approved']
    
    def rating_stars(self, obj):
        return '⭐' * obj.rating
    rating_stars.short_description = 'التقييم'


@admin.register(LabStatistics)
class LabStatisticsAdmin(admin.ModelAdmin):
    list_display = ['lab', 'total_views', 'total_starts', 'total_completions', 
                   'average_rating', 'completion_rate', 'last_calculated']
    readonly_fields = ['last_calculated']
    
    def has_add_permission(self, request):
        return False
    
    def has_delete_permission(self, request, obj=None):
        return False