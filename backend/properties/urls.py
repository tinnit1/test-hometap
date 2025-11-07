from django.urls import path
from .views import property_view

urlpatterns = [
    path('', property_view, name='property_view'),
]