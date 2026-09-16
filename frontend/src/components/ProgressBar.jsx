import React from 'react';

const formatTime = (seconds) => {
  if (isNaN(seconds) || seconds === null) return '00:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

export const ProgressBar = ({ currentTime = 0, duration = 0, onSeek }) => {
  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  const handleChange = (e) => {
    const newTime = parseFloat(e.target.value);
    if (onSeek) {
      onSeek(newTime);
    }
  };

  return (
    <div className="w-full flex items-center gap-3 text-xs text-white font-mono select-none">
      <span className="w-10 text-right font-black text-white drop-shadow-sm">{formatTime(currentTime)}</span>
      
      <div className="relative flex-1 flex items-center">
        {/* Background track */}
        <div className="absolute inset-0 h-2 bg-white/30 rounded-full overflow-hidden pointer-events-none">
          <div
            className="h-full bg-rose-500 transition-all duration-75 shadow-lg shadow-rose-500/50"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Range Input for Scrubbing */}
        <input
          type="range"
          min="0"
          max={duration || 100}
          step="0.1"
          value={currentTime || 0}
          onChange={handleChange}
          aria-label="Video progress scrubber"
          className="w-full h-4 opacity-0 z-10 cursor-pointer"
        />
      </div>

      <span className="w-10 font-black text-slate-200 drop-shadow-sm">{formatTime(duration)}</span>
    </div>
  );
};

export default ProgressBar;
