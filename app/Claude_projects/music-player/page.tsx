'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward } from 'lucide-react';

export default function MusicPlayer() {
  const songs = ['hey', 'summer', 'ukulele'];
  const [songIndex, setSongIndex] = useState(2);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState('0:00');
  const [duration, setDuration] = useState('0:00');

  const audioRef = useRef<HTMLAudioElement>(null);
  const progressContainerRef = useRef<HTMLDivElement>(null);

  const currentSong = songs[songIndex];

  // Format time helper
  const formatTime = (time: number): string => {
    if (isNaN(time)) return '0:00';
    
    let minutes = Math.floor(time / 60);
    let seconds = Math.floor(time % 60);
    
    return `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
  };

  // Play song
  const playSong = () => {
    if (audioRef.current) {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  // Pause song
  const pauseSong = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  // Toggle play/pause
  const togglePlay = () => {
    if (isPlaying) {
      pauseSong();
    } else {
      playSong();
    }
  };

  // Previous song
  const prevSong = () => {
    setSongIndex((prev) => {
      const newIndex = prev - 1 < 0 ? songs.length - 1 : prev - 1;
      return newIndex;
    });
    setIsPlaying(true);
  };

  // Next song
  const nextSong = () => {
    setSongIndex((prev) => {
      const newIndex = prev + 1 > songs.length - 1 ? 0 : prev + 1;
      return newIndex;
    });
    setIsPlaying(true);
  };

  // Update progress
  const updateProgress = () => {
    if (audioRef.current) {
      const { duration, currentTime } = audioRef.current;
      const progressPercent = (currentTime / duration) * 100;
      setProgress(progressPercent || 0);
      setCurrentTime(formatTime(currentTime));
      setDuration(formatTime(duration));
    }
  };

  // Set progress on click
  const setProgressOnClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (progressContainerRef.current && audioRef.current) {
      const width = progressContainerRef.current.clientWidth;
      const clickX = e.nativeEvent.offsetX;
      const duration = audioRef.current.duration;
      audioRef.current.currentTime = (clickX / width) * duration;
    }
  };

  // Handle song end
  const handleSongEnd = () => {
    nextSong();
  };

  // Play new song when index changes
  useEffect(() => {
    if (audioRef.current && isPlaying) {
      audioRef.current.play();
    }
  }, [songIndex]);

  return (
    <>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css?family=Lato&display=swap');

        * {
          box-sizing: border-box;
        }

        body {
          background-image: linear-gradient(
            0deg,
            rgba(247, 247, 247, 1) 23.8%,
            rgba(252, 221, 221, 1) 92%
          );
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          font-family: 'Lato', sans-serif;
          margin: 0;
          padding: 20px;
        }

        h1 {
          margin-bottom: 20px;
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
          cursor: pointer;
          padding: 10px;
          margin: 0 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: color 0.2s;
        }

        .action-btn:hover {
          color: #cdc2d0;
        }

        .action-btn.action-btn-big {
          color: #cdc2d0;
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
          margin: 0 0 10px 0;
          text-transform: capitalize;
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
          transition: width 0.1s linear;
        }
      `}</style>

      <h1>Music Player</h1>

      <div className={`music-container ${isPlaying ? 'play' : ''}`}>
        <div className="music-info">
          <h4>{currentSong}</h4>
          <div
            className="progress-container"
            ref={progressContainerRef}
            onClick={setProgressOnClick}
          >
            <div className="progress" style={{ width: `${progress}%` }} />
          </div>
        </div>

        <audio
          ref={audioRef}
          src={`/music/${currentSong}.mp3`}
          onTimeUpdate={updateProgress}
          onEnded={handleSongEnd}
        />

        <div className="img-container">
          <img src={`/img/${currentSong}.jpg`} alt="music-cover" />
        </div>

        <div className="navigation">
          <button className="action-btn" onClick={prevSong}>
            <SkipBack size={20} />
          </button>
          <button className="action-btn action-btn-big" onClick={togglePlay}>
            {isPlaying ? <Pause size={30} /> : <Play size={30} />}
          </button>
          <button className="action-btn" onClick={nextSong}>
            <SkipForward size={20} />
          </button>
        </div>
      </div>
    </>
  );
}