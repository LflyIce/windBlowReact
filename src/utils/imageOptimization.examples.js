/**
 * 图片优化使用示例
 * 
 * 这个文件包含了各种图片优化场景的使用示例
 */

import OptimizedImage from '../components/common/OptimizedImage';
import { useImagePreload, useSingleImagePreload } from '../hooks/useImagePreload';
import { preloadImage, preloadImages, checkWebPSupport } from './imageOptimization';

// =====================================================
// 示例 1: 基础用法 - 简单的懒加载图片
// =====================================================

function BasicExample() {
  return (
    <OptimizedImage
      src="/imgs/post1.jpg"
      alt="文章封面"
      className="w-full h-64 object-cover"
      lazy={true}
    />
  );
}

// =====================================================
// 示例 2: 首屏关键图片 - 禁用懒加载
// =====================================================

function HeroImageExample() {
  return (
    <OptimizedImage
      src="/imgs/featured.jpg"
      alt="特色文章"
      className="w-full h-96 object-cover"
      lazy={false} // 首屏图片禁用懒加载
    />
  );
}

// =====================================================
// 示例 3: 带错误处理的图片
// =====================================================

function ImageWithFallback() {
  return (
    <OptimizedImage
      src="/imgs/possibly-broken.jpg"
      alt="可能失效的图片"
      fallback="/imgs/default-placeholder.jpg"
      onError={() => console.log('图片加载失败')}
      className="w-full h-48 object-cover"
    />
  );
}

// =====================================================
// 示例 4: 自定义占位符
// =====================================================

function CustomPlaceholderExample() {
  return (
    <OptimizedImage
      src="/imgs/avatar.jpg"
      alt="用户头像"
      className="w-10 h-10 rounded-full"
      placeholder={
        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 animate-pulse" />
      }
    />
  );
}

// =====================================================
// 示例 5: 预加载关键图片
// =====================================================

function PreloadExample() {
  const { isLoading, loadedImages } = useImagePreload([
    '/imgs/hero.jpg',
    '/imgs/featured.jpg'
  ], { concurrency: 2 });

  if (isLoading) {
    return <div>加载中...</div>;
  }

  return (
    <div>
      <h1>欢迎!</h1>
      {/* 现在可以立即显示图片,因为已经预加载 */}
    </div>
  );
}

// =====================================================
// 示例 6: 相册/图库 - 批量加载
// =====================================================

function GalleryExample({ images }) {
  return (
    <div className="grid grid-cols-3 gap-4">
      {images.map((img) => (
        <OptimizedImage
          key={img.id}
          src={img.url}
          alt={img.caption}
          className="w-full h-48 object-cover rounded"
          lazy={true}
          rootMargin="100px" // 提前 100px 开始加载
        />
      ))}
    </div>
  );
}

// =====================================================
// 示例 7: 背景图片
// =====================================================

function BackgroundImageExample() {
  return (
    <div className="relative">
      <OptimizedImage
        src="/imgs/background.jpg"
        alt=""
        className="absolute inset-0 w-full h-full"
        lazy={false}
      />
      <div className="relative z-10">
        <h1>内容在背景之上</h1>
      </div>
    </div>
  );
}

// =====================================================
// 示例 8: 头像列表
// =====================================================

function AvatarListExample({ users }) {
  return (
    <div className="flex -space-x-2">
      {users.map((user) => (
        <OptimizedImage
          key={user.id}
          src={user.avatar}
          alt={user.name}
          className="w-10 h-10 rounded-full border-2 border-white"
          lazy={true}
        />
      ))}
    </div>
  );
}

// =====================================================
// 示例 9: 响应式图片
// =====================================================

function ResponsiveImageExample() {
  return (
    <OptimizedImage
      src="/imgs/featured.jpg"
      alt="响应式图片"
      className="w-full h-auto"
      lazy={true}
      // 注意: 实际响应式图片需要使用 srcset 属性
      // 这里展示的是概念,需要根据实际需求扩展 OptimizedImage 组件
    />
  );
}

// =====================================================
// 示例 10: 条件加载 - 根据网络状态
// =====================================================

function NetworkAwareImage({ src, alt }) {
  const [lowQualityMode, setLowQualityMode] = useState(false);

  useEffect(() => {
    if (navigator.connection) {
      const conn = navigator.connection;
      // 慢速网络使用低质量模式
      setLowQualityMode(
        conn.saveData || 
        conn.effectiveType === 'slow-2g' || 
        conn.effectiveType === '2g'
      );
    }
  }, []);

  const imageSrc = lowQualityMode ? src.replace('.jpg', '-low.jpg') : src;

  return (
    <OptimizedImage
      src={imageSrc}
      alt={alt}
      className="w-full h-64 object-cover"
      lazy={true}
    />
  );
}

