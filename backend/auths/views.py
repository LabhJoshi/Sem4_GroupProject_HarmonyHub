from django.shortcuts import render
import base64
import requests
from django.http import JsonResponse
from django.conf import settings
from django.shortcuts import redirect
from django.conf import settings
from .models import TokenTable


def callback(request):
    token_info=None
    code = request.GET.get('code')
    token_url = 'https://accounts.spotify.com/api/token'
    client_id = 'e6baed8ae0fa4188aba840fc9b0e680f'
    client_secret = '85321bdc7b724dc9abf3eb8423518228'
    redirect_uri = 'http://127.0.0.1:8000/spotify/callback/'

    headers = {
        'Authorization': f'Basic {base64.b64encode(f"{client_id}:{client_secret}".encode()).decode()}',
        'Content-Type': 'application/x-www-form-urlencoded'
    }

    data = {
        'grant_type': 'authorization_code',
        'code': code,
        'redirect_uri': redirect_uri
    }

    response = requests.post(token_url, headers=headers, data=data)
    if response.status_code == 200:
        token_info = response.json()
        TokenTable.objects.update_or_create(
            defaults={
                'access_token': token_info['access_token'],
                'refresh_token': token_info['refresh_token']
            }
        )
        return redirect(f"http://localhost:3000/login?token={token_info['access_token']}")
    else:
        return JsonResponse({"error": "Failed to get token"}, status=response.status_code)


# Another view to access the stored token_info
# def get_token_info(request):
#     token_info=request.session.get('token_info')
#     if token_info:
#         return JsonResponse(token_info)
#     else:
#         return JsonResponse({"error": "Token info not found"}, status=404)


def authorize(request):
    client_id = 'e6baed8ae0fa4188aba840fc9b0e680f'   
    redirect_uri = 'http://127.0.0.1:8000/spotify/callback/'

    scope = 'user-library-read streaming user-read-playback-state user-modify-playback-state'  # Example scope, adjust as needed
    response_type = 'code'
    auth_url = (
        f'https://accounts.spotify.com/authorize'
        f'?response_type={response_type}'
        f'&client_id={client_id}'
        f'&redirect_uri={redirect_uri}'
        f'&scope={scope}'
    )
    return redirect(auth_url)