# labs/urls.py - النسخة النهائية
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    LabViewSet, ChallengeViewSet, SubmissionViewSet,
    UserLabProgressViewSet, LabReviewViewSet, LabWebView
)

# API Router - مع basename لكل ViewSet
router = DefaultRouter()
router.register(r'labs', LabViewSet, basename='lab')
router.register(r'challenges', ChallengeViewSet, basename='challenge')
router.register(r'submissions', SubmissionViewSet, basename='submission')
router.register(r'progress', UserLabProgressViewSet, basename='userlabprogress')
router.register(r'reviews', LabReviewViewSet, basename='labreview')

# URL patterns
urlpatterns = [
    # API URLs
    path('', include(router.urls)),
    
    # يمكن إضافة URLs إضافية هنا
    # path('web/', LabWebView.as_view(), name='lab-list-web'),  # اختياري
]# labs/urls.py - الإصدار النهائي المصحح
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    LabViewSet, ChallengeViewSet, SubmissionViewSet,
    UserLabProgressViewSet, LabReviewViewSet
)

# API Router مع basename المطلوب
router = DefaultRouter()
router.register(r'labs', LabViewSet, basename='lab')
router.register(r'challenges', ChallengeViewSet, basename='challenge')
router.register(r'submissions', SubmissionViewSet, basename='submission')
router.register(r'progress', UserLabProgressViewSet, basename='userlabprogress')
router.register(r'reviews', LabReviewViewSet, basename='labreview')

# URL patterns
urlpatterns = [
    # API URLs فقط - تم إزالة LabListView
    path('', include(router.urls)),
]