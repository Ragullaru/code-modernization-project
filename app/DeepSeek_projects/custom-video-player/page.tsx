'use client';

import { useState, useRef, useEffect } from 'react';
import { Play, Pause, Square } from 'lucide-react';

export default function CustomVideoPlayer() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState('00:00');
  const [duration, setDuration] = useState(0);

  // Initialize video duration
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedMetadata = () => {
      setDuration(video.duration);
    };

    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
    };
  }, []);

  // Toggle play/pause
  const toggleVideoStatus = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video.play();
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  // Update progress and timestamp
  const updateProgress = () => {
    const video = videoRef.current;
    if (!video || !duration) return;

    const currentProgress = (video.currentTime / duration) * 100;
    setProgress(currentProgress);

    // Format time as MM:SS
    const mins = Math.floor(video.currentTime / 60);
    const secs = Math.floor(video.currentTime % 60);
    const formattedMins = mins < 10 ? `0${mins}` : `${mins}`;
    const formattedSecs = secs < 10 ? `0${secs}` : `${secs}`;
    setCurrentTime(`${formattedMins}:${formattedSecs}`);
  };

  // Set video time based on progress bar
  const setVideoProgress = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current;
    if (!video || !duration) return;

    const newProgress = parseFloat(e.target.value);
    setProgress(newProgress);
    video.currentTime = (newProgress * duration) / 100;
  };

  // Stop video
  const stopVideo = () => {
    const video = videoRef.current;
    if (!video) return;

    video.pause();
    video.currentTime = 0;
    setIsPlaying(false);
    setProgress(0);
    setCurrentTime('00:00');
  };

  // Handle video click
  const handleVideoClick = () => {
    toggleVideoStatus();
  };

  // Handle video events
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleTimeUpdate = () => updateProgress();
    const handleEnded = () => {
      setIsPlaying(false);
      setProgress(100);
    };

    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('ended', handleEnded);

    return () => {
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('ended', handleEnded);
    };
  }, [duration]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
          Custom Video Player
        </h1>

        <div className="bg-gray-800 rounded-2xl overflow-hidden shadow-2xl">
          {/* Video Container */}
          <div className="relative">
            <video
              ref={videoRef}
              className="w-full h-auto cursor-pointer"
              poster="https://images.unsplash.com/photo-1574267432553-4b4628081c31?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
              onClick={handleVideoClick}
            >
              <source
                src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
                type="video/mp4"
              />
              Your browser does not support the video tag.
            </video>

            {/* Play overlay */}
            {!isPlaying && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                <button
                  onClick={toggleVideoStatus}
                  className="bg-white/20 backdrop-blur-sm p-6 rounded-full hover:bg-white/30 transition-all duration-300 transform hover:scale-110"
                >
                  <Play className="w-12 h-12 text-white" />
                </button>
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="p-6 bg-gray-900">
            <div className="flex items-center justify-between gap-4">
              {/* Play/Pause Button */}
              <button
                onClick={toggleVideoStatus}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white p-4 rounded-full transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg"
                aria-label={isPlaying ? 'Pause video' : 'Play video'}
              >
                {isPlaying ? (
                  <Pause className="w-6 h-6" />
                ) : (
                  <Play className="w-6 h-6" />
                )}
              </button>

              {/* Stop Button */}
              <button
                onClick={stopVideo}
                className="bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white p-4 rounded-full transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg"
                aria-label="Stop video"
              >
                <Square className="w-6 h-6" />
              </button>

              {/* Progress Bar */}
              <div className="flex-1">
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="0.1"
                  value={progress}
                  onChange={setVideoProgress}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gradient-to-r [&::-webkit-slider-thumb]:from-blue-400 [&::-webkit-slider-thumb]:to-purple-500 [&::-webkit-slider-thumb]:hover:scale-110 [&::-webkit-slider-thumb]:transition-transform"
                  aria-label="Video progress"
                />
              </div>

              {/* Timestamp */}
              <div className="bg-gray-800 px-4 py-2 rounded-lg min-w-[80px] text-center font-mono text-lg font-semibold">
                {currentTime}
              </div>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-8 bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
          <h2 className="text-2xl font-bold mb-4 text-blue-300">How to Use</h2>
          <ul className="space-y-2 text-gray-300">
            <li className="flex items-center gap-2">
              <Play className="w-4 h-4 text-green-400" />
              <span>Click the play button or video to play/pause</span>
            </li>
            <li className="flex items-center gap-2">
              <Square className="w-4 h-4 text-red-400" />
              <span>Stop button resets video to beginning</span>
            </li>
            <li className="flex items-center gap-2">
              <div className="w-4 h-1 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full" />
              <span>Drag progress bar to seek through video</span>
            </li>
            <li className="flex items-center gap-2">
              <div className="font-mono text-blue-300">00:00</div>
              <span>Displays current time in minutes and seconds</span>
            </li>
          </ul>
        </div>
      </div>

      <style jsx global>{`
        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 10px;
        }
        ::-webkit-scrollbar-track {
          background: #1f2937;
        }
        ::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #3b82f6, #8b5cf6);
          border-radius: 5px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #2563eb, #7c3aed);
        }
        
        /* Remove default range input styling in Firefox */
        input[type="range"]::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: linear-gradient(to right, #60a5fa, #a855f7);
          border: none;
          cursor: pointer;
        }
        
        input[type="range"]::-moz-range-track {
          background: #374151;
          height: 8px;
          border-radius: 4px;
        }
      `}</style>
    </div>
  );
}