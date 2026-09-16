import React, { useRef, useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Sparkles, Search, SlidersHorizontal } from 'lucide-react';
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
      scrollContainerRef.current.scrollBy({ left: -340, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 340, behavior: 'smooth' });
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
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-100 border border-rose-200 text-rose-700 text-xs font-black uppercase tracking-wider mb-3 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 animate-spin text-rose-600" />
            <span>Community Spotlight</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
            Socially <span className="text-rose-600">Approved</span>
          </h2>
          <p className="text-sm sm:text-base text-slate-700 mt-2 max-w-lg leading-relaxed font-semibold">
            Real customer style checks, viral lookbooks, and trending wardrobe edits.
          </p>
        </div>

        {/* Filter Badges & Controls Header */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* Search Input Bar */}
          <div className="relative">
            <Search className="w-4.5 h-4.5 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search collections..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full sm:w-64 pl-10 pr-4 py-3 rounded-2xl bg-white text-xs sm:text-sm font-bold text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500 transition-all border border-slate-300 shadow-sm"
            />
          </div>

          {/* Carousel Desktop Navigation Buttons */}
          <div className="hidden sm:flex items-center gap-2">
            <button
              onClick={scrollLeft}
              aria-label="Previous videos"
              className="p-3 rounded-2xl bg-white hover:bg-slate-100 active:scale-95 text-slate-900 transition-all shadow-sm border border-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-500"
            >
              <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
            </button>
            <button
              onClick={scrollRight}
              aria-label="Next videos"
              className="p-3 rounded-2xl bg-white hover:bg-slate-100 active:scale-95 text-slate-900 transition-all shadow-sm border border-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-500"
            >
              <ChevronRight className="w-5 h-5 stroke-[2.5]" />
            </button>
          </div>
        </div>
      </div>

      {/* Category Pills Bar (Spacious & Crisp High Contrast) */}
      <div className="flex items-center gap-3 overflow-x-auto no-scrollbar mb-8 pb-2">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-black transition-all whitespace-nowrap active:scale-95 border ${
              selectedCategory === cat
                ? 'bg-rose-600 text-white border-rose-600 shadow-md shadow-rose-500/30'
                : 'bg-white text-slate-800 border-slate-300 hover:bg-slate-50 hover:text-slate-900 hover:border-slate-400 shadow-sm'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Horizontal Carousel Track */}
      {filteredVideos.length > 0 ? (
        <div
          ref={scrollContainerRef}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          className="flex gap-6 overflow-x-auto no-scrollbar scroll-smooth py-4 px-1 snap-x snap-mandatory"
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
