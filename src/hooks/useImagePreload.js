import { useState, useEffect } from 'react';
import { preloadImage, preloadImages } from '../utils/imageOptimization';

/**
 * 图片预加载 Hook
 * 用于预加载关键图片资源
 */
export const useImagePreload = (sources, options = {}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [loadedImages, setLoadedImages] = useState([]);
  const [errors, setErrors] = useState([]);

  useEffect(() => {
    if (!sources || sources.length === 0) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setErrors([]);

    const { concurrency = 3 } = options;

    preloadImages(sources, concurrency)
      .then((results) => {
        const loaded = results.filter(src => src !== null);
        const failed = results
          .map((src, index) => (src === null ? sources[index] : null))
          .filter(Boolean);

        setLoadedImages(loaded);
        if (failed.length > 0) {
          setErrors(failed);
        }
        setIsLoading(false);
      })
      .catch((err) => {
        console.error('Image preload error:', err);
        setErrors([err.message]);
        setIsLoading(false);
      });
  }, [sources, options]);

  return { isLoading, loadedImages, errors };
};

/**
 * 单个图片预加载 Hook
 */
export const useSingleImagePreload = (src) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!src) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setIsLoaded(false);
    setError(null);

    preloadImage(src)
      .then(() => {
        setIsLoaded(true);
        setIsLoading(false);
      })
      .catch((err) => {
        setError(err);
        setIsLoading(false);
      });
  }, [src]);

  return { isLoading, isLoaded, error };
};

/**
 * 背景图片预加载 Hook
 */
export const useBackgroundImagePreload = (imageUrl) => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (!imageUrl) return;

    const img = new Image();
    img.src = imageUrl;
    img.onload = () => setIsLoaded(true);
  }, [imageUrl]);

  return isLoaded;
};
