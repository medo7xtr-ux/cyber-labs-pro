# users/views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

class SimpleUserAPI(APIView):
    def get(self, request):
        return Response({"message": "Users API تعمل بنجاح!"})

class RegisterView(APIView):
    def post(self, request):
        return Response({"message": "تم التسجيل بنجاح"}, status=status.HTTP_201_CREATED)

class LoginView(APIView):
    def post(self, request):
        return Response({"message": "تم تسجيل الدخول"})

class LogoutView(APIView):
    def post(self, request):
        return Response({"message": "تم تسجيل الخروج"})

class ProfileView(APIView):
    def get(self, request):
        return Response({"message": "الملف الشخصي"})

class CurrentUserView(APIView):
    def get(self, request):
        return Response({"message": "بيانات المستخدم الحالي"})