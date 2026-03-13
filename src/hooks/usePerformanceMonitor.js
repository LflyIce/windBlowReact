import { useEffect } from 'react';

/**
 * 性能监控 Hook
 * 用于监控图片加载性能
 */
export const usePerformanceMonitor = () => {
  useEffect(() => {
    if (typeof window === 'undefined' || !window.PerformanceObserver) {
      return;
    }

    // 监控资源加载性能
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.initiatorType === 'img') {
          console.log(`📸 图片加载: ${entry.name.slice(-50)}`);
          console.log(`   时长: ${entry.duration.toFixed(2)}ms`);
          console.log(`   大小: ${entry.transferSize} bytes`);
        }
      }
    });

    try {
      observer.observe({ entryTypes: ['resource'] });
    } catch (e) {
      console.warn('Performance Observer not supported');
    }

    return () => observer.disconnect();
  }, []);
};

/**
 * 核心性能指标监控
 */
export const useCoreWebVitals = () => {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // LCP (Largest Contentful Paint)
    let lcpValue = 0;
    const observeLCP = () => {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        lcpValue = lastEntry.renderTime || lastEntry.loadTime;
        console.log(`⏱️ LCP: ${(lcpValue / 1000).toFixed(2)}s`);
      });
      observer.observe({ entryTypes: ['largest-contentful-paint'] });
    };

    // FID (First Input Delay)
    const observeFID = () => {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          console.log(`⌨️ FID: ${entry.processingStart - entry.startTime}ms`);
        }
      });
      observer.observe({ entryTypes: ['first-input'] });
    };

    // CLS (Cumulative Layout Shift)
    let clsValue = 0;
    const observeCLS = () => {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
            console.log(`📐 CLS: ${clsValue.toFixed(4)}`);
          }
        }
      });
      observer.observe({ entryTypes: ['layout-shift'] });
    };

    observeLCP();
    observeFID();
    observeCLS();
  }, []);
};

/**
 * 图片加载错误追踪
 */
export const useImageErrorTracking = () => {
  useEffect(() => {
    const handleImageError = (event) => {
      const img = event.target;
      if (img.tagName === 'IMG') {
        console.error(`❌ 图片加载失败:`, {
          src: img.src,
          alt: img.alt,
          width: img.width,
          height: img.height
        });

        // 可以在这里发送错误到监控服务
        // sendToMonitoringService({ type: 'image_error', src: img.src });
      }
    };

    document.addEventListener('error', handleImageError, true);

    return () => {
      document.removeEventListener('error', handleImageError, true);
    };
  }, []);
};

/**
 * 网络信息监控
 */
export const useNetworkInfo = () => {
  useEffect(() => {
    if (typeof navigator === 'undefined' || !navigator.connection) {
      console.log('网络信息 API 不可用');
      return;
    }

    const connection = navigator.connection;

    console.log('📡 网络信息:', {
      effectiveType: connection.effectiveType,
      downlink: connection.downlink,
      rtt: connection.rtt,
      saveData: connection.saveData
    });

    const handleConnectionChange = () => {
      console.log('📡 网络状态变化:', {
        effectiveType: connection.effectiveType,
        downlink: connection.downlink
      });
    };

    connection.addEventListener('change', handleConnectionChange);

    return () => {
      connection.removeEventListener('change', handleConnectionChange);
    };
  }, []);
};

/**
 * 性能报告生成
 */
export const generatePerformanceReport = () => {
  if (typeof window === 'undefined' || !window.performance) {
    return null;
  }

  const perfData = window.performance.getEntriesByType('navigation')[0];
  const resourceData = window.performance.getEntriesByType('resource');

  // 计算图片相关指标
  const imageResources = resourceData.filter(r => r.initiatorType === 'img');
  const totalImageTime = imageResources.reduce((sum, img) => sum + img.duration, 0);
  const totalImageSize = imageResources.reduce((sum, img) => sum + (img.transferSize || 0), 0);

  return {
    // 页面加载时间
    domContentLoaded: perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart,
    loadComplete: perfData.loadEventEnd - perfData.loadEventStart,
    domInteractive: perfData.domInteractive - perfData.fetchStart,

    // 图片统计
    imageCount: imageResources.length,
    totalImageLoadTime: totalImageTime,
    averageImageLoadTime: imageResources.length > 0 ? totalImageTime / imageResources.length : 0,
    totalImageSize: totalImageSize,
    averageImageSize: imageResources.length > 0 ? totalImageSize / imageResources.length : 0,

    // 缓存效率
    cachedImages: imageResources.filter(img => img.transferSize === 0).length,
    uncachedImages: imageResources.filter(img => img.transferSize > 0).length
  };
};

/**
 * 使用完整性能监控
 */
export const usePerformanceMonitoring = () => {
  usePerformanceMonitor();
  useCoreWebVitals();
  useImageErrorTracking();
  useNetworkInfo();
};
