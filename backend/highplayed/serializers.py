# serializers.py
from rest_framework import serializers
from .models import SongClick

class SongClickSerializer(serializers.ModelSerializer):
    class Meta:
        model = SongClick
        fields = ['song_name', 'click_count']
