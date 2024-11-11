from django.shortcuts import get_object_or_404
from rest_framework import status
# from django.views.decorators.csrf import csrf_exempt
from rest_framework.permissions import AllowAny
from rest_framework.decorators import api_view,permission_classes
from rest_framework.response import Response
from .models import Playlist, Song
from .serializers import PlaylistSerializer, CreatePlaylistSerializer, AddSongToPlaylistSerializer, SongSerializer

# @csrf_exempt
@api_view(['POST'])
@permission_classes([AllowAny])
def create_playlist(request):
    serializer = CreatePlaylistSerializer(data=request.data)
    if serializer.is_valid():
        playlist = Playlist.objects.create(name=serializer.validated_data['name'])
        return Response(PlaylistSerializer(playlist).data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def add_song_to_playlists(request):
    print(request.data)
    serializer = AddSongToPlaylistSerializer(data=request.data)
    print(serializer.is_valid())
    if serializer.is_valid():
        # Extract the validated data
        name = serializer.validated_data['name']
        artist = serializer.validated_data['artist']
        album = serializer.validated_data['album']
        duration = serializer.validated_data['duration']
        spotify = serializer.validated_data.get('spotify', '')
        preview_url = serializer.validated_data.get('preview_url', '')
        track_id = serializer.validated_data['track_id']
        popularity = serializer.validated_data.get('popularity', 0)
        album_cover_url = serializer.validated_data.get('album_cover_url', '')
        uri=serializer.validated_data['uri']
        

        # Check if the song already exists in the database
        song, created = Song.objects.get_or_create(
            track_id=track_id,
            defaults={
                'name': name,
                'artist': artist,
                'album': album,
                'duration': duration,
                'spotify': spotify,
                'preview_url': preview_url,
                'popularity': popularity,
                'album_cover_url': album_cover_url,
                'uri':uri
            }
        )

        # Add the song to the selected playlists
        playlist_ids = serializer.validated_data['playlist_ids']
        playlists = Playlist.objects.filter(id__in=playlist_ids)

        for playlist in playlists:
            playlist.songs.add(song)

        return Response({'message': 'Song added to playlists successfully.'}, status=status.HTTP_200_OK)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def get_user_playlists(request):
    playlists = Playlist.objects.filter()
    serializer = PlaylistSerializer(playlists, many=True)
    # print(serializer.data)
    return Response(serializer.data)

@api_view(['GET'])
def get_playlist_songs(request, playlist_id):
    playlist = Playlist.objects.get(id=playlist_id)
    songs = playlist.songs.all()
    # return Response({'tracks':PlaylistSerializer(playlist).data})
    # Serialize the song data
    serialized_songs = SongSerializer(songs, many=True).data
    
    # Return only the serialized song data, not the full playlist
    print(serialized_songs)
    return Response({'tracks':serialized_songs})