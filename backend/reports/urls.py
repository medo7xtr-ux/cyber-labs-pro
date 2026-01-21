# reports/urls.py - مبسط
from django.urls import path
from . import views

urlpatterns = [
    path('', views.SimpleReportAPI.as_view(), name='reports'),
    path('list/', views.ReportListView.as_view(), name='report_list'),
    path('<int:pk>/', views.ReportDetailView.as_view(), name='report_detail'),
    path('create/', views.ReportCreateView.as_view(), name='report_create'),
    path('stats/', views.ReportStatsView.as_view(), name='report_stats'),
]