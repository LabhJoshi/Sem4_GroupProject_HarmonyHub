# serializers.py
# from rest_framework import serializers
# from .models import LikedArtist

# class LikedArtistSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = LikedArtist
#         fields = ['id', 'artist_id', 'artist_name', 'artist_image', 'followers', 'popularity']

# music/serializers.py
# from rest_framework import serializers
# from .models import LikedSong

# class LikedSongSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = LikedSong
#         fields = '__all__'

# serializers.py

from rest_framework import serializers
from .models import Song

class SongSerializer(serializers.ModelSerializer):
    class Meta:
        model = Song
        fields = ['artist_name', 'artist_image', 'artist_followers', 'track_name', 'album_name', 'duration', 'track_url']

# serializers.py
from rest_framework import serializers
from .models import Song

class SongSerializer1(serializers.ModelSerializer):
    class Meta:
        model = Song
        fields = ['id', 'artist_name', 'artist_image', 'song_name']  # Adjust fields as needed

# serializers.py
from rest_framework import serializers
from .models import Song

class SongSerializer2(serializers.ModelSerializer):
    class Meta:
        model = Song
        fields = '__all__'  # or specify the fields you want to include
