import { useState, useEffect } from 'react';
import { useRAFThrottledCallback, useThrottledCallback } from './useThrottledCallback';

/**
 * 优化的滚动位置 Hook
 * 使用 RAF 节流优化性能
 */
export const useScrollPosition = (threshold = 50) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  // 使用 RAF 节流优化滚动性能
  const handleScroll = useRAFThrottledCallback(() => {
    const scrollPosition = window.scrollY;
    setScrollY(scrollPosition);
    setIsScrolled(scrollPosition > threshold);
  });

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  return { isScrolled, scrollY };
};

/**
 * 优化的滚动方向检测 Hook
 */
export const useScrollDirection = () => {
  const [scrollDirection, setScrollDirection] = useState('down');
  const [scrollY, setScrollY] = useState(0);

  const handleScroll = useThrottledCallback(() => {
    const currentScrollY = window.scrollY;
    
    if (currentScrollY > scrollY) {
      setScrollDirection('down');
    } else if (currentScrollY < scrollY) {
      setScrollDirection('up');
    }

    setScrollY(currentScrollY);
  }, 100);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll, scrollY]);

  return scrollDirection;
};

/**
 * 元素可见性检测 Hook (替代滚动事件)
 */
export const useElementVisibility = (elementRef, threshold = 0.1) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [elementRef, threshold]);

  return isVisible;
};
