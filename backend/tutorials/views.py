# tutorials/views.py
from rest_framework.views import APIView
from rest_framework.response import Response

class SimpleTutorialAPI(APIView):
    def get(self, request):
        return Response({"message": "Tutorials API تعمل بنجاح!"})

class TutorialListView(APIView):
    def get(self, request):
        return Response({"message": "قائمة الدروس"})

class TutorialDetailView(APIView):
    def get(self, request, pk):
        return Response({"message": f"تفاصيل الدرس {pk}"})

class CategoryListView(APIView):
    def get(self, request):
        return Response({"message": "قائمة التصنيفات"})