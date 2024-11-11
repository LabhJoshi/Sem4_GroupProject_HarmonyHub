// import { useNavigate } from 'react-router-dom';
// import './SideNavbar.css'; // Import CSS for the sidenavbar
// import React, { useState,useEffect } from 'react';
// import CreatePlaylistModal from './CreatePlaylistModal';
// import axios from 'axios';
// import '@fortawesome/fontawesome-free/css/all.min.css';

// const SideNavbar = () => {
//   const [showArtistDropdown, setShowArtistDropdown] = useState(false);
//   const navigate = useNavigate();

//   const toggleArtistDropdown = () => {
//     setShowArtistDropdown(prev => !prev);
//   };

//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [playlists, setPlaylists] = useState([]);

//   const openModal = () => setIsModalOpen(true);
//   const closeModal = () => setIsModalOpen(false)

//   const fetchPlaylists = async () => {
//     try {
//       const response = await axios.get('http://localhost:8000/myplaylist/my-playlists/', {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
//         },
//       });
//       setPlaylists(response.data);
//     } catch (error) {
//       console.error('Error fetching playlists:', error);
//     }
//   };

//   useEffect(() => {
//     fetchPlaylists();
//   }, []);

//   const handlePlaylistCreated = (newPlaylist) => {
//     setPlaylists((prev) => [...prev, newPlaylist]);
// };
//   const handlePageRefresh = (path) => {
//     navigate(path); // Navigate to the new path
//     window.location.reload(); // Reload the page
//   };

//   return (
//     <div className="side-navbar">
//       <div className="menu-section">
//         <h2 className="menu-heading">MENU</h2>
//         <div className="menu-item" onClick={() => handlePageRefresh('/player')}>
//           <i className="fas fa-compass"></i> Explore
//         </div>
//         <div className="menu-item" onClick={() => handlePageRefresh('/genres')}>
//           <i className="fas fa-music"></i> Genres
//         </div>
//         <div className="menu-item artists-menu" onClick={toggleArtistDropdown}>
//           <i className="fas fa-users"></i> Artists
//           <i className={`fas fa-chevron-${showArtistDropdown ? 'up' : 'down'}`} style={{ marginLeft: '8px' }}></i>
//         </div>



//         {showArtistDropdown && (
//           <div className="artist-dropdown">
//             <div className="menu-item" onClick={() => handlePageRefresh('/artists/global')}>
//               <i className="fas fa-globe"></i> Global Artists
//             </div>
//             <div className="menu-item" onClick={() => handlePageRefresh('/artists/indian')}>
//               <i className="fas fa-flag"></i> Indian Artists
//             </div>
//             <div className="menu-item" onClick={() => handlePageRefresh('/artists/fav')}>
//               <i className="fas fa-flag"></i> Favourite Artists
//             </div>
//           </div>
//         )}
//       </div>

//       <div className="library-section">
//         <h2 className="menu-heading">CHAT</h2>
//         <div className="menu-item" onClick={() => handlePageRefresh('/chat')}>
//           <i className="fas fa-smile"></i> Mood
//         </div>
//       </div>

//       <div className="playlist-section">
//         <h2 className="menu-heading">PLAYLIST</h2>
//         <div className="menu-item" onClick={() => handlePageRefresh('/favourite/songs')}>
//           <i className="fas fa-heart"></i> Favourites
//         </div>
//         {playlists.map((playlist) => (
//           <div
//             key={playlist.id}
//             className="menu-item playlist-item"
//             onClick={() => onPlaylistSelect(playlist)}
//             style={{ cursor: 'pointer' }}
//           >
//             <i className="fas fa-list"></i> {playlist.name}
//           </div>
//         ))}
//         <div className="menu-item create-playlist" onClick={openModal} style={{ cursor: 'pointer' }}>
//           <i className="fas fa-plus-circle"></i> Create New
//           </div>
//       </div>
//     </div>
//   );
// };

// export default SideNavbar;



// import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import './SideNavbar.css'; // Import CSS for the sidenavbar
// import axios from 'axios';
// import CreatePlaylistModal from './CreatePlaylistModal';
// // import './ModalStyling.css';

// import '@fortawesome/fontawesome-free/css/all.min.css';


// const SideNavbar = ({ onPlaylistSelect }) => {
//   const [showArtistDropdown, setShowArtistDropdown] = useState(false);
//   const [isModalOpen, setIsModalOpen] = useState();
//   const [playlists, setPlaylists] = useState([]);

//   const closeModal = () => {setIsModalOpen(false)};
//   const toggleArtistDropdown = () => {
//     setShowArtistDropdown(prev => !prev);
//   };
//   const fetchPlaylists = async () => {
//     try {
//       const response = await axios.get('http://localhost:8000/myplaylist/my-playlists/', {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
//         },
//       });
//       setPlaylists(response.data);
//       console.log(playlists);
//     } catch (error) {
//       console.error('Error fetching playlists:', error);
//     }
//   };

//   useEffect(() => {
//     fetchPlaylists();
//   }, []);

//   const handlePlaylistCreated = (newPlaylist) => {
//     setPlaylists((prev) => [...prev, newPlaylist]);
//   };

//   const openModal=()=>{
//     return(
//       <CreatePlaylistModal
//       isOpen={isModalOpen}
//       onRequestClose={closeModal}
//       onPlaylistCreated={handlePlaylistCreated}
//     />
//     );
//   }
//   return (

//     <div className="side-navbar">
//       <div className="menu-section">
//         <h2 className="menu-heading">MENU</h2>
//         <Link to="/player" className="menu-item">
//           <i className="fas fa-compass"></i> Explore
//         </Link>
//         <Link to="/genres" className="menu-item">
//           <i className="fas fa-music"></i> Genres
//         </Link>

