# 安装图片优化工具

## 快速开始

### 1. 安装依赖
```bash
npm install --save-dev sharp mkdirp
```

### 2. 运行优化脚本
```bash
node scripts/optimize-images.js
```

## 可选: 使用 Imagemin

### 安装 imagemin
```bash
npm install --save-dev imagemin imagemin-webp imagemin-mozjpeg imagemin-pngquant
```

### 创建优化脚本
```bash
# 压缩所有图片
npx imagemin public/imgs/**/* --out-dir=public/imgs-min --plugin=imagemin-mozjpeg --plugin=imagemin-pngquant

# 转换为 WebP
npx imagemin public/imgs/**/* --out-dir=public/imgs-webp --plugin=imagemin-webp
```

## 在线工具

### Squoosh (推荐)
- 网址: https://squoosh.app
- 功能: 免费在线图片压缩和格式转换
- 支持批量处理

### TinyPNG
- 网址: https://tinypng.com
- 功能: 智能 PNG/JPEG 压缩
- 限制: 每次最多 20 张图片

### CloudConvert
- 网址: https://cloudconvert.com
- 功能: 格式转换、压缩、调整大小

## 推荐工作流程

1. **开发阶段**: 使用原始图片
2. **测试阶段**: 使用在线工具压缩关键图片
3. **生产环境**: 运行脚本批量优化所有图片

## 注意事项

- **备份**: 优化前备份原始图片
- **质量测试**: 调整质量参数找到最佳平衡点
- **格式选择**: WebP 适合照片, SVG 适合图标
- **渐进式加载**: 启用渐进式 JPEG 提升感知性能
