"use client";

import React, { useEffect, useRef, useState } from "react";
import Head from "next/head";

const CustomVideoPlayerPage: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0); // 0 - 100
  const [timestamp, setTimestamp] = useState("00:00");

  // Helper to format time as mm:ss
  const formatTime = (timeInSeconds: number): string => {
    if (!Number.isFinite(timeInSeconds) || timeInSeconds < 0) {
      return "00:00";
    }

    const minsNumber = Math.floor(timeInSeconds / 60);
    const secsNumber = Math.floor(timeInSeconds % 60);

    const mins = minsNumber < 10 ? `0${minsNumber}` : String(minsNumber);
    const secs = secsNumber < 10 ? `0${secsNumber}` : String(secsNumber);

    return `${mins}:${secs}`;
  };

  // Toggle play / pause
  const toggleVideoStatus = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video.play();
    } else {
      video.pause();
    }
  };

  // Stop video (reset to start and pause)
  const stopVideo = () => {
    const video = videoRef.current;
    if (!video) return;

    video.currentTime = 0;
    video.pause();
    setIsPlaying(false);
    setProgress(0);
    setTimestamp("00:00");
  };

  // Fired whenever the video's playback position changes
  const handleTimeUpdate: React.ReactEventHandler<HTMLVideoElement> = (e) => {
    const video = e.currentTarget;
    const { currentTime, duration } = video;

    if (duration && duration > 0) {
      const newProgress = (currentTime / duration) * 100;
      setProgress(newProgress);
    }

    setTimestamp(formatTime(currentTime));
  };

  // Fired when video starts playing
  const handlePlay: React.ReactEventHandler<HTMLVideoElement> = () => {
    setIsPlaying(true);
  };

  // Fired when video is paused
  const handlePause: React.ReactEventHandler<HTMLVideoElement> = () => {
    setIsPlaying(false);
  };

  // Set video time based on progress slider
  const handleProgressChange: React.ChangeEventHandler<HTMLInputElement> = (
    e
  ) => {
    const video = videoRef.current;
    if (!video || !video.duration || video.duration <= 0) return;

    const value = parseFloat(e.target.value); // 0 - 100
    const newTime = (value * video.duration) / 100;
    video.currentTime = newTime;
    setProgress(value);
    setTimestamp(formatTime(newTime));
  };

  // Ensure timestamp is correct if metadata loads before any interaction
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedMetadata = () => {
      setTimestamp(formatTime(video.currentTime));
    };

    video.addEventListener("loadedmetadata", handleLoadedMetadata);
    return () => {
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
    };
  }, []);

  return (
    <>
      <Head>
        <title>Custom Video Player</title>
        {/* Google Font (Questrial) */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css?family=Questrial&display=swap"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <main>
        <h1>Custom Video Player</h1>

        <video
          ref={videoRef}
          id="video"
          className="screen"
          src="/videos/gone.mp4"
          poster="/img/poster.png"
          onClick={toggleVideoStatus}
          onTimeUpdate={handleTimeUpdate}
          onPlay={handlePlay}
          onPause={handlePause}
        />

        <div className="controls">
          <button className="btn" id="play" onClick={toggleVideoStatus}>
            <span className="icon">
              {isPlaying ? "❚❚" : "▶"}
            </span>
          </button>

          <button className="btn" id="stop" onClick={stopVideo}>
            <span className="icon">■</span>
          </button>

          <input
            type="range"
            id="progress"
            className="progress"
            min="0"
            max="100"
            step="0.1"
            value={progress.toString()}
            onChange={handleProgressChange}
          />

          <span className="timestamp" id="timestamp">
            {timestamp}
          </span>
        </div>
      </main>

      {/* Global styles converted from your original CSS */}
      <style jsx global>{`
        * {
          box-sizing: border-box;
        }

        html,
        body {
          padding: 0;
          margin: 0;
        }

        body {
          font-family: "Questrial", sans-serif;
          background-color: #666;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
        }

        h1 {
          color: #fff;
          text-align: center;
        }

        main {
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .screen {
          cursor: pointer;
          width: 60%;
          background-color: #000 !important;
          border-top-left-radius: 10px;
          border-top-right-radius: 10px;
          display: block;
        }

        .controls {
          background: #333;
          color: #fff;
          width: 60%;
          border-bottom-left-radius: 10px;
          border-bottom-right-radius: 10px;
          display: flex;
          align-items: center;
          padding: 10px;
          gap: 8px;
        }

        .controls .btn {
          border: 0;
          background: transparent;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          font-size: 20px;
          color: #fff;
        }

        .controls #play .icon {
          color: ${"#28a745"};
        }

        .controls #stop .icon {
          color: ${"#dc3545"};
        }

        .controls .timestamp {
          color: #fff;
          font-weight: bold;
          margin-left: 10px;
          white-space: nowrap;
        }

        .btn:focus {
          outline: 0;
        }

        .progress {
          flex: 1;
        }

        @media (max-width: 800px) {
          .screen,
          .controls {
            width: 90%;
          }
        }

        /* Slider styling from progress.css */

        input[type="range"] {
          -webkit-appearance: none;
          width: 100%;
          background: transparent;
        }

        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
        }

        input[type="range"]:focus {
          outline: none;
        }

        input[type="range"]::-ms-track {
          width: 100%;
          cursor: pointer;
          background: transparent;
          border-color: transparent;
          color: transparent;
        }

        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          border: 1px solid #000000;
          height: 36px;
          width: 16px;
          border-radius: 3px;
          background: #ffffff;
          cursor: pointer;
          margin-top: -14px;
          box-shadow: 1px 1px 1px #000000, 0px 0px 1px #0d0d0d;
        }

        input[type="range"]::-moz-range-thumb {
          box-shadow: 1px 1px 1px #000000, 0px 0px 1px #0d0d0d;
          border: 1px solid #000000;
          height: 36px;
          width: 16px;
          border-radius: 3px;
          background: #ffffff;
          cursor: pointer;
        }

        input[type="range"]::-ms-thumb {
          box-shadow: 1px 1px 1px #000000, 0px 0px 1px #0d0d0d;
          border: 1px solid #000000;
          height: 36px;
          width: 16px;
          border-radius: 3px;
          background: #ffffff;
          cursor: pointer;
        }

        input[type="range"]::-webkit-slider-runnable-track {
          width: 100%;
          height: 8.4px;
          cursor: pointer;
          box-shadow: 1px 1px 1px #000000, 0px 0px 1px #0d0d0d;
          background: #3071a9;
          border-radius: 1.3px;
          border: 0.2px solid #010101;
        }

        input[type="range"]:focus::-webkit-slider-runnable-track {
          background: #367ebd;
        }

        input[type="range"]::-moz-range-track {
          width: 100%;
          height: 8.4px;
          cursor: pointer;
          box-shadow: 1px 1px 1px #000000, 0px 0px 1px #0d0d0d;
          background: #3071a9;
          border-radius: 1.3px;
          border: 0.2px solid #010101;
        }

        input[type="range"]::-ms-track {
          width: 100%;
          height: 8.4px;
          cursor: pointer;
          background: transparent;
          border-color: transparent;
          border-width: 16px 0;
          color: transparent;
        }

        input[type="range"]::-ms-fill-lower {
          background: #2a6495;
          border: 0.2px solid #010101;
          border-radius: 2.6px;
          box-shadow: 1px 1px 1px #000000, 0px 0px 1px #0d0d0d;
        }

        input[type="range"]:focus::-ms-fill-lower {
          background: #3071a9;
        }

        input[type="range"]::-ms-fill-upper {
          background: #3071a9;
          border: 0.2px solid #010101;
          border-radius: 2.6px;
          box-shadow: 1px 1px 1px #000000, 0px 0px 1px #0d0d0d;
        }

        input[type="range"]:focus::-ms-fill-upper {
          background: #367ebd;
        }
      `}</style>
    </>
  );
};

export default CustomVideoPlayerPage;
