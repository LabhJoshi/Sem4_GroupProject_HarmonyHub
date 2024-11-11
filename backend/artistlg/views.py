from django.shortcuts import render

# Create your views here.
import requests
from django.http import JsonResponse

# Spotify API credentials
def get_spotify_access_token():
    client_id = '2582a34021a84a2c91ff63c318f7a0d5'
    client_secret = 'd7ccb170010842029e1b5a804c9fe17b'
    auth_url = 'https://accounts.spotify.com/api/token'
    auth_response = requests.post(auth_url, data={
        'grant_type': 'client_credentials',
        'client_id': client_id,
        'client_secret': client_secret,
    })
    if auth_response.status_code == 200:
        auth_response_data = auth_response.json()
        return auth_response_data['access_token']
    else:
        return None

# Fetch globally popular tracks and extract artist IDs
def get_global_top_tracks(access_token):
    headers = {
        'Authorization': f'Bearer {access_token}'
    }
    url = "https://api.spotify.com/v1/playlists/37i9dQZEVXbMDoHDwVN2tF/tracks"  # Spotify Global Top 50 playlist
    response = requests.get(url, headers=headers)

    if response.status_code == 200:
        data = response.json()
        artist_list = {track['track']['artists'][0]['id'] for track in data['items'] if track['track']['artists']}
        return list(artist_list)
    else:
        return []

# Fetch popular Bollywood artists in India
def get_popular_artists(access_token, genre='Bollywood'):
    headers = {
        'Authorization': f'Bearer {access_token}'
    }
    url = f"https://api.spotify.com/v1/search?q=genre:{genre}&type=artist&market=IN&limit=50"
    response = requests.get(url, headers=headers)
    if response.status_code == 200:
        data = response.json()
        artist_list = {artist['id'] for artist in data['artists']['items']}
        return list(artist_list)
    else:
        return []

# Fetch artist details using artist ID
def fetch_artist_details(artist_id, headers):
    url = f"https://api.spotify.com/v1/artists/{artist_id}"
    response = requests.get(url, headers=headers)
    if response.status_code == 200:
        return response.json()
    else:
        return {}

# Fetch artist data based on type (Global or Bollywood)
def get_artists(access_token, genre='Bollywood', global_artists=False):
    headers = {
        'Authorization': f'Bearer {access_token}'
    }
    if global_artists:
        artist_ids = get_global_top_tracks(access_token)
    else:
        artist_ids = get_popular_artists(access_token, genre)

    if not artist_ids:
        return []

    artists_data = []
    for artist_id in artist_ids:
        artist_data = fetch_artist_details(artist_id, headers)
        if artist_data:
            artists_data.append({
                'id': artist_id,
                'name': artist_data.get('name'),
                'image': artist_data.get('images', [{}])[0].get('url'),
                'followers': artist_data.get('followers', {}).get('total', 0),
                'popularity': artist_data.get('popularity', 0)
            })

    # Sort artists by popularity
    sorted_artists = sorted(artists_data, key=lambda artist: artist['popularity'], reverse=True)[:7]  # Get top 7 artists

    return sorted_artists

# View to get Indian (Bollywood) artists
def get_indian_artists(request):
    access_token = get_spotify_access_token()
    if access_token:
        artists = get_artists(access_token, genre='Bollywood', global_artists=False)
        return JsonResponse(artists, safe=False)
    else:
        return JsonResponse({'error': 'Unable to retrieve access token'}, status=500)

# View to get Global artists
def get_global_artists(request):
    access_token = get_spotify_access_token()
    if access_token:
        artists = get_artists(access_token, global_artists=True)
        return JsonResponse(artists, safe=False)
    else:
        return JsonResponse({'error': 'Unable to retrieve access token'}, status=500)

