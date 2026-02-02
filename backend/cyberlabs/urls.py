from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework.routers import DefaultRouter
from labs.views import (
    LabViewSet, ChallengeViewSet, SubmissionViewSet, 
    NotificationViewSet, UserProfileViewSet
)

router = DefaultRouter()
router.register(r'labs', LabViewSet, basename='lab')
router.register(r'challenges', ChallengeViewSet, basename='challenge')
router.register(r'submissions', SubmissionViewSet, basename='submission')
router.register(r'notifications', NotificationViewSet, basename='notification')
router.register(r'profile', UserProfileViewSet, basename='profile')

urlpatterns = [
    path('admin/', admin.admin_site.urls if hasattr(admin, 'admin_site') else admin.site.urls),
    path('api/', include(router.urls)),
    path('api/auth/', include('rest_framework.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
