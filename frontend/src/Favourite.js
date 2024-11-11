import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import axios from 'axios';
import SideNavbar from './SideNavbar';
import './Favourite.css';

const PlaylistTracks = () => {
    const location = useLocation();
    const [tracks, setTracks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentTrack, setCurrentTrack] = useState(null); 

    // Get the Spotify token from query parameters or localStorage
    const queryParams = new URLSearchParams(location.search);
    const queryToken = queryParams.get("token");
    const accessToken = queryToken || localStorage.getItem("accessToken");

    useEffect(() => {
        const fetchTracks = async () => {
            setLoading(true);
            try {
                const response = await axios.get('http://localhost:8000/api/favsongs/'); // Adjust URL as needed
                const songs = response.data;

                // Extract track URLs from the Spotify API using track names
                const trackPromises = songs.map(async (song) => {
                    // Fetch the track URL from Spotify using track name and artist
                    const trackResponse = await axios.get(`https://api.spotify.com/v1/search`, {
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                        },
                        params: {
                            q: `${song.track_name} ${song.artist_name}`,
                            type: 'track',
                            limit: 1, // Get the first result
                        },
                    });

                    // If a track is found, return the details
                    if (trackResponse.data.tracks.items.length > 0) {
                        const track = trackResponse.data.tracks.items[0];
                        return {
                            id: song.id,
                            track_name: song.track_name,
                            artist_name: song.artist_name,
                            artist_image: song.artist_image,
                            track_url: track.external_urls.spotify, // Get the Spotify URL
                            duration: track.duration_ms,
                        };
                    }
                    return null; // Return null if no track is found
                });

                // Wait for all track promises to resolve and filter out nulls
                const tracksWithDetails = await Promise.all(trackPromises);
                setTracks(tracksWithDetails.filter(Boolean)); // Filter out any null results
            } catch (error) {
                console.error('Error fetching tracks:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchTracks();
    }, [accessToken]);

    const playTrack = (trackUrl) => {
        console.log('Playing track:', trackUrl); 
        if (trackUrl) {
            setCurrentTrack(trackUrl); // Play the Spotify track URL
        } else {
            console.error('Track URL is invalid or undefined.');
        }
    };

    const formatDuration = (ms) => {
        const minutes = Math.floor(ms / 60000);
        const seconds = Math.floor((ms % 60000) / 1000);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

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
                {loading ? (
                    <p>Loading tracks...</p>
                ) : (
                    <div className="tracks-container">
                        {tracks.length > 0 ? (
                            tracks.map((track) => (
                                <div key={track.id} className="track-item" onClick={() => playTrack(track.track_url)}>
                                    <img 
                                        src={track.artist_image} 
                                        alt={`${track.track_name} album art`} 
                                        className="album-art" 
                                    />
                                    <div className="song-track-info">
                                        <p className="track-name">{track.track_name}</p>
                                        <p className="track-artist">{track.artist_name}</p>
                                    </div>
                                    <div className="track-duration">
                                        <p>{formatDuration(track.duration)}</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p>No tracks available.</p>
                        )}
                    </div>
                )}

                {currentTrack && (
                    <div className="audio-player">
                        <iframe
                            src={`https://open.spotify.com/embed/track/${currentTrack.split('/').pop()}`} // Embed Spotify track using URL
                            width="300" // Width of the embedded player
                            height="380" // Height of the embedded player
                            frameBorder="0"
                            allow="encrypted-media"
                            title="Spotify Player"
                        ></iframe>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PlaylistTracks;
