from django.urls import path
from . import views

urlpatterns=[
 path('api/artist/indian/', views.get_indian_artists, name='get_indian_artists'),
    path('api/artist/global/', views.get_global_artists, name='get_global_artists'),]