import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SideNavbar from './SideNavbar';
import { Link } from "react-router-dom"; 
import './SongSearch.css';

// Emoji modal component
const EmojiModal = ({ isOpen, onClose, onSelectEmoji }) => {
  const emojis = {
    "😊": "happy", "😀": "happy", "😆": "happy", "😂": "happy", 
    "😢": "sad", "😔": "sad", "😓": "sad", "🙃": "sad", "😒": "sad", 
    "😡": "angry", "🤬": "angry", "😠": "angry", 
    "😍": "love", "😘": "love", "🥰": "love", "😙": "love",
    "😎": "cool", "🤑": "cool", "💸": "cool", 
    "😭": "breakup", "☠️": "breakup", "❤️‍🩹": "breakup", "💔": "breakup"
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <h3>Select your mood:</h3>
        <div className="emoji-grid">
          {Object.keys(emojis).map(emoji => (
            <span
              key={emoji}
              className="emoji"
              onClick={() => onSelectEmoji(emoji)}
            >
              {emoji}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

// Main SongSearch component
const SongSearch = () => {
  const [prompt, setPrompt] = useState('');
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(false);
  console.log(loading)
  const [error, setError] = useState(null);
  console.log(error)
  const [deviceId, setDeviceId] = useState(null);
  const [currentSongId, setCurrentSongId] = useState(null); 
  const [isPlaying, setIsPlaying] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); // Emoji modal state
  const [selectedEmoji, setSelectedEmoji] = useState(null); // Selected emoji state
  const accessToken = localStorage.getItem('accessToken');  
  const djangoApiUrl = 'http://localhost:8000/mood/get-songs/'; 

  useEffect(() => {
    const fetchDeviceId = async () => {
      const scriptTag = document.getElementById("spotify-player");
      if (!scriptTag) {
        const script = document.createElement("script");
        script.id = "spotify-player";
        script.src = "https://sdk.scdn.co/spotify-player.js";
        script.async = true;
        document.body.appendChild(script);
      }

      window.onSpotifyWebPlaybackSDKReady = () => {
        const spotifyPlayer = new window.Spotify.Player({
          name: "Web Playback SDK Player",
          getOAuthToken: (cb) => {
            cb(accessToken);
          },
        });

        spotifyPlayer.addListener("ready", ({ device_id }) => {
          setDeviceId(device_id);
          console.log("Spotify Player is ready with device id:", device_id);
        });

        spotifyPlayer.connect();
      };
    };

    fetchDeviceId();
  }, [accessToken]);

  const searchTrack = async (query) => {
    try {
      const response = await axios.post(djangoApiUrl, { prompt: query }, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });

      const tracks = response.data;
      if (tracks.length > 0) {
        setSongs(tracks);
      } else {
        console.log('No tracks found.');
        setError('No tracks found.');
      }
    } catch (error) {
      console.error('Error fetching tracks:', error);
      setError('Error fetching tracks.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await searchTrack(prompt);
    } catch (error) {
      setError('Failed to fetch songs. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEmojiSelect = (emoji) => {
    setSelectedEmoji(emoji);
    const mood = emoji ? emoji : '';
    setPrompt(mood); // Set the mood as the search prompt
    setIsModalOpen(false);
    searchTrack(mood); // Trigger search based on mood
  };

  const togglePlayPause = async (trackId) => {
    if (currentSongId === trackId && isPlaying) {
      await pauseTrack();
    } else {
      await playTrack(trackId);
    }
  };

  const playTrack = async (trackId) => {
    if (deviceId && accessToken) {
      try {
        const trackUriFull = `spotify:track:${trackId}`;
        await axios.put(
          `https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`,
          {
            uris: [trackUriFull],
          },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        console.log(`Playing track: ${trackUriFull}`);
        setCurrentSongId(trackId); 
        setIsPlaying(true); 
      } catch (error) {
        console.error('Error playing track:', error.response ? error.response.data : error.message);
      }
    } else {
      console.error('Device ID or access token not set.');
    }
  };

  const pauseTrack = async () => {
    if (deviceId && accessToken) {
      try {
        await axios.put(
          `https://api.spotify.com/v1/me/player/pause?device_id=${deviceId}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        console.log(`Paused track: ${currentSongId}`);
        setIsPlaying(false); 
      } catch (error) {
        console.error('Error pausing track:', error.response ? error.response.data : error.message);
      }
    }
  };
  console.log(songs)
  return (
    <div className="song-search-container">
      <SideNavbar/>
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

      <div className="songs-container">
        

        {selectedEmoji && <p>You selected: {selectedEmoji}</p>}

        <EmojiModal 
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSelectEmoji={handleEmojiSelect}
        />

        <ul className="songs-list">
          {songs.map((song, index) => (
            <li key={index} className="song-item">
              
              {song.title} by {song.artist}
              <button onClick={() => togglePlayPause(song.id)} className="pl">
                {currentSongId === song.id && isPlaying ? (
                  <i className="fas fa-pause"></i> 
                ) : (
                  <i className="fas fa-play"></i> 
                )}
              </button>
            </li>
          ))}
        </ul>
        <hr />
        <form onSubmit={handleSubmit} className="song-search-form">
          
          <button type="submit" onClick={() => setIsModalOpen(true)} className="open-modal-button">
          Select Mood
        </button>
          
        </form>
      </div>
    </div>
  );
};

export default SongSearch;






//new code