// =====================================================
// 示例 11: 渐进式加载 - 低质量占位符 (LQIP)
// =====================================================

function ProgressiveLoadingExample() {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className="relative">
      {/* 低质量占位符 */}
      <img
        src="/imgs/featured-low.jpg"
        alt=""
        className={`w-full h-64 object-cover transition-opacity duration-500 ${
          isLoaded ? 'opacity-0' : 'opacity-100'
        }`}
        style={{ filter: 'blur(10px)' }}
      />
      
      {/* 高质量原图 */}
      <OptimizedImage
        src="/imgs/featured.jpg"
        alt="渐进式加载"
        className="absolute inset-0 w-full h-64 object-cover"
        lazy={false}
        onLoad={() => setIsLoaded(true)}
      />
    </div>
  );
}

// =====================================================
// 示例 12: 图片预加载管理器
// =====================================================

class ImagePreloadManager {
  constructor() {
    this.preloadedImages = new Set();
  }

  // 预加载下一页的图片
  async preloadNextPage(nextPageImages) {
    const results = await preloadImages(nextPageImages.map(img => img.url));
    this.preloadedImages.addAll(results.filter(r => r !== null));
  }

  // 检查图片是否已加载
  isLoaded(src) {
    return this.preloadedImages.has(src);
  }
}

// 使用示例
const preloadManager = new ImagePreloadManager();

// 在用户滚动接近底部时预加载下一页
function InfiniteScrollExample({ items, onLoadMore }) {
  const [page, setPage] = useState(1);

  const handleScroll = () => {
    if (nearBottom && !preloadManager.isLoaded(nextPageImageUrls[0])) {
      preloadManager.preloadNextPage(getNextPageImages(page + 1));
    }
  };

  // ...
}

// =====================================================
// 示例 13: 性能监控集成
// =====================================================

import { usePerformanceMonitoring, generatePerformanceReport } from '../hooks/usePerformanceMonitor';

function MonitoredApp() {
  // 启用性能监控
  usePerformanceMonitoring();

  useEffect(() => {
    // 定期生成性能报告
    const interval = setInterval(() => {
      const report = generatePerformanceReport();
      console.log('性能报告:', report);
      
      // 可以发送到分析服务
      // analytics.track('performance_report', report);
    }, 30000); // 每 30 秒

    return () => clearInterval(interval);
  }, []);

  return <App />;
}

// =====================================================
// 示例 14: WebP 检测和降级
// =====================================================

function WebPAwareImage({ src, alt }) {
  const [supportsWebP, setSupportsWebP] = useState(true);
  const [imageSrc, setImageSrc] = useState(src);

  useEffect(() => {
    checkWebPSupport().then(supported => {
      if (!supported && src.endsWith('.jpg')) {
        // 不支持 WebP,使用原图
        setImageSrc(src.replace('.webp', '.jpg'));
      }
      setSupportsWebP(supported);
    });
  }, [src]);

  return (
    <OptimizedImage
      src={imageSrc}
      alt={alt}
      className="w-full h-64 object-cover"
      lazy={true}
    />
  );
}

// =====================================================
// 示例 15: 卡片组件 - 综合应用
// =====================================================

function PostCard({ post }) {
  return (
    <article className="bg-white rounded-lg shadow overflow-hidden">
      {/* 文章封面 - 懒加载 */}
      <OptimizedImage
        src={post.image}
        alt={post.title}
        className="w-full h-48 object-cover"
        lazy={true}
        rootMargin="50px"
      />
      
      <div className="p-4">
        {/* 作者头像 - 懒加载 */}
        <OptimizedImage
          src={post.author.avatar}
          alt={post.author.name}
          className="w-8 h-8 rounded-full mr-2 inline"
          lazy={true}
        />
        
        <h3>{post.title}</h3>
        <p>{post.excerpt}</p>
      </div>
    </article>
  );
}

export {
  BasicExample,
  HeroImageExample,
  ImageWithFallback,
  CustomPlaceholderExample,
  PreloadExample,
  GalleryExample,
  BackgroundImageExample,
  AvatarListExample,
  ResponsiveImageExample,
  NetworkAwareImage,
  ProgressiveLoadingExample,
  WebPAwareImage,
  PostCard
};
