from django.shortcuts import render

# Create your views here.
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import recentlyplayed
from .serializers import LikedSongSerializer
from django.utils import timezone

# @api_view(['POST'])
# def like_song(request):
#     serializer = LikedSongSerializer(data=request.data)
#     if serializer.is_valid():
#         serializer.save()
#         return Response(serializer.data, status=status.HTTP_201_CREATED)
#     return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# from django.utils import timezone
# @api_view(['POST'])
# def like_song(request):
#     song_name = request.data.get('song_name')
#     artist_name = request.data.get('artist_name')

#     try:
#         song = recentlyplayed.objects.get(song_name=song_name, artist_name=artist_name)
#         song.played_at = timezone.now()
#         song.save() 
#         serializer = LikedSongSerializer(song)
#         return Response(serializer.data, status=status.HTTP_200_OK)
#     except recentlyplayed.DoesNotExist:
#         serializer = LikedSongSerializer(data=request.data)
#         if serializer.is_valid():
#             serializer.save(played_at=timezone.now())
#             return Response(serializer.data, status=status.HTTP_201_CREATED)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



# from django.utils import timezone
# from rest_framework import status
# from rest_framework.decorators import api_view
# from rest_framework.response import Response
# from .models import recentlyplayed
# from .serializers import LikedSongSerializer

# @api_view(['POST'])
# def like_song(request):
#     song_name = request.data.get('song_name')
#     artist_name = request.data.get('artist_name')
     

#     # Attempt to find and delete the existing song
#     try:
#         existing_song = recentlyplayed.objects.get(song_name=song_name, artist_name=artist_name)
#         existing_song.delete()
#         print(f"Deleted existing song: {song_name} by {artist_name}")
#     except recentlyplayed.DoesNotExist:
#         print(f"Song not found, will be created: {song_name} by {artist_name}")

#     # Create a new entry with the current time
#     serializer = LikedSongSerializer(data=request.data)
#     if serializer.is_valid():
#         # Add the played_at field to the validated data
#         validated_data = serializer.validated_data
#         validated_data['played_at'] = timezone.now()
#         new_serializer = LikedSongSerializer(data=validated_data)
#         if new_serializer.is_valid():
#             new_serializer.save()
#             return Response(new_serializer.data, status=status.HTTP_201_CREATED)
#         return Response(new_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
#     return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



# from rest_framework.decorators import api_view
# from .models import recentlyplayed
# from .serializers import LikedSongSerializer

# @api_view(['GET'])
# def get_liked_songs(request):
#     songs = recentlyplayed.objects.all().order_by('-played_at') # Order by the most recently played
#     serializer = LikedSongSerializer(songs, many=True)
#     return Response(serializer.data)



from django.utils import timezone
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import recentlyplayed
from .serializers import LikedSongSerializer

@api_view(['POST'])
def like_song(request):
    song_name = request.data.get('song_name')
    artist_name = request.data.get('artist_name')

    # Attempt to find the existing song
    try:
        existing_song = recentlyplayed.objects.get(song_name=song_name, artist_name=artist_name)
        # If the song is found, increment the play count
        existing_song.play_count += 1;
        print(existing_song.play_count)
        existing_song.played_at = timezone.now()  # Update the time as well
        existing_song.save()
        print(f"Incremented play count for: {song_name} by {artist_name}")
        return Response(LikedSongSerializer(existing_song).data, status=status.HTTP_200_OK)
    
    except recentlyplayed.DoesNotExist:
        # If the song doesn't exist, create a new entry
        print(f"Song not found, creating new entry: {song_name} by {artist_name}")
        serializer = LikedSongSerializer(data=request.data)
        if serializer.is_valid():
            validated_data = serializer.validated_data
            validated_data['played_at'] = timezone.now()  # Set current play time
            validated_data['play_count'] = 1  # Initialize with play count 1
            new_song = recentlyplayed(**validated_data)
            new_song.save()
            return Response(LikedSongSerializer(new_song).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def get_liked_songs(request):
    songs = recentlyplayed.objects.all().order_by('-played_at') # Order by the most recently played
    serializer = LikedSongSerializer(songs, many=True)
    return Response(serializer.data)
