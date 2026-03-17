# 腾讯云 COS 图片上传指南

本文档说明如何将静态图片上传到腾讯云 COS，并在项目中使用 CDN 加速。

## 📋 前置准备

### 1. 获取腾讯云密钥

1. 访问 [腾讯云 API 密钥管理](https://console.cloud.tencent.com/cam/capi)
2. 创建或获取你的 `SecretId` 和 `SecretKey`
3. 确保你的账号已开通 COS 服务

### 2. 配置环境变量

编辑 `.env.local` 文件，填入你的密钥信息：

```env
REACT_APP_COS_SECRET_ID=你的SecretId
REACT_APP_COS_SECRET_KEY=你的SecretKey
REACT_APP_COS_BUCKET=jiuyue-1308104144
REACT_APP_COS_REGION=ap-shanghai
REACT_APP_COS_CDN_DOMAIN=jiuyueice.cloud
```

⚠️ **重要**：`.env.local` 文件包含敏感信息，请勿提交到 Git 仓库！

## 🚀 上传图片

### 方式一：使用 NPM 脚本（推荐）

```bash
npm run upload:images
```

该命令会自动：
- 扫描 `public/imgs/` 目录下的所有图片
- 上传到腾讯云 COS 的 `imgs/` 路径
- 显示上传进度和 CDN 地址

### 方式二：手动运行脚本

```bash
node scripts/upload-images-to-cos.js
```

## 📁 目录结构

```
public/imgs/           # 本地图片目录
├── avatar.jpg
├── background.jpg
├── featured.jpg
└── ...

COS 桶:
└── imgs/              # COS 中的目标路径
    ├── avatar.jpg
    ├── background.jpg
    ├── featured.jpg
    └── ...
```

## 🌐 访问图片

上传成功后，图片可以通过以下方式访问：

### 1. CDN 地址（推荐）

```
https://jiuyueice.cloud/imgs/avatar.jpg
```

### 2. COS 原始地址

```
https://jiuyue-1308104144.cos.ap-shanghai.myqcloud.com/imgs/avatar.jpg
```

## 💻 项目中使用

### 自动使用 CDN 地址

项目中已经集成了 CDN 配置，会自动使用 CDN 地址：

```javascript
import { getImageUrl } from './config/cdn';

// 自动转换为 CDN 地址
const avatarUrl = getImageUrl('/imgs/avatar.jpg');
// 结果: https://jiuyueice.cloud/imgs/avatar.jpg
```

### 环境变量控制

- **配置了 CDN 域名**：使用 `https://jiuyueice.cloud/...`
- **未配置 CDN 域名**：使用相对路径 `/imgs/...`

## 📊 上传示例

```bash
$ npm run upload:images

🚀 开始上传图片到腾讯云 COS...

📦 Bucket: jiuyue-1308104144
🌍 Region: ap-shanghai
📁 本地目录: d:\666\blog\windBlowReact\public\imgs

📊 找到 18 个图片文件

⬆️  上传: avatar.jpg
✅ 成功: avatar.jpg
   CDN地址: https://jiuyueice.cloud/imgs/avatar.jpg

⬆️  上传: background.jpg
✅ 成功: background.jpg
   CDN地址: https://jiuyueice.cloud/imgs/background.jpg

...

==================================================
📈 上传完成统计:
✅ 成功: 18 个
❌ 失败: 0 个
==================================================
```

## 🔧 常见问题

### 1. 上传失败：密钥错误

```
❌ 错误: 请先在 .env.local 文件中配置你的腾讯云 COS 密钥
```

**解决方案**：
- 检查 `.env.local` 文件是否存在
- 确认 `SecretId` 和 `SecretKey` 是否正确
- 确保密钥有 COS 的读写权限

### 2. CDN 无法访问

**可能原因**：
- COS 中的文件未设置为公共读权限
- CDN 缓存未刷新
- 域名配置有误

**解决方案**：
1. 在腾讯云 COS 控制台设置存储桶为**公共读**权限
2. 在 CDN 控制台刷新缓存
3. 检查域名解析是否正确

### 3. 图片显示不正常

**检查清单**：
- 图片是否成功上传到 COS
- 图片路径是否正确（区分大小写）
- 浏览器缓存是否已清除

## 🎯 最佳实践

### 1. 图片优化

上传前建议先优化图片：

```bash
# 使用项目中的优化脚本
npm run optimize:images
```

### 2. 版本控制

建议为图片添加版本号或哈希值，避免缓存问题：

```javascript
// 示例
const avatarUrl = getImageUrl('/imgs/avatar.jpg?v=1.0.0');
```

### 3. 定期清理

定期清理 COS 中不再使用的图片，节省存储空间。

## 📚 相关文档

- [腾讯云 COS 文档](https://cloud.tencent.com/document/product/436)
- [CDN 配置指南](https://cloud.tencent.com/document/product/228)
- [COS Node.js SDK](https://cloud.tencent.com/document/product/436/8629)

## 🔄 更新日志

- 2026-03-17: 初始版本，支持图片上传到 COS
- 集成 CDN 配置，自动切换图片地址
