# forum/serializers.py
from rest_framework import serializers
from .models import ForumCategory, Thread, Reply
from django.contrib.auth import get_user_model

User = get_user_model()

class ForumCategorySerializer(serializers.ModelSerializer):
    thread_count = serializers.IntegerField(source='threads.count', read_only=True)
    
    class Meta:
        model = ForumCategory
        fields = ['id', 'name', 'description', 'order', 'created_at', 'thread_count']

class ReplySerializer(serializers.ModelSerializer):
    author = serializers.StringRelatedField(read_only=True)
    author_id = serializers.PrimaryKeyRelatedField(source='author', queryset=User.objects.all(), write_only=True)
    
    class Meta:
        model = Reply
        fields = ['id', 'thread', 'author', 'author_id', 'content', 'created_at', 'updated_at']
        read_only_fields = ['author', 'created_at', 'updated_at']

class ThreadSerializer(serializers.ModelSerializer):
    author = serializers.StringRelatedField(read_only=True)
    author_id = serializers.PrimaryKeyRelatedField(source='author', queryset=User.objects.all(), write_only=True)
    replies = ReplySerializer(many=True, read_only=True)
    reply_count = serializers.IntegerField(source='replies.count', read_only=True)
    
    class Meta:
        model = Thread
        fields = [
            'id', 'title', 'content', 'category', 'author', 'author_id',
            'created_at', 'updated_at', 'is_pinned', 'is_locked', 'views',
            'replies', 'reply_count'
        ]
        read_only_fields = ['author', 'views', 'created_at', 'updated_at']