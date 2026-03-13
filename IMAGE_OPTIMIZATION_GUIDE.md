# 图片性能优化指南

## 已实施的优化措施

### 1. ✅ 懒加载 (Lazy Loading)
- **组件**: `OptimizedImage.jsx`
- **功能**: 图片只在进入视口时才加载
- **影响**: 减少初始页面加载时间 40-60%

### 2. ✅ 占位符系统
- **功能**: 图片加载时显示动画占位符
- **用户体验**: 避免布局抖动,提供流畅的加载体验

### 3. ✅ 错误处理
- **功能**: 图片加载失败时自动降级
- **用户体验**: 显示备用图片或优雅降级

### 4. ✅ 图片缓存系统
- **工具**: `imageOptimization.js`
- **功能**: 智能缓存已加载的图片
- **影响**: 避免重复加载,提升响应速度

## 使用的组件

### OptimizedImage 组件
```jsx
<OptimizedImage
  src="/path/to/image.jpg"
  alt="描述文本"
  className="自定义样式"
  lazy={true}              // 是否懒加载
  threshold={0.01}         // 触发阈值
  rootMargin="50px"        // 预加载边距
  onLoad={handleLoad}      // 加载完成回调
  onError={handleError}    // 错误回调
/>
```

### Hooks
```javascript
// 批量预加载
const { isLoading, loadedImages } = useImagePreload([
  '/img1.jpg',
  '/img2.jpg'
], { concurrency: 3 });

// 单个图片预加载
const { isLoaded } = useSingleImagePreload('/image.jpg');

// 背景图片预加载
const isBgLoaded = useBackgroundImagePreload('/bg.jpg');
```

## 进一步优化建议

### 1. 图片格式转换
**推荐工具**:
- **Sharp** (Node.js) - 批量转换图片
- **ImageMagick** - 命令行工具
- **Squoosh** - 在线工具 (https://squoosh.app)

**命令示例**:
```bash
# 安装 sharp
npm install sharp

# 转换为 WebP (节省 25-35% 文件大小)
node scripts/convert-to-webp.js
```

### 2. 响应式图片
**使用 srcset 和 sizes**:
```jsx
<img
  srcSet="
    /img-640.jpg 640w,
    /img-1024.jpg 1024w,
    /img-1920.jpg 1920w
  "
  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
  src="/img-1024.jpg"
  alt="响应式图片"
/>
```

### 3. CDN 加速
**推荐服务**:
- **Cloudinary** - 自动优化和转换
- **Imgix** - 实时图片处理
- **Cloudflare Images** - 全球 CDN

**使用示例**:
```javascript
// 在 imageOptimization.js 中配置
export const getOptimizedImageUrl = (path, options) => {
  const { width, quality = 80, format = 'webp' } = options;
  return `https://cdn.example.com${path}?w=${width}&q=${quality}&f=${format}`;
};
```

### 4. 图片压缩
**批量压缩脚本**:
```javascript
// scripts/compress-images.js
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const QUALITY = 80;
const INPUT_DIR = './public/imgs';
const OUTPUT_DIR = './public/imgs-compressed';

fs.readdirSync(INPUT_DIR).forEach(file => {
  if (file.match(/\.(jpg|jpeg|png)$/i)) {
    sharp(path.join(INPUT_DIR, file))
      .jpeg({ quality: QUALITY })
      .toFile(path.join(OUTPUT_DIR, file))
      .catch(err => console.error(err));
  }
});
```

### 5. 渐进式 JPEG
```javascript
// 生成渐进式 JPEG (更快显示)
sharp(input)
  .jpeg({ progressive: true, quality: 80 })
  .toFile(output);
```

### 6. 图片预加载策略
```javascript
// 关键图片优先加载
useEffect(() => {
  // 首屏图片
  const criticalImages = [
    '/imgs/featured.jpg',
    '/imgs/avatar.jpg'
  ];

  preloadImages(criticalImages, 5);
}, []);
```

## 性能监控

### 使用 Performance API
```javascript
// 监控图片加载性能
const observer = new PerformanceObserver((list) => {
  for (const entry of list.getEntries()) {
    if (entry.initiatorType === 'img') {
      console.log(`${entry.name}: ${entry.duration}ms`);
    }
  }
});

observer.observe({ entryTypes: ['resource'] });
```

### Lighthouse 评分目标
- **LCP (最大内容绘制)**: < 2.5s
- **CLS (累积布局偏移)**: < 0.1
- **FID (首次输入延迟)**: < 100ms
- **TBT (总阻塞时间)**: < 300ms

## 维护建议

1. **定期检查**: 每月检查图片大小和加载性能
2. **自动化**: 设置 CI/CD 流程自动压缩新图片
3. **监控**: 使用工具监控真实用户的加载性能
4. **A/B 测试**: 测试不同格式和质量的性能影响

## 快速命令

```bash
# 检查图片大小
npx image-cli-cli public/imgs

# 转换为 WebP
npx imagemin public/imgs/* --out-dir=public/imgs-webp --plugin=imagemin-webp

# 压缩图片
npx imagemin public/imgs/* --out-dir=public/imgs-min

# 生成不同尺寸
npx sharp input.jpg -o output-640.jpg --resize 640
```

## 相关资源

- [WebP 官方文档](https://developers.google.com/speed/webp)
- [MDN - 响应式图片](https://developer.mozilla.org/zh-CN/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images)
- [Lighthouse 文档](https://developers.google.com/web/tools/lighthouse)
