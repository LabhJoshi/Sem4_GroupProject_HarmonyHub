# from django.db import models

# # Create your models here.
# # models.py
# from django.conf import settings
# from django.db import models

# class LikedArtist(models.Model):
#     user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
#     artist_id = models.CharField(max_length=255)
#     artist_name = models.CharField(max_length=255)
#     artist_image = models.URLField()
#     followers = models.IntegerField()
#     popularity = models.IntegerField()

#     def __str__(self):
#         return self.artist_name
# from django.db import models

# class LikedArtist(models.Model):
#     artist_id = models.CharField(max_length=255, unique=True)
#     artist_name = models.CharField(max_length=255)
#     artist_image = models.URLField()
#     followers = models.IntegerField()
#     popularity = models.IntegerField()

#     def __str__(self):
#         return self.artist_name
# music/models.py
# from django.db import models

# class LikedSong(models.Model):
#     track_name = models.CharField(max_length=255)
#     artist_name = models.CharField(max_length=255)
#     album_image = models.URLField()
#     spotify_uri = models.CharField(max_length=255)

#     def __str__(self):
#         return f"{self.track_name} by {self.artist_name}"
# from django.db import models

# class LikedArtist(models.Model):
#     name = models.CharField(max_length=255)
#     image_url = models.URLField()
#     followers = models.IntegerField()

#     def __str__(self):
#         return self.name

# models.py

from django.db import models

class Song(models.Model):
    artist_name = models.CharField(max_length=255)
    artist_image = models.URLField()  # URL for the artist's image
    artist_followers = models.IntegerField(default=0)  # Default to 0 if no followers count
    track_name = models.CharField(max_length=255)
    album_name = models.CharField(max_length=255)
    duration = models.IntegerField()  # Duration in milliseconds
    track_url = models.URLField()  # URL to the track on Spotify or similar

    def __str__(self):
        return f"{self.track_name} by {self.artist_name}"