//         {/* Artists with dropdown for Global and Indian */}
//         <div className="menu-item artists-menu" onClick={toggleArtistDropdown}>
//           <i className="fas fa-users"></i> Artists
//           <i className={`fas fa-chevron-${showArtistDropdown ? 'up' : 'down'}`} style={{ marginLeft: '8px' }}></i>
//         </div>

//         {showArtistDropdown && (
//           <div className="artist-dropdown">
//             <Link to="/artists/global" className="menu-item">
//               <i className="fas fa-globe"></i> Global Artists
//             </Link>
//             <Link to="/artists/indian" className="menu-item">
//               <i className="fas fa-flag"></i> Indian Artists
//             </Link>
//             <Link to="/artists/fav" className="menu-item">
//               <i className="fas fa-heart"></i> Favourites
//             </Link>
//           </div>
//         )}


//       </div>
//       <div className="library-section">
//         <h2 className="menu-heading">CHAT</h2>
//         <Link to="/chat" className="menu-item">
//           <i className="fas fa-smile"></i> Mood
//         </Link>
//         {/* <Link to="/albums" className="menu-item">
//           <i className="fas fa-record-vinyl"></i> Albums
//         </Link> */}

//         {/* <Link to="/local" className="menu-item">
//           <i className="fas fa-folder"></i> Local
//         </Link> */}
//       </div>
//       <div className="playlist-section">
//         <h2 className="menu-heading">PLAYLIST</h2>
//         <Link to="/favourite/songs" className="menu-item">
//           <i className="fas fa-heart"></i> Favourites
//         </Link>
//         {playlists.map((playlist) => (
//           <div
//             key={playlist.id}
//             className="menu-item playlist-item"
//             onClick={() => onPlaylistSelect(playlist)}
//             style={{ cursor: 'pointer' }}
//           >
//             <i className="fas fa-list"></i> {playlist.name}
//           </div>
//         ))}

//         <div className="menu-item create-playlist" onClick={openModal} style={{ cursor: 'pointer' }}>
//           <i className="fas fa-plus-circle"></i> Create New
//         </div>        
//       </div>
//     </div>
//   );
// }

// export default SideNavbar;









import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './SideNavbar.css'; // Import CSS for the sidenavbar
import axios from 'axios';
import CreatePlaylistModal from './CreatePlaylistModal';
import '@fortawesome/fontawesome-free/css/all.min.css';

const SideNavbar = ({ onPlaylistSelect }) => {
  const [showArtistDropdown, setShowArtistDropdown] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); // Set initial state to false
  const [playlists, setPlaylists] = useState([]);

  const closeModal = () => {
    setIsModalOpen(false);  // Close the modal
  };

  const toggleArtistDropdown = () => {
    setShowArtistDropdown(prev => !prev);
  };

  const fetchPlaylists = async () => {
    try {
      const response = await axios.get('http://localhost:8000/myplaylist/my-playlists/', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });
      setPlaylists(response.data);
    } catch (error) {
      console.error('Error fetching playlists:', error);
    }
  };

  useEffect(() => {
    fetchPlaylists();
  }, []);

  const handlePlaylistCreated = (newPlaylist) => {
    setPlaylists((prev) => [...prev, newPlaylist]);  // Add new playlist
  };

  // Instead of returning JSX, just set the modal state to true when creating a playlist
  const openModal = () => {
    setIsModalOpen(true);
  };

  return (
    <div className="side-navbar">
      <div className="menu-section">
        <h2 className="menu-heading">MENU</h2>
        <Link to="/player" className="menu-item">
          <i className="fas fa-compass"></i> Explore
        </Link>
        <Link to="/genres" className="menu-item">
          <i className="fas fa-music"></i> Genres
        </Link>

        <div className="menu-item artists-menu" onClick={toggleArtistDropdown}>
          <i className="fas fa-users"></i> Artists
          <i className={`fas fa-chevron-${showArtistDropdown ? 'up' : 'down'}`} style={{ marginLeft: '8px' }}></i>
        </div>

        {showArtistDropdown && (
          <div className="artist-dropdown">
            <Link to="/artists/global" className="menu-item">
              <i className="fas fa-globe"></i> Global Artists
            </Link>
            <Link to="/artists/indian" className="menu-item">
              <i className="fas fa-flag"></i> Indian Artists
            </Link>
            <Link to="/artists/fav" className="menu-item">
              <i className="fas fa-heart"></i> Favourites
            </Link>
          </div>
        )}
      </div>

      <div className="library-section">
        <h2 className="menu-heading">CHAT</h2>
        <Link to="/chat" className="menu-item">
          <i className="fas fa-smile"></i> Mood
        </Link>
      </div>

      <div className="playlist-section">
        <h2 className="menu-heading">PLAYLIST</h2>
        <Link to="/favourite/songs" className="menu-item">
          <i className="fas fa-heart"></i> Favourites
        </Link>
        {playlists.map((playlist) => (
          <div
            key={playlist.id}
            className="menu-item playlist-item"
            onClick={() => onPlaylistSelect(playlist)}
            style={{ cursor: 'pointer' }}
          >
            <i className="fas fa-list"></i> {playlist.name}
          </div>
        ))}

        <div className="menu-item create-playlist" onClick={openModal} style={{ cursor: 'pointer' }}>
          <i className="fas fa-plus-circle"></i> Create New
        </div>
      </div>

      {/* Conditionally render the modal based on the modal state */}
      {isModalOpen && (
        <CreatePlaylistModal
          isOpen={isModalOpen}
          onRequestClose={closeModal}
          onPlaylistCreated={handlePlaylistCreated}
        />
      )}
    </div>
  );
};

export default SideNavbar;
