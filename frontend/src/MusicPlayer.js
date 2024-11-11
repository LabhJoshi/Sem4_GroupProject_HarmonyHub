import React, { useState, useEffect } from "react";
import { useCallback } from "react";
import { useLocation, Link } from "react-router-dom"; // Import useLocation to access route state
import axios from "axios";
import './App.css';
import SideNavbar from "./SideNavbar";
import AddToPlaylistModal from './AddToPlaylistModal';
// import './MusicPlayer.css';
import "./TrialMusicPlayer.css";
import GenreBox from "./GenreBox";
import Slider from 'react-slick'; // Make sure to install this package
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import 'simple-line-icons/css/simple-line-icons.css';

// import Carousel from "./carousal";
// Format time helper function
const formatTime = (milliseconds) => {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;
};
let i = 1;

const MusicPlayer = () => {
  const location = useLocation(); // Get the location object
  const queryParams = new URLSearchParams(location.search);
  const queryToken = queryParams.get("token");

  // Use query token if available, fallback to localStorage if not.
  const accessToken = localStorage.getItem("accessToken");

  const [player, setPlayer] = useState(null);
  const [deviceId, setDeviceId] = useState(null);
  const [tracks, setTracks] = useState([]);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPaused, setIsPaused] = useState(true);
  const [currentPosition, setCurrentPosition] = useState(0);
  const [trackDuration, setTrackDuration] = useState(0);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  //   changes made
  const [searchQuery, setSearchQuery] = useState('');
  const [submittedQuery, setSubmittedQuery] = useState('');
  const [isLiked, setIsLiked] = useState(false);
  const [liked, setLiked] = useState(false);


  const [selectedPlaylist, setSelectedPlaylist] = useState(null); // For displaying playlist songs
  const [isFromPlaylist, setIsFromPlaylist] = useState(false);

  // Modal state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [songToAdd, setSongToAdd] = useState(null);


  //   handle search and handle key down 

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      setSubmittedQuery(searchQuery);
      console.log(submittedQuery);  //  console                                                                                                                                                                                                                                                                                             
    }
  };

  useEffect(() => {
    if (queryToken) {
      // Store the token in localStorage for future use
      localStorage.setItem("accessToken", queryToken);
    }

    if (!accessToken) {
      console.error("No access token available.");
      return;
    }

    // Load Spotify's Web Playback SDK
    const scriptTag = document.getElementById("spotify-player");
    if (!scriptTag) {
      const script = document.createElement("script");
      script.id = "spotify-player";
      script.src = "https://sdk.scdn.co/spotify-player.js";
      script.async = true;
      document.body.appendChild(script);
    }

    // Setup Spotify Web Playback SDK
    window.onSpotifyWebPlaybackSDKReady = () => {
      const spotifyPlayer = new window.Spotify.Player({
        name: "Web Playback SDK Player",
        getOAuthToken: (cb) => {
          cb(accessToken);
        },
        volume: 0.5,
      });

      setPlayer(spotifyPlayer);

      spotifyPlayer.addListener("ready", ({ device_id }) => {
        console.log("Ready with Device ID", device_id);
        setDeviceId(device_id);
      });

      spotifyPlayer.addListener("not_ready", ({ device_id }) => {
        console.log("Device ID has gone offline", device_id);
      });

      spotifyPlayer.addListener("player_state_changed", (state) => {
        if (!state) return;
        setCurrentTrack(state.track_window.current_track);
        setIsPaused(state.paused);
        setCurrentPosition(state.position);
        setTrackDuration(state.duration);
      });

      spotifyPlayer.addListener("initialization_error", ({ message }) => {
        console.error("Failed to initialize", message);
      });

      spotifyPlayer.addListener("authentication_error", ({ message }) => {
        console.error("Failed to authenticate", message);
      });

      spotifyPlayer.addListener("account_error", ({ message }) => {
        console.error("Account issue", message);
      });

      spotifyPlayer.connect().then((success) => {
        if (success) {
          console.log(
            "The Web Playback SDK successfully connected to Spotify!"
          );
        } else {
          console.error("Failed to connect to Spotify");
        }
      });
    };

    return () => {
      if (player) {
        player.disconnect();
      }
    };
  }, [accessToken, player, queryToken]);

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

  const fetchTracks = useCallback(async () => {
    try {
      const response = await axios.get("https://api.spotify.com/v1/search", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        params: {
          q: `${searchQuery}`,
          type: "track",
          limit: 7,
        },
      });
      setTracks(response.data.tracks.items);
      setCurrentTrackIndex(0);
    } catch (error) {
      console.error("Error fetching tracks:", error);
    }
  }, [accessToken, searchQuery]); // Add accessToken and searchQuery as dependencies

  // useEffect(() => {
  //     if (searchQuery) {
  //         fetchTracks(searchQuery); // Fetch tracks whenever searchQuery changes
  //     }
  // });

  const playTrack = async (trackUri, track) => {
    try {
      if (deviceId) {
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
        saveLikedSong(track);
      } else {
        console.error("Device ID is not set. Cannot play track.");
      }
      console.log(deviceId);
    } catch (error) {
      console.error("Error playing track:", error);
    }
  };

  const togglePlayback = () => {
    if (player) {
      player.togglePlay().catch((error) => {
        console.error("Error toggling playback:", error);
      });
    }
  };



  const onSeek = (e) => {
    const newPosition = (e.target.value / 100) * trackDuration;
    if (player) {
      player.seek(newPosition).catch((error) => {
        console.error("Error seeking:", error);
      });
    }
  };

  // const playNextTrack = () => {
  //   if (currentTrackIndex < tracks.length - 1) {
  //     const nextIndex = currentTrackIndex + 1;
  //     setCurrentTrackIndex(nextIndex);
  //     playTrack(tracks[nextIndex].uri);
  //   } else {
  //     console.log("No next track available.");
  //   }
  // };

  // const playPreviousTrack = () => {
  //   if (currentTrackIndex > 0) {
  //     const prevIndex = currentTrackIndex - 1;
  //     setCurrentTrackIndex(prevIndex);
  //     playTrack(tracks[prevIndex].uri);
  //   } else {
  //     console.log("No previous track available.");
  //   }
  // };

  const playNextTrack = async () => {
    if (currentTrackIndex < tracks.length - 1) {
      const nextIndex = currentTrackIndex + i;
      const nextTrack = tracks[nextIndex];
      i = i + 1;
      await playTrack(nextTrack.uri, nextTrack);  // Your function to play the track

      const updatedTracks = [...tracks];
      updatedTracks.splice(currentTrackIndex, 1);  // Remove current track
      updatedTracks.unshift(nextTrack);  // Add next track to the front
      setTracks(updatedTracks);

      // // Update click count for the next track
      setTrackClickCount((prevState) => ({
        ...prevState,
        [nextTrack.name]: (prevState[nextTrack.name] || 0) + 1,
      }));

      setCurrentTrackIndex(nextIndex);  // Update the current track index
      // setCurrentTrackIndex(currentTrackInde);  // Update the current track index
    } else {
      console.log("No next track available.");
    }
  };

  const playPreviousTrack = async () => {
    let j = 1;
    if (currentTrackIndex >= 0) {
      // const prevIndex = currentTrackIndex - 1;
      const prevIndex = currentTrackIndex + j;
      const prevTrack = tracks[prevIndex];
      // const prevTrack = tracks[currentTrackIndex];
      j = j + 1;
      await playTrack(prevTrack.uri, prevTrack);  // Your function to play the track

      // const updatedTracks = [...tracks];
      // updatedTracks.splice(currentTrackIndex, 1);  // Remove current track
      // updatedTracks.unshift(prevTrack);  // Add previous track to the front
      // setTracks(updatedTracks);

      // Update click count for the previous track
      // setTrackClickCount((prevState) => ({
      //     ...prevState,
      //     [prevTrack.name]: (prevState[prevTrack.name] || 0) + 1,
      // }));

      // setCurrentTrackIndex(prevIndex);  // Update the current track index
    } else {
      console.log("No previous track available.");
    }
  };


  const saveLikedSong = async (track) => {
    try {
      await axios.post("http://localhost:8000/recent/like/", {
        song_name: track.name,
        artist_name: track.artists.map((artist) => artist.name).join(", "),
      });
      console.log("Song liked successfully");
    } catch (error) {
      console.error("Error liking song:", error);
    }
  };

  const [savedSongs, setSavedSongs] = useState([]);
  const fetchSavedSongs = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/recent/get-liked-songs/"
      );
      // console.log(response.data)
      setSavedSongs(response.data);
    } catch (error) {
      console.error("Error fetching saved songs:", error);
    }
  };

  const recentTracks = useCallback(async () => {
    try {
      const songRequests = savedSongs.map((song) =>
        axios.get("https://api.spotify.com/v1/search", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          params: {
            q: `${song.song_name} ${song.artist_name}`,
            type: "track",
            limit: 1,
          },
        })
      );

      // Execute all requests and wait for all responses
      const responses = await Promise.all(songRequests);

      // Extract tracks from all responses
      const tracks = responses.map((response) => response.data.tracks.items[0]);

      // Update state with the fetched tracks
      setTracks(tracks);

      // Reset the current track index to the first track
      setCurrentTrackIndex(0);
    } catch (error) {
      console.error("Error fetching tracks:", error);
    }
  }, [accessToken, savedSongs]);

  const [name, heading] = useState(""); // state for heading

  useEffect(() => {
    if (searchQuery) {
      heading("Searched Items"); // Set heading based on the search query
      fetchTracks(searchQuery); // Fetch tracks whenever searchQuery changes
    }
    else if (selectedPlaylist) {
      // If a playlist is selected, fetch its songs
      fetchPlaylistTracks(selectedPlaylist.id);
      heading(selectedPlaylist.name);
    }
    else {
      heading("Recently Played");
      recentTracks(); // Fetch recently played tracks if no search query
    }
  }, [searchQuery, fetchTracks, recentTracks]);

  useEffect(() => {
    fetchSavedSongs();
  }, [currentTrack]); // Empty array ensures this runs only once on mount



  const fetchPlaylistTracks = async (playlistId) => {
    try {
      const response = await axios.get(`http://localhost:8000/myplaylist/${playlistId}/songs/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });
      const tracks = response.data.tracks;

      setTracks(tracks);
      // console.log(tracks[0].uri);
      // console.log(typeof tracks);
      setCurrentTrackIndex(0);
    } catch (error) {
      console.error("Error fetching playlist tracks:", error);
    }
  };


  // const handlePlayClick = (index, track) => {
  //     setCurrentTrackIndex(index);
  //     playTrack(track.uri, track);
  // };
  const [trackClickCount, setTrackClickCount] = useState({});
  // const handlePlayClick = async (index, track) => {
  //   await playTrack(track.uri, track);

  //   const updatedTracks = [...tracks];
  //   updatedTracks.splice(index, 1);
  //   updatedTracks.unshift(track);
  //   setTracks(updatedTracks);

  //   await fetchSavedSongs();
  // };
  const handlePlayClick = async (index, track) => {
    await playTrack(track.uri, track);  // Your function to play the track

    const updatedTracks = [...tracks];
    updatedTracks.splice(index, 1);
    updatedTracks.unshift(track);
    setTracks(updatedTracks);

    // Update click count for the track
    setTrackClickCount((prevState) => ({
      ...prevState,
      [track.name]: (prevState[track.name] || 0) + 1,
    }));

    await fetchSavedSongs();  // Your function to fetch saved songs
  };
  const anotherFunction = async (trackName, clickCount) => {
    console.log(`Track: ${trackName} has been clicked ${clickCount} times.`);

    // Send the track name and click count to the Django backend
    try {
      await axios.post('http://localhost:8000/highlyplayed/save-click-data/', {
        song_name: trackName,
        click_count: clickCount,
      });
      console.log('Data saved successfully.');
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };
  const handlePlaybackClick = (index, track) => {
    handlePlayClick(index, track);
    // Get the click count for the track after updating
    const clickCount = trackClickCount[track.name] || 0;
    anotherFunction(track.name, clickCount + 1);  // Pass the updated count
  };


  // carousal

  //most viewed by user
  const [mostViewedSong, setMostViewedSong] = useState(null);
  const [savedSongs1, setSavedSongs1] = useState([]);

  useEffect(() => {
    // Fetch the most viewed song from Django backend
    const fetchMostViewedSong = async () => {
      try {
        const response = await axios.get("http://localhost:8000/highlyplayed/most-viewed/");
        setMostViewedSong(response.data); // Save the most viewed song in state
        console.log("Most viewed song fetched from backend:", response.data);
      } catch (error) {
        console.error("Error fetching most viewed song:", error);
      }
    };

    fetchMostViewedSong();
  }, []);

  useEffect(() => {
    if (!mostViewedSong) return;

    // Perform Spotify API search for the most viewed song
    const searchSpotifyForSong = async () => {
      try {
        const response = await axios.get("https://api.spotify.com/v1/search", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          params: {
            q: `${mostViewedSong.song_name}`, // You can include artist_name here if available
            type: "track",
            limit: 1,
          },
        });

        // Log the result and handle the response from Spotify
        console.log("Spotify API search result for the most viewed song:", response.data);
        setSavedSongs1([response.data.tracks.items[0]]); // You can store the track in your state
      } catch (error) {
        console.error("Error searching Spotify API:", error);
      }
    };

    searchSpotifyForSong();
  }, [mostViewedSong, accessToken]);
  // end most viewed by user
  // top song bollywood
  const [topSong2, setTopSong2] = useState(null);
  const [error, setError] = useState(null);


  // Handle adding song to playlist
  const openAddModal = (track) => {
    setSongToAdd(track);
    setIsAddModalOpen(true);
  };

  const closeAddModal = () => {
    setIsAddModalOpen(false);
    setSongToAdd(null);
  };


  useEffect(() => {
    const fetchTopBollywoodSong = async () => {
      try {
        const response = await axios.get('https://api.spotify.com/v1/search', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          params: {
            q: 'Bollywood trending most viewed',
            type: 'track',
            limit: 1, // Fetch top 10 tracks related to Bollywood
            market: 'IN' // Target India market
          },
        });

        const songs = response.data.tracks.items;

        // Find the song with the highest popularity score
        if (songs.length > 0) {
          const mostPopularSong = songs.reduce((prev, current) =>
            prev.popularity > current.popularity ? prev : current
          );
          setTopSong2(mostPopularSong);
        }
      } catch (err) {
        setError('Failed to fetch top Bollywood song');
      }
    };

    if (accessToken) {
      fetchTopBollywoodSong();
    }
  }, [accessToken]);

  if (error) return <p>{error}</p>;
  // end top song bollywood

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true, // Enables autoplay
    autoplaySpeed: 2000, // Time in milliseconds between slides
  };

  // caorusal end
  // like artist like song starts
  const likeSong = (track) => {
    // Check if the track and artists data are available
    if (!track || !track.artists || track.artists.length === 0) {
      console.error("Current track or artist data is missing.");
      return; // Exit if data is missing
    }
    // console.log(track)
    const artist = track.artists[0]; // Safely access the first artist
    setIsLiked(!isLiked);
    setLiked(!liked);
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


  // like song like artist ends
  return (
    <>
      <div style={{ display: "flex" }}>
        <div className="side-navbar">
          <SideNavbar />
        </div>
        <div className="main-content">
          <div className="top-navbar">
            <div className="nav-left">
              <div className="logo-music">Harmony Hub</div>
            </div>

            <div className="nav-search">
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                onKeyDown={handleKeyDown}
                placeholder="Search for a song..."
              />
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
        </div>
      </div>
      {/* carousal */}
      <div
        style={{
          marginLeft: '-532px',
          background: 'linear-gradient(178deg, rgba(0, 0, 0, 0.8) 50%, rgba(106, 13, 173, 0.8)) 40%',
          width: '930px',
          height: '250px',
          borderRadius: '10px',
          position: 'fixed',
          top: '75px',
          paddingLeft: '0px',
          boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
          overflow: 'hidden',
        }}
      >
        <Slider {...settings}>
          {/* Slide 1 */}
          <div className="carbox1">
            {savedSongs1.length > 0 && (
              <div >
                {savedSongs1.map((song) => (
                  <div key={song.id} style={{ display: 'flex', alignItems: 'center' }}>
                    <img
                      src={song.album.images[0].url}
                      alt={song.name}
                      style={{
                        width: '160px',
                        height: '160px',
                        marginLeft: '40px',
                        // marginBottom : '50px',
                        border: '1px solid white',
                        marginTop: '40px',
                        borderRadius: '8px', // Rounded corners for the image
                      }}
                    />
                    <div style={{
                      marginLeft: '100px',
                      borderRadius: '8px',
                    }} className="carbox">
                      <p style={{
                        color: 'white',
                        fontSize: '60px',
                        fontWeight: 'bold', // Bold font
                        letterSpacing: '1.5px', // Adds spacing between letters
                        lineHeight: '1.2', // Adjusts the space between lines
                        marginBottom: '10px', // Adds space after song title
                        textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)', // Adds subtle shadow
                      }}>
                        {song.name}
                      </p>
                      <p
                        style={{
                          color: 'white',
                          fontSize: '12px',
                          fontWeight: 'bold', // Bold font for artist name
                          letterSpacing: '1.2px',
                          lineHeight: '1.1',
                          marginTop: '0',
                        }}
                      >
                        {song.artists[0].name}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Slide 2 */}
          <div className="carbox2">
            {topSong2 && (
              <div style={{ display: 'flex', alignItems: 'center' }} >
                <img
                  src={topSong2.album.images[0]?.url || 'fallback_image_url.png'}
                  alt={topSong2.name || 'Song'}
                  style={{
                    width: '160px',
                    height: '160px',
                    marginLeft: '40px',
                    // marginBottom : '50px',
                    border: '1px solid white',
                    marginTop: '40px',
                    borderRadius: '8px', // Rounded corners for the image
                  }}
                />
                <div style={{ marginLeft: '100px', borderRadius: '8px' }}>
                  <p
                    style={{
                      color: 'white',
                      fontSize: '60px',
                      fontWeight: 'bold', // Bold font
                      letterSpacing: '1.5px', // Adds spacing between letters
                      lineHeight: '1.2', // Adjusts the space between lines
                      marginBottom: '10px', // Adds space after song title
                      textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)', // Adds subtle shadow
                    }}
                  >
                    {topSong2.name || 'Unknown Title'}
                  </p>
                  <p
                    style={{
                      color: 'white',
                      fontSize: '12px',
                      fontWeight: 'bold',
                      letterSpacing: '1.2px',
                      lineHeight: '1.1',
                      marginTop: '0',
                    }}
                  >
                    {topSong2.artists[0]?.name || 'Unknown Artist'}
                  </p>
                </div>
              </div>
            )}
          </div>
        </Slider>
      </div>


      {/* carousal end */}
      <div className="saved-songs">
        <h2
          style={{
            "color": "white",
            "marginLeft": "80px",
            "fontSize": "40px",
            "marginBottom": "7px",
          }}
        >
          {name}
        </h2>

        {/* <div className="track-list-container">
          <ul className="track-list">
            {tracks.map((track, index) => (
              <li key={track.id} className="track-list-item">
                <img
                  src={track.album.images[0].url}
                  alt="Album cover"
                  style={{
                    height: "50px",
                    width: "50px",
                    marginLeft: "10px",
                    borderRadius: "5px",
                  }}
                />

                <div className="track-fo">
                  <span className="track-name">{track.name}</span>
                  <span className="artist-name">{track.artists[0].name}</span>
                </div>
                
                <span
                  className="minutes"
                  style={{ "marginLeft": "0px", "marginBottom": "10px","position" : "relative" }}
                >
                  {formatTime(track.duration_ms)}
                </span>

                <button
                  onClick={() => handlePlaybackClick(index, track)}
                  className="play-button"
                  style={{ "marginBottom": "10px", "marginLeft": "10px",
                    "position": "relative" }}
                >
                  <span className="simple-line-icons--control-play"></span>
                </button>
                <i
                  className="fas fa-plus "
                  style={{
                    color: "white",
                    "marginLeft": "7px",
                    "position": "relative",
                    "marginBottom": "10px",
                  }}
                ></i>
                
              </li>
            ))}
          </ul>
        </div> */}


        {!isFromPlaylist ?
          <div className="track-list-container">
            <ul className="track-list">
              {tracks.map((track, index) => (
                <li key={track.id} className="track-list-item">
                  <img
                    src={track.album.images[0].url}
                    alt="Album cover"
                    style={{
                      height: "50px",
                      width: "50px",
                      marginLeft: "10px",
                      borderRadius: "5px",
                    }}
                  />

                  <div className="track-fo">
                    <span className="track-name">{track.name}</span>
                    <span className="artist-name">{track.artists[0].name}</span>
                  </div>
                  <span
                    className="minutes"
                    style={{ paddingRight:'70px', marginBottom: "20px", position: 'relative' }}
                  >
                    {formatTime(track.duration_ms)}
                  </span>

                  <button
                    onClick={() => handlePlaybackClick(index, track)}
                    className="play-button"
                    
                  >
                    <span className="simple-line-icons--control-play"></span>
                  </button>
                  <i id="add-to-playlist"
                    className="fas fa-plus"
                    // style={{
                    //   color: "white",
                    //   marginLeft: "05px",
                    //   marginBottom: "20px",
                    //   cursor:'pointer'
                    // }}
                    onClick={() => openAddModal(track)} // Open modal on click
                  ></i>
                </li>
              ))}
            </ul></div> : <div className="track-list-container"> <ul className="track-list">
              {tracks.map((track, index) => (
                <li key={track.id} className="track-list-item">
                  <img
                    src={track.album_cover_url}
                    alt="Album cover"
                    style={{
                      height: "50px",
                      width: "50px",
                      marginLeft: "10px",
                      borderRadius: "5px",
                    }}
                  />

                  <div className="track-fo">
                    <span className="track-name">{track.name}</span>
                    <span className="artist-name">{track.artist}</span>
                  </div>
                  <span
                    className="minutes"
                    style={{ paddingRight: "70px", marginBottom: "20px", position: 'relative' }}
                  >
                    {formatTime(track.duration)}
                  </span>

                  <button
                    onClick={() => handlePlaybackClick(index, track)}
                    className="play-button"
                    style={{ marginBottom: "20px" }}
                  >
                    <span className="simple-line-icons--control-play"></span>
                  </button>
                </li>
              ))}
            </ul></div>
        }
      </div>

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
              className={`like-button ${liked ? 'liked' : ''}`} // Add a "liked" class if liked is true
              style={{
                background: "none",
                color: liked ? "white" : "white", // Change the heart color when liked
                border: "none",
                fontSize: "40px",
                marginLeft: "10px",
                transition: "color 0.3s ease", // Smooth color transition
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

              className="playback-button"
            >
              <span className="simple-line-icons--control-start"></span>
            </button>

            <button className="playback-button" >
              {isPaused ? (
                <span className="simple-line-icons--control-play"></span>
              ) : (
                <span className="simple-line-icons--control-pause"></span>
              )}
            </button>
            <button

              className="playback-button"
            >
              <span className="simple-line-icons--control-end"></span>
            </button>
            <button

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

      <GenreBox accessToken={accessToken} />
      {/* <Carousel/> */}
      {songToAdd && (
        <AddToPlaylistModal
          isOpen={isAddModalOpen}
          onRequestClose={closeAddModal}
          song={songToAdd}
        />
      )}
    </>
  );
};

export default MusicPlayer;
