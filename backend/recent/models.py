from django.db import models

# Create your models here.
from django.db import models
from django.utils import timezone  
class recentlyplayed(models.Model):
    song_name = models.CharField(max_length=255)
    artist_name = models.CharField(max_length=255)
    played_at = models.DateTimeField(default=timezone.now)
    play_count = models.PositiveIntegerField(default=1)    
    def __str__(self):
        return f"{self.song_name} by {self.artist_name} (Played {self.play_count} times)"
