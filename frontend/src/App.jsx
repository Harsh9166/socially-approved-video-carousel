import React, { useState, useEffect, useCallback } from 'react';
import { fetchVideos, likeVideo, shareVideo } from './services/videoApi';
import VideoCarousel from './components/VideoCarousel';
import VideoModal from './components/VideoModal';
import Spinner from './components/Spinner';
import { AlertCircle, RefreshCw, Sparkles, Film, Layers } from 'lucide-react';

export const App = () => {
  const [videos, setVideos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [likedVideoIds, setLikedVideoIds] = useState(new Set());
  const [toastMessage, setToastMessage] = useState(null);

  // Helper toast notification function
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // Load Video Metadata from Backend API
  const loadVideos = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchVideos();
      setVideos(data);
    } catch (err) {
      console.error('Error loading videos:', err);
      setError('Unable to load video collection. Please refresh or try again.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadVideos();
  }, [loadVideos]);

  // Handle Like Action
  const handleLike = async (videoId) => {
    const videoIdStr = String(videoId);
    
    // Optimistic UI Update
    setVideos((prev) =>
      prev.map((v) =>
        String(v.id) === videoIdStr ? { ...v, likes: v.likes + 1 } : v
      )
    );

    if (selectedVideo && String(selectedVideo.id) === videoIdStr) {
      setSelectedVideo((prev) => ({ ...prev, likes: prev.likes + 1 }));
    }

    setLikedVideoIds((prev) => new Set(prev).add(videoIdStr));

    try {
      const response = await likeVideo(videoIdStr);
      if (response.alreadyLiked) {
        showToast('You already liked this reel!');
      } else {
        showToast('❤️ Reel liked successfully!');
      }
    } catch (err) {
      console.error('Like error:', err);
      showToast('⚠️ Action recorded locally');
    }
  };

  // Handle Share Action
  const handleShare = async (videoId) => {
    const videoIdStr = String(videoId);
    const targetVideo = videos.find((v) => String(v.id) === videoIdStr);
    const shareUrl = window.location.href;

    let platform = 'copy';
    if (navigator.share) {
      try {
        await navigator.share({
          title: targetVideo?.title || 'Socially Approved Reel',
          text: targetVideo?.description || 'Check out this trending reel!',
          url: shareUrl,
        });
        platform = 'native';
        showToast('🔗 Shared successfully!');
      } catch (shareErr) {
        if (shareErr.name === 'AbortError') return;
      }
    } else {
      try {
        await navigator.clipboard.writeText(shareUrl);
        showToast('📋 Reel link copied to clipboard!');
      } catch (clipErr) {
        showToast('📋 Copy link ready!');
      }
    }

    try {
      const response = await shareVideo(videoIdStr, platform);
      if (response.shares !== undefined) {
        setVideos((prev) =>
          prev.map((v) =>
            String(v.id) === videoIdStr ? { ...v, shares: response.shares } : v
          )
        );
        if (selectedVideo && String(selectedVideo.id) === videoIdStr) {
          setSelectedVideo((prev) => ({ ...prev, shares: response.shares }));
        }
      }
    } catch (err) {
      console.error('Share error:', err);
    }
  };

  const handleOpenModal = (video) => {
    setSelectedVideo(video);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between selection:bg-rose-500 selection:text-white">
      {/* Toast Floating Notification */}
      {toastMessage && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white px-6 py-3 rounded-full text-xs font-black shadow-2xl border border-slate-700 flex items-center gap-2.5 animate-bounce">
          <Sparkles className="w-4 h-4 text-rose-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Clean Glass Navbar */}
      <header className="sticky top-0 z-40 bg-white/95 border-b border-slate-200 backdrop-blur-xl shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-2">
          {/* Brand Logo */}
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-rose-600 flex-shrink-0 flex items-center justify-center text-white shadow-md shadow-rose-500/30 border border-white transform hover:scale-105 transition-transform">
              <Film className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="min-w-0">
              <span className="text-base sm:text-2xl font-black tracking-tight text-slate-900 block leading-none truncate">
                SOCIALLY<span className="text-rose-600">APPROVED</span>
              </span>
              <span className="hidden sm:block text-[10px] font-bold text-slate-500 tracking-wider uppercase mt-1">Trending Community Reels</span>
            </div>
          </div>

          {/* Stats Badges - Optimized for Mobile & Desktop */}
          <div className="flex-shrink-0">
            <div className="flex items-center gap-1.5 sm:gap-2 bg-slate-100 px-2.5 py-1.5 sm:px-4 sm:py-2 rounded-xl sm:rounded-2xl border border-slate-300 text-[11px] sm:text-xs font-black text-slate-800 shadow-sm">
              <Layers className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-rose-600 flex-shrink-0" />
              <span>{videos.length || 36} <span className="hidden xs:inline">Reels</span></span>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Banner & Video Carousel Section */}
      <main className="flex-1 py-1">
        {/* Prominent Loader State */}
        {isLoading && (
          <div className="min-h-[500px] flex flex-col items-center justify-center gap-4 text-center p-6">
            <Spinner size="lg" />
            <p className="text-sm font-extrabold text-slate-800 tracking-wide">Loading Trending Reels...</p>
          </div>
        )}

        {/* Error State Banner */}
        {error && !isLoading && (
          <div className="max-w-xl mx-auto my-16 p-8 rounded-3xl bg-white border border-rose-200 text-center shadow-lg">
            <AlertCircle className="w-14 h-14 text-rose-600 mx-auto mb-4 animate-bounce" />
            <h3 className="text-xl font-black text-slate-900 mb-2">Unable to Load Videos</h3>
            <p className="text-xs text-slate-700 font-semibold mb-6 leading-relaxed">{error}</p>
            <button
              onClick={loadVideos}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-black transition-all shadow-md active:scale-95 border border-white/20"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Retry Loading</span>
            </button>
          </div>
        )}

        {/* Main Video Carousel Component */}
        {!isLoading && !error && videos.length > 0 && (
          <VideoCarousel
            videos={videos}
            onOpenModal={handleOpenModal}
            onLike={handleLike}
            onShare={handleShare}
            likedVideoIds={likedVideoIds}
          />
        )}
      </main>

      {/* Fullscreen Video Modal Component */}
      <VideoModal
        video={selectedVideo}
        videos={videos}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onNavigate={(newVideo) => setSelectedVideo(newVideo)}
        onLike={handleLike}
        onShare={handleShare}
        isLiked={selectedVideo ? likedVideoIds.has(String(selectedVideo.id)) : false}
      />

      {/* Clean Footer */}
      <footer className="border-t border-slate-200 py-6 text-center text-xs text-slate-700 bg-white font-semibold shadow-inner">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-bold">© 2026 Socially Approved Video Carousel.</p>
          <div className="flex items-center gap-4 text-[11px] font-black text-slate-800">
            <span>Community Approved</span>
            <span>•</span>
            <span>Trending Collections</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
