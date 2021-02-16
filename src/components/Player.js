import React, { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPlay,
  faPause,
  faAngleLeft,
  faAngleRight,
  faSyncAlt,
  faRandom,
  faVolumeDown,
  faVolumeUp,
  faVolumeMute,
} from '@fortawesome/free-solid-svg-icons';

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
  const [volume, setVolume] = useState(50 / 100);
  const [muted, setMuted] = useState(false);

  const formatTime = (time) => {
    return Math.floor(time / 60) + ':' + ('0' + Math.floor(time % 60)).slice(-2);
  };

  const dragHandler = (e) => {
    audioRef.current.currentTime = e.target.value;
  };

  const volumeHandler = (e) => {
    let vol = e?.target?.value ? e.target.value / 100 : e / 100;
    setVolume(vol);
    audioRef.current.volume = vol;
    if (volume <= 0) {
      setMuted(true);
    } else {
      setMuted(false);
    }
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

  const resetSongInfo = () => {
    setSongInfo({
      ...songInfo,
      currentTime: 0,
      duration: 0,
      animationPercentage: 0,
    });
  };

  const nextSong = () => {
    const currentSongIndex = songs.findIndex((s) => s.id === currentSong.id);
    currentSongIndex < songs.length - 1 ? setCurrentSong(songs[currentSongIndex + 1]) : setCurrentSong(songs[0]);
    resetSongInfo();
  };

  const previousSong = () => {
    const currentSongIndex = songs.findIndex((s) => s.id === currentSong.id);
    currentSongIndex !== 0 ? setCurrentSong(songs[currentSongIndex - 1]) : setCurrentSong(songs[songs.length - 1]);
    resetSongInfo();
  };

  const onLoadHandler = () => {
    audioRef.current.volume = volume;
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
    if (songPlaying && shuffleSongs && e.target.ended) {
      setCurrentSong(songs[Math.floor(Math.random() * Math.floor(songs.length))]);
    }
  };

  useEffect(() => {
    console.log('setting songs');
    setSongs(
      songs.map((targetSong) => {
        return {
          ...targetSong,
          active: targetSong.id === currentSong.id,
        };
      })
    );
  }, []);

  // Styles
  const animateTrack = {
    transform: `translateX(${songInfo.animationPercentage}%)`,
  };

  const animateVolume = {
    transform: `translateX(${volume <= 0 ? -50 : volume * 100}%)`,
  };

  return (
    <div>
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
            title={!shuffleSongs ? 'Enable shuffle' : 'Disable shuffle'}
            size='1x'
            icon={faRandom}
            color={shuffleSongs ? '#007CC7' : '#4DA8DA'}
            onClick={() => {
              if (loopSong) setLoopSong(false);
              setShuffleSongs(!shuffleSongs);
            }}
          />
          <FontAwesomeIcon
            title='Previous'
            color={'#4DA8DA'}
            className='skip-back'
            size='2x'
            icon={faAngleLeft}
            onClick={() => previousSong()}
          />
          <FontAwesomeIcon
            title='Play'
            color={'#4DA8DA'}
            onClick={playSongHandler}
            className='play'
            size='2x'
            icon={!songPlaying ? faPlay : faPause}
          />
          <FontAwesomeIcon
            title='Next'
            color={'#4DA8DA'}
            className='skip-forward'
            size='2x'
            icon={faAngleRight}
            onClick={() => nextSong()}
          />
          <FontAwesomeIcon
            title={loopSong ? 'Disable repeat' : 'Enable repeat'}
            className='repeat'
            size='1x'
            icon={faSyncAlt}
            color={loopSong ? '#007CC7' : '#4DA8DA'}
            loop={loopSong}
            onClick={() => {
              if (shuffleSongs) setShuffleSongs(false);
              setLoopSong(!loopSong);
            }}
          />
        </div>
        <audio
          muted={muted}
          autoPlay={songPlaying}
          onLoadedData={onLoadHandler}
          onTimeUpdate={timeUpdateHandler}
          onLoadedMetadata={timeUpdateHandler}
          ref={audioRef}
          src={currentSong.audio}
          loop={loopSong}
        ></audio>
      </div>
      <div className='volume-container'>
        <div className='volume-control'>
          <div className='volume-btn'>
            <FontAwesomeIcon
              size='1x'
              icon={muted ? faVolumeMute : faVolumeDown}
              loop={loopSong}
              onClick={() => {
                setMuted(!muted);
                volumeHandler(0.1);
              }}
            />
          </div>
          <div
            style={{ background: `linear-gradient(to right, ${currentSong.color[0]},${currentSong.color[1]})` }}
            className='track'
          >
            <input onChange={volumeHandler} min={0} max={100} value={muted ? 0 : volume * 100} type='range' />
            <div style={animateVolume} className='animate-volume'></div>
          </div>
          <div className='volume-btn'>
            <FontAwesomeIcon size='1x' icon={faVolumeUp} loop={loopSong} onClick={() => volumeHandler(1 * 100)} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Player;
