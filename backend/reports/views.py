# reports/views.py
from rest_framework.views import APIView
from rest_framework.response import Response

class SimpleReportAPI(APIView):
    def get(self, request):
        return Response({"message": "Reports API تعمل بنجاح!"})

class ReportListView(APIView):
    def get(self, request):
        return Response({"message": "قائمة التقارير"})

class ReportDetailView(APIView):
    def get(self, request, pk):
        return Response({"message": f"تفاصيل التقرير {pk}"})

class ReportCreateView(APIView):
    def post(self, request):
        return Response({"message": "تم إنشاء التقرير"})

class ReportStatsView(APIView):
    def get(self, request):
        return Response({"message": "إحصائيات التقارير"})