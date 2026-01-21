from django.contrib import admin
from django.utils.html import format_html
from django.utils import timezone
from .models import ReportCategory, ReportType, Report, ReportComment, ReportStatusHistory


@admin.register(ReportCategory)
class ReportCategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'description', 'types_count', 'reports_count', 'order', 'created_at']
    list_filter = ['created_at']
    search_fields = ['name', 'description']
    list_editable = ['order']
    readonly_fields = ['created_at']
    
    def types_count(self, obj):
        return obj.types.count()
    types_count.short_description = 'عدد الأنواع'
    
    def reports_count(self, obj):
        return obj.reports.count()
    reports_count.short_description = 'عدد التقارير'


@admin.register(ReportType)
class ReportTypeAdmin(admin.ModelAdmin):
    list_display = ['name', 'category', 'severity_level_display', 'sla_days', 'reports_count', 'created_at']
    list_filter = ['category', 'severity_level', 'created_at']
    search_fields = ['name', 'description']
    readonly_fields = ['created_at']
    
    def severity_level_display(self, obj):
        colors = {1: 'green', 2: 'orange', 3: 'red'}
        color = colors.get(obj.severity_level, 'gray')
        return format_html(
            '<span style="color: {};">{}</span>',
            color,
            obj.get_severity_level_display()
        )
    severity_level_display.short_description = 'مستوى الخطورة'
    
    def reports_count(self, obj):
        return obj.reports.count()
    reports_count.short_description = 'عدد التقارير'


@admin.register(Report)
class ReportAdmin(admin.ModelAdmin):
    list_display = ['title', 'reporter', 'status', 'priority',  # تأكد من وجود status و priority
                    'assigned_to', 'created_at', 'due_date'] 
    list_filter = ['status', 'priority', 'type', 'category']
    search_fields = ['title', 'description']
    readonly_fields = ['created_at', 'updated_at', 'resolved_at']
    list_editable = ['status', 'priority']  # الآن هما في list_display
    fieldsets = (
        ('المعلومات الأساسية', {
            'fields': ('title', 'description', 'type', 'category', 'reporter')
        }),
        ('الحالة والتصنيف', {
            'fields': ('status', 'priority', 'severity')
        }),
        ('معلومات إضافية', {
            'fields': ('evidence_files', 'location', 'ip_address', 'is_public')
        }),
        ('المعلومات الإحصائية', {
            'fields': ('view_count', 'status_history_display')
        }),
        ('التواريخ', {
            'fields': ('created_at', 'updated_at', 'resolved_at', 'due_date')
        }),
    )
    
    def status_display(self, obj):
        status_colors = {
            'pending': 'gray',
            'in_progress': 'blue',
            'resolved': 'green',
            'rejected': 'red',
            'closed': 'black'
        }
        color = status_colors.get(obj.status, 'gray')
        return format_html(
            '<span style="color: {}; font-weight: bold;">{}</span>',
            color,
            obj.get_status_display()
        )
    status_display.short_description = 'الحالة'
    
    def priority_display(self, obj):
        priority_colors = {
            'low': 'green',
            'medium': 'orange',
            'high': 'red',
            'critical': 'darkred'
        }
        color = priority_colors.get(obj.priority, 'gray')
        return format_html(
            '<span style="color: {}; font-weight: bold;">{}</span>',
            color,
            obj.get_priority_display()
        )
    priority_display.short_description = 'الأولوية'
    
    def severity_display(self, obj):
        colors = {1: 'green', 2: 'orange', 3: 'red'}
        color = colors.get(obj.severity, 'gray')
        return format_html(
            '<span style="color: {}; font-weight: bold;">{}</span>',
            color,
            obj.get_severity_display()
        )
    severity_display.short_description = 'الخطورة'
    
    def due_date_display(self, obj):
        if obj.due_date:
            if obj.due_date < timezone.now():
                return format_html(
                    '<span style="color: red; font-weight: bold;">{}</span>',
                    obj.due_date.strftime('%Y-%m-%d')
                )
            return obj.due_date.strftime('%Y-%m-%d')
        return '-'
    due_date_display.short_description = 'تاريخ الاستحقاق'
    
    def status_history_display(self, obj):
        history = obj.status_history.all()[:5]
        if history:
            return format_html('<br>'.join(
                f"{h.created_at.strftime('%Y-%m-%d %H:%M')}: "
                f"{h.old_status} → {h.new_status}"
                for h in history
            ))
        return 'لا يوجد تاريخ'
    status_history_display.short_description = 'تاريخ الحالة'


@admin.register(ReportComment)
class ReportCommentAdmin(admin.ModelAdmin):
    list_display = ['report', 'author', 'content_preview', 'is_internal', 'created_at']
    list_filter = ['is_internal', 'created_at', 'report']
    search_fields = ['content', 'author__username', 'report__title']
    readonly_fields = ['created_at', 'updated_at']
    
    def content_preview(self, obj):
        if len(obj.content) > 50:
            return f"{obj.content[:50]}..."
        return obj.content
    content_preview.short_description = 'محتوى التعليق'


@admin.register(ReportStatusHistory)
class ReportStatusHistoryAdmin(admin.ModelAdmin):
    list_display = ['report', 'old_status', 'new_status', 'changed_by', 'created_at']
    list_filter = ['old_status', 'new_status', 'created_at']
    search_fields = ['report__title', 'changed_by__username', 'reason']
    readonly_fields = ['created_at']
    
    def has_add_permission(self, request):
        return False
    
    def has_change_permission(self, request, obj=None):
        return False