import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import SideNavbar from './SideNavbar';
import './PlaylistTracks.css';
// import './TrialMusicPlayer.css';

const PlaylistTracks = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [currentPosition, setCurrentPosition] = useState(0); // Track seek position
  const [isPaused, setIsPaused] = useState(true); // Track pause state
  const [playlistCover, setPlaylistCover] = useState(null);
  const [player, setPlayer] = useState(null); // Player state
  const [deviceId, setDeviceId] = useState(null);
  const [trackDuration, setTrackDuration] = useState(0); // Track duration
  const [isLiked, setIsLiked] = useState(false);
  // const [seekInterval, setSeekInterval] = useState(null)

  const playlistId = location.state?.playlistId;
  const playlistName = location.state?.playlistName;
  const accessToken = localStorage.getItem('accessToken'); // Ensure access token is retrieved
  const formatTime = (milliseconds) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  // Fetch playlist tracks
  useEffect(() => {
    if (!playlistId) {
      navigate('/genre');
      return;
    }
    // window.location.reload();

    // refreshAndReload();
    const fetchTracks = async () => {
      setLoading(true);

      if (!accessToken) {
        console.error('Access token is missing!');
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(
          `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        setTracks(response.data.items);

        // Fetch playlist details for the cover image
        const playlistResponse = await axios.get(
          `https://api.spotify.com/v1/playlists/${playlistId}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        setPlaylistCover(playlistResponse.data.images[0]?.url); // Set playlist cover
      } catch (error) {
        console.error('Error fetching playlist tracks:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTracks();
  }, [playlistId, navigate, accessToken]);

  // Initialize Spotify SDK
  useEffect(() => {
    if (!accessToken) return;

    const scriptTag = document.getElementById('spotify-player');
    if (!scriptTag) {
      const script = document.createElement('script');
      script.id = 'spotify-player';
      script.src = 'https://sdk.scdn.co/spotify-player.js';
      script.async = true;
      document.body.appendChild(script);
    }

    window.onSpotifyWebPlaybackSDKReady = () => {
      const spotifyPlayer = new window.Spotify.Player({
        name: 'Web Playback SDK Player',
        getOAuthToken: (cb) => {
          cb(accessToken);
        },
        volume: 0.5,
      });

      setPlayer(spotifyPlayer);

      spotifyPlayer.addListener('ready', ({ device_id }) => {
        console.log('Ready with Device ID', device_id);
        setDeviceId(device_id);
      });

      spotifyPlayer.addListener('player_state_changed', (state) => {
        if (!state) return;
        setCurrentTrack(state.track_window.current_track);
        setIsPaused(state.paused);
        setCurrentPosition(state.position);
        setTrackDuration(state.duration);
      });

      spotifyPlayer.connect();
    };

    return () => {
      if (player) player.disconnect();
    };
  }, [accessToken, player]);

  // Play the selected track
  const playTrack = async (trackUri) => {
    if (deviceId && accessToken) {
      try {
        await axios.put(
          `https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`,
          {
            uris: [trackUri],
          },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
      } catch (error) {
        console.error('Error playing track:', error);
      }
    }
  };

  // Play the next track in the list
  const playNextTrack = () => {
    const currentIndex = tracks.findIndex((t) => t.track.uri === currentTrack.uri);
    if (currentIndex < tracks.length - 1) {
      const nextTrack = tracks[currentIndex + 1].track;
      playTrack(nextTrack.uri);
      setCurrentTrack(nextTrack);
    }
  };

  // Play the previous track in the list
  const playPreviousTrack = () => {
    const currentIndex = tracks.findIndex((t) => t.track.uri === currentTrack.uri);
    if (currentIndex > 0) {
      const prevTrack = tracks[currentIndex - 1].track;
      playTrack(prevTrack.uri);
      setCurrentTrack(prevTrack);
    }
  };

  // Toggle playback (pause/resume)
  const togglePlayback = () => {
    if (player) {
      player.togglePlay().catch((error) => {
        console.error('Error toggling playback:', error);
      });
    }
  };

  // Seek functionality
  const onSeek = (e) => {
    const newPosition = (e.target.value / 100) * trackDuration;
    if (player) {
      player.seek(newPosition).catch((error) => {
        console.error('Error seeking:', error);
      });
    }
  };



  // Format track duration
  const formatDuration = (ms) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = ((ms % 60000) / 1000).toFixed(0);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };
  const likeSong = (track) => {
    // Check if the track and artists data are available
    if (!track || !track.artists || track.artists.length === 0) {
      console.error("Current track or artist data is missing.");
      return; // Exit if data is missing
    }
    // console.log(track)
    const artist = track.artists[0]; // Safely access the first artist
    setIsLiked(!isLiked);

    // Check if album images and external URLs are available
    const artistImage = track.album.images && track.album.images.length > 0 ? track.album.images[0].url : '';
    const trackUrl = `https://open.spotify.com/track/${track.id}`;
    // console.log(artist)
    console.log("hello")
    console.log(trackUrl)
    const songData = {
      artist_name: artist.name,
      artist_image: artistImage,
      artist_followers: artist.followers ? artist.followers.total : 0,
      track_name: track.name,
      album_name: track.album.name,
      duration: track.duration_ms,
      track_url: trackUrl,
    };

    fetch('http://localhost:8000/api/like-song/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(songData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        console.log('Song liked:', data);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };



  try {
    useEffect(() => {
      // console.log(player['_getCurrentStateRequests']);
      let interval = null;
      if (!isPaused && player) {
        interval = setInterval(() => {
          player.getCurrentState().then((state) => {
            if (state) {
              setCurrentPosition(state.position);
            }
          });
        }, 1000);
      } else if (isPaused && interval) {
        clearInterval(interval);
      }
      return () => clearInterval(interval);
    }, [isPaused, player]);
  } catch (error) {
    console.log(error);
  }
  return (
    <div className="playlist-page">
      <SideNavbar />
      <div className="top-navbar">
        <div className="nav-left">
          <div className="logo-music">Harmony Hub</div>
        </div>
        <div className="nav-right">
          <nav>
            <ul>
              <li><Link to="/" className="nav-link">Home</Link></li>
              <li><Link to="/mood" className="nav-link">Mood</Link></li>
              <li><Link to="/profile" className="nav-link">Profile</Link></li>
            </ul>
          </nav>
        </div>
      </div>

      <div className="playlist-content">
        {playlistCover && (
          <div className="playlist-header">
            <img src={playlistCover} alt={`${playlistName} cover`} className="playlist-cover" />
            <h2 className="playlist-title">{playlistName}</h2>
          </div>
        )}

        {loading ? (
          <p>Loading tracks...</p>
        ) : (
          <div className="tracks-container">
            {tracks.length > 0 ? (
              tracks.map((track, index) => (
                <div key={index} className="track-item" onClick={() => playTrack(track.track.uri)}>
                  <img
                    src={track.track.album.images[0]?.url}
                    alt={`${track.track.name} album art`}
                    className="album-art"
                  />
                  <div className="song-track-info">
                    <p className="track-name">{track.track.name}</p>
                    <p className="track-artist">{track.track.artists.map(artist => artist.name).join(', ')}</p>
                  </div>
                  <div className="track-duration">
                    <p>{formatDuration(track.track.duration_ms)}</p>
                  </div>
                </div>
              ))
            ) : (
              <p>No tracks available.</p>
            )}
          </div>
        )}

        {/* Now Playing Box */}
        {currentTrack && (
          <div className="now-playing-box">
            <div className="container">
              <img
                src={currentTrack.album.images[0].url}
                alt="Album cover"
                className="album-cover"
              />
              <div className="track-info">
                <p className="songname">{currentTrack.name}</p>
                <p className="artistname">
                  {currentTrack.artists.map((artist) => artist.name).join(", ")}
                </p>
              </div>
            </div>
            <div className="seek-bar">
              <span className="minutes">{formatTime(currentPosition)}</span>
              <input
                type="range"
                min="0"
                max="100"
                value={(currentPosition / trackDuration) * 100}
                onChange={onSeek}
              />
              <span className="minutes">{formatTime(trackDuration)}</span>
            </div>

            <div className="controls">
              <button
                onClick={playPreviousTrack}
                className="playback-button"
              >
                <span className="simple-line-icons--control-start"></span>
              </button>

              <button className="playback-button" onClick={togglePlayback}>
                {isPaused ? (
                  <span className="simple-line-icons--control-play"></span>

                ) : (
                  <span className="simple-line-icons--control-pause"></span>

                )}
              </button>
              <button
                onClick={playNextTrack}
                className="playback-button"
              >
                <span className="simple-line-icons--control-end"></span>
              </button>
              <button
                onClick={() => likeSong(currentTrack)}
                disabled={!currentTrack || !currentTrack.artists || currentTrack.artists.length === 0}
                className="like-button"
                style={{
                  background: "none",
                  color: "white",
                  // background:"white",
                  border: "none",
                  fontSize: "40px",
                  marginLeft: "10px",
                  transition: "color 0.3s ease", // Add transition here
                }}
              >
                <span className="icon-heart"></span>
              </button>


            </div>
          </div>
        )}
        {!currentTrack && (
          <div className="now-playing-box">
            <div className="container">
              <img
                // src={currentTrack.album.images[0].url}
                alt="NO Song Selected"
                className="album-cover"
              />
              <div className="track-info">
                <p className="songname">No song played yet :(</p>
                <p className="artistname">
                  None
                </p>
              </div>
            </div>
            <div className="seek-bar">
              <span className="minutes">{formatTime(currentPosition)}</span>
              <input
                type="range"
                min="0"
                max="100"
                value={(currentPosition / trackDuration) * 100}
                onChange={onSeek}
              />
              <span className="minutes">{formatTime(trackDuration)}</span>
            </div>
            <div className="controls">
              <button
                onClick={playPreviousTrack}
                className="playback-button"
              >
                <span className="simple-line-icons--control-start"></span>
              </button>

              <button className="playback-button" onClick={togglePlayback}>
                {isPaused ? (
                  <span className="simple-line-icons--control-play"></span>
                ) : (
                  <span className="simple-line-icons--control-pause"></span>
                )}
              </button>
              <button
                onClick={playNextTrack}
                className="playback-button"
              >
                <span className="simple-line-icons--control-end"></span>
              </button>
              <button
                onClick={() => likeSong(currentTrack)}
                disabled={!currentTrack || !currentTrack.artists || currentTrack.artists.length === 0}
                className="like-button"
                style={{
                  background: "none",
                  color: "white",
                  // background:"white",
                  border: "none",
                  fontSize: "40px",
                  marginLeft: "10px",
                  transition: "color 0.3s ease", // Add transition here
                }}
              >
                <span className="icon-heart"></span>
              </button>


            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlaylistTracks;
