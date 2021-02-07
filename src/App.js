import React, { useState } from 'react';
import Player from './components/Player';
import Song from './components/Song';
import Library from './components/Library';
import data from './data';
import './styles/app.scss';

const App = () => {
  const [songs, setSongs] = useState(data());
  const [currentSong, setCurrentSong] = useState(songs[3]);

  return (
    <div className='App'>
      <Song currentSong={currentSong} />
      <Player currentSong={currentSong} />
      <Library songs={songs} currentSong={currentSong} />
    </div>
  );
};

export default App;
