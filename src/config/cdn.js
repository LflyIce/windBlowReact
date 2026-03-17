/**
 * CDN配置文件
 * 用于管理静态资源的CDN地址
 */

// 从环境变量读取CDN域名，如果没有配置则使用相对路径
const CDN_DOMAIN = process.env.REACT_APP_COS_CDN_DOMAIN || '';

/**
 * 获取图片的CDN地址
 * @param {string} imagePath - 图片的相对路径，如 '/imgs/avatar.jpg'
 * @returns {string} 完整的CDN地址或相对路径
 */
export const getImageUrl = (imagePath) => {
  if (!CDN_DOMAIN) {
    // 如果没有配置CDN域名，使用相对路径
    return imagePath;
  }

  // 移除开头的斜杠
  const cleanPath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath;

  // 返回CDN地址
  return `https://${CDN_DOMAIN}/${cleanPath}`;
};

/**
 * 批量转换图片路径为CDN地址
 * @param {string[]} imagePaths - 图片路径数组
 * @returns {string[]} CDN地址数组
 */
export const getImageUrls = (imagePaths) => {
  return imagePaths.map(getImageUrl);
};

/**
 * 检查是否启用了CDN
 */
export const isCDNEnabled = () => {
  return !!CDN_DOMAIN;
};

export default {
  getImageUrl,
  getImageUrls,
  isCDNEnabled,
};
