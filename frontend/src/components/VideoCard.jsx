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
    threshold: 0.25,
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
      className="group relative flex-shrink-0 w-[270px] sm:w-[290px] md:w-[310px] aspect-[9/16] rounded-3xl overflow-hidden bg-slate-900 transition-all duration-300 cursor-pointer select-none border border-slate-200 shadow-xl hover:shadow-2xl hover:shadow-rose-500/20 hover:border-rose-500 flex flex-col justify-between"
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
          className="w-full h-full transform group-hover:scale-105 transition-transform duration-700 ease-out"
        />

        {/* Floating Top Header Badges */}
        <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between z-10 pointer-events-none">
          <div className="bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-full text-[10px] font-black tracking-wider text-slate-900 uppercase flex items-center gap-1.5 border border-slate-200 shadow-md">
            <Flame className="w-3.5 h-3.5 text-rose-600 fill-current animate-pulse" />
            <span>Approved</span>
          </div>

          <button
            onClick={handleLikeClick}
            aria-label="Like video"
            className={`pointer-events-auto p-2.5 rounded-full transition-all duration-300 active:scale-90 shadow-md backdrop-blur-md ${
              isLiked
                ? 'bg-rose-600 text-white shadow-rose-500/40 border border-rose-500'
                : 'bg-white/95 text-slate-800 hover:text-slate-900 hover:bg-white border border-slate-200'
            } ${justLiked ? 'animate-heart-pop' : ''}`}
          >
            <Heart className={`w-4 h-4 ${isLiked ? 'fill-current text-white' : 'text-slate-700'}`} />
          </button>
        </div>

        {/* Center Play Icon Overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none z-10 scale-95 group-hover:scale-100">
          <div className="w-16 h-16 rounded-full bg-rose-600 flex items-center justify-center text-white shadow-2xl shadow-rose-600/50 border-2 border-white transform group-hover:rotate-6 transition-transform">
            <Play className="w-7 h-7 fill-current ml-1 text-white" />
          </div>
        </div>

        {/* Strong Bottom Gradient Overlay for High Contrast Text */}
        <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent pointer-events-none" />
      </div>

      {/* Bottom Information Card Container */}
      <div className="absolute bottom-0 inset-x-0 p-4 z-20 flex flex-col gap-1.5 pointer-events-auto">
        <h3 className="text-base font-extrabold text-white tracking-tight line-clamp-1 group-hover:text-rose-400 transition-colors drop-shadow-md">
          {video.title}
        </h3>
        
        <p className="text-xs text-slate-200 line-clamp-2 leading-relaxed font-medium drop-shadow-sm">
          {video.description}
        </p>

        {/* Footer Metrics Row */}
        <div className="flex items-center justify-between mt-2 pt-2.5 border-t border-white/20">
          <div className="flex items-center gap-2.5 text-xs font-bold text-white">
            <span className="flex items-center gap-1.5 bg-slate-900/90 backdrop-blur-md px-3 py-1 rounded-full text-[11px] border border-white/20 font-extrabold shadow-sm">
              <Heart className={`w-3.5 h-3.5 ${isLiked ? 'text-rose-500 fill-current' : 'text-rose-400'}`} />
              <span>{video.likes}</span>
            </span>
            <span className="flex items-center gap-1.5 bg-slate-900/90 backdrop-blur-md px-3 py-1 rounded-full text-[11px] border border-white/20 font-extrabold shadow-sm">
              <Share2 className="w-3.5 h-3.5 text-slate-300" />
              <span>{video.shares}</span>
            </span>
          </div>

          <button
            onClick={handleShareClick}
            aria-label="Share video"
            className="p-2 rounded-full bg-slate-900/90 hover:bg-slate-900 text-white transition-all active:scale-95 border border-white/20 shadow-sm"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
});

VideoCard.displayName = 'VideoCard';
export default VideoCard;
