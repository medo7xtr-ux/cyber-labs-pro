# forum/urls.py - مبسط
from django.urls import path
from . import views

urlpatterns = [
    path('', views.SimpleForumAPI.as_view(), name='forum'),
    path('threads/', views.ThreadListView.as_view(), name='thread_list'),
    path('threads/<int:pk>/', views.ThreadDetailView.as_view(), name='thread_detail'),
    path('posts/', views.PostListView.as_view(), name='post_list'),
    path('posts/<int:pk>/', views.PostDetailView.as_view(), name='post_detail'),
]