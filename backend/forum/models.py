from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class ForumCategory(models.Model):
    """فئات المنتدى"""
    name = models.CharField(max_length=100, verbose_name='اسم الفئة')
    description = models.TextField(blank=True, verbose_name='الوصف')
    icon = models.CharField(max_length=50, blank=True, verbose_name='الأيقونة')
    order = models.IntegerField(default=0, verbose_name='الترتيب')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='تاريخ الإنشاء')
    
    class Meta:
        verbose_name = 'فئة منتدى'
        verbose_name_plural = 'فئات المنتدى'
        ordering = ['order', 'name']
    
    def __str__(self):
        return self.name


class Thread(models.Model):
    """مواضيع المنتدى"""
    STATUS_CHOICES = [
        ('open', 'مفتوح'),
        ('closed', 'مغلق'),
        ('pinned', 'مثبت'),
    ]
    
    title = models.CharField(max_length=200, verbose_name='العنوان')
    content = models.TextField(verbose_name='المحتوى')
    category = models.ForeignKey(ForumCategory, on_delete=models.CASCADE, 
                                related_name='threads', verbose_name='الفئة')
    author = models.ForeignKey(User, on_delete=models.CASCADE, 
                              related_name='threads', verbose_name='المؤلف')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, 
                             default='open', verbose_name='الحالة')
    views = models.IntegerField(default=0, verbose_name='المشاهدات')
    likes = models.IntegerField(default=0, verbose_name='الإعجابات')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='تاريخ الإنشاء')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='آخر تحديث')
    
    class Meta:
        verbose_name = 'موضوع'
        verbose_name_plural = 'المواضيع'
        ordering = ['-created_at']
    
    def __str__(self):
        return self.title
    
    def get_reply_count(self):
        return self.replies.count()
    
    def get_latest_reply(self):
        return self.replies.order_by('-created_at').first()


class Reply(models.Model):
    """ردود المواضيع"""
    thread = models.ForeignKey(Thread, on_delete=models.CASCADE, 
                              related_name='replies', verbose_name='الموضوع')
    author = models.ForeignKey(User, on_delete=models.CASCADE, 
                              related_name='replies', verbose_name='المؤلف')
    content = models.TextField(verbose_name='المحتوى')
    is_solution = models.BooleanField(default=False, verbose_name='هل هو حل؟')
    likes = models.IntegerField(default=0, verbose_name='الإعجابات')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='تاريخ الإنشاء')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='آخر تحديث')
    
    class Meta:
        verbose_name = 'رد'
        verbose_name_plural = 'الردود'
        ordering = ['created_at']
    
    def __str__(self):
        return f"رد بواسطة {self.author.username}"

    
class ForumVote(models.Model):
    """تصويتات المنتدى"""
    VOTE_TYPES = [
        ('like', 'إعجاب'),
        ('dislike', 'عدم إعجاب'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, verbose_name='المستخدم')
    thread = models.ForeignKey(Thread, on_delete=models.CASCADE, null=True, blank=True, 
                              related_name='votes', verbose_name='الموضوع')
    reply = models.ForeignKey(Reply, on_delete=models.CASCADE, null=True, blank=True,
                             related_name='votes', verbose_name='الرد')
    vote_type = models.CharField(max_length=10, choices=VOTE_TYPES, verbose_name='نوع التصويت')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='تاريخ التصويت')
    
    class Meta:
        unique_together = [('user', 'thread'), ('user', 'reply')]
        verbose_name = 'تصويت'
        verbose_name_plural = 'التصويتات'