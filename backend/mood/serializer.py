from rest_framework import serializers

class MoodInputSerializer(serializers.Serializer):
    prompt = serializers.CharField(max_length=500)
