from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'labs', views.LabViewSet, basename='lab')
router.register(r'challenges', views.ChallengeViewSet, basename='challenge')
router.register(r'submissions', views.SubmissionViewSet, basename='submission')
router.register(r'progress', views.UserLabProgressViewSet, basename='progress')
router.register(r'reviews', views.LabReviewViewSet, basename='review')

urlpatterns = [
    path('', include(router.urls)),
]