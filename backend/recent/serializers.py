from rest_framework import serializers
from .models import recentlyplayed

class LikedSongSerializer(serializers.ModelSerializer):
    class Meta:
        model = recentlyplayed
        fields = '__all__'
