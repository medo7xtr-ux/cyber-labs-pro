# cyberlabs/urls.py - النسخة النهائية
from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse, HttpResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from django.conf import settings
from django.conf.urls.static import static
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

# استيراد View بسيط لصفحة الويب
from labs.views import LabWebView
from labs.views import TestView
@csrf_exempt
def home_view(request):
    return JsonResponse({
        "project": "CyberLabs",
        "status": "running",
        "message": "✅ Backend يعمل بنجاح!",
        "endpoints": {
            "api_root": "/api/labs/",
            "labs_api": "/api/labs/labs/",
            "labs_web": "/labs/",
            "admin_panel": "/admin/",
            "api_docs": "/api/"
        }
    })

@csrf_exempt
def cors_view(request):
    """View للتعامل مع طلبات CORS"""
    response = JsonResponse({"cors": "allowed"})
    response["Access-Control-Allow-Origin"] = "*"
    response["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS"
    response["Access-Control-Allow-Headers"] = "Content-Type, Authorization"
    response["Access-Control-Allow-Credentials"] = "true"
    return response

urlpatterns = [
    # الصفحة الرئيسية
    path('', home_view, name='home'),
    
    # Authentication (JWT)
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    # لوحة الإدارة
    path('admin/', admin.site.urls),
    
    # Labs API
    path('api/labs/', include('labs.urls')),
    
    # صفحة الويب للمعامل
    path('labs/', LabWebView.as_view(), name='labs-web'),  # ← هذا السطر

    # أضف في urlpatterns
    path('test/', TestView.as_view(), name='test'),
    path('cors-test/', cors_view),
]

# ملفات الوسائط في وضع التطوير
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)

# معالجة الأخطاء
handler404 = lambda request, exception=None: JsonResponse(
    {"error": "الصفحة غير موجودة", "code": 404}, status=404
)

handler500 = lambda request: JsonResponse(
    {"error": "خطأ داخلي في الخادم", "code": 500}, status=500
)