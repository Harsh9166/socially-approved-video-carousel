import React, { useRef, useState, useEffect, memo } from 'react';
import Spinner from './Spinner';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export const VideoPlayer = memo(({
  videoUrl,
  poster,
  title,
  isActive = true,
  shouldPlay = false,
  isMuted = true,
  autoPlay = false,
  loop = true,
  controls = false,
  onTimeUpdate,
  onDurationChange,
  onEnded,
  onClick,
  className = '',
}) => {
  const videoRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  // Synchronize muted prop
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = isMuted;
    }
  }, [isMuted]);

  // Synchronize playback according to isActive and shouldPlay props
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !isActive) return;

    if (shouldPlay) {
      setIsLoading(true);
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
            setIsLoading(false);
            setHasError(false);
          })
          .catch((err) => {
            if (err.name !== 'AbortError' && err.name !== 'NotAllowedError') {
              console.warn('Playback notice:', err.message);
            }
            setIsPlaying(false);
            setIsLoading(false);
          });
      }
    } else {
      video.pause();
      setIsPlaying(false);
      setIsLoading(false);
    }
  }, [shouldPlay, isActive, videoUrl]);

  // Native HTML5 Video Event Handlers
  const handleLoadStart = () => {
    setIsLoading(true);
    setHasError(false);
  };

  const handleCanPlay = () => {
    setIsLoading(false);
    setIsBuffering(false);
    if (videoRef.current) {
      setDuration(videoRef.current.duration || 0);
    }
  };

  const handleWaiting = () => {
    setIsBuffering(true);
  };

  const handlePlaying = () => {
    setIsLoading(false);
    setIsBuffering(false);
    setIsPlaying(true);
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  const handleError = () => {
    if (!videoRef.current || !isActive) return;
    setIsLoading(false);
    setIsBuffering(false);
    if (shouldPlay) {
      setHasError(true);
      setErrorMessage('Video stream unavailable');
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const curr = videoRef.current.currentTime;
      setCurrentTime(curr);
      if (onTimeUpdate) onTimeUpdate(curr);
    }
  };

  const handleDurationChange = () => {
    if (videoRef.current) {
      const dur = videoRef.current.duration || 0;
      setDuration(dur);
      if (onDurationChange) onDurationChange(dur);
    }
  };

  const handleRetry = (e) => {
    e.stopPropagation();
    setHasError(false);
    setIsLoading(true);
    if (videoRef.current) {
      videoRef.current.load();
      videoRef.current.play().catch(() => {});
    }
  };

  return (
    <div
      className={`relative overflow-hidden bg-dark-900 group cursor-pointer ${className}`}
      onClick={onClick}
    >
      {/* Background Thumbnail Poster */}
      <img
        src={poster}
        alt={title}
        className={`absolute inset-0 w-full h-full object-cover select-none transition-opacity duration-300 ${
          isPlaying ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
        loading="lazy"
      />

      {/* Native Video Element */}
      {isActive && (
        <video
          ref={videoRef}
          src={videoUrl}
          poster={poster}
          playsInline
          muted={isMuted}
          loop={loop}
          preload="metadata"
          controls={controls}
          onLoadStart={handleLoadStart}
          onCanPlay={handleCanPlay}
          onWaiting={handleWaiting}
          onPlaying={handlePlaying}
          onPause={handlePause}
          onError={handleError}
          onTimeUpdate={handleTimeUpdate}
          onDurationChange={handleDurationChange}
          onEnded={onEnded}
          className={`w-full h-full object-cover select-none relative z-0 transition-opacity duration-300 ${
            isPlaying ? 'opacity-100' : 'opacity-0'
          }`}
        />
      )}

      {/* Loading / Buffering Spinner Overlay */}
      {(isLoading || isBuffering) && shouldPlay && !hasError && (
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-20 transition-opacity">
          <Spinner size="lg" />
        </div>
      )}

      {/* Error Fallback State */}
      {hasError && shouldPlay && (
        <div className="absolute inset-0 bg-dark-900/90 flex flex-col items-center justify-center p-4 text-center z-20">
          <AlertTriangle className="w-10 h-10 text-rose-500 mb-2 animate-bounce" />
          <p className="text-xs text-slate-200 font-bold mb-3">{errorMessage}</p>
          <button
            onClick={handleRetry}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-black shadow-md transition-all active:scale-95"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Retry</span>
          </button>
        </div>
      )}
    </div>
  );
});

VideoPlayer.displayName = 'VideoPlayer';
export default VideoPlayer;
