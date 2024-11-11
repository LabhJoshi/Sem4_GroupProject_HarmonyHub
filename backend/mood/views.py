from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
import requests
from .serializer import MoodInputSerializer
from .mood_mapping import MOOD_MAPPINGS
from auths.models import TokenTable
import emoji
from collections import Counter


class GetSongsView(APIView):
    def post(self, request):
        authorization_header = request.headers.get("Authorization")
        if not authorization_header:
            return Response({"error": "Authorization header is required"}, status=status.HTTP_400_BAD_REQUEST)        
        # Extract the token (assuming it's in the format "Bearer <token>")
        try:
            SPOTIFY_TOKEN = authorization_header.split(" ")[1]
        except IndexError:
            return Response({"error": "Invalid token format"}, status=status.HTTP_400_BAD_REQUEST)
        # print(f'Spotify_Token:{SPOTIFY_TOKEN}')
        serializer = MoodInputSerializer(data=request.data)
        if serializer.is_valid():
            user_input = serializer.validated_data["prompt"]
            mood = self.detect_mood_by_emoji(user_input)
            print(mood)
            mood_attributes = MOOD_MAPPINGS.get(
                mood, MOOD_MAPPINGS["happy"]
            )  # Default to 'happy' if mood not found
            genre = self.detect_genre(user_input)

            headers = {"Authorization": f"Bearer {SPOTIFY_TOKEN}"}
            
            # recent_tracks = ["1YAkguluz9Tchon3sa1QWA","7cPjdagbwxLbT76i62jSmf"]

            data = {
                "limit": 10,
                "target_valence": mood_attributes["valence"],
                "target_energy": mood_attributes["energy"],
                "target_danceability": mood_attributes["danceability"],
                "target_acousticness": mood_attributes["acousticness"],
                "target_instrumentalness": mood_attributes["instrumentalness"],
                "target_tempo": mood_attributes["tempo"],
                "seed_genres": genre,
                # "seed_tracks": recent_tracks,
            }

            try:
                response = requests.get(
                    "https://api.spotify.com/v1/recommendations",
                    headers=headers,
                    params=data,
                )
                print(response)
                response_data = response.json()
                # print(response_data)
                songs = [
                    {
                        "title": track["name"],
                        "artist": track["artists"][0]["name"],
                        "preview_url": track["preview_url"],
                        "release_date": track["album"]["release_date"],
                        "id": track["id"],
                    }
                    for track in response_data.get("tracks", [])
                    # if int(track["album"]["release_date"][:4]) >= 2015
                ]
                print(len(songs))
                return Response(songs, status=status.HTTP_200_OK)
            except Exception as e:
                return Response(
                    {"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def detect_mood_by_emoji(self, prompt):
        # lower_prompt = prompt.lower()
        user_prompt = prompt
        emoji_to_emotion = {
            "😊": "happy","😀": "happy","😆": "happy","😂": "happy","😢": "sad","😔": "sad","😓": "sad",
            "🙃": "sad","😒": "sad","😔": "sad","😟": "sad","😡": "angry","🤬": "angry","😠": "angry",
            "😍": "love","😘": "love","🥰": "love","😙": "love","😗": "love","🤗": "love","💘": "love",
            "💝": "love","💖": "love","💗": "love","💓": "love","❣️": "love","💞": "love","❤️": "love",
            "💌": "love","😻": "love","💕": "love","😎": "cool","🤑": "cool","💸": "cool","💵": "cool",
            "💹": "cool","😭": "breakup","☠️": "breakup","❤️‍🩹": "breakup","💔": "breakup",
        }
        emotion_count=Counter()
        
        for mood in MOOD_MAPPINGS.keys():
            for char in user_prompt:
                if char in emoji_to_emotion:
                    emotion_count[emoji_to_emotion[char]]+=1
            if emotion_count:
                mood=emotion_count.most_common(1)[0][0]
                return mood
            else:
                return "happy"  # Default mood

    def detect_genre(self, prompt):
        # if (
        #     "hindi" in prompt.lower()
        #     or "bollywood" in prompt.lower()
        #     or "indian" in prompt.lower()
        # ):
        #     return "indie"
        return "indian"
