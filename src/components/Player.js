import React, { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faPause, faAngleLeft, faAngleRight, faSyncAlt, faRandom } from '@fortawesome/free-solid-svg-icons';

const Player = ({ songs, setSongs, currentSong, setCurrentSong }) => {
  const audioRef = useRef(null);
  const [songPlaying, setSongPlaying] = useState(false);
  const [songInfo, setSongInfo] = useState({
    currentTime: 0,
    duration: 0,
    animationPercentage: 0,
  });
  const [loopSong, setLoopSong] = useState(false);
  const [shuffleSongs, setShuffleSongs] = useState(false);

  const formatTime = (time) => {
    return Math.floor(time / 60) + ':' + ('0' + Math.floor(time % 60)).slice(-2);
  };

  const dragHandler = (e) => {
    audioRef.current.currentTime = e.target.value;
    //setSongInfo({ ...songInfo, currentTime: e.target.value });
  };

  const playSongHandler = async () => {
    if (songPlaying) {
      audioRef.current.pause();
      setSongPlaying(!songPlaying);
    } else {
      audioRef.current.play();
      setSongPlaying(!songPlaying);
    }
  };

  // const autoPlayHandler = () => {
  //   if (songPlaying) {
  //     audioRef.current.play();
  //   }
  // };

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
      setSongInfo({
        ...songInfo,
        currentTime: 0,
        animationPercentage: 0,
      });
      if (!shuffleSongs) nextSong();
    }
    if (e.target.ended && shuffleSongs) {
      setCurrentSong(songs[Math.floor(Math.random() * Math.floor(songs.length))]);
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
        <FontAwesomeIcon
          className='shuffle'
          size='1x'
          icon={faRandom}
          color={shuffleSongs ? 'grey' : ''}
          onClick={async () => {
            if (loopSong) setLoopSong(false);
            setShuffleSongs(!shuffleSongs);
          }}
        />
        <FontAwesomeIcon className='skip-back' size='2x' icon={faAngleLeft} onClick={() => previousSong()} />
        <FontAwesomeIcon onClick={playSongHandler} className='play' size='2x' icon={!songPlaying ? faPlay : faPause} />
        <FontAwesomeIcon className='skip-forward' size='2x' icon={faAngleRight} onClick={() => nextSong()} />
        <FontAwesomeIcon
          className='repeat'
          size='1x'
          icon={faSyncAlt}
          color={loopSong ? 'grey' : ''}
          loop={loopSong}
          onClick={() => {
            if (shuffleSongs) setShuffleSongs(false);
            setLoopSong(!loopSong);
          }}
        />
      </div>
      <audio
        autoPlay={songPlaying}
        // onLoadedData={autoPlayHandler}
        onTimeUpdate={timeUpdateHandler}
        onLoadedMetadata={timeUpdateHandler}
        ref={audioRef}
        src={currentSong.audio}
        loop={loopSong}
      ></audio>
    </div>
  );
};

export default Player;
