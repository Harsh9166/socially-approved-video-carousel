import React, { useState, useMemo } from 'react';
import { Search, X } from 'lucide-react';
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
  const [searchQuery, setSearchQuery] = useState('');

  // Filtered dataset according to Category and Search Query
  const filteredVideos = useMemo(() => {
    return videos.filter((video) => {
      const matchesCategory =
        selectedCategory === 'All' ||
        video.title.toLowerCase().includes(selectedCategory.toLowerCase()) ||
        video.description.toLowerCase().includes(selectedCategory.toLowerCase());

      const matchesSearch =
        !searchQuery.trim() ||
        video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        video.description.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesCategory && matchesSearch;
    });
  }, [videos, selectedCategory, searchQuery]);

  // Top 3 narrower videos and all remaining wider bottom videos (total 36 videos)
  const top3Videos = useMemo(() => filteredVideos.slice(0, 3), [filteredVideos]);
  const bottomVideos = useMemo(() => filteredVideos.slice(3), [filteredVideos]);

  return (
    <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-1">
      {/* Categories & Search Input Bar */}
      <div className="flex flex-wrap sm:flex-nowrap items-center justify-between gap-3 mb-6">
        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap flex-shrink-0 border shadow-sm ${
                selectedCategory === cat
                  ? 'bg-slate-900 text-white border-slate-900 shadow-md scale-105'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Right-aligned Search Input */}
        <div className="relative flex items-center min-w-[180px] sm:min-w-[220px] ml-auto">
          <Search className="absolute left-3 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search..."
            className="w-full pl-9 pr-8 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white transition-all shadow-inner"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 p-0.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>
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
