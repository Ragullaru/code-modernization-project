'use client';

import React, { useRef, useState, useEffect } from 'react';

export default function CustomVideoPlayer() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [timestamp, setTimestamp] = useState('00:00');

  // Play & pause video
  const toggleVideoStatus = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
      } else {
        videoRef.current.pause();
      }
    }
  };

  // Update progress & timestamp
  const updateProgress = () => {
    if (videoRef.current) {
      const video = videoRef.current;
      const progressValue = (video.currentTime / video.duration) * 100;
      setProgress(progressValue);

      // Get the minutes
      let mins = Math.floor(video.currentTime / 60);
      let minsStr = mins < 10 ? '0' + String(mins) : String(mins);

      // Get Seconds
      let secs = Math.floor(video.currentTime % 60);
      let secsStr = secs < 10 ? '0' + String(secs) : String(secs);

      setTimestamp(`${minsStr}:${secsStr}`);
    }
  };

  // Set video time to progress
  const setVideoProgress = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (videoRef.current) {
      const newProgress = parseFloat(e.target.value);
      videoRef.current.currentTime = (newProgress * videoRef.current.duration) / 100;
      setProgress(newProgress);
    }
  };

  // Stop video
  const stopVideo = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.pause();
    }
  };

  // Handle video events
  const handlePlay = () => setIsPlaying(true);
  const handlePause = () => setIsPlaying(false);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.addEventListener('timeupdate', updateProgress);
      video.addEventListener('play', handlePlay);
      video.addEventListener('pause', handlePause);

      return () => {
        video.removeEventListener('timeupdate', updateProgress);
        video.removeEventListener('play', handlePlay);
        video.removeEventListener('pause', handlePause);
      };
    }
  }, []);

  return (
    <>
      <style jsx>{`
        * {
          box-sizing: border-box;
        }

        body {
          font-family: Arial, Helvetica, sans-serif;
          max-width: 900px;
          margin: 0 auto;
          padding: 0 20px;
        }

        h1 {
          text-align: center;
        }

        .screen {
          cursor: pointer;
          width: 100%;
          background-color: #000 !important;
          border-top-left-radius: 10px;
          border-top-right-radius: 10px;
        }

        .controls {
          background: #333;
          color: #fff;
          border-bottom-left-radius: 10px;
          border-bottom-right-radius: 10px;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 10px;
        }

        .controls .btn {
          border: 0;
          background: transparent;
          cursor: pointer;
        }

        .controls .fa-play {
          color: #28a745;
        }

        .controls .fa-stop {
          color: #dc3545;
        }

        .controls .fa-pause {
          color: #fff;
        }

        .controls .timestamp {
          color: #fff;
          font-weight: bold;
          margin-left: 10px;
        }

        .btn:focus {
          outline: 0;
        }

        @media (max-width: 800px) {
          .screen,
          .controls {
            width: 90%;
          }
        }

        /* Progress Bar */
        input[type='range'] {
          -webkit-appearance: none;
          margin: 10px 0;
          width: 100%;
        }
        input[type='range']:focus {
          outline: none;
        }
        input[type='range']::-webkit-slider-runnable-track {
          width: 100%;
          height: 8.4px;
          cursor: pointer;
          box-shadow: 0 0 0 #000000, 0 0 0 #0d0d0d;
          background: #3071a9;
          border-radius: 1.3px;
          border: 0.2px solid #010101;
        }
        input[type='range']::-webkit-slider-thumb {
          box-shadow: 0 0 0 #000000, 0 0 0 #0d0d0d;
          border: 0;
          height: 20px;
          width: 39px;
          border-radius: 7px;
          background: #ffffff;
          cursor: pointer;
          -webkit-appearance: none;
          margin-top: -7px;
        }
        input[type='range']:focus::-webkit-slider-runnable-track {
          background: #367ebd;
        }
        input[type='range']::-moz-range-track {
          width: 100%;
          height: 8.4px;
          cursor: pointer;
          box-shadow: 0 0 0 #000000, 0 0 0 #0d0d0d;
          background: #3071a9;
          border-radius: 1.3px;
          border: 0.2px solid #010101;
        }
        input[type='range']::-moz-range-thumb {
          box-shadow: 0 0 0 #000000, 0 0 0 #0d0d0d;
          border: 0;
          height: 20px;
          width: 39px;
          border-radius: 7px;
          background: #ffffff;
          cursor: pointer;
        }
        input[type='range']::-ms-track {
          width: 100%;
          height: 8.4px;
          cursor: pointer;
          background: transparent;
          border-color: transparent;
          border-width: 16px 0;
          color: transparent;
        }
        input[type='range']::-ms-fill-lower {
          background: #2a6495;
          border: 0.2px solid #010101;
          border-radius: 2.6px;
          box-shadow: 0 0 0 #000000, 0 0 0 #0d0d0d;
        }
        input[type='range']::-ms-fill-upper {
          background: #3071a9;
          border: 0.2px solid #010101;
          border-radius: 2.6px;
          box-shadow: 0 0 0 #000000, 0 0 0 #0d0d0d;
        }
        input[type='range']::-ms-thumb {
          box-shadow: 0 0 0 #000000, 0 0 0 #0d0d0d;
          border: 0;
          height: 20px;
          width: 39px;
          border-radius: 7px;
          background: #ffffff;
          cursor: pointer;
        }
        input[type='range']:focus::-ms-fill-lower {
          background: #3071a9;
        }
        input[type='range']:focus::-ms-fill-upper {
          background: #367ebd;
        }
      `}</style>

      <link
        href="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css"
        rel="stylesheet"
        integrity="sha384-wvfXpqpZZVQGK6TAh5PVlGOfQNHSoD2xbE+QkPxCAFlNEevoEH3Sl0sibVcOQVnN"
        crossOrigin="anonymous"
      />

      <h1>Custom Video Player</h1>
      <video
        ref={videoRef}
        className="screen"
        poster="/img/poster.png"
        onClick={toggleVideoStatus}
      >
        <source src="/videos/gone.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="controls">
        <button className="btn" onClick={toggleVideoStatus}>
          <i className={`fa ${isPlaying ? 'fa-pause' : 'fa-play'} fa-2x`}></i>
        </button>
        <button className="btn" onClick={stopVideo}>
          <i className="fa fa-stop fa-2x"></i>
        </button>
        <input
          type="range"
          className="progress"
          min="0"
          max="100"
          step="0.1"
          value={progress}
          onChange={setVideoProgress}
        />
        <span className="timestamp">{timestamp}</span>
      </div>
    </>
  );
}