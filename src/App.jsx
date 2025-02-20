import React, { useState, useRef } from "react";
import ReactPlayer from "react-player";
import {
  FaPlay,
  FaPause,
  FaVolumeUp,
  FaVolumeMute,
  FaArrowsAlt,
  FaStepBackward,
  FaStepForward,
} from "react-icons/fa";
import fscreen from "fscreen";
import "./App.css";

const App = () => {
  const videoUrls = [
    "https://www.youtube.com/watch?v=GfSUvqslrE8",
    "https://www.youtube.com/watch?v=m1i-sYxTX8I",
    "https://www.youtube.com/watch?v=STJgVuDibrc&t=4s",
  ];

  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const playerRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [seek, setSeek] = useState(0);

  const togglePlayPause = () => setIsPlaying(!isPlaying);

  const toggleMute = () => setIsMuted(!isMuted);

  const changeVolume = (e) => setVolume(parseFloat(e.target.value));

  const handleDuration = (duration) => {
    setDuration(duration);
  };

  const handleProgress = (progressData) => {
    setProgress(progressData.played * 100);
    setSeek(progressData.playedSeconds);
  };

  const handleSeek = (e) => {
    const newTime = (e.target.value / 100) * duration;
    setSeek(newTime);
    playerRef.current.seekTo(newTime);
  };

  const goToPreviousFrame = () => {
    const prevFrame = Math.max(seek - 0.04, 0);
    setSeek(prevFrame);
    playerRef.current.seekTo(prevFrame);
  };

  const goToNextFrame = () => {
    const nextFrame = Math.min(seek + 0.04, duration);
    setSeek(nextFrame);
    playerRef.current.seekTo(nextFrame);
  };

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    return `${hours > 0 ? hours + ":" : ""}${
      minutes < 10 ? "0" + minutes : minutes
    }:${secs < 10 ? "0" + secs : secs}`;
  };

  const toggleFullscreen = () => {
    const isFull = !isFullscreen;
    setIsFullscreen(isFull);
    if (isFull) {
      if (playerRef.current && playerRef.current.wrapper) {
        fscreen.requestFullscreen(playerRef.current.wrapper);
      }
    } else {
      fscreen.exitFullscreen();
    }
  };

  const goToNextVideo = () => {
    const nextIndex = (currentVideoIndex + 1) % videoUrls.length;
    setCurrentVideoIndex(nextIndex);
    setSeek(0);
  };

  const goToPreviousVideo = () => {
    const prevIndex =
      (currentVideoIndex - 1 + videoUrls.length) % videoUrls.length;
    setCurrentVideoIndex(prevIndex);
    setSeek(0);
  };

  return (
    <div className="video-player-container">
      <ReactPlayer
        ref={playerRef}
        url={videoUrls[currentVideoIndex]}
        playing={isPlaying}
        muted={isMuted}
        volume={volume}
        onProgress={handleProgress}
        onDuration={handleDuration}
        width="100%"
        height="100%"
        controls={false}
      />
      <div className="navigation-controls">
        <button onClick={goToPreviousVideo} className="carousel-control-btn">
          <FaStepBackward size={24} />
        </button>
        <button onClick={goToNextVideo} className="carousel-control-btn">
          <FaStepForward size={24} />
        </button>
      </div>
      <div className="controls">
        <div className="progress-bar-container">
          <span>{formatTime(seek)}</span>
          <input
            type="range"
            className="progress-bar"
            min="0"
            max="100"
            value={progress}
            onChange={handleSeek}
            width={"100%"}
          />
          <span>{formatTime(duration)}</span>
        </div>
        <div className="all-controls">
          <div className="left-control">
            <button onClick={toggleMute} className="control-btn">
              {isMuted ? <FaVolumeMute size={24} /> : <FaVolumeUp size={24} />}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={changeVolume}
              style={{
                width: "100px",
                margin: "0 10px",
                borderRadius: "8px",
                background: "#333",
              }}
            />
          </div>
          <div className="middle-control">
            <button onClick={goToPreviousFrame} className="control-btn">
              <FaStepBackward size={24} />
            </button>
            <button onClick={togglePlayPause} className="control-btn">
              {isPlaying ? <FaPause size={24} /> : <FaPlay size={24} />}
            </button>
            <button onClick={goToNextFrame} className="control-btn">
              <FaStepForward size={24} />
            </button>
          </div>
          <div className="right-control">
            <button onClick={toggleFullscreen} className="control-btn">
              <FaArrowsAlt size={24} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
