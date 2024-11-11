import React, { useState, useEffect } from 'react';
import './ImageSlider.css';
import SideNavbar from './SideNavbar';
import { Link } from "react-router-dom"; 

const ImageSlider = ({ category }) => {
    const [artists, setArtists] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchArtistData = async () => {
            try {
                let endpoint;
                if (category === 'indian') {
                    endpoint = 'http://localhost:8000/artist1/api/artist/indian';
                } else {
                    endpoint = 'http://localhost:8000/artist1/api/artist/global';
                }

                const response = await fetch(endpoint);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();

                setArtists(data);
                setLoading(false);
            } catch (error) {
                setError(error.message);
                setLoading(false);
            }
        };

        fetchArtistData();
    }, [category]);  // Fetch data whenever the category changes

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) =>
                prevIndex === artists.length - 1 ? 0 : prevIndex + 1
            );
        }, 3000); // Change slide every 3 seconds

        return () => clearInterval(interval);
    }, [artists.length]);

    if (loading) {
        return <p>Loading artist data...</p>;
    }

    if (error) {
        return <p>Error: {error}</p>;
    }

    if (!Array.isArray(artists) || artists.length === 0) {
        return <p>No artists found.</p>;
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
                <div className="slider-images">
                    {artists.map((artist, index) => (
                        <div
                            className={`slider-img ${index === currentIndex ? 'active' : ''}`}
                            key={artist.id}
                        >
                            <img src={artist.image} alt={artist.name} className="artist-image" />
                            <div className="details">
                                <h2>{artist.name}</h2>
                                <p>{artist.followers?.toLocaleString()} followers</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};

export default ImageSlider;
