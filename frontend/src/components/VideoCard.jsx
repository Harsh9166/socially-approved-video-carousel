import React, { useState, memo } from 'react';
import { Heart, Share2, Play, Flame } from 'lucide-react';
import VideoPlayer from './VideoPlayer';
import useIntersectionObserver from '../hooks/useIntersectionObserver';

export const VideoCard = memo(({
  video,
  onOpenModal,
  onLike,
  onShare,
  isLiked = false,
}) => {
  const [containerRef, isIntersecting] = useIntersectionObserver({
    threshold: 0.2,
    rootMargin: '50px 0px 50px 0px',
  });

  const [justLiked, setJustLiked] = useState(false);

  const handleLikeClick = (e) => {
    e.stopPropagation();
    setJustLiked(true);
    setTimeout(() => setJustLiked(false), 400);
    if (onLike) onLike(video.id);
  };

  const handleShareClick = (e) => {
    e.stopPropagation();
    if (onShare) onShare(video.id);
  };

  return (
    <div
      ref={containerRef}
      onClick={() => onOpenModal(video)}
      className="group relative flex-shrink-0 w-[240px] sm:w-[265px] md:w-[275px] aspect-[9/16] rounded-2xl sm:rounded-3xl overflow-hidden bg-slate-900 transition-all duration-300 cursor-pointer select-none border border-slate-200 shadow-md hover:shadow-2xl hover:scale-[1.02] flex flex-col justify-between"
    >
      {/* Top Section: Video Player / Lazy Poster */}
      <div className="relative w-full h-full overflow-hidden">
        <VideoPlayer
          videoUrl={video.videoUrl}
          poster={video.thumbnail}
          title={video.title}
          isActive={isIntersecting}
          shouldPlay={isIntersecting}
          isMuted={true}
          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
        />

        {/* Floating Top Header Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10 pointer-events-none">
          <div className="bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-extrabold tracking-wider text-slate-900 uppercase flex items-center gap-1 border border-slate-200 shadow-md">
            <Flame className="w-3 h-3 text-rose-600 fill-current animate-pulse" />
            <span>Approved</span>
          </div>

          <button
            onClick={handleLikeClick}
            aria-label="Like video"
            className={`pointer-events-auto p-2 rounded-full transition-all duration-300 active:scale-90 shadow-md backdrop-blur-md ${
              isLiked
                ? 'bg-rose-600 text-white border border-rose-500 shadow-rose-500/40'
                : 'bg-white/90 text-slate-800 hover:text-slate-900 hover:bg-white border border-slate-200'
            } ${justLiked ? 'animate-heart-pop' : ''}`}
          >
            <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-current text-white' : 'text-slate-700'}`} />
          </button>
        </div>

        {/* Center Play Icon Overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none z-10 scale-95 group-hover:scale-100">
          <div className="w-14 h-14 rounded-full bg-slate-900/90 flex items-center justify-center text-white shadow-2xl border border-white/40 transform group-hover:rotate-6 transition-transform">
            <Play className="w-6 h-6 fill-current ml-1 text-white" />
          </div>
        </div>

        {/* Strong Bottom Gradient Overlay for High Contrast Text */}
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent pointer-events-none" />
      </div>

      {/* Bottom Information Card Container */}
      <div className="absolute bottom-0 inset-x-0 p-3.5 z-20 flex flex-col gap-1 pointer-events-auto">
        <h3 className="text-sm sm:text-base font-extrabold text-white tracking-tight line-clamp-1 group-hover:text-rose-400 transition-colors drop-shadow-md">
          {video.title}
        </h3>
        
        <p className="text-[11px] sm:text-xs text-slate-200 line-clamp-1 leading-relaxed font-medium drop-shadow-sm">
          {video.description}
        </p>

        {/* Footer Metrics Row */}
        <div className="flex items-center justify-between mt-1.5 pt-2 border-t border-white/20">
          <div className="flex items-center gap-2 text-xs font-bold text-white">
            <span className="flex items-center gap-1 bg-slate-900/90 backdrop-blur-md px-2.5 py-0.5 rounded-full text-[10px] border border-white/20 font-extrabold shadow-sm">
              <Heart className={`w-3 h-3 ${isLiked ? 'text-rose-500 fill-current' : 'text-rose-400'}`} />
              <span>{video.likes}</span>
            </span>
            <span className="flex items-center gap-1 bg-slate-900/90 backdrop-blur-md px-2.5 py-0.5 rounded-full text-[10px] border border-white/20 font-extrabold shadow-sm">
              <Share2 className="w-3 h-3 text-slate-300" />
              <span>{video.shares}</span>
            </span>
          </div>

          <button
            onClick={handleShareClick}
            aria-label="Share video"
            className="p-1.5 rounded-full bg-slate-900/90 hover:bg-slate-900 text-white transition-all active:scale-95 border border-white/20 shadow-sm"
          >
            <Share2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
});

VideoCard.displayName = 'VideoCard';
export default VideoCard;
