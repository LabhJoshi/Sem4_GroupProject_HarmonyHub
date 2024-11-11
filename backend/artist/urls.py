# from django.urls import path
# from . import views  # Assuming your view is in views.py

# urlpatterns = [
#     # API endpoint for artist data
#     path('api/artist/', views.get_artist_data, name='get_artist_data'),  # This matches the frontend's fetch URL
# ]
# from django.urls import path
# from .views import get_indian_artists, get_global_artists
# # from .views import like_artist
# from . import views
# urlpatterns = [
#     path('api/artist/indian', get_indian_artists, name='get_indian_artists'),
#     path('api/artist/global', get_global_artists, name='get_global_artists'),
#     # path('api/like-artist/', like_artist, name='like-artist'),
#     path('api/like-song/', views.like_song, name='like-song'),
#     path('api/favr',views.SongViewSet,name='SongViewSet')
# ]
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import SongViewSet,SongViewSet1
from . import views
# Create a router and register the SongViewSet with it
router = DefaultRouter()
router.register(r'songs', SongViewSet, basename='song')
router.register(r'favsongs', SongViewSet1, basename='song1')

urlpatterns = [
   
    path('api/like-song/', views.like_song, name='like-song'),
    path('api/', include(router.urls)),  # Include the router's URLs
]






