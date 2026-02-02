# labs/serializers.py
from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import (
    Lab, Challenge, Submission, 
    UserLabProgress, LabReview, LabStatistics
)

User = get_user_model()


class LabSerializer(serializers.ModelSerializer):
    """Serializer للمعامل"""
    
    difficulty_display = serializers.CharField(source='get_difficulty_display', read_only=True)
    category_display = serializers.CharField(source='get_category_display', read_only=True)
    challenge_count = serializers.SerializerMethodField()
    completion_rate = serializers.SerializerMethodField()
    thumbnail_url = serializers.SerializerMethodField()
    
    class Meta:
        model = Lab
        fields = [
            'id', 'title', 'slug', 'description', 'overview', 
            'learning_objectives', 'category', 'category_display',
            'difficulty', 'difficulty_display', 'points', 
            'estimated_time', 'thumbnail', 'thumbnail_url',
            'lab_guide', 'starter_files', 'solution_file',
            'is_premium', 'is_active', 'requires_vm', 'vm_image',
            'views', 'completions', 'average_score',
            'challenge_count', 'completion_rate',
            'created_at', 'updated_at', 'published_at'
        ]
        read_only_fields = [
            'id', 'slug', 'views', 'completions', 'average_score',
            'created_at', 'updated_at', 'published_at'
        ]
    
    def get_challenge_count(self, obj):
        """عدد التحديات في المعمل"""
        return obj.challenges.count()
    
    def get_completion_rate(self, obj):
        """نسبة الإكمال"""
        if obj.views > 0:
            return (obj.completions / obj.views) * 100
        return 0
    
    def get_thumbnail_url(self, obj):
        """الحصول على رابط الصورة المصغرة"""
        if obj.thumbnail:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.thumbnail.url)
            return obj.thumbnail.url
        return None


