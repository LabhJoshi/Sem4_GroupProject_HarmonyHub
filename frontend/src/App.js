// import React,{useState} from 'react';
// import './App.css';
// import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
// import Tokenization from './Tokenization';
// import MusicPlayer from './MusicPlayer';
// import SongSearch from './SongSearch';
// import SideNavbar from './SideNavbar';

// function App() {
//   const [searchQuery, setSearchQuery] = useState('');
//   const [submittedQuery, setSubmittedQuery] = useState('');

//   const handleSearchChange = (event) => {
//     console.log(event.target.value)
//     setSearchQuery(event.target.value);
//   };

//   const handleKeyDown = (event) => {
//     if (event.key === 'Enter') {
//       event.preventDefault(); // Prevent default form submission behavior
//       setSubmittedQuery(searchQuery); // Set the query to trigger re-render of MusicPlayer
//     }
//   };
//   return (
//     <Router>
//       <div style={{ display: 'flex' }}>
//         <div className="side-navbar">
//           <SideNavbar />
//         </div>

//         <div className="main-content">
//           <div className="top-navbar">
//             <div className="nav-left">
//               <div className="logo">Harmony Hub</div>
//             </div>
//             <div className="nav-search">
//               <input 
//                 type="text" 
//                 value={searchQuery} 
//                 onChange={handleSearchChange} 
//                 onKeyDown={handleKeyDown} // Add onKeyDown listener
//                 placeholder="Search for a song..." 
//               />
//             </div>
//             <div className="nav-right">
//               <nav>
//                 <ul>
//                   <li><Link to="/" className="nav-link">Home</Link></li>
//                   <li><Link to="/mood" className="nav-link">Mood</Link></li>
//                   <li><Link to="/profile" className="nav-link">Profile</Link></li>
//                 </ul>
//               </nav>
//             </div>
//           </div>

//           <Routes>
//             <Route path='/' element={<Tokenization />} />
//             console.log(submittedQuery);
//             <Route path='/player' element={<MusicPlayer searchQuery={submittedQuery} />} />
//             <Route path='/mood' element={<SongSearch />} />
//           </Routes>
//         </div>
//       </div>
//     </Router>
//   );
// }

// export default App;


import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import Tokenization from './Tokenization';
import MusicPlayer from './MusicPlayer';
import LoginSignup from './login-signup';
// import SongSearch from './SongSearch';
import ImageSlider from './ImageSlider';
import SongSearch from './SongSearch';
import GenreBox from './GenreBox';
import GenrePlaylists from './GenrePlaylist';
import PlaylistTracks from './PlaylistTracks';
import ImageSlider1 from './ImageSlider1';
import Favourite from './Favourite';
import AllGenre from './AllGenre';

function App() {
  return (
    <Router>
      <div style={{ display: 'flex' }}>
        <div className="main-content">
          <Link to="/"></Link>
          <Link to="/mood"></Link>
          <Link to="/profile"></Link>
          <Link to='/login'></Link>
          <Link to='/chat'></Link>
          <Link to="/genre"></Link>

          <Routes>
            <Route path='/' element={<Tokenization />} />
            <Route path='/player' element={<MusicPlayer />} />
            <Route path='/login' element={<LoginSignup />} />
            <Route path='/chat' element={<SongSearch />} />
            <Route path='/artists/global' element={<ImageSlider category="global" />} />
            <Route path='/artists/indian' element={<ImageSlider category="indian" />} />
            <Route path="/genre" element={<GenreBox />} />
            <Route path="/genre/:genre" element={<GenrePlaylists  />} />
            <Route path="/playlist/:id" element={<PlaylistTracks />} />
            <Route path='/artists/fav' element={<ImageSlider1 />} />
            <Route path='/favourite/songs' element={<Favourite/>}/>
            <Route path='/all-genres' element={<AllGenre />} />
            <Route path="/genres/:genre" element={<GenrePlaylists  />} />
            <Route path="/genre/:genre" element={<GenrePlaylists />}/>

          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
