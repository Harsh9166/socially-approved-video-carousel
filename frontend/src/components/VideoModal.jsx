import React, { useState, useEffect, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight, Heart, Send, ShoppingBag, Volume2, VolumeX, ExternalLink } from 'lucide-react';
import VideoPlayer from './VideoPlayer';

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

  const currentLikes = video.likes + (isLiked ? 1 : 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md animate-fade-in">
      {/* Background Backdrop Click to Close */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Top-Right Close Button */}
      <button
        onClick={onClose}
        aria-label="Close modal"
        className="absolute top-5 right-5 sm:top-8 sm:right-8 z-50 p-2.5 rounded-full bg-black/40 hover:bg-black/70 text-white transition-all border border-white/20 focus:outline-none"
      >
        <X className="w-6 h-6" />
      </button>

      {/* Main Video Container Frame (driptrip.in style) */}
      <div className="relative w-full max-w-[360px] sm:max-w-[400px] aspect-[9/16] max-h-[85vh] rounded-3xl overflow-hidden bg-black shadow-2xl z-30 flex items-center justify-center border border-white/10">
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
          className="w-full h-full object-cover"
        />

        {/* Mute/Unmute Floating Button (Top Right Inside Video) */}
        <button
          onClick={() => setIsMuted(!isMuted)}
          className="absolute top-4 right-4 z-40 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-all backdrop-blur-sm"
        >
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>

        {/* Right Floating Actions Column (Like, Share, Cart) */}
        <div className="absolute right-4 bottom-28 z-40 flex flex-col items-center gap-5">
          {/* Like Button */}
          <button
            onClick={() => onLike && onLike(video.id)}
            className="flex flex-col items-center gap-1 group text-white focus:outline-none"
          >
            <div className="p-2.5 rounded-full bg-black/40 group-hover:bg-black/60 backdrop-blur-sm transition-all border border-white/10">
              <Heart
                className={`w-5 h-5 transition-transform group-active:scale-125 ${
                  isLiked ? 'fill-rose-500 text-rose-500' : 'text-white'
                }`}
              />
            </div>
            <span className="text-[11px] font-bold drop-shadow-md text-white">{currentLikes}</span>
          </button>

          {/* Share Button */}
          <button
            onClick={() => onShare && onShare(video.id)}
            className="flex flex-col items-center gap-1 group text-white focus:outline-none"
          >
            <div className="p-2.5 rounded-full bg-black/40 group-hover:bg-black/60 backdrop-blur-sm transition-all border border-white/10">
              <Send className="w-5 h-5 text-white transform -rotate-45 ml-0.5" />
            </div>
            <span className="text-[11px] font-bold drop-shadow-md text-white">{video.shares}</span>
          </button>

          {/* Shopping Bag Button */}
          <button
            className="flex flex-col items-center gap-1 group text-white focus:outline-none"
          >
            <div className="p-2.5 rounded-full bg-black/40 group-hover:bg-black/60 backdrop-blur-sm transition-all border border-white/10">
              <ShoppingBag className="w-5 h-5 text-white" />
            </div>
          </button>
        </div>

        {/* Bottom Floating Product Card (driptrip.in overlay style) */}
        <div className="absolute bottom-3 left-3 right-3 z-40">
          <div className="bg-white/95 backdrop-blur-md rounded-2xl p-3 border border-white/40 shadow-2xl text-slate-900">
            {/* Top row: Thumbnail, Title, Price, View More */}
            <div className="flex items-center gap-3 mb-2.5">
              <img
                src={video.thumbnail}
                alt={video.title}
                className="w-12 h-12 rounded-xl object-cover border border-slate-200 shadow-sm flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <h4 className="text-xs font-black text-slate-900 truncate tracking-tight">{video.title}</h4>
                  <button className="px-2.5 py-1 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] font-bold tracking-wide flex-shrink-0 flex items-center gap-1 transition-all">
                    View More <ExternalLink className="w-2.5 h-2.5" />
                  </button>
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs font-extrabold text-slate-900">Rs. 2,199</span>
                  <span className="text-[10px] font-semibold text-slate-400 line-through">Rs. 3,900</span>
                  <span className="text-[9px] font-black text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded border border-rose-100">44% OFF</span>
                </div>
              </div>
            </div>

            {/* Bottom Add to Cart Action */}
            <button className="w-full py-2 rounded-xl bg-slate-900 hover:bg-black active:scale-[0.99] text-white text-xs font-bold transition-all shadow-md">
              Add to Cart
            </button>
          </div>
        </div>
      </div>

      {/* Previous Video Navigation Button */}
      {hasPrev && (
        <button
          onClick={handlePrev}
          aria-label="Previous video"
          className="absolute left-4 sm:left-12 top-1/2 -translate-y-1/2 z-40 p-3 sm:p-4 rounded-full bg-white text-slate-900 hover:bg-slate-100 active:scale-95 transition-all shadow-xl focus:outline-none"
        >
          <ChevronLeft className="w-6 h-6 stroke-[2.5]" />
        </button>
      )}

      {/* Next Video Navigation Button */}
      {hasNext && (
        <button
          onClick={handleNext}
          aria-label="Next video"
          className="absolute right-4 sm:right-12 top-1/2 -translate-y-1/2 z-40 p-3 sm:p-4 rounded-full bg-white text-slate-900 hover:bg-slate-100 active:scale-95 transition-all shadow-xl focus:outline-none"
        >
          <ChevronRight className="w-6 h-6 stroke-[2.5]" />
        </button>
      )}
    </div>
  );
};

export default VideoModal;
