import React, { useState, useEffect, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import VideoPlayer from './VideoPlayer';
import VideoControls from './VideoControls';

export const VideoModal = ({
  video,
  videos = [],
  isOpen,
  onClose,
  onNavigate,
  onLike,
  onShare,
  isLiked = false,
}) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // Current video index helper
  const currentIndex = videos.findIndex((v) => String(v.id) === String(video?.id));
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < videos.length - 1;

  const handlePrev = useCallback(() => {
    if (hasPrev && onNavigate) {
      onNavigate(videos[currentIndex - 1]);
    }
  }, [hasPrev, currentIndex, videos, onNavigate]);

  const handleNext = useCallback(() => {
    if (hasNext && onNavigate) {
      onNavigate(videos[currentIndex + 1]);
    }
  }, [hasNext, currentIndex, videos, onNavigate]);

  // Keyboard Shortcuts: Esc (Close), Left (Prev), Right (Next), Space (Play/Pause)
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key === ' ' || e.code === 'Space') {
        e.preventDefault();
        setIsPlaying((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, handlePrev, handleNext]);

  // Reset video state when target video changes
  useEffect(() => {
    setIsPlaying(true);
    setCurrentTime(0);
  }, [video?.id]);

  if (!isOpen || !video) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-2xl animate-fade-in">
      {/* Background Backdrop Click to Close */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Top Header Controls (High Contrast Top-Left Badge & Top-Right Close) */}
      <div className="absolute top-6 left-6 right-6 flex items-center justify-between z-40 pointer-events-none">
        {/* Top-Left Now Playing Badge - Solid High Contrast White Badge */}
        <div className="pointer-events-auto bg-white text-slate-900 px-5 py-2.5 rounded-full text-xs font-black flex items-center gap-2.5 border-2 border-white shadow-2xl">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-600 animate-pulse" />
          <span className="tracking-wide">Now Playing: {currentIndex + 1} of {videos.length}</span>
        </div>

        {/* Top-Right Close Button - High Contrast Solid White */}
        <button
          onClick={onClose}
          aria-label="Close modal"
          className="pointer-events-auto p-3 rounded-full bg-white hover:bg-rose-600 text-slate-900 hover:text-white active:scale-95 transition-all border-2 border-white shadow-2xl focus:outline-none focus:ring-2 focus:ring-rose-500"
        >
          <X className="w-6 h-6 stroke-[2.5]" />
        </button>
      </div>

      {/* Main Video Container Frame */}
      <div className="relative w-full max-w-lg aspect-[9/16] max-h-[88vh] rounded-3xl overflow-hidden bg-black border-2 border-white/20 shadow-2xl z-30 flex items-center justify-center">
        <VideoPlayer
          videoUrl={video.videoUrl}
          poster={video.thumbnail}
          title={video.title}
          isActive={true}
          shouldPlay={isPlaying}
          isMuted={isMuted}
          onTimeUpdate={(t) => setCurrentTime(t)}
          onDurationChange={(d) => setDuration(d)}
          onClick={() => setIsPlaying(!isPlaying)}
          className="w-full h-full"
        />

        {/* Floating Custom Controls Overlay */}
        <div className="absolute bottom-4 left-4 right-4 z-40">
          <div className="mb-3 px-2">
            <h3 className="text-lg font-black text-white tracking-tight drop-shadow-md">{video.title}</h3>
            <p className="text-xs text-slate-200 line-clamp-2 mt-0.5 font-medium drop-shadow-sm">{video.description}</p>
          </div>

          <VideoControls
            isPlaying={isPlaying}
            isMuted={isMuted}
            currentTime={currentTime}
            duration={duration}
            likes={video.likes}
            shares={video.shares}
            isLiked={isLiked}
            onTogglePlay={() => setIsPlaying(!isPlaying)}
            onToggleMute={() => setIsMuted(!isMuted)}
            onSeek={(newTime) => setCurrentTime(newTime)}
            onLike={() => onLike(video.id)}
            onShare={() => onShare(video.id)}
          />
        </div>
      </div>

      {/* Previous Video Navigation Button - Solid White High Contrast */}
      {hasPrev && (
        <button
          onClick={handlePrev}
          aria-label="Previous video in modal"
          className="absolute left-4 sm:left-12 top-1/2 -translate-y-1/2 z-40 p-4 sm:p-5 rounded-full bg-white hover:bg-rose-600 text-slate-900 hover:text-white active:scale-95 transition-all border-2 border-white shadow-2xl focus:outline-none focus:ring-2 focus:ring-rose-500"
        >
          <ChevronLeft className="w-8 h-8 stroke-[3]" />
        </button>
      )}

      {/* Next Video Navigation Button - Solid White High Contrast */}
      {hasNext && (
        <button
          onClick={handleNext}
          aria-label="Next video in modal"
          className="absolute right-4 sm:right-12 top-1/2 -translate-y-1/2 z-40 p-4 sm:p-5 rounded-full bg-white hover:bg-rose-600 text-slate-900 hover:text-white active:scale-95 transition-all border-2 border-white shadow-2xl focus:outline-none focus:ring-2 focus:ring-rose-500"
        >
          <ChevronRight className="w-8 h-8 stroke-[3]" />
        </button>
      )}
    </div>
  );
};

export default VideoModal;
