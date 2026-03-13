/**
 * 图片优化工具
 * 提供懒加载、预加载、响应式图片等优化功能
 */

// 图片预加载 - 用于关键图片
export const preloadImage = (src) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = src;
    img.onload = () => resolve(src);
    img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
  });
};

// 批量预加载图片
export const preloadImages = (sources, concurrency = 3) => {
  return new Promise((resolve, reject) => {
    const results = [];
    let completed = 0;
    let index = 0;

    const loadNext = () => {
      if (index >= sources.length) {
        if (completed === sources.length) {
          resolve(results);
        }
        return;
      }

      const currentIndex = index++;
      preloadImage(sources[currentIndex])
        .then((src) => {
          results[currentIndex] = src;
          completed++;
          if (completed === sources.length) {
            resolve(results);
          } else {
            loadNext();
          }
        })
        .catch((err) => {
          results[currentIndex] = null;
          completed++;
          if (completed === sources.length) {
            resolve(results);
          } else {
            loadNext();
          }
        });
    };

    // 启动并发加载
    for (let i = 0; i < Math.min(concurrency, sources.length); i++) {
      loadNext();
    }
  });
};

// 检测 WebP 支持
export const checkWebPSupport = () => {
  return new Promise((resolve) => {
    const webP = new Image();
    webP.onload = webP.onerror = () => {
      resolve(webP.height === 2);
    };
    webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
  });
};

// 获取优化后的图片路径 (可以扩展为使用 CDN 或图片服务)
export const getOptimizedImageUrl = (originalPath, options = {}) => {
  const { width, quality = 80, format = 'webp' } = options;
  
  // 如果使用图片服务,可以在这里转换 URL
  // 例如: return `https://cdn.example.com/${originalPath}?w=${width}&q=${quality}&f=${format}`;
  
  return originalPath;
};

// 图片加载状态追踪
export class ImageLoader {
  constructor() {
    this.loadedImages = new Set();
    this.loadingImages = new Map();
    this.failedImages = new Set();
  }

  // 加载图片(带缓存)
  async loadImage(src) {
    if (this.loadedImages.has(src)) {
      return { src, status: 'cached' };
    }

    if (this.failedImages.has(src)) {
      return { src, status: 'failed' };
    }

    if (this.loadingImages.has(src)) {
      return this.loadingImages.get(src);
    }

    const promise = preloadImage(src)
      .then(() => {
        this.loadedImages.add(src);
        this.loadingImages.delete(src);
        return { src, status: 'loaded' };
      })
      .catch(() => {
        this.failedImages.add(src);
        this.loadingImages.delete(src);
        return { src, status: 'failed' };
      });

    this.loadingImages.set(src, promise);
    return promise;
  }

  // 批量加载
  async loadImages(sources, priority = 'normal') {
    const concurrency = priority === 'high' ? 5 : 3;
    return preloadImages(sources, concurrency);
  }

  // 清除缓存
  clearCache() {
    this.loadedImages.clear();
    this.loadingImages.clear();
    this.failedImages.clear();
  }

  // 获取统计信息
  getStats() {
    return {
      loaded: this.loadedImages.size,
      loading: this.loadingImages.size,
      failed: this.failedImages.size
    };
  }
}

// 创建全局实例
export const globalImageLoader = new ImageLoader();

// Intersection Observer 配置
export const getDefaultObserverOptions = () => ({
  rootMargin: '50px 0px',
  threshold: 0.01
});

// 图片尺寸建议
export const getImageSizeForBreakpoint = (breakpoint) => {
  const sizes = {
    'xs': 320,
    'sm': 640,
    'md': 768,
    'lg': 1024,
    'xl': 1280,
    '2xl': 1536
  };
  return sizes[breakpoint] || 768;
};

// 生成 srcset
export const generateSrcSet = (basePath, sizes = [640, 768, 1024, 1280]) => {
  return sizes
    .map(size => `${basePath}?w=${size} ${size}w`)
    .join(', ');
};
