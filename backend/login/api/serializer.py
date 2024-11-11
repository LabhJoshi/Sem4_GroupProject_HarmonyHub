from rest_framework.serializers import ModelSerializer
from ..models import UserData

class UserSerializer(ModelSerializer):
    class Meta:
        model=UserData
        fields=('username','email','password')