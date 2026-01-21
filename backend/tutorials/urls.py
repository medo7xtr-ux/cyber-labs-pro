# tutorials/urls.py - مبسط
from django.urls import path
from . import views

urlpatterns = [
    path('', views.SimpleTutorialAPI.as_view(), name='tutorials'),
    path('list/', views.TutorialListView.as_view(), name='tutorial_list'),
    path('<int:pk>/', views.TutorialDetailView.as_view(), name='tutorial_detail'),
    path('categories/', views.CategoryListView.as_view(), name='category_list'),
]