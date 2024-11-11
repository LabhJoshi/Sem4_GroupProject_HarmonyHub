from rest_framework import serializers
from .models import Playlist, Song

class SongSerializer(serializers.ModelSerializer):
    class Meta:
        model = Song
        fields = [
            'id', 'name', 'artist', 'album', 'duration', 'spotify', 
            'preview_url', 'track_id', 'popularity', 'album_cover_url','uri'
        ]

class PlaylistSerializer(serializers.ModelSerializer):
    songs = SongSerializer(many=True, read_only=True)

    class Meta:
        model = Playlist
        fields = ['id', 'name', 'songs', 'created_at']

class CreatePlaylistSerializer(serializers.ModelSerializer):
    class Meta:
        model = Playlist
        fields = ['name']

class ArtistSerializer(serializers.Serializer):
    external_urls = serializers.DictField()
    href = serializers.URLField()
    id = serializers.CharField(max_length=255)
    name = serializers.CharField(max_length=255)
    type = serializers.CharField(max_length=50)
    uri = serializers.CharField(max_length=255)

class AlbumSerializer(serializers.Serializer):
    album_type = serializers.CharField(max_length=50)
    artists = ArtistSerializer(many=True)  # List of artists
    available_markets = serializers.ListField(child=serializers.CharField())
    external_urls = serializers.DictField()
    href = serializers.URLField()
    id = serializers.CharField(max_length=255)
    images = serializers.ListField(child=serializers.DictField())
    name = serializers.CharField(max_length=255)
    release_date = serializers.DateField()
    release_date_precision = serializers.CharField(max_length=50)
    total_tracks = serializers.IntegerField()
    type = serializers.CharField(max_length=50)
    uri = serializers.CharField(max_length=255)

class AddSongToPlaylistSerializer(serializers.Serializer):
    playlist_ids = serializers.ListField(
        child=serializers.IntegerField()
    )
    name = serializers.CharField(max_length=500)
    artist = serializers.CharField(max_length=500)
    album = serializers.CharField(max_length=500)
    duration = serializers.IntegerField()
    spotify = serializers.URLField(required=False)
    preview_url = serializers.URLField(required=False)
    track_id = serializers.CharField(max_length=100)
    popularity = serializers.IntegerField(required=False)
    album_cover_url = serializers.URLField(required=False)
    uri=serializers.CharField(max_length=500)