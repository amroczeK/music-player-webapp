import React from 'react';
import LibrarySong from './LibrarySong';

const Library = ({ libraryOpen, songs, setCurrentSong, setSongs }) => {
  return (
    <div className={`library ${libraryOpen ? 'active-library' : ''} `}>
      <h2>Library</h2>
      <div className='library-songs'></div>
      {songs.map((song) => (
        <LibrarySong key={song.id} songs={songs} song={song} setCurrentSong={setCurrentSong} setSongs={setSongs} />
      ))}
    </div>
  );
};

export default Library;
