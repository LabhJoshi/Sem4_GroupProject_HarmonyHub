// AddToPlaylistModal.js
import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import axios from 'axios';
import './ModalStyling.css';

Modal.setAppElement('#root');

const AddToPlaylistModal = ({ isOpen, onRequestClose, song }) => {
  const [playlists, setPlaylists] = useState([]);
  const [selectedPlaylists, setSelectedPlaylists] = useState([]);

  useEffect(() => {
    if (isOpen) {
      fetchPlaylists();
    }
  }, [isOpen]);

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
      alert('Failed to fetch playlists.');
    }
  };

  const handleCheckboxChange = (playlistId) => {
    setSelectedPlaylists((prev) =>
      prev.includes(playlistId)
        ? prev.filter((id) => id !== playlistId)
        : [...prev, playlistId]
    );
  };

  const handleAddToPlaylists = async () => {
    if (selectedPlaylists.length === 0) {
      alert('Please select at least one playlist.');
      return;
    }

    try {
      // Prepare the song data to send to the backend
      const name = song.name;
      const artist = song.artists.map(artist => artist.name).join(', ');
      const album = song.album.name;
      const duration = song.duration_ms;  // Convert ms to seconds
      const spotify = song.external_urls.spotify;
      const previewUrl = song.preview_url || '';
      const trackId = song.id;  // Track ID from Spotify
      const popularity = song.popularity;
      const albumCoverUrl = song.album.images[0].url;
      const uri=song.uri;

      // Send the playlist IDs and song details to the backend
      await axios.post(
          'http://localhost:8000/myplaylist/add-song/',
          {
              playlist_ids: selectedPlaylists,
              name: name,
              artist: artist,
              album: album || '',
              duration: duration,
              spotify: spotify || '',
              preview_url: previewUrl || '',
              track_id: trackId,
              popularity: popularity || 0,
              album_cover_url: albumCoverUrl || '',
              uri:uri
          },
          {
              headers: {
                  Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
              },
          }
      );

      alert('Song added to selected playlists.');
      onRequestClose();
     } catch (error) {
      console.error('Error adding song to playlists:', error);
      alert('Failed to add song to playlists.');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Add to Playlists"
      className="modal"
      overlayClassName="overlay"
    >
      <h2>Add to Playlists</h2>
      <div className="playlist-list">
        {playlists.map((playlist) => (
          <div key={playlist.id} className="playlist-item">
            <input
              type="checkbox"
              id={`playlist-${playlist.id}`}
              checked={selectedPlaylists.includes(playlist.id)}
              onChange={() => handleCheckboxChange(playlist.id)}
            />
            <label htmlFor={`playlist-${playlist.id}`}>{playlist.name}</label>
          </div>
        ))}
      </div>
      <div className="modal-buttons">
        <button onClick={handleAddToPlaylists}>Done</button>
        <button onClick={onRequestClose}>Cancel</button>
      </div>
    </Modal>
  );
};

export default AddToPlaylistModal;
