from django.conf import settings  # Import settings to reference AUTH_USER_MODEL
from django.db import models

class Song(models.Model):
    name = models.CharField(max_length=500)
    artist = models.CharField(max_length=500)
    album = models.CharField(max_length=500, blank=True)
    duration = models.IntegerField()  # Store duration of the song
    spotify = models.URLField(blank=True, null=True)  # URL to Spotify song if applicable
    preview_url = models.URLField(blank=True, null=True)  # Preview URL from Spotify
    track_id = models.CharField(max_length=255, unique=True, blank=True, null=True)  # Spotify track ID
    popularity = models.IntegerField(default=0)  # Spotify popularity metric
    album_cover_url = models.URLField(blank=True, null=True)  # URL for album cover image
    uri=models.CharField(max_length=500,blank=True,null=True)

    # def __str__(self):
    #     return f"{self.name} by {self.artist}"

class Playlist(models.Model):
    # user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='playlists')
    name = models.CharField(max_length=255)
    songs = models.ManyToManyField(Song, related_name='myplaylist')
    created_at = models.DateTimeField(auto_now_add=True)







"""0
: 
album
: 
{album_type: 'compilation', artists: Array(1), available_markets: Array(185), external_urls: {…}, href: 'https://api.spotify.com/v1/albums/7q1z5e9qcpIHAyPj4xMVaj', …}
artists
: 
Array(4)
0
: 
external_urls
: 
{spotify: 'https://open.spotify.com/artist/7MAlFea251zaprQFjwvYaL'}
href
: 
"https://api.spotify.com/v1/artists/7MAlFea251zaprQFjwvYaL"
id
: 
"7MAlFea251zaprQFjwvYaL"
name
: 
"Aishwarya Majmudar"
type
: 
"artist"
uri
: 
"spotify:artist:7MAlFea251zaprQFjwvYaL"
[[Prototype]]
: 
Object
1
: 
external_urls
: 
{spotify: 'https://open.spotify.com/artist/4F5GXhGMlllYsj1D7MufXL'}
href
: 
"https://api.spotify.com/v1/artists/4F5GXhGMlllYsj1D7MufXL"
id
: 
"4F5GXhGMlllYsj1D7MufXL"
name
: 
"Jigardan Gadhavi"
type
: 
"artist"
uri
: 
"spotify:artist:4F5GXhGMlllYsj1D7MufXL"
[[Prototype]]
: 
Object
2
: 
external_urls
: 
{spotify: 'https://open.spotify.com/artist/5T6piZxWaVBROOqKE0PgTE'}
href
: 
"https://api.spotify.com/v1/artists/5T6piZxWaVBROOqKE0PgTE"
id
: 
"5T6piZxWaVBROOqKE0PgTE"
name
: 
"Rajbha Gadhvi Gir"
type
: 
"artist"
uri
: 
"spotify:artist:5T6piZxWaVBROOqKE0PgTE"
[[Prototype]]
: 
Object
3
: 
external_urls
: 
{spotify: 'https://open.spotify.com/artist/5Z2WSteuCeTWrpT6s2Zh4C'}
href
: 
"https://api.spotify.com/v1/artists/5Z2WSteuCeTWrpT6s2Zh4C"
id
: 
"5Z2WSteuCeTWrpT6s2Zh4C"
name
: 
"Maulik Mehta"
type
: 
"artist"
uri
: 
"spotify:artist:5Z2WSteuCeTWrpT6s2Zh4C"
[[Prototype]]
: 
Object
length
: 
4
[[Prototype]]
: 
Array(0)
available_markets
: 
(185) ['AR', 'AU', 'AT', 'BE', 'BO', 'BR', 'BG', 'CA', 'CL', 'CO', 'CR', 'CY', 'CZ', 'DK', 'DO', 'DE', 'EC', 'EE', 'SV', 'FI', 'FR', 'GR', 'GT', 'HN', 'HK', 'HU', 'IS', 'IE', 'IT', 'LV', 'LT', 'LU', 'MY', 'MT', 'MX', 'NL', 'NZ', 'NI', 'NO', 'PA', 'PY', 'PE', 'PH', 'PL', 'PT', 'SG', 'SK', 'ES', 'SE', 'CH', 'TW', 'TR', 'UY', 'US', 'GB', 'AD', 'LI', 'MC', 'ID', 'JP', 'TH', 'VN', 'RO', 'IL', 'ZA', 'SA', 'AE', 'BH', 'QA', 'OM', 'KW', 'EG', 'MA', 'DZ', 'TN', 'LB', 'JO', 'PS', 'IN', 'BY', 'KZ', 'MD', 'UA', 'AL', 'BA', 'HR', 'ME', 'MK', 'RS', 'SI', 'KR', 'BD', 'PK', 'LK', 'GH', 'KE', 'NG', 'TZ', 'UG', 'AG', …]
disc_number
: 
1
duration_ms
: 
3840296
explicit
: 
false
external_ids
: 
{isrc: 'GBHNS1902905'}
external_urls
: 
{spotify: 'https://open.spotify.com/track/0LGSy1USYUk3byYLUvRipN'}
href
: 
"https://api.spotify.com/v1/tracks/0LGSy1USYUk3byYLUvRipN"
id
: 
"0LGSy1USYUk3byYLUvRipN"
is_local
: 
false
name
: 
"Rangtaali 4 Non Stop Garba"
popularity
: 
23
preview_url
: 
"https://p.scdn.co/mp3-preview/e916705779e051837b4a4131d3a89f266d09085f?cid=e6baed8ae0fa4188aba840fc9b0e680f"
track_number
: 
1
type
: 
"track"
uri
: 
"spotify:track:0LGSy1USYUk3byYLUvRipN"
[[Prototype]]
: 
Object"""