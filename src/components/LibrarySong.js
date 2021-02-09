import React from 'react';

const LibrarySong = ({ song, songs, setCurrentSong, setSongs }) => {
  const songSelectHandler = () => {
    const selectedSong = songs.filter((state) => {
      console.log(state);
      console.log(song.id);
      return state.id === song.id;
    });
    setCurrentSong(selectedSong[0]);
    setSongs(
      songs.map((targetSong) => {
        return {
          ...targetSong,
          active: targetSong.id === song.id,
        };
      })
    );
  };
  return (
    <div onClick={songSelectHandler} className={`library-song ${song.active ? 'selected' : ''}`}>
      <img alt={song.name} src={song.cover} />
      <div className='song-description'>
        <h3>{song.name}</h3>
        <h4>{song.artist}</h4>
      </div>
    </div>
  );
};

export default LibrarySong;
