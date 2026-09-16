import React from 'react';
import { Play, Pause, Volume2, VolumeX, Heart, Share2, Maximize } from 'lucide-react';
import ProgressBar from './ProgressBar';

export const VideoControls = ({
  isPlaying,
  isMuted,
  currentTime,
  duration,
  likes,
  shares,
  isLiked,
  onTogglePlay,
  onToggleMute,
  onSeek,
  onLike,
  onShare,
  onFullscreen,
  showLikeShare = true,
  className = '',
}) => {
  return (
    <div className={`bg-slate-950/95 text-white rounded-2xl p-4 flex flex-col gap-3 shadow-2xl backdrop-blur-xl border border-white/20 ${className}`}>
      {/* Time & Scrubbing Bar */}
      <ProgressBar currentTime={currentTime} duration={duration} onSeek={onSeek} />

      {/* Main Buttons Row */}
      <div className="flex items-center justify-between mt-1">
        <div className="flex items-center gap-2">
          {/* Play/Pause */}
          <button
            onClick={onTogglePlay}
            aria-label={isPlaying ? 'Pause video' : 'Play video'}
            className="p-2.5 rounded-full bg-white/20 hover:bg-white/30 active:scale-95 transition-all text-white focus:outline-none focus:ring-2 focus:ring-rose-500 shadow-md"
          >
            {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
          </button>

          {/* Mute/Unmute */}
          <button
            onClick={onToggleMute}
            aria-label={isMuted ? 'Unmute video' : 'Mute video'}
            className="p-2.5 rounded-full bg-white/20 hover:bg-white/30 active:scale-95 transition-all text-white focus:outline-none focus:ring-2 focus:ring-rose-500 shadow-md"
          >
            {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          </button>
        </div>

        {/* Right Action Items */}
        <div className="flex items-center gap-2.5">
          {showLikeShare && (
            <>
              {/* Like Button */}
              <button
                onClick={onLike}
                aria-label="Like video"
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-black transition-all active:scale-95 border ${
                  isLiked
                    ? 'bg-rose-600 text-white border-rose-500 shadow-lg shadow-rose-600/50'
                    : 'bg-white/20 hover:bg-white/30 text-white border-white/20'
                }`}
              >
                <Heart className={`w-4 h-4 ${isLiked ? 'fill-current text-white' : 'text-rose-400'}`} />
                <span className="font-extrabold">{likes}</span>
              </button>

              {/* Share Button */}
              <button
                onClick={onShare}
                aria-label="Share video"
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-black bg-white/20 hover:bg-white/30 text-white transition-all active:scale-95 border border-white/20"
              >
                <Share2 className="w-4 h-4" />
                <span className="font-extrabold">{shares}</span>
              </button>
            </>
          )}

          {/* Fullscreen Button */}
          {onFullscreen && (
            <button
              onClick={onFullscreen}
              aria-label="Toggle fullscreen"
              className="p-2.5 rounded-full bg-white/20 hover:bg-white/30 active:scale-95 transition-all text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
            >
              <Maximize className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoControls;
