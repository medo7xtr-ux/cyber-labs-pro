# forum/views.py
from rest_framework.views import APIView
from rest_framework.response import Response

class SimpleForumAPI(APIView):
    def get(self, request):
        return Response({"message": "Forum API تعمل بنجاح!"})

class ThreadListView(APIView):
    def get(self, request):
        return Response({"message": "قائمة المواضيع"})

class ThreadDetailView(APIView):
    def get(self, request, pk):
        return Response({"message": f"تفاصيل الموضوع {pk}"})

class PostListView(APIView):
    def get(self, request):
        return Response({"message": "قائمة المشاركات"})

class PostDetailView(APIView):
    def get(self, request, pk):
        return Response({"message": f"تفاصيل المشاركة {pk}"})