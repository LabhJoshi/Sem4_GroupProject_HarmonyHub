from django.db import models

# Create your models here.
# models.py

class SongClick(models.Model):
    song_name = models.CharField(max_length=255)
    click_count = models.IntegerField(default=0)

    def __str__(self):
        return f'{self.song_name} - {self.click_count} clicks'