class ChallengeSerializer(serializers.ModelSerializer):
    """Serializer للتحديات"""
    
    answer_type_display = serializers.CharField(source='get_answer_type_display', read_only=True)
    level_display = serializers.CharField(source='get_level_display', read_only=True)
    lab_title = serializers.CharField(source='lab.title', read_only=True)
    
    class Meta:
        model = Challenge
        fields = [
            'id', 'lab', 'lab_title', 'title', 'description', 
            'instructions', 'challenge_type', 'answer_type', 
            'answer_type_display', 'level', 'level_display',
            'correct_answer', 'correct_code', 'expected_output',
            'multiple_choices', 'hint', 'solution_hint',
            'points', 'order', 'starter_code', 'test_cases',
            'attachments', 'attempts', 'success_rate',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['attempts', 'success_rate', 'created_at', 'updated_at']


class SubmissionSerializer(serializers.ModelSerializer):
    """Serializer للتسليمات"""
    
    user = serializers.StringRelatedField(read_only=True)
    lab_title = serializers.CharField(source='lab.title', read_only=True)
    challenge_title = serializers.CharField(source='challenge.title', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    
    class Meta:
        model = Submission
        fields = [
            'id', 'user', 'lab', 'lab_title', 'challenge', 'challenge_title',
            'answer', 'code', 'file', 'status', 'status_display',
            'is_correct', 'execution_time', 'completion_time',
            'test_results', 'output', 'errors', 'score',
            'reviewed_by', 'review_notes', 'review_score',
            'submitted_at', 'reviewed_at'
        ]
        read_only_fields = [
            'id', 'user', 'submitted_at', 'reviewed_at',
            'test_results', 'output', 'errors', 'score'
        ]
    
    def validate(self, data):
        """التحقق من صحة التسليم"""
        request = self.context.get('request')
        challenge = data.get('challenge')
        lab = data.get('lab')
        
        if challenge and lab and challenge.lab != lab:
            raise serializers.ValidationError({
                'challenge': 'هذا التحدي لا ينتمي إلى المعمل المحدد'
            })
        
        return data


class UserLabProgressSerializer(serializers.ModelSerializer):
    """Serializer لتقدم المستخدم"""
    
    user = serializers.StringRelatedField(read_only=True)
    lab_title = serializers.CharField(source='lab.title', read_only=True)
    
    class Meta:
        model = UserLabProgress
        fields = [
            'id', 'user', 'lab', 'lab_title',
            'is_started', 'is_completed', 'completion_percentage',
            'completed_challenges', 'total_score', 'max_possible_score',
            'started_at', 'completed_at', 'total_time_spent',
            'attempt_count', 'created_at', 'updated_at'
        ]
        read_only_fields = [
            'id', 'user', 'created_at', 'updated_at'
        ]


class LabReviewSerializer(serializers.ModelSerializer):
    """Serializer لتقييمات المعامل"""
    
    user = serializers.StringRelatedField(read_only=True)
    lab_title = serializers.CharField(source='lab.title', read_only=True)
    username = serializers.CharField(source='user.username', read_only=True)
    
    class Meta:
        model = LabReview
        fields = [
            'id', 'user', 'username', 'lab', 'lab_title',
            'rating', 'difficulty_rating', 'content_quality',
            'support_quality', 'comment', 'is_approved',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class LabStatisticsSerializer(serializers.ModelSerializer):
    """Serializer لإحصائيات المعامل"""
    
    lab_title = serializers.CharField(source='lab.title', read_only=True)
    
    class Meta:
        model = LabStatistics
        fields = [
            'id', 'lab', 'lab_title',
            'total_views', 'total_starts', 'total_completions',
            'average_rating', 'average_completion_time',
            'completion_rate', 'challenge_success_rate',
            'user_retention_rate', 'last_calculated'
        ]
        read_only_fields = ['id', 'last_calculated']


# Serializers للـ API العمليات
class SubmitChallengeSerializer(serializers.Serializer):
    """Serializer لتقديم حل للتحدي"""
    
    answer = serializers.CharField(required=False, allow_blank=True)
    code = serializers.CharField(required=False, allow_blank=True)
    file = serializers.FileField(required=False)
    
    def validate(self, data):
        """التحقق من وجود إجابة واحدة على الأقل"""
        if not any([data.get('answer'), data.get('code'), data.get('file')]):
            raise serializers.ValidationError(
                "يجب تقديم إجابة على الأقل (نص، كود، أو ملف)"
            )
        return data


class LabSearchSerializer(serializers.Serializer):
    """Serializer للبحث في المعامل"""
    
    search = serializers.CharField(required=False)
    category = serializers.CharField(required=False)
    difficulty = serializers.CharField(required=False)
    is_premium = serializers.BooleanField(required=False)


class UserProgressSerializer(serializers.Serializer):
    """Serializer لتقدم المستخدم"""
    
    total_labs = serializers.IntegerField()
    completed_labs = serializers.IntegerField()
    total_points = serializers.IntegerField()
    completion_rate = serializers.FloatField()
    average_score = serializers.FloatField()
# ========================
# Serializers للإشعارات والملف الشخصي
# ========================

from .models import Notification, UserProfile

class NotificationSerializer(serializers.ModelSerializer):
    """Serializer للإشعارات"""
    class Meta:
        model = Notification
        fields = ['id', 'title', 'message', 'type', 'is_read', 'link', 'created_at']

class UserProfileSerializer(serializers.ModelSerializer):
    """Serializer للملف الشخصي"""
    username = serializers.CharField(source='user.username', read_only=True)
    email = serializers.CharField(source='user.email', read_only=True)
    
    class Meta:
        model = UserProfile
        fields = [
            'id', 'username', 'email', 'bio', 'avatar', 
            'total_points', 'rank', 'completed_labs_count', 
            'streak_days', 'last_activity', 'is_public', 'receive_emails'
        ]
        read_only_fields = ['total_points', 'rank', 'completed_labs_count', 'streak_days', 'last_activity']
