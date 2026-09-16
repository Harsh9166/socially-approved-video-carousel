import { useState, useEffect, useRef } from 'react';

/**
 * Custom hook for Intersection Observer to lazy load video resources
 * and pause videos outside the viewport.
 * 
 * @param {Object} options - IntersectionObserverInit options
 * @returns {Array} [targetRef, isIntersecting, hasBeenSeen]
 */
export const useIntersectionObserver = (options = {}) => {
  const {
    threshold = 0.4,
    rootMargin = '50px 0px 50px 0px',
    triggerOnce = false,
  } = options;

  const targetRef = useRef(null);
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [hasBeenSeen, setHasBeenSeen] = useState(false);

  useEffect(() => {
    const element = targetRef.current;
    if (!element) return;

    if (typeof IntersectionObserver === 'undefined') {
      // Fallback if IntersectionObserver is not supported
      setIsIntersecting(true);
      setHasBeenSeen(true);
      return;
    }

    const observer = new IntersectionObserver(([entry]) => {
      const isElementIntersecting = entry.isIntersecting;
      setIsIntersecting(isElementIntersecting);

      if (isElementIntersecting) {
        setHasBeenSeen(true);
        if (triggerOnce) {
          observer.unobserve(element);
        }
      }
    }, {
      threshold,
      rootMargin,
    });

    observer.observe(element);

    return () => {
      if (element) {
        observer.unobserve(element);
      }
      observer.disconnect();
    };
  }, [threshold, rootMargin, triggerOnce]);

  return [targetRef, isIntersecting, hasBeenSeen];
};

export default useIntersectionObserver;
