import React from 'react';

export const Spinner = ({ size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'w-5 h-5 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
  };

  return (
    <div className={`inline-flex items-center justify-center ${className}`}>
      <div
        className={`${sizeClasses[size] || sizeClasses.md} border-white/20 border-t-brand-500 rounded-full animate-spin`}
        role="status"
        aria-label="Loading"
      />
    </div>
  );
};

export default Spinner;
