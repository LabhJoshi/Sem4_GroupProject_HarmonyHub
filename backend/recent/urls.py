from django.urls import path
from .views import like_song,get_liked_songs

urlpatterns = [
    path('like/', like_song, name='like_song'),
    path('get-liked-songs/', get_liked_songs, name='get_liked_songs'),
]
