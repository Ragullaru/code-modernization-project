"use client";

import { useEffect, useRef, useState } from "react";

const songs = ["hey", "summer", "ukulele"] as const;
type SongId = (typeof songs)[number];

const formatTime = (time: number | null | undefined): string => {
  if (!time || Number.isNaN(time)) return "00:00";
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  const m = minutes < 10 ? `0${minutes}` : `${minutes}`;
  const s = seconds < 10 ? `0${seconds}` : `${seconds}`;
  return `${m}:${s}`;
};

const MusicPlayerPage = () => {
  const [songIndex, setSongIndex] = useState<number>(2); // default "ukulele"
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentSong: SongId = songs[songIndex];

  const handlePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => {
          // autoplay might be blocked
        });
    }
  };

  const handlePrev = () => {
    setSongIndex((prev) => (prev - 1 < 0 ? songs.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setSongIndex((prev) => (prev + 1 > songs.length - 1 ? 0 : prev + 1));
  };

  const handleTimeUpdate = () => {
    const audio = audioRef.current;
    if (!audio) return;

    const { currentTime: ct, duration: d } = audio;
    setCurrentTime(ct || 0);
    setDuration(d || 0);
    if (d && !Number.isNaN(d)) {
      setProgress((ct / d) * 100);
    } else {
      setProgress(0);
    }
  };

  const handleProgressClick = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    const audio = audioRef.current;
    if (!audio || !duration) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const newTime = (clickX / width) * duration;
    audio.currentTime = newTime;
  };

  const handleEnded = () => {
    setSongIndex((prev) => (prev + 1 > songs.length - 1 ? 0 : prev + 1));
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    setProgress(0);
    setCurrentTime(0);
    setDuration(0);

    if (isPlaying) {
      audio
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));
    }
  }, [songIndex]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <main>
        <h1>Music Player</h1>

        <div
          className={`music-container${isPlaying ? " play" : ""}`}
          id="music-container"
        >
          <div className="music-info">
            <h4 id="title">{currentSong}</h4>
            <div
              className="progress-container"
              id="progress-container"
              onClick={handleProgressClick}
            >
              <div
                className="progress"
                id="progress"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="time-container">
              <span id="currTime">{formatTime(currentTime)}</span>
              <span className="time-separator">/</span>
              <span id="durTime">{formatTime(duration)}</span>
            </div>
          </div>

          <audio
            id="audio"
            ref={audioRef}
            src={`/music/${currentSong}.mp3`}
            onTimeUpdate={handleTimeUpdate}
            onEnded={handleEnded}
          />

          <div className="img-container">
            <img
              src={`/img/${currentSong}.jpg`}
              alt="music-cover"
              id="cover"
            />
          </div>

          <div className="navigation">
            <button
              id="prev"
              className="action-btn"
              type="button"
              onClick={handlePrev}
            >
              ⏮
            </button>
            <button
              id="play"
              className="action-btn action-btn-big"
              type="button"
              onClick={handlePlayPause}
            >
              {isPlaying ? "⏸" : "▶"}
            </button>
            <button
              id="next"
              className="action-btn"
              type="button"
              onClick={handleNext}
            >
              ⏭
            </button>
          </div>
        </div>
      </main>

      <style jsx>{`
        :global(body) {
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
          font-family: "Lato", sans-serif;
          margin: 0;
        }

        main {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        h1 {
          margin: 0;
        }

        .music-container {
          background-color: #fff;
          border-radius: 15px;
          box-shadow: 0 20px 20px 0 rgba(252, 169, 169, 0.6);
          display: flex;
          align-items: center;
          padding: 80px 30px 20px 30px; /* extra top space for info bar */
          position: relative;
          margin: 100px 0;
          z-index: 10;
          overflow: hidden; /* CLIP children to rounded card */
        }

        .img-container {
          position: relative;
          width: 110px;
          height: 110px;
        }

        .img-container::after {
          content: "";
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
          margin-left: 40px;
          z-index: 1;
        }

        .action-btn {
          background-color: #fff;
          border: none;
          color: #df6e8a;
          font-size: 20px;
          cursor: pointer;
          padding: 10px;
          margin: 0 20px;
        }

        .action-btn.action-btn-big {
          font-size: 30px;
        }

        .action-btn:focus {
          outline: 0;
        }

        /* Info bar now full width but clipped by overflow:hidden */
        .music-info {
          background-color: rgba(255, 255, 255, 0.5);
          border-radius: 15px 15px 0 0;
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          padding: 10px 30px;
          z-index: 0;
        }

        .music-info h4 {
          margin: 0;
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
          width: 0%;
          transition: width 0.1s linear;
        }

        .time-container {
          display: flex;
          align-items: center;
          font-size: 12px;
          color: #555;
          margin-top: 4px;
        }

        .time-container span {
          min-width: 40px;
          text-align: center;
        }

        .time-separator {
          width: 12px;
        }

        @media (max-width: 600px) {
          .music-container {
            flex-direction: column;
            align-items: center;
            padding: 80px 20px 20px 20px;
          }

          .navigation {
            margin-left: 0;
          }
        }
      `}</style>
    </>
  );
};

export default MusicPlayerPage;
