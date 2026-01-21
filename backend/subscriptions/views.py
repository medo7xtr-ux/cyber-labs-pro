# backend/subscriptions/views.py
from rest_framework import generics, permissions, status
from rest_framework.response import Response

class SubscriptionPlansView(generics.ListAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    
    def get(self, request, *args, **kwargs):
        # خطط الاشتراك
        plans = [
            {
                'id': 1,
                'name': 'الاشتراك الأساسي',
                'description': 'وصول كامل لجميع المعامل والدروس',
                'price': 29.99,
                'currency': 'SAR',
                'duration': 'شهري',
                'features': [
                    'وصول لجميع المعامل المميزة',
                    'دروس متقدمة',
                    'شهادات إنجاز',
                    'دعم فني',
                ]
            },
            {
                'id': 2,
                'name': 'الاشتراك المميز',
                'description': 'كل ميزات الأساسي بالإضافة إلى أدوات متقدمة',
                'price': 49.99,
                'currency': 'SAR',
                'duration': 'شهري',
                'features': [
                    'جميع ميزات الأساسي',
                    'أدوات اختبار متقدمة',
                    'جلسات تدريبية أسبوعية',
                    'مكتبة أدوات حصرية',
                    'دعم على مدار الساعة',
                ]
            }
        ]
        
        return Response(plans)

class SubscribeView(generics.CreateAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    
    def post(self, request, *args, **kwargs):
        plan_id = request.data.get('plan_id')
        
        # محاكاة عملية الاشتراك
        return Response({
            'success': True,
            'message': 'تم الاشتراك بنجاح',
            'subscription': {
                'plan_id': plan_id,
                'status': 'active',
                'start_date': '2024-01-01',
                'end_date': '2024-02-01',
            }
        })

class CancelSubscriptionView(generics.CreateAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    
    def post(self, request, *args, **kwargs):
        return Response({
            'success': True,
            'message': 'تم إلغاء الاشتراك بنجاح',
        })

class SubscriptionStatusView(generics.RetrieveAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    
    def get(self, request, *args, **kwargs):
        # محاكاة حالة الاشتراك
        return Response({
            'has_subscription': True,
            'status': 'active',
            'plan': 'الاشتراك الأساسي',
            'expires_at': '2024-02-01',
        })