import React, { useState, useEffect } from 'react';
import './ImageSlider.css';
import SideNavbar from './SideNavbar';
import { Link,useLocation} from "react-router-dom";

const ImageSlider = () => {
    const [songs, setSongs] = useState([]);
    const [artistImages, setArtistImages] = useState({}); // State to hold artist images
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const location = useLocation(); // Get the location object
    const queryParams = new URLSearchParams(location.search);
    const queryToken = queryParams.get("token");

    // Use query token if available, fallback to localStorage if not.
    const accessToken = queryToken || localStorage.getItem("accessToken");
  
    // Function to fetch artist image from Spotify API
    const fetchArtistImage = async (artistName) => {
        try {
            const response = await fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(artistName)}&type=artist`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                  },
            });

            if (!response.ok) {
                const errorText = await response.text(); // Capture the error response
                throw new Error(`Failed to fetch artist image: ${response.status} ${response.statusText}. Response: ${errorText}`);
            }

            const data = await response.json();

            if (data.artists && data.artists.items && data.artists.items.length > 0) {
                return data.artists.items[0].images[0]?.url || null; // Return the artist image URL or null if not found
            } else {
                console.warn(`No artist found for ${artistName}`);
                return null; // No artist found
            }
        } catch (error) {
            console.error('Error fetching artist image:', error);
            return null; // Return null on error
        }
    };

    // Function to fetch songs data from backend
    const fetchSongsData = async () => {
        try {
            const response = await fetch('http://localhost:8000/api/songs/');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setSongs(data);
            setLoading(false);

            const images = {};
            for (const song of data) {
                if (song.artist_name) {
                    const artistImage = await fetchArtistImage(song.artist_name);
                    images[song.artist_name] = artistImage;
                }
            }
            setArtistImages(images);
        } catch (error) {
            console.error('Error fetching songs data:', error);
            setError(error.message);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSongsData();
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) =>
                prevIndex === songs.length - 1 ? 0 : prevIndex + 1
            );
        }, 3000); // Change slide every 3 seconds

        return () => clearInterval(interval);
    }, [songs.length]);

    const nextSlide = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === songs.length - 1 ? 0 : prevIndex + 1
        );
    };

    const prevSlide = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === 0 ? songs.length - 1 : prevIndex - 1
        );
    };

    if (loading) {
        return <p>Loading song data...</p>;
    }

    if (error) {
        return <p>Error: {error}</p>;
    }

    if (!Array.isArray(songs) || songs.length === 0) {
        return <p>No songs found.</p>;
    }

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
            <div className="slider-container">
                <button className="slider-button prev" onClick={prevSlide}>❮</button>
                <div className="slider-images">
                    {songs.map((song, index) => (
                        <div
                            className={`slider-img ${index === currentIndex ? 'active' : ''}`}
                            key={song.id}
                        >
                            <img 
                                src={artistImages[song.artist_name] || 'default-image-url.jpg'} // Fallback image if not found
                                alt={song.artist_name} 
                                className="artist-image" 
                            />
                            <div className="details">
                                <h2>{song.artist_name}</h2>
                                <p>{song.song_name}</p>
                            </div>
                        </div>
                    ))}
                </div>
                <button className="slider-button next" onClick={nextSlide}>❯</button>
            </div>
        </>
    );
};

export default ImageSlider;
