import React, { useState, useRef } from 'react';
import Player from './components/Player';
import Song from './components/Song';
import Library from './components/Library';
import Nav from './components/Nav';
import data from './data';
import './styles/app.scss';

const App = () => {
  const [songs, setSongs] = useState(data());
  const [currentSong, setCurrentSong] = useState(songs[0]);
  const [libraryOpen, setLibraryOpen] = useState(false);

  return (
    <div className='App'>
      <Nav libraryOpen={libraryOpen} setLibraryOpen={setLibraryOpen} />
      <Song currentSong={currentSong} />
      <Player songs={songs} setSongs={setSongs} currentSong={currentSong} setCurrentSong={setCurrentSong} />
      <Library libraryOpen={libraryOpen} songs={songs} setSongs={setSongs} setCurrentSong={setCurrentSong} />
    </div>
  );
};

export default App;
