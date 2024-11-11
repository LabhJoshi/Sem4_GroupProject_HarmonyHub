from django.contrib import admin

# Register your models here.
# admin.py
from django.contrib import admin
from .models import SongClick

# Register the SongClick model
@admin.register(SongClick)
class SongClickAdmin(admin.ModelAdmin):
    list_display = ('song_name', 'click_count')  # Customize fields shown in admin
    search_fields = ('song_name',)  # Add search functionality for song names
