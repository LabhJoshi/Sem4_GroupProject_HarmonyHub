from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import UserData
from django.contrib.auth.hashers import make_password,check_password

@api_view(['POST'])
def register_view(request):
    username = request.data.get('username')
    email = request.data.get('email')
    password = request.data.get('password')
    
    print(username,email,password)
    
    hashed_password=make_password(password)
    
    user=UserData(username=username,email=email,password=hashed_password)
    user.save()
    return Response({"message": "Login successful!"})

@api_view(['GET'])
def get_email(request):
    db_email=UserData.objects.values_list('email',flat=True)
    return Response({'email':list(db_email)})

@api_view(['GET'])
def get_username(request):
    db_username=UserData.objects.values_list('username',flat=True)
    return Response({'username':list(db_username)})

@api_view(['POST'])
def verify_password(request):
    username=request.data.get('username')
    password=request.data.get('password')
    
    try:
        print('im here')
        user=UserData.objects.get(username=username)
        db_password=user.password
        is_correct=check_password(password,db_password)
        return Response({'is_correct':is_correct},status=status.HTTP_200_OK)

    except UserData.DoesNotExist:
        return Response({'response':False})