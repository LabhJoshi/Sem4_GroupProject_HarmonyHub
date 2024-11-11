// CreatePlaylistModal.js
import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
// import './ModalStyling.css';
import axios from 'axios';

Modal.setAppElement('#root'); // Bind modal to your appElement (https://reactcommunity.org/react-modal/accessibility/)

const CreatePlaylistModal = ({ isOpen, onRequestClose, onPlaylistCreated }) => {
  const [playlistName, setPlaylistName] = useState('');

  // useEffect(()=>{console.log('Is opened?',isOpen)})
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Is opened?',isOpen)
    if (!playlistName.trim()) {
      alert('Playlist name cannot be empty.');
      return;
    }

    try {
      // Send POST request to create a new playlist
      const response = await axios.post('http://localhost:8000/myplaylist/create/', {
        name: playlistName,
      });

      // Optionally, add default playlists if needed
      // For example, if you want to ensure "Best of 2023" and "Best of 2022" exist
      // You can create them here or handle it on the backend

      onPlaylistCreated(response.data); // Callback to refresh playlists
      setPlaylistName('');
      onRequestClose();
    } catch (error) {
      console.error('Error creating playlist:', error);
      alert('Failed to create playlist. Please try again.');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      shouldCloseOnOverlayClick={true}
      contentLabel="Create New Playlist"
      className="modal"
      overlayClassName="overlay"
    >
      <h2>Create New Playlist</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={playlistName}
          onChange={(e) => setPlaylistName(e.target.value)}
          placeholder="Enter playlist name"
          required
        />
        <div className="modal-buttons">
          <button type="submit">Create</button>
          <button type="button" onClick={onRequestClose}>
            Cancel
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default CreatePlaylistModal;
