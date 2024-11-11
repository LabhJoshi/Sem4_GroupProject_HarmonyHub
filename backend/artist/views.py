# from rest_framework import status
# from rest_framework.response import Response
# from rest_framework.decorators import api_view, permission_classes
# from rest_framework.permissions import IsAuthenticated
# from .models import LikedArtist
# from .serializers import LikedArtistSerializer

# @api_view(['POST'])
# @permission_classes([IsAuthenticated])
# def like_artist(request):
#     data = request.data
#     user = request.user

#     print(data)  # Log incoming data for debugging

#     # Check if the artist is already liked by the user
#     if LikedArtist.objects.filter(user=user, artist_id=data['artist_id']).exists():
#         liked_artist = LikedArtist.objects.get(user=user, artist_id=data['artist_id'])
#         return Response({'message': 'Artist already liked', 'artist': LikedArtistSerializer(liked_artist).data}, status=status.HTTP_400_BAD_REQUEST)

#     try:
#         # Create a new liked artist
#         liked_artist = LikedArtist.objects.create(
#             user=user,
#             artist_id=data['artist_id'],
#             artist_name=data['artist_name'],
#             artist_image=data['artist_image'],
#             followers=data['followers'],
#             popularity=data['popularity']
#         )
#         return Response(LikedArtistSerializer(liked_artist).data, status=status.HTTP_201_CREATED)

#     except Exception as e:
#         return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# @api_view(['GET'])
# @permission_classes([IsAuthenticated])
# def get_liked_artists(request):
#     user = request.user
#     liked_artists = LikedArtist.objects.filter(user=user)
#     serializer = LikedArtistSerializer(liked_artists, many=True)
#     return Response(serializer.data)

# from rest_framework import status
# from rest_framework.decorators import api_view
# from rest_framework.response import Response
# from .models import LikedArtist
# from .serializers import LikedArtistSerializer

# @api_view(['POST'])
# def like_artist(request):
#     # Check if the artist is already liked
#     artist_id = request.data.get('artist_id')
#     if LikedArtist.objects.filter(artist_id=artist_id).exists():
#         return Response({'message': 'Artist already liked!'}, status=status.HTTP_400_BAD_REQUEST)
    
#     # Save the liked artist to the database
#     serializer = LikedArtistSerializer(data=request.data)
#     if serializer.is_valid():
#         serializer.save()
#         return Response({'message': 'Artist liked successfully!'}, status=status.HTTP_201_CREATED)
    
#     return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
# music/views.py
# views.py
# from rest_framework import generics
# from .models import LikedSong
# from .serializers import LikedSongSerializer

# class LikedSongListCreate(generics.ListCreateAPIView):
#     queryset = LikedSong.objects.all()
# serializer_class = LikedSongSerializer
# @api_view(['POST'])
# def like_song(request):
#     print("Received data:", request.data)  # Log incoming data
#     track_id = request.data.get('track_id')
#     if track_id:
#         # Assuming you have the user and liked_song logic
#         liked_song = LikedSong.objects.create(track_id=track_id, user=request.user)
#         liked_song.save()
#         return Response({"message": "Track liked successfully!"}, status=200)
#     return Response({"error": "Track ID is required"}, status=400)
#//// main code
# import requests
# from django.http import JsonResponse

# # Spotify API credentials
# def get_spotify_access_token():
#     client_id = 'e6baed8ae0fa4188aba840fc9b0e680f'
#     client_secret = '85321bdc7b724dc9abf3eb8423518228'
#     auth_url = 'https://accounts.spotify.com/api/token'
#     auth_response = requests.post(auth_url, data={
#         'grant_type': 'client_credentials',
#         'client_id': client_id,
#         'client_secret': client_secret,
#     })
#     if auth_response.status_code == 200:
#         auth_response_data = auth_response.json()
#         return auth_response_data['access_token']
#     else:
#         return None

# # Fetch popular Bollywood artists in India
# def get_popular_artists(access_token, genre='Bollywood'):
#     headers = {
#         'Authorization': f'Bearer {access_token}'
#     }
#     # Use the market parameter for India (IN)
#     url = f"https://api.spotify.com/v1/search?q=genre:{genre}&type=artist&market=IN&limit=50"
#     response = requests.get(url, headers=headers)
#     if response.status_code == 200:
#         data = response.json()
#         artist_list = {artist['id'] for artist in data['artists']['items']}  # Use a set to ensure uniqueness
#         return list(artist_list)
#     else:
#         return []

# # Fetch artist details using artist ID
# def fetch_artist_details(artist_id, headers):
#     url = f"https://api.spotify.com/v1/artists/{artist_id}"
#     response = requests.get(url, headers=headers)
#     if response.status_code == 200:
#         return response.json()
#     else:
#         return {}

# # Get the top artists based on popularity in India
# def get_artists(access_token, genre='Bollywood'):
#     headers = {
#         'Authorization': f'Bearer {access_token}'
#     }
#     artist_ids = get_popular_artists(access_token, genre)

#     artists_data = []
#     for artist_id in artist_ids:
#         artist_data = fetch_artist_details(artist_id, headers)
#         if artist_data:
#             artists_data.append({
#                 'id': artist_id,
#                 'name': artist_data.get('name'),
#                 'image': artist_data.get('images', [{}])[0].get('url'),
#                 'followers': artist_data.get('followers', {}).get('total', 0),
#                 'popularity': artist_data.get('popularity', 0)
#             })

#     # Sort artists by popularity
#     sorted_artists = sorted(artists_data, key=lambda artist: artist['popularity'], reverse=True)[:7]  # Get top 7 artists

#     return sorted_artists

