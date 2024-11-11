
//new code


import React from 'react';
import { useNavigate ,Link} from 'react-router-dom'; // Use for navigation
import './GenreBox.css';

const genres = [
  { name: 'Bollywood', color: '#6A0DAD' },
  { name: 'Punjabi', color: '#FF77FF' },
  { name: 'Filmi', color: '#3399FF' },
  { name: 'Indian Indie', color: '#B19CD9' },
  { name: 'Retro Bollywood', color: '#FF66B2' },
  { name: 'Hip Hop', color: '#4B0082' },
];

const GenreBox = ({ accessToken }) => {
  const navigate = useNavigate();

  const fetchGenrePlaylists = async (genre) => {
    try {
      // Format genre for Spotify API query
      const query = encodeURIComponent(genre); // Encode the genre name to be URL-safe

      // Fetch playlists related to the genre
      const response = await fetch(`https://api.spotify.com/v1/search?q=${query}&type=playlist`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const data = await response.json();
      const playlists = data.playlists.items; // Extract playlists from the response

      // Navigate to the genre playlist page and pass the playlists via state
      navigate(`/genre/${genre}`, { state: { playlists, genre } });
    } catch (error) {
      console.error('Error fetching playlists:', error);
    }
  };

  return (
    <div className='genre'>
      <div>
        <p className='GenreName'>Genres
        <Link to='/all-genres'><a className='seeAll'>See All</a></Link>
        </p>
      </div>
    <div className="genre-container">
      
      {genres.map((genre, index) => (
        <div
          key={index}
          className="genre-box"
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

export default GenreBox;








