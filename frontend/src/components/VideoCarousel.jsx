import React, { useRef, useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Search, SlidersHorizontal, Sparkles } from 'lucide-react';
import VideoCard from './VideoCard';

const CATEGORIES = ['All', 'Streetwear', 'Summer', 'Luxury', 'Athleisure', 'Vintage', 'Knitwear'];

export const VideoCarousel = ({
  videos = [],
  onOpenModal,
  onLike,
  onShare,
  likedVideoIds = new Set(),
}) => {
  const scrollContainerRef = useRef(null);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [touchStartX, setTouchStartX] = useState(null);
  const [touchEndX, setTouchEndX] = useState(null);

  // Filtered dataset according to Category and Search Query
  const filteredVideos = useMemo(() => {
    return videos.filter((video) => {
      const matchesCategory =
        selectedCategory === 'All' ||
        video.title.toLowerCase().includes(selectedCategory.toLowerCase()) ||
        video.description.toLowerCase().includes(selectedCategory.toLowerCase());

      const matchesSearch =
        searchQuery.trim() === '' ||
        video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        video.description.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesCategory && matchesSearch;
    });
  }, [videos, selectedCategory, searchQuery]);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -320, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 320, behavior: 'smooth' });
    }
  };

  // Touch Swipe gesture handling for mobile devices
  const handleTouchStart = (e) => {
    setTouchStartX(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEndX(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStartX || !touchEndX) return;
    const distance = touchStartX - touchEndX;
    if (distance > 50) {
      scrollRight();
    } else if (distance < -50) {
      scrollLeft();
    }
    setTouchStartX(null);
    setTouchEndX(null);
  };

  return (
    <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Header Title Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5 text-rose-600 animate-spin" />
            <span>Approved Reels</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Socially <span className="text-rose-600">Approved</span>
          </h2>
        </div>

        {/* Search Bar & Nav Arrows */}
        <div className="flex items-center gap-3">
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search reels..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-full bg-white text-xs font-bold text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500 border border-slate-300 shadow-sm"
            />
          </div>

          <div className="hidden sm:flex items-center gap-2">
            <button
              onClick={scrollLeft}
              aria-label="Previous videos"
              className="p-2.5 rounded-full bg-white hover:bg-slate-100 active:scale-95 text-slate-800 transition-all shadow-sm border border-slate-300 focus:outline-none"
            >
              <ChevronLeft className="w-4 h-4 stroke-[2.5]" />
            </button>
            <button
              onClick={scrollRight}
              aria-label="Next videos"
              className="p-2.5 rounded-full bg-white hover:bg-slate-100 active:scale-95 text-slate-800 transition-all shadow-sm border border-slate-300 focus:outline-none"
            >
              <ChevronRight className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>
        </div>
      </div>

      {/* Category Tag Pills (Pill-shaped, non-squished, clear padding & contrast) */}
      <div className="flex items-center gap-3 overflow-x-auto no-scrollbar mb-8 py-2">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-5 py-2 rounded-full text-xs sm:text-sm font-extrabold transition-all whitespace-nowrap flex-shrink-0 border shadow-sm ${
              selectedCategory === cat
                ? 'bg-slate-900 text-white border-slate-900 shadow-md scale-105'
                : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100 hover:text-slate-900 hover:border-slate-400'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* 4 Cards Row Layout (driptrip.in style) */}
      {filteredVideos.length > 0 ? (
        <div
          ref={scrollContainerRef}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          className="flex gap-4 sm:gap-6 overflow-x-auto no-scrollbar scroll-smooth py-2 px-1 snap-x snap-mandatory justify-start lg:justify-between"
        >
          {filteredVideos.map((video) => (
            <div key={video.id} className="snap-center">
              <VideoCard
                video={video}
                onOpenModal={onOpenModal}
                onLike={onLike}
                onShare={onShare}
                isLiked={likedVideoIds.has(String(video.id))}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="py-16 text-center bg-white rounded-3xl border border-slate-300 my-4 shadow-sm">
          <SlidersHorizontal className="w-10 h-10 text-slate-400 mx-auto mb-3" />
          <p className="text-sm font-bold text-slate-800">No reels found for "{searchQuery || selectedCategory}"</p>
          <button
            onClick={() => { setSelectedCategory('All'); setSearchQuery(''); }}
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
