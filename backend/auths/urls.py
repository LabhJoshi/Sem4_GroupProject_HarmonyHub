from django.urls import path
from .views import authorize, callback

urlpatterns = [
    path('authorize/', authorize, name='authorize'),
    path('callback/', callback, name='callback'),
]