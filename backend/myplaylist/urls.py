from django.urls import path
from . import views

urlpatterns = [
    path('create/', views.create_playlist, name='create_playlist'),
    path('add-song/', views.add_song_to_playlists, name='add_song_to_playlists'),
    path('my-playlists/', views.get_user_playlists, name='get_user_playlists'),
    path('<int:playlist_id>/songs/', views.get_playlist_songs, name='get_playlist_songs'),
    # path('create', views.create_playlist, name='create_playlist'),
    path('add-song', views.add_song_to_playlists, name='add_song_to_playlists'),
    # path('my-playlists', views.get_user_playlists, name='get_user_playlists'),
    # path('<int:playlist_id>/songs', views.get_playlist_songs, name='get_playlist_songs'),
]
