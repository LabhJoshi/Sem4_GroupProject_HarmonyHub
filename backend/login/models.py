from django.db import models

# Create your models here.
class UserData(models.Model):
    username=models.CharField(max_length=100)
    email=models.EmailField()
    password=models.CharField(max_length=16)