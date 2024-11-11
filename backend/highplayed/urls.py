# urls.py
from django.urls import path
from . import views

urlpatterns = [
    path('save-click-data/', views.save_click_data, name='save_click_data'),
    path('most-viewed/', views.get_most_viewed_song, name='get_most_viewed_song'),
]
