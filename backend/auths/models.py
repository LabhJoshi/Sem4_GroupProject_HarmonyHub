from django.db import models

# Create your models here.
class TokenTable(models.Model):
    access_token = models.CharField(max_length=255)
    refresh_token = models.CharField(max_length=255)

    def __str__(self):
        return "Spotify Token"