import React, { useEffect } from 'react';
import { useNavigate,useLocation } from 'react-router-dom'; // Import useNavigate from react-router-dom
import './App.css';


function Tokenization() {
  const navigate = useNavigate(); // Initialize useNavigate for redirection
  const location = useLocation();

  useEffect(() => {
    // Check if the access token is available from the backend after redirection
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get('token');

    if (token) {
        // Store the token in localStorage
        localStorage.setItem('accessToken', token);
  
        // Optionally, navigate to the player page without the token in the URL
        navigate('/player', { replace: true });
      }
  }, [location,navigate]);
//   console.log(accessToken);

  const redirectToSpotify = () => {
    window.location.href = 'http://127.0.0.1:8000/spotify/authorize/';
  };

  return (
    <div className="App">
        <button onClick={redirectToSpotify}>Authorize with Spotify</button>
    </div>
  );
}

export default Tokenization;
