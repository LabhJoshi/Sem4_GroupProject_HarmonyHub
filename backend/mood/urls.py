from django.urls import path
from .views import GetSongsView

urlpatterns = [
    path('get-songs/', GetSongsView.as_view(), name='get-songs'),
]

# /mood/get-songs 