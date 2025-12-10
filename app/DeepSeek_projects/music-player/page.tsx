'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { FaPlay, FaPause, FaBackward, FaForward } from 'react-icons/fa';

const songs = ['hey', 'summer', 'ukulele'];

export default function MusicPlayer() {
  const [songIndex, setSongIndex] = useState(2);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState('0:00');
  const [duration, setDuration] = useState('0:00');
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const progressContainerRef = useRef<HTMLDivElement>(null);

  const loadSong = useCallback((index: number) => {
    const song = songs[index];
    if (audioRef.current) {
      audioRef.current.src = `/music/${song}.mp3`;
      if (isPlaying) {
        audioRef.current.play();
      }
    }
  }, [isPlaying]);

  const playSong = useCallback(() => {
    audioRef.current?.play();
    setIsPlaying(true);
  }, []);

  const pauseSong = useCallback(() => {
    audioRef.current?.pause();
    setIsPlaying(false);
  }, []);

  const prevSong = useCallback(() => {
    setSongIndex(prev => {
      const newIndex = prev === 0 ? songs.length - 1 : prev - 1;
      return newIndex;
    });
  }, []);

  const nextSong = useCallback(() => {
    setSongIndex(prev => {
      const newIndex = prev === songs.length - 1 ? 0 : prev + 1;
      return newIndex;
    });
  }, []);

  const updateProgress = useCallback((e: React.SyntheticEvent<HTMLAudioElement>) => {
    const audio = e.currentTarget;
    const { duration, currentTime } = audio;
    if (duration) {
      const progressPercent = (currentTime / duration) * 100;
      setProgress(progressPercent);
      
      // Update current time display
      const minutes = Math.floor(currentTime / 60);
      const seconds = Math.floor(currentTime % 60);
      setCurrentTime(`${minutes}:${seconds.toString().padStart(2, '0')}`);
    }
  }, []);

  const setAudioProgress = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressContainerRef.current || !audioRef.current) return;
    
    const width = progressContainerRef.current.clientWidth;
    const clickX = e.nativeEvent.offsetX;
    const audioDuration = audioRef.current.duration;
    
    if (audioDuration) {
      audioRef.current.currentTime = (clickX / width) * audioDuration;
    }
  }, []);

  const handleLoadedMetadata = useCallback((e: React.SyntheticEvent<HTMLAudioElement>) => {
    const audio = e.currentTarget;
    const totalMinutes = Math.floor(audio.duration / 60);
    const totalSeconds = Math.floor(audio.duration % 60);
    setDuration(`${totalMinutes}:${totalSeconds.toString().padStart(2, '0')}`);
  }, []);

  const handleEnded = useCallback(() => {
    nextSong();
  }, [nextSong]);

  useEffect(() => {
    loadSong(songIndex);
  }, [songIndex, loadSong]);

  const handlePlayPause = () => {
    if (isPlaying) {
      pauseSong();
    } else {
      playSong();
    }
  };

  return (
    <>
      <style jsx global>{`
        * {
          box-sizing: border-box;
        }

        body {
          background-image: linear-gradient(
            0deg,
            rgba(247, 247, 247, 1) 23.8%,
            rgba(252, 221, 221, 1) 92%
          );
          height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          font-family: 'Lato', sans-serif;
          margin: 0;
        }

        .music-container {
          background-color: #fff;
          border-radius: 15px;
          box-shadow: 0 20px 20px 0 rgba(252, 169, 169, 0.6);
          display: flex;
          padding: 20px 30px;
          position: relative;
          margin: 100px 0;
          z-index: 10;
        }

        .img-container {
          position: relative;
          width: 110px;
        }

        .img-container::after {
          content: '';
          background-color: #fff;
          border-radius: 50%;
          position: absolute;
          bottom: 100%;
          left: 50%;
          width: 20px;
          height: 20px;
          transform: translate(-50%, 50%);
        }

        .img-container img {
          border-radius: 50%;
          object-fit: cover;
          height: 110px;
          width: inherit;
          position: absolute;
          bottom: 0;
          left: 0;
          animation: rotate 3s linear infinite;
          animation-play-state: paused;
        }

        .music-container.play .img-container img {
          animation-play-state: running;
        }

        @keyframes rotate {
          from {
            transform: rotate(0deg);
          }

          to {
            transform: rotate(360deg);
          }
        }

        .navigation {
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1;
        }

        .action-btn {
          background-color: #fff;
          border: 0;
          color: #dfdbdf;
          font-size: 20px;
          cursor: pointer;
          padding: 10px;
          margin: 0 20px;
        }

        .action-btn.action-btn-big {
          color: #cdc2d0;
          font-size: 30px;
        }

        .action-btn:focus {
          outline: 0;
        }

        .music-info {
          background-color: rgba(255, 255, 255, 0.5);
          border-radius: 15px 15px 0 0;
          position: absolute;
          top: 0;
          left: 20px;
          width: calc(100% - 40px);
          padding: 10px 10px 10px 150px;
          opacity: 0;
          transform: translateY(0%);
          transition: transform 0.3s ease-in, opacity 0.3s ease-in;
          z-index: 0;
        }

        .music-container.play .music-info {
          opacity: 1;
          transform: translateY(-100%);
        }

        .music-info h4 {
          margin: 0;
        }

        .progress-container {
          background: #fff;
          border-radius: 5px;
          cursor: pointer;
          margin: 10px 0;
          height: 4px;
          width: 100%;
        }

        .progress {
          background-color: #fe8daa;
          border-radius: 5px;
          height: 100%;
          width: ${progress}%;
          transition: width 0.1s linear;
        }

        .time-display {
          display: flex;
          justify-content: space-between;
          font-size: 12px;
          color: #666;
          margin-top: 5px;
        }
      `}</style>

      <h1>Music Player</h1>

      <div className={`music-container ${isPlaying ? 'play' : ''}`}>
        <div className="music-info">
          <h4>{songs[songIndex]}</h4>
          <div 
            className="progress-container" 
            ref={progressContainerRef}
            onClick={setAudioProgress}
          >
            <div className="progress"></div>
          </div>
          <div className="time-display">
            <span>{currentTime}</span>
            <span>{duration}</span>
          </div>
        </div>

        <audio
          ref={audioRef}
          onTimeUpdate={updateProgress}
          onLoadedMetadata={handleLoadedMetadata}
          onEnded={handleEnded}
        />

        <div className="img-container">
          <img 
            src={`/img/${songs[songIndex]}.jpg`} 
            alt="music-cover" 
          />
        </div>
        
        <div className="navigation">
          <button 
            id="prev" 
            className="action-btn"
            onClick={prevSong}
          >
            <FaBackward />
          </button>
          <button 
            id="play" 
            className="action-btn action-btn-big"
            onClick={handlePlayPause}
          >
            {isPlaying ? <FaPause /> : <FaPlay />}
          </button>
          <button 
            id="next" 
            className="action-btn"
            onClick={nextSong}
          >
            <FaForward />
          </button>
        </div>
      </div>
    </>
  );
}