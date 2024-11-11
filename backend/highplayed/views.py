from django.shortcuts import render

# Create your views here.
# views.py
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view
from .models import SongClick
from .serializers import SongClickSerializer

@api_view(['POST'])
def save_click_data(request):
    serializer = SongClickSerializer(data=request.data)
    if serializer.is_valid():
        # Check if the song already exists
        song_click, created = SongClick.objects.get_or_create(song_name=request.data['song_name'])
        # Update the click count
        song_click.click_count += request.data['click_count']
        song_click.save()
        return Response({"message": "Data saved successfully"}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def get_most_viewed_song(request):
    most_viewed_song = SongClick.objects.order_by('-click_count').first()
    if most_viewed_song:
        serializer = SongClickSerializer(most_viewed_song)
        return Response(serializer.data, status=status.HTTP_200_OK)
    return Response({"message": "No songs found"}, status=status.HTTP_404_NOT_FOUND)


