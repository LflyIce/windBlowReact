import { useCallback, useRef } from 'react';

/**
 * 创建节流回调函数
 * 确保函数在指定时间间隔内最多执行一次
 * 
 * @param {Function} callback - 需要节流的函数
 * @param {number} delay - 延迟时间(毫秒)
 * @returns {Function} - 节流后的函数
 */
export const useThrottledCallback = (callback, delay = 100) => {
  const lastRun = useRef(Date.now());

  return useCallback((...args) => {
    const now = Date.now();
    if (now - lastRun.current >= delay) {
      callback(...args);
      lastRun.current = now;
    }
  }, [callback, delay]);
};

/**
 * 创建防抖回调函数
 * 确保函数在停止触发指定时间后才执行
 * 
 * @param {Function} callback - 需要防抖的函数
 * @param {number} delay - 延迟时间(毫秒)
 * @returns {Function} - 防抖后的函数
 */
export const useDebouncedCallback = (callback, delay = 100) => {
  const timeoutRef = useRef(null);

  return useCallback((...args) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      callback(...args);
    }, delay);
  }, [callback, delay]);
};

/**
 * 创建 RAF (RequestAnimationFrame) 节流回调
 * 使用 requestAnimationFrame 优化滚动性能
 * 
 * @param {Function} callback - 需要优化的函数
 * @returns {Function} - RAF 节流后的函数
 */
export const useRAFThrottledCallback = (callback) => {
  const rafId = useRef(null);

  return useCallback((...args) => {
    if (rafId.current !== null) {
      return;
    }

    rafId.current = requestAnimationFrame(() => {
      callback(...args);
      rafId.current = null;
    });
  }, [callback]);
};
