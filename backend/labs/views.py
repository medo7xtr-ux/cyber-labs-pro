# labs/views.py - النسخة النهائية
from django.db.models import Sum
from rest_framework import viewsets, permissions, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Count, Avg, Q
from django.shortcuts import render, get_object_or_404
from django.views import View

from labs.models import Lab, Challenge, Submission, UserLabProgress, LabReview
from .serializers import (
    LabSerializer, ChallengeSerializer, SubmissionSerializer,
    UserLabProgressSerializer, LabReviewSerializer,
    SubmitChallengeSerializer, LabSearchSerializer, UserProgressSerializer
)

# ========================
# ViewSets للـ API
# ========================

class LabViewSet(viewsets.ModelViewSet):
    """ViewSet للمعامل"""
    
    queryset = Lab.objects.filter(is_active=True)
    serializer_class = LabSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category', 'difficulty', 'is_premium']
    search_fields = ['title', 'description', 'overview']
    ordering_fields = ['created_at', 'points', 'views', 'completions']
    
    def get_queryset(self):
        queryset = super().get_queryset()
        
        # فلترة للمستخدمين العاديين
        if not self.request.user.is_authenticated:
            queryset = queryset.filter(is_premium=False)
        elif not (self.request.user.is_staff or self.request.user.is_superuser):
            queryset = queryset.filter(is_premium=False)
        
        return queryset
    
    def retrieve(self, request, *args, **kwargs):
        """زيادة عدد المشاهدات عند عرض المعمل"""
        instance = self.get_object()
        instance.views += 1
        instance.save()
        return super().retrieve(request, *args, **kwargs)
    
    @action(detail=True, methods=['get'])
    def challenges(self, request, pk=None):
        """الحصول على تحديات المعمل"""
        lab = self.get_object()
        challenges = lab.challenges.all()
        serializer = ChallengeSerializer(challenges, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['get'])
    def submissions(self, request, pk=None):
        """الحصول على تسليمات المستخدم للمعمل"""
        if not request.user.is_authenticated:
            return Response({'detail': 'يجب تسجيل الدخول'}, status=status.HTTP_401_UNAUTHORIZED)
        
        lab = self.get_object()
        submissions = Submission.objects.filter(
            lab=lab,
            user=request.user
        )
        serializer = SubmissionSerializer(submissions, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def start(self, request, pk=None):
        """بدء المعمل"""
        if not request.user.is_authenticated:
            return Response({'detail': 'يجب تسجيل الدخول'}, status=status.HTTP_401_UNAUTHORIZED)
        
        lab = self.get_object()
        
        progress, created = UserLabProgress.objects.get_or_create(
            user=request.user,
            lab=lab,
            defaults={'is_started': True}
        )
        
        if not created and not progress.is_started:
            progress.is_started = True
            progress.save()
        
        serializer = UserLabProgressSerializer(progress)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def search(self, request):
        """بحث في المعامل"""
        serializer = LabSearchSerializer(data=request.query_params)
        serializer.is_valid(raise_exception=True)
        
        queryset = Lab.objects.filter(is_active=True)
        
        if serializer.validated_data.get('search'):
            search = serializer.validated_data['search']
            queryset = queryset.filter(
                Q(title__icontains=search) |
                Q(description__icontains=search) |
                Q(overview__icontains=search)
            )
        
        if serializer.validated_data.get('category'):
            queryset = queryset.filter(
                category=serializer.validated_data['category']
            )
        
        if serializer.validated_data.get('difficulty'):
            queryset = queryset.filter(
                difficulty=serializer.validated_data['difficulty']
            )
        
        if serializer.validated_data.get('is_premium') is not None:
            queryset = queryset.filter(
                is_premium=serializer.validated_data['is_premium']
            )
        
        if not request.user.is_authenticated or not request.user.is_premium:
            queryset = queryset.filter(is_premium=False)
        
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = LabSerializer(page, many=True, context={'request': request})
            return self.get_paginated_response(serializer.data)
        
        serializer = LabSerializer(queryset, many=True, context={'request': request})
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def categories(self, request):
        """الحصول على جميع التصنيفات"""
        categories = Lab.objects.filter(is_active=True).values_list(
            'category', flat=True
        ).distinct()
        
        category_choices = dict(Lab.CATEGORY_CHOICES)
        result = []
        for category in categories:
            if category in category_choices:
                result.append({
                    'value': category,
                    'label': category_choices[category],
                    'count': Lab.objects.filter(category=category, is_active=True).count()
                })
        
        return Response(result)
    
    @action(detail=False, methods=['get'])
    def statistics(self, request):
        """إحصائيات عامة للمعامل"""
        total_labs = Lab.objects.filter(is_active=True).count()
        total_challenges = Challenge.objects.count()
        total_submissions = Submission.objects.count()
        total_users_completed = UserLabProgress.objects.filter(is_completed=True).count()
        
        return Response({
            'total_labs': total_labs,
            'total_challenges': total_challenges,
            'total_submissions': total_submissions,
            'total_users_completed': total_users_completed,
        })


class ChallengeViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet للتحديات"""
    
    queryset = Challenge.objects.all()
    serializer_class = ChallengeSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    
    def get_queryset(self):
        queryset = super().get_queryset()
        
        lab_id = self.request.query_params.get('lab_id')
        if lab_id:
            queryset = queryset.filter(lab_id=lab_id)
        
        return queryset
    
    @action(detail=True, methods=['post'])
    def submit(self, request, pk=None):
        """تقديم حل للتحدي"""
        if not request.user.is_authenticated:
            return Response({'detail': 'يجب تسجيل الدخول'}, status=status.HTTP_401_UNAUTHORIZED)
        
        challenge = self.get_object()
        serializer = SubmitChallengeSerializer(data=request.data)
        
        if serializer.is_valid():
            submission_data = {
                'user': request.user,
                'lab': challenge.lab,
                'challenge': challenge,
                'status': 'pending'
            }
            
            if serializer.validated_data.get('answer'):
                submission_data['answer'] = serializer.validated_data['answer']
            
            if serializer.validated_data.get('code'):
                submission_data['code'] = serializer.validated_data['code']
            
            if serializer.validated_data.get('file'):
                submission_data['file'] = serializer.validated_data['file']
            
            submission = Submission.objects.create(**submission_data)
            
            # نظام التقييم الآلي البسيط
            is_correct = False
            if challenge.answer_type == 'flag' or challenge.answer_type == 'text':
                if submission.answer.strip() == challenge.correct_answer.strip():
                    is_correct = True
            
            if is_correct:
                submission.status = 'correct'
                submission.is_correct = True
                submission.score = challenge.points
            else:
                submission.status = 'incorrect'
                submission.is_correct = False
                submission.score = 0
            
            submission.save()
            
            submission_serializer = SubmissionSerializer(submission)
            return Response(submission_serializer.data, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class SubmissionViewSet(viewsets.ModelViewSet):
    """ViewSet للتسليمات"""
    
    # المطلوب: إضافة queryset لتجنب خطأ basename
    queryset = Submission.objects.all()
    serializer_class = SubmissionSerializer
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]
    
    def get_queryset(self):
        """الحصول على تسليمات المستخدم فقط"""
        queryset = Submission.objects.filter(user=self.request.user)
        
        lab_id = self.request.query_params.get('lab_id')
        if lab_id:
            queryset = queryset.filter(lab_id=lab_id)
        
        challenge_id = self.request.query_params.get('challenge_id')
        if challenge_id:
            queryset = queryset.filter(challenge_id=challenge_id)
        
        return queryset
    
    def perform_create(self, serializer):
        """إنشاء تسليم جديد"""
        serializer.save(user=self.request.user)
    
    @action(detail=False, methods=['get'])
    def user_statistics(self, request):
        """إحصائيات المستخدم"""
        user = request.user
        
        total_submissions = Submission.objects.filter(user=user).count()
        correct_submissions = Submission.objects.filter(user=user, is_correct=True).count()
        total_score = Submission.objects.filter(user=user).aggregate(total=Sum('score'))['total'] or 0
        
        progress_queryset = UserLabProgress.objects.filter(user=user)
        total_labs_started = progress_queryset.filter(is_started=True).count()
        total_labs_completed = progress_queryset.filter(is_completed=True).count()
        
        return Response({
            'total_submissions': total_submissions,
            'correct_submissions': correct_submissions,
            'accuracy_rate': (correct_submissions / total_submissions * 100) if total_submissions > 0 else 0,
            'total_score': total_score,
            'total_labs_started': total_labs_started,
            'total_labs_completed': total_labs_completed,
        })


class UserLabProgressViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet لتقدم المستخدم"""
    
    queryset = UserLabProgress.objects.all()
    serializer_class = UserLabProgressSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        """الحصول على تقدم المستخدم فقط"""
        return UserLabProgress.objects.filter(user=self.request.user)
    
    @action(detail=False, methods=['get'])
    def overview(self, request):
        """نظرة عامة على تقدم المستخدم"""
        progress = UserLabProgress.objects.filter(user=request.user)
        
        total_labs = progress.count()
        completed_labs = progress.filter(is_completed=True).count()
        total_score = progress.aggregate(total=Sum('total_score'))['total'] or 0
        
        serializer = UserProgressSerializer({
            'total_labs': total_labs,
            'completed_labs': completed_labs,
            'completion_rate': (completed_labs / total_labs * 100) if total_labs > 0 else 0,
            'total_points': total_score,
            'average_score': (total_score / completed_labs) if completed_labs > 0 else 0,
        })
        
        return Response(serializer.data)


class LabReviewViewSet(viewsets.ModelViewSet):
    """ViewSet لتقييمات المعامل"""
    
    queryset = LabReview.objects.all()
    serializer_class = LabReviewSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    
    def get_queryset(self):
        """الحصول على التقييمات العامة أو الخاصة بالمستخدم"""
        queryset = LabReview.objects.all()
        
        if not self.request.user.is_staff:
            queryset = queryset.filter(is_approved=True)
        
        lab_id = self.request.query_params.get('lab_id')
        if lab_id:
            queryset = queryset.filter(lab_id=lab_id)
        
        return queryset
    
    def perform_create(self, serializer):
        """إنشاء تقييم جديد"""
        serializer.save(user=self.request.user)
    
    @action(detail=False, methods=['get'])
    def user_reviews(self, request):
        """تقييمات المستخدم"""
        if not request.user.is_authenticated:
            return Response({'detail': 'يجب تسجيل الدخول'}, status=status.HTTP_401_UNAUTHORIZED)
        
        reviews = LabReview.objects.filter(user=request.user)
        serializer = self.get_serializer(reviews, many=True)
        return Response(serializer.data)


# ========================
# View لواجهة الويب
# ========================

class LabWebView(View):
    """عرض قائمة المعامل في واجهة ويب"""
    def get(self, request):
        return render(request, 'labs/lab_list.html')
    
# ========================
# View لواجهة الويب - أضف هذا في نهاية الملف
# ========================

from django.shortcuts import render
from django.views import View

class LabWebView(View):
    """عرض قائمة المعامل في واجهة ويب"""
    def get(self, request):
        return render(request, 'labs/lab_list.html')
    
# في labs/views.py، أضف في class LabViewSet:
def get_serializer_context(self):
    """إضافة context للـ serializer"""
    context = super().get_serializer_context()
    context['request'] = self.request
    return context

# أضف في نهاية views.py
class TestView(View):
    def get(self, request):
        return render(request, 'labs/test.html')
# ========================
# ViewSets للإشعارات والملف الشخصي
# ========================

from .serializers import NotificationSerializer, UserProfileSerializer
from .models import Notification, UserProfile

class NotificationViewSet(viewsets.ModelViewSet):
    """ViewSet للإشعارات"""
    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Notification.objects.filter(user=self.request.user)

    @action(detail=False, methods=['post'])
    def mark_all_as_read(self, request):
        """تحديد جميع الإشعارات كمقروءة"""
        self.get_queryset().update(is_read=True)
        return Response({'status': 'success'})

class UserProfileViewSet(viewsets.ModelViewSet):
    """ViewSet للملف الشخصي"""
    serializer_class = UserProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return UserProfile.objects.filter(user=self.request.user)

    @action(detail=False, methods=['get'])
    def me(self, request):
        """الحصول على ملفي الشخصي"""
        profile, created = UserProfile.objects.get_or_create(user=request.user)
        profile.update_stats()
        serializer = self.get_serializer(profile)
        return Response(serializer.data)
