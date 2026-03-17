require('dotenv').config({ path: '.env.local' });
const fs = require('fs');
const path = require('path');
const COS = require('cos-nodejs-sdk-v5');

// 从环境变量读取配置
const config = {
  SecretId: process.env.REACT_APP_COS_SECRET_ID,
  SecretKey: process.env.REACT_APP_COS_SECRET_KEY,
  Bucket: process.env.REACT_APP_COS_BUCKET,
  Region: process.env.REACT_APP_COS_REGION,
};

// 验证配置
if (!config.SecretId || !config.SecretKey || config.SecretId === '你的SecretId') {
  console.error('❌ 错误: 请先在 .env.local 文件中配置你的腾讯云 COS 密钥');
  console.log('📝 获取密钥地址: https://console.cloud.tencent.com/cam/capi');
  process.exit(1);
}

// 初始化COS客户端
const cos = new COS({
  SecretId: config.SecretId,
  SecretKey: config.SecretKey,
});

// 本地图片目录
const localImgDir = path.join(__dirname, '../public/imgs');

// COS中的目标路径
const cosBasePath = 'imgs/';

/**
 * 递归获取目录下所有图片文件
 */
function getAllImageFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);

  files.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      getAllImageFiles(filePath, fileList);
    } else if (stat.isFile() && isImageFile(file)) {
      fileList.push(filePath);
    }
  });

  return fileList;
}

/**
 * 判断是否为图片文件
 */
function isImageFile(filename) {
  const ext = path.extname(filename).toLowerCase();
  return ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.ico'].includes(ext);
}

/**
 * 上传单个文件到COS
 */
function uploadFile(localPath, cosPath) {
  return new Promise((resolve, reject) => {
    cos.uploadFile({
      Bucket: config.Bucket,
      Region: config.Region,
      Key: cosPath,
      FilePath: localPath,
    }, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
}

/**
 * 主上传函数
 */
async function uploadImages() {
  console.log('🚀 开始上传图片到腾讯云 COS...\n');
  console.log(`📦 Bucket: ${config.Bucket}`);
  console.log(`🌍 Region: ${config.Region}`);
  console.log(`📁 本地目录: ${localImgDir}\n`);

  try {
    // 获取所有图片文件
    const imageFiles = getAllImageFiles(localImgDir);

    if (imageFiles.length === 0) {
      console.log('⚠️  未找到图片文件');
      return;
    }

    console.log(`📊 找到 ${imageFiles.length} 个图片文件\n`);

    // 上传每个文件
    let successCount = 0;
    let failCount = 0;

    for (const localPath of imageFiles) {
      // 计算相对路径
      const relativePath = path.relative(localImgDir, localPath);
      const cosPath = cosBasePath + relativePath.replace(/\\/g, '/');

      console.log(`⬆️  上传: ${relativePath}`);

      try {
        await uploadFile(localPath, cosPath);
        console.log(`✅ 成功: ${relativePath}`);
        console.log(`   CDN地址: https://${process.env.REACT_APP_COS_CDN_DOMAIN}/${cosPath}\n`);
        successCount++;
      } catch (error) {
        console.log(`❌ 失败: ${relativePath}`);
        console.log(`   错误信息: ${error.message}\n`);
        failCount++;
      }
    }

    console.log('\n' + '='.repeat(50));
    console.log('📈 上传完成统计:');
    console.log(`✅ 成功: ${successCount} 个`);
    console.log(`❌ 失败: ${failCount} 个`);
    console.log('='.repeat(50));

    if (failCount > 0) {
      process.exit(1);
    }
  } catch (error) {
    console.error('❌ 上传过程出错:', error.message);
    process.exit(1);
  }
}

// 运行上传
uploadImages();
