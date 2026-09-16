import React, { memo } from 'react';
import { Play } from 'lucide-react';
import VideoPlayer from './VideoPlayer';
import useIntersectionObserver from '../hooks/useIntersectionObserver';

export const VideoCard = memo(({
  video,
  onOpenModal,
  variant = 'compact', // 'compact' for top 3 videos, 'wide' for bottom grid
  autoPlay = true,
}) => {
  const [isHovered, setIsHovered] = React.useState(false);
  const [containerRef, isIntersecting] = useIntersectionObserver({
    threshold: 0.2,
    rootMargin: '50px 0px 50px 0px',
  });

  const cardSizing =
    variant === 'wide'
      ? 'w-[190px] sm:w-[220px] md:w-[240px] aspect-[4/5]'
      : 'w-[190px] sm:w-[210px] md:w-[225px] aspect-[9/16]';

  const shouldPlay = autoPlay ? isIntersecting : (isIntersecting && isHovered);

  return (
    <div
      ref={containerRef}
      onClick={() => onOpenModal(video)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`group relative flex-shrink-0 ${cardSizing} rounded-2xl sm:rounded-3xl overflow-hidden bg-slate-900 transition-all duration-300 cursor-pointer select-none border border-slate-200 shadow-md hover:shadow-xl hover:scale-[1.03]`}
    >
      {/* Edge-to-Edge Pure Video Player */}
      <VideoPlayer
        videoUrl={video.videoUrl}
        poster={video.thumbnail}
        title={video.title}
        isActive={isIntersecting}
        shouldPlay={shouldPlay}
        isMuted={true}
        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
      />

      {/* Center Play Icon Overlay on Hover */}
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none z-10 scale-95 group-hover:scale-100 bg-black/20">
        <div className="w-14 h-14 rounded-full bg-slate-900/90 flex items-center justify-center text-white shadow-2xl border border-white/40 transform group-hover:rotate-6 transition-transform">
          <Play className="w-6 h-6 fill-current ml-1 text-white" />
        </div>
      </div>

      {/* Bottom Title Overlay */}
      <div className="absolute bottom-0 inset-x-0 p-3 z-10 bg-gradient-to-t from-slate-950/80 via-slate-950/40 to-transparent pointer-events-none">
        <h3 className="text-xs sm:text-sm font-bold text-white line-clamp-1 text-center drop-shadow-sm">
          {video.title}
        </h3>
      </div>
    </div>
  );
});

VideoCard.displayName = 'VideoCard';
export default VideoCard;
