from django.shortcuts import render
from rest_framework import viewsets
from .serializer import UserSerializer,UserData

# Create your views here.
class UserViewSet(viewsets.ModelViewSet):
    queryset=UserData.objects.all()
    serializer_class=UserSerializer