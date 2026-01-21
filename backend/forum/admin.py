from django.contrib import admin
from django.utils.html import format_html
from .models import ForumCategory, Thread, Reply, ForumVote


@admin.register(ForumCategory)
class ForumCategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'description', 'order', 'threads_count', 'created_at']
    list_filter = ['created_at']
    search_fields = ['name', 'description']
    list_editable = ['order']
    readonly_fields = ['created_at']
    fields = ['name', 'description', 'icon', 'order', 'created_at']
    
    def threads_count(self, obj):
        return obj.threads.count()
    threads_count.short_description = 'عدد المواضيع'


@admin.register(Thread)
class ThreadAdmin(admin.ModelAdmin):
    list_display = ['title', 'category', 'author', 'status', 'views', 
                   'likes', 'reply_count', 'created_at']
    list_filter = ['category', 'status', 'created_at']
    search_fields = ['title', 'content', 'author__username']
    readonly_fields = ['created_at', 'updated_at', 'views', 'likes', 
                      'reply_count_display']
    list_editable = ['status']
    fieldsets = (
        ('المعلومات الأساسية', {
            'fields': ('title', 'category', 'author', 'content')
        }),
        ('الحالة والإحصائيات', {
            'fields': ('status', 'views', 'likes')
        }),
        ('المعلومات الإضافية', {
            'fields': ('reply_count_display', 'created_at', 'updated_at')
        }),
    )
    
    def reply_count(self, obj):
        return obj.replies.count()
    reply_count.short_description = 'عدد الردود'
    
    def reply_count_display(self, obj):
        return obj.replies.count()
    reply_count_display.short_description = 'عدد الردود'


@admin.register(Reply)
class ReplyAdmin(admin.ModelAdmin):
    list_display = ['thread', 'author', 'is_solution', 'content_preview', 
                   'likes', 'created_at']
    list_filter = ['is_solution', 'created_at', 'thread']
    search_fields = ['content', 'author__username', 'thread__title']
    readonly_fields = ['created_at', 'updated_at']
    list_editable = ['is_solution']
    fieldsets = (
        ('المعلومات الأساسية', {
            'fields': ('thread', 'author', 'content')
        }),
        ('الإعدادات', {
            'fields': ('is_solution', 'likes')
        }),
        ('التواريخ', {
            'fields': ('created_at', 'updated_at')
        }),
    )
    
    def content_preview(self, obj):
        if len(obj.content) > 50:
            return f"{obj.content[:50]}..."
        return obj.content
    content_preview.short_description = 'محتوى الرد'


@admin.register(ForumVote)
class ForumVoteAdmin(admin.ModelAdmin):
    list_display = ['user', 'vote_type', 'content_object', 'created_at']
    list_filter = ['vote_type', 'created_at']
    search_fields = ['user__username']
    
    def content_object(self, obj):
        if obj.thread:
            return f"موضوع: {obj.thread.title}"
        elif obj.reply:
            return f"رد على: {obj.reply.thread.title}"
        return "-"
    content_object.short_description = 'المحتوى'