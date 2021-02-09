import React, { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faPause, faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons';

const Player = ({ songs, setSongs, currentSong, setCurrentSong }) => {
  const audioRef = useRef(null);
  const [songPlaying, setSongPlaying] = useState(false);
  const [songInfo, setSongInfo] = useState({
    currentTime: 0,
    duration: 0,
    animationPercentage: 0,
  });

  const formatTime = (time) => {
    return Math.floor(time / 60) + ':' + ('0' + Math.floor(time % 60)).slice(-2);
  };

  const dragHandler = (e) => {
    audioRef.current.currentTime = e.target.value;
    setSongInfo({ ...songInfo, currentTime: e.target.value });
  };

  const playSongHandler = async () => {
    if (songPlaying) {
      await audioRef.current.pause();
      setSongPlaying(!songPlaying);
    } else {
      await audioRef.current.play();
      setSongPlaying(!songPlaying);
    }
  };

  const autoPlayHandler = async () => {
    if (songPlaying) {
      await audioRef.current.play();
    }
  };

  const nextSong = () => {
    const currentSongIndex = songs.findIndex((s) => s.id === currentSong.id);
    currentSongIndex < songs.length - 1 ? setCurrentSong(songs[currentSongIndex + 1]) : setCurrentSong(songs[0]);
  };

  const previousSong = () => {
    const currentSongIndex = songs.findIndex((s) => s.id === currentSong.id);
    currentSongIndex !== 0 ? setCurrentSong(songs[currentSongIndex - 1]) : setCurrentSong(songs[songs.length - 1]);
  };

  const timeUpdateHandler = (e) => {
    const currentTime = e.target.currentTime;
    const duration = e.target.duration;

    const roundedCurrentTime = Math.round(currentTime);
    const roundedDuration = Math.round(duration);
    const animationPercentage = Math.round((roundedCurrentTime / roundedDuration) * 100);

    setSongInfo({
      ...songInfo,
      currentTime,
      duration,
      animationPercentage,
    });
    if (e.target.ended) {
      setSongPlaying(!songPlaying);
      setSongInfo({
        ...songInfo,
        currentTime: 0,
        animationPercentage,
      });
    }
  };

  useEffect(() => {
    setSongs(
      songs.map((targetSong) => {
        return {
          ...targetSong,
          active: targetSong.id === currentSong.id,
        };
      })
    );
  }, [currentSong]);

  // Styles
  const animateTrack = {
    transform: `translateX(${songInfo.animationPercentage}%)`,
  };

  console.log(currentSong);
  return (
    <div className='player'>
      <div className='time-control'>
        <p>{formatTime(songInfo.currentTime)}</p>
        <div
          style={{ background: `linear-gradient(to right, ${currentSong.color[0]},${currentSong.color[1]})` }}
          className='track'
        >
          <input
            onChange={dragHandler}
            min={0}
            max={songInfo.duration || 0}
            value={songInfo.currentTime}
            type='range'
          />
          <div style={animateTrack} className='animate-track'></div>
        </div>
        <p>{formatTime(songInfo.duration || 0)}</p>
      </div>
      <div className='play-control'>
        <FontAwesomeIcon className='skip-back' size='2x' icon={faAngleLeft} onClick={() => previousSong()} />
        <FontAwesomeIcon onClick={playSongHandler} className='play' size='2x' icon={!songPlaying ? faPlay : faPause} />
        <FontAwesomeIcon className='skip-forward' size='2x' icon={faAngleRight} onClick={() => nextSong()} />
      </div>
      <audio
        onLoadedData={autoPlayHandler}
        onTimeUpdate={timeUpdateHandler}
        onLoadedMetadata={timeUpdateHandler}
        ref={audioRef}
        src={currentSong.audio}
      ></audio>
    </div>
  );
};

export default Player;
