from django.contrib import admin

# Register your models here.
from .models import recentlyplayed

@admin.register(recentlyplayed)
class LoginAdmin(admin.ModelAdmin):
    list_display = ('song_name', 'artist_name','played_at')
    search_fields = ('song_name', 'artist_name','played_at')