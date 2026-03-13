/**
 * 图片优化脚本
 * 用于批量压缩和转换图片
 * 
 * 使用方法:
 * node scripts/optimize-images.js
 * 
 * 需要先安装依赖:
 * npm install sharp mkdirp --save-dev
 */

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// 配置
const CONFIG = {
  inputDir: './public/imgs',
  outputDir: './public/imgs-optimized',
  quality: 80,
  formats: ['jpg', 'jpeg', 'png'],
  generateWebP: true,
  generateAvif: false,
  sizes: [640, 1024, 1920], // 生成响应式图片尺寸
  progressive: true
};

/**
 * 确保目录存在
 */
function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

/**
 * 处理单个图片
 */
async function processImage(inputPath, outputPath) {
  try {
    const image = sharp(inputPath);
    const metadata = await image.metadata();

    console.log(`处理: ${path.basename(inputPath)} (${metadata.width}x${metadata.height})`);

    // 压缩原图
    let processor = image;

    if (metadata.format === 'jpeg' || path.extname(inputPath) === '.jpg') {
      processor = processor.jpeg({
        quality: CONFIG.quality,
        progressive: CONFIG.progressive
      });
    } else if (metadata.format === 'png') {
      processor = processor.png({
        quality: CONFIG.quality,
        compressionLevel: 9
      });
    }

    await processor.toFile(outputPath);

    // 生成 WebP 版本
    if (CONFIG.generateWebP) {
      const webpPath = outputPath.replace(/\.(jpg|jpeg|png)$/i, '.webp');
      await image
        .webp({ quality: CONFIG.quality })
        .toFile(webpPath);
      console.log(`  ✓ WebP: ${path.basename(webpPath)}`);
    }

    // 生成 AVIF 版本 (可选,较慢)
    if (CONFIG.generateAvif) {
      const avifPath = outputPath.replace(/\.(jpg|jpeg|png)$/i, '.avif');
      await image
        .avif({ quality: CONFIG.quality })
        .toFile(avifPath);
      console.log(`  ✓ AVIF: ${path.basename(avifPath)}`);
    }

    // 生成响应式尺寸
    for (const size of CONFIG.sizes) {
      if (metadata.width > size) {
        const resizedPath = outputPath.replace(
          /\.(jpg|jpeg|png)$/i,
          `-${size}w.$1`
        );
        await image
          .resize(size, null, {
            fit: 'inside',
            withoutEnlargement: true
          })
          .jpeg({ quality: CONFIG.quality, progressive: CONFIG.progressive })
          .toFile(resizedPath);
        console.log(`  ✓ ${size}w: ${path.basename(resizedPath)}`);
      }
    }

    return true;
  } catch (error) {
    console.error(`✗ 错误: ${inputPath}`, error.message);
    return false;
  }
}

/**
 * 主函数
 */
async function main() {
  console.log('🚀 开始优化图片...\n');

  ensureDir(CONFIG.outputDir);

  // 获取所有图片文件
  const files = fs.readdirSync(CONFIG.inputDir)
    .filter(file => {
      const ext = path.extname(file).toLowerCase();
      return CONFIG.formats.includes(ext.replace('.', ''));
    });

  if (files.length === 0) {
    console.log('❌ 未找到图片文件');
    return;
  }

  console.log(`找到 ${files.length} 个图片文件\n`);

  let success = 0;
  let failed = 0;

  // 逐个处理
  for (const file of files) {
    const inputPath = path.join(CONFIG.inputDir, file);
    const outputPath = path.join(CONFIG.outputDir, file);

    const result = await processImage(inputPath, outputPath);
    if (result) {
      success++;
    } else {
      failed++;
    }

    console.log('');
  }

  console.log('═══════════════════════════════════════');
  console.log(`✅ 成功: ${success}`);
  console.log(`❌ 失败: ${failed}`);
  console.log(`📊 总计: ${files.length}`);
  console.log('═══════════════════════════════════════');
  console.log(`\n输出目录: ${CONFIG.outputDir}`);
}

// 运行
main().catch(console.error);