# # Main API endpoint to return Bollywood artist data for India
# def get_artist_data(request):
#     access_token = get_spotify_access_token()
#     if access_token:
#         genre = request.GET.get('genre', 'Bollywood')  # Default genre is 'Bollywood'
#         artists = get_artists(access_token, genre)
#         return JsonResponse(artists, safe=False)
#     else:
#         return JsonResponse({'error': 'Unable to retrieve access token'}, status=500)
#main----
# import requests
# from django.http import JsonResponse

# # Spotify API credentials
# def get_spotify_access_token():
#     client_id = 'e6baed8ae0fa4188aba840fc9b0e680f'
#     client_secret = '85321bdc7b724dc9abf3eb8423518228'
#     auth_url = 'https://accounts.spotify.com/api/token'
#     auth_response = requests.post(auth_url, data={
#         'grant_type': 'client_credentials',
#         'client_id': client_id,
#         'client_secret': client_secret,
#     })
#     if auth_response.status_code == 200:
#         auth_response_data = auth_response.json()
#         return auth_response_data['access_token']
#     else:
#         return None

# # Fetch globally popular tracks and extract artist IDs
# def get_global_top_tracks(access_token):
#     headers = {
#         'Authorization': f'Bearer {access_token}'
#     }
#     # Get the top tracks globally
#     url = "https://api.spotify.com/v1/playlists/37i9dQZEVXbMDoHDwVN2tF/tracks"  # Spotify Global Top 50 playlist
#     response = requests.get(url, headers=headers)

#     if response.status_code == 200:
#         data = response.json()
#         # Extract unique artist IDs from the top tracks
#         artist_list = {track['track']['artists'][0]['id'] for track in data['items'] if track['track']['artists']}
#         return list(artist_list)
#     else:
#         return []

# # Fetch popular Bollywood artists in India
# def get_popular_artists(access_token, genre='Bollywood'):
#     headers = {
#         'Authorization': f'Bearer {access_token}'
#     }
#     # Use the market parameter for India (IN)
#     url = f"https://api.spotify.com/v1/search?q=genre:{genre}&type=artist&market=IN&limit=50"
#     response = requests.get(url, headers=headers)
#     if response.status_code == 200:
#         data = response.json()
#         artist_list = {artist['id'] for artist in data['artists']['items']}  # Use a set to ensure uniqueness
#         return list(artist_list)
#     else:
#         return []

# # Fetch artist details using artist ID
# def fetch_artist_details(artist_id, headers):
#     url = f"https://api.spotify.com/v1/artists/{artist_id}"
#     response = requests.get(url, headers=headers)
#     if response.status_code == 200:
#         return response.json()
#     else:
#         return {}

# # Get top artists based on popularity (India or globally)
# def get_artists(access_token, genre='Bollywood', global_artists=False):
#     headers = {
#         'Authorization': f'Bearer {access_token}'
#     }
#     if global_artists:
#         artist_ids = get_global_top_tracks(access_token)
#     else:
#         artist_ids = get_popular_artists(access_token, genre)

#     if not artist_ids:
#         return []

#     artists_data = []
#     for artist_id in artist_ids:
#         artist_data = fetch_artist_details(artist_id, headers)
#         if artist_data:
#             artists_data.append({
#                 'id': artist_id,
#                 'name': artist_data.get('name'),
#                 'image': artist_data.get('images', [{}])[0].get('url'),
#                 'followers': artist_data.get('followers', {}).get('total', 0),
#                 'popularity': artist_data.get('popularity', 0)
#             })

#     # Sort artists by popularity
#     sorted_artists = sorted(artists_data, key=lambda artist: artist['popularity'], reverse=True)[:7]  # Get top 7 artists

#     return sorted_artists

# # Main API endpoint to return artist data (either global or Bollywood)
# def get_artist_data(request):
#     access_token = get_spotify_access_token()
#     if access_token:
#         # Determine if the user wants global artists or Bollywood (default)
#         global_artists = request.GET.get('global', 'false').lower() == 'true'
#         genre = request.GET.get('genre', 'Bollywood')  # Default genre is 'Bollywood'
#         artists = get_artists(access_token, genre, global_artists)
#         return JsonResponse(artists, safe=False)
#     else:
#         return JsonResponse({'error': 'Unable to retrieve access token'}, status=500)


# Fetch artist data based on type (Global or Bollywood)


# from django.http import JsonResponse
# from django.views.decorators.csrf import csrf_exempt
# from .models import LikedArtist
# import json

# @csrf_exempt
# def like_artist(request):
#     if request.method == 'POST':
#         data = json.loads(request.body)
#         artist = LikedArtist(
#             name=data['name'],
#             image_url=data['image'],
#             followers=data['followers'],
#         )
#         artist.save()
#         return JsonResponse({'message': 'Artist liked successfully!'})
# views.py

from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Song
from .serializers import SongSerializer

@api_view(['POST'])
def like_song(request):
    song_data = request.data

    serializer = SongSerializer(data=song_data)
    if serializer.is_valid():
        serializer.save()
        return Response({"message": "Song liked successfully"}, status=status.HTTP_201_CREATED)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
# views.py
from rest_framework import viewsets
from .models import Song  # Assuming your model is named Song
from .serializers import SongSerializer1  # Create a serializer for the Song model

class SongViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Song.objects.all()  # Adjust according to your requirements
    serializer_class = SongSerializer  # Use the serializer you create


# views.py
from rest_framework import viewsets
from .models import Song
from .serializers import SongSerializer2

class SongViewSet1(viewsets.ReadOnlyModelViewSet):
    queryset = Song.objects.all()
    serializer_class = SongSerializer2
