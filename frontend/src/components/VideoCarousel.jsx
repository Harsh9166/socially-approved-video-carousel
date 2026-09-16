import React, { useState, useMemo } from 'react';
import VideoCard from './VideoCard';

const CATEGORIES = ['All', 'Streetwear', 'Summer', 'Luxury', 'Athleisure', 'Vintage', 'Knitwear'];

export const VideoCarousel = ({
  videos = [],
  onOpenModal,
  onLike,
  onShare,
  likedVideoIds = new Set(),
}) => {
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Filtered dataset according to Category
  const filteredVideos = useMemo(() => {
    return videos.filter((video) => {
      return (
        selectedCategory === 'All' ||
        video.title.toLowerCase().includes(selectedCategory.toLowerCase()) ||
        video.description.toLowerCase().includes(selectedCategory.toLowerCase())
      );
    });
  }, [videos, selectedCategory]);

  // Top 3 narrower videos and all remaining wider bottom videos (total 36 videos)
  const top3Videos = useMemo(() => filteredVideos.slice(0, 3), [filteredVideos]);
  const bottomVideos = useMemo(() => filteredVideos.slice(3), [filteredVideos]);

  return (
    <div className="relative w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
      {/* Category Pills (Clean Spaced Centered Bar) */}
      <div className="flex items-center justify-start sm:justify-center gap-2.5 overflow-x-auto no-scrollbar mb-6 pb-1">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-5 py-2 rounded-full text-xs sm:text-sm font-bold transition-all whitespace-nowrap flex-shrink-0 border shadow-sm ${
              selectedCategory === cat
                ? 'bg-slate-900 text-white border-slate-900 shadow-md scale-105'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Filtered Content View */}
      {filteredVideos.length > 0 ? (
        <div className="flex flex-col gap-10">
          {/* Top Row: Exactly 3 Narrower Active Video Cards (Auto-playing) */}
          <div className="flex flex-wrap justify-center items-center gap-5 sm:gap-6">
            {top3Videos.map((video) => (
              <VideoCard
                key={video.id}
                video={video}
                onOpenModal={onOpenModal}
                onLike={onLike}
                onShare={onShare}
                isLiked={likedVideoIds.has(String(video.id))}
                variant="compact"
                autoPlay={true}
              />
            ))}
          </div>

          {/* Bottom Grid: 4 Wider Cards Below (Paused by default, play on hover) */}
          {bottomVideos.length > 0 && (
            <div className="flex flex-wrap justify-center items-center gap-6 sm:gap-7 pt-8 border-t border-slate-200">
              {bottomVideos.map((video) => (
                <VideoCard
                  key={video.id}
                  video={video}
                  onOpenModal={onOpenModal}
                  onLike={onLike}
                  onShare={onShare}
                  isLiked={likedVideoIds.has(String(video.id))}
                  variant="wide"
                  autoPlay={false}
                />
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="py-16 text-center bg-white rounded-3xl border border-slate-200 my-4 shadow-sm">
          <p className="text-sm font-bold text-slate-800">No reels found for "{selectedCategory}"</p>
          <button
            onClick={() => setSelectedCategory('All')}
            className="mt-3 text-xs font-black text-rose-600 hover:underline"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
};

export default VideoCarousel;
