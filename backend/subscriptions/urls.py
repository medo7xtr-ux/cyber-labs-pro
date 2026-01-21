# backend/subscriptions/urls.py
from django.urls import path
from . import views

urlpatterns = [
    path('plans/', views.SubscriptionPlansView.as_view(), name='plans'),
    path('subscribe/', views.SubscribeView.as_view(), name='subscribe'),
    path('cancel/', views.CancelSubscriptionView.as_view(), name='cancel'),
    path('status/', views.SubscriptionStatusView.as_view(), name='status'),
]