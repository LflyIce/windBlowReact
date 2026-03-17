require('dotenv').config({ path: '.env.local' });
const COS = require('cos-nodejs-sdk-v5');

const config = {
  SecretId: process.env.REACT_APP_COS_SECRET_ID,
  SecretKey: process.env.REACT_APP_COS_SECRET_KEY,
  Bucket: process.env.REACT_APP_COS_BUCKET,
  Region: process.env.REACT_APP_COS_REGION,
};

const cos = new COS({
  SecretId: config.SecretId,
  SecretKey: config.SecretKey,
});

console.log('🔍 检查COS存储桶权限配置...\n');

// 1. 检查存储桶ACL
cos.getBucketAcl({
  Bucket: config.Bucket,
  Region: config.Region,
}, (err, data) => {
  if (err) {
    console.error('❌ 获取存储桶ACL失败:', err.message);
    return;
  }

  console.log('📋 当前存储桶ACL配置:');
  console.log(JSON.stringify(data, null, 2));

  // 检查是否有公共读权限
  const hasPublicRead = data.Grant && (
    data.Grant.includes('grant-read') ||
    JSON.stringify(data).includes('AllUsers')
  );

  console.log('\n' + '='.repeat(50));

  if (hasPublicRead) {
    console.log('✅ 存储桶已设置公共读权限');
  } else {
    console.log('❌ 存储桶未设置公共读权限！');
    console.log('\n🔧 需要手动设置权限：');
    console.log('1. 访问: https://console.cloud.tencent.com/cos/bucket');
    console.log(`2. 找到存储桶: ${config.Bucket}`);
    console.log('3. 进入"权限管理" → "存储桶访问权限"');
    console.log('4. 设置为"公共读"或"公共读写"');
    console.log('\n或者使用以下脚本自动设置:');
    console.log('node scripts/set-cos-public-read.js');
  }

  console.log('='.repeat(50));

  // 2. 测试文件访问
  console.log('\n🧪 测试文件访问...\n');

  const testFiles = ['avatar.jpg', 'author2.jpg'];

  testFiles.forEach(file => {
    const objectUrl = `https://${config.Bucket}.cos.${config.Region}.myqcloud.com/imgs/${file}`;
    const cdnUrl = `https://jiuyueice.cloud/imgs/${file}`;

    console.log(`文件: ${file}`);
    console.log(`  COS地址: ${objectUrl}`);
    console.log(`  CDN地址: ${cdnUrl}`);

    // 获取文件ACL
    cos.getObjectAcl({
      Bucket: config.Bucket,
      Region: config.Region,
      Key: `imgs/${file}`,
    }, (err, data) => {
      if (err) {
        console.log(`  ❌ 无法获取文件ACL: ${err.message}`);
      } else {
        const fileHasPublicRead = JSON.stringify(data).includes('AllUsers');
        console.log(`  ${fileHasPublicRead ? '✅' : '❌'} 文件权限: ${fileHasPublicRead ? '公共读' : '私有'}`);
      }
      console.log('');
    });
  });
});
