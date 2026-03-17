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

console.log('🔧 设置COS存储桶为公共读权限...\n');

// 设置存储桶ACL为公共读
cos.putBucketAcl({
  Bucket: config.Bucket,
  Region: config.Region,
  ACL: 'public-read'  // 设置为公共读
}, (err, data) => {
  if (err) {
    console.error('❌ 设置失败:', err.message);
    console.error('\n可能的原因:');
    console.error('1. 密钥没有权限修改存储桶ACL');
    console.error('2. 存储桶开启了策略权限保护');
    console.error('3. 需要使用子用户UID或UIN授权');
    console.error('\n🔧 手动设置方法:');
    console.error('1. 访问: https://console.cloud.tencent.com/cos/bucket');
    console.error(`2. 找到存储桶: ${config.Bucket}`);
    console.error('3. 点击"权限管理" → "存储桶访问权限"');
    console.error('4. 下拉选择"公共读"');
    console.error('5. 点击"保存"');
    return;
  }

  console.log('✅ 成功设置存储桶为公共读权限！');
  console.log('\n📋 配置结果:');
  console.log(JSON.stringify(data, null, 2));

  console.log('\n🧪 验证配置...');
  console.log('请稍等片刻，然后访问以下地址验证:');
  console.log(`  https://jiuyueice.cloud/imgs/avatar.jpg`);
  console.log(`  https://jiuyueice.cloud/imgs/author2.jpg`);

  console.log('\n⚠️  注意:');
  console.log('1. CDN缓存可能需要时间刷新');
  console.log('2. 如果CDN还是403，需要在CDN控制台刷新缓存');
  console.log('3. 访问: https://console.cloud.tencent.com/cdn/access');
  console.log('4. 找到域名 jiuyueice.cloud → 缓存刷新 → 目录刷新');
  console.log('5. 刷新目录: /imgs/');
});
