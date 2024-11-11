import React from 'react';
import { useNavigate, Link } from 'react-router-dom'; // Use for navigation
import SideNavbar from './SideNavbar';
import './AllGenre.css';

const genres = [
    { name: 'Bollywood', color: '#6A0DAD' },
    { name: 'Punjabi', color: '#FF77FF' },
    { name: 'Filmi', color: '#3399FF' },
    { name: 'Indian Indie', color: '#B19CD9' },
    { name: 'Retro Bollywood', color: '#FF66B2' },
    { name: 'Hip Hop', color: '#4B0082' },
    { name: 'Rock', color: '#FF4500' },
    { name: 'Pop', color: '#1E90FF' },
    { name: 'Jazz', color: '#FF6347' },
    { name: 'Classical', color: '#FFD700' },
    { name: 'Country', color: '#32CD32' },
    { name: 'Reggae', color: '#8B0000' },
    { name: 'Electronic', color: '#8A2BE2' },
    { name: 'R&B', color: '#FF00FF' },
    { name: 'Soul', color: '#FF1493' },
    { name: 'Blues', color: '#00CED1' },
    { name: 'Funk', color: '#FF69B4' },
    { name: 'Metal', color: '#000080' },
    { name: 'Alternative', color: '#8B008B' },
    { name: 'Dance', color: '#FF4500' },
    { name: 'Disco', color: '#FF8C00' },
    { name: 'House', color: '#FF6347' },
    { name: 'Techno', color: '#FFD700' },
    { name: 'Trance', color: '#32CD32' },
    { name: 'Folk', color: '#8B0000' },
    { name: 'Latin', color: '#FF69B4' },
    { name: 'K-Pop', color: '#000080' },
    { name: 'J-Pop', color: '#8B008B' },
    { name: 'World Music', color: '#FF8C00' },
    { name: 'Ambient', color: '#FF6347' },
    { name: 'Chillout', color: '#FFD700' },
    { name: 'Lo-Fi', color: '#32CD32' },
    { name: 'Indie Rock', color: '#8B0000' },
    { name: 'Indie Pop', color: '#8A2BE2' },
    { name: 'Electro', color: '#FF00FF' },
    { name: 'Garage', color: '#FF1493' },
    { name: 'Grunge', color: '#00CED1' },
    { name: 'Opera', color: '#000080' },
    { name: 'Salsa', color: '#8B008B' },
    { name: 'Reggaeton', color: '#FF4500' },
    { name: 'Afrobeat', color: '#FF8C00' },
    { name: 'Tango', color: '#FF6347' },
];

const AllGenre = () => {
    const navigate = useNavigate();
    const accessToken = localStorage.getItem('accessToken');
    const fetchGenrePlaylists = async (genre) => {
        try {
            const query = encodeURIComponent(genre);

            const response = await fetch(`https://api.spotify.com/v1/search?q=${query}&type=playlist`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            const data = await response.json();
            console.log(data);

            if (data.playlists && data.playlists.items) {
                const playlists = data.playlists.items;
                console.log(playlists);
                
                playlists.forEach((playlist) => {
                    console.log(`Playlist Name: ${playlist.name}, Owner: ${playlist.owner.display_name}`);
                });

                navigate(`/genres/${genre}`, { state: { playlists, genre } });
            } else {
                console.error('No playlists found for this genre.');
            }
        } catch (error) {
            console.error('Error fetching playlists:', error);
        }
    };

    return (
        <div className='all-genre'>
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
            <h1 className='AllGenreName'>All Genres</h1>

            <div className="all-genre-container">
                {genres.map((genre, index) => (
                    <div
                        key={index}
                        className="all-genre-box"
                        style={{ backgroundColor: genre.color }}
                        onClick={() => fetchGenrePlaylists(genre.name)}
                    >
                        {genre.name}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AllGenre;
