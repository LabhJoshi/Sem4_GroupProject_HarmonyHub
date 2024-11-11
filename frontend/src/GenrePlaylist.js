//new code
import React from 'react';
import { useLocation, useNavigate,Link } from 'react-router-dom';
import SideNavbar from './SideNavbar';
import './GenrePlaylists.css';

const GenrePlaylists = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const playlists = location.state?.playlists || [];
  const genre = location.state?.genre || 'Unknown Genre';

  if (!location.state) {
    navigate('/genre');
    return null;
  }
  
  const handlePlaylistClick = (playlist) => {
    // Navigate to the PlaylistTracks page, passing the playlist's ID and name
    navigate(`/playlist/${playlist.id}`, {
      state: { playlistId: playlist.id, playlistName: playlist.name }
    });
  };

  return (
    <div>

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
    <div className="full-page-container">
      < h1 className="text-center mb-4">{genre} Playlists</h1>
      <div className="gridy-container">
        {playlists.length > 0 ? (
          playlists.map((playlist) => (
            <div
              key={playlist.id}
              className="grid-item"
              onClick={() => handlePlaylistClick(playlist)}
            >
              <img
                src={playlist.images[0]?.url}
                alt={playlist.name}
                className="playlist-image"
              />
              <div className="overlay">
                <h6 className="overlay-title">{playlist.name}</h6>
              </div>
            </div>
          ))
        ) : (
          <p>No playlists found for this genre.</p>
        )}
      </div>
    </div>
    </div>
  );
};

export default GenrePlaylists;