# 🚀 COS 图片上传快速开始

## 三步完成配置

### 第 1 步：配置密钥（5分钟）

1. 访问 https://console.cloud.tencent.com/cam/capi 获取密钥
2. 编辑 `.env.local` 文件，替换以下内容：
   ```env
   REACT_APP_COS_SECRET_ID=你的SecretId
   REACT_APP_COS_SECRET_KEY=你的SecretKey
   ```
   其他配置已经预置好，无需修改。

### 第 2 步：上传图片（1分钟）

```bash
npm run upload:images
```

等待上传完成，你会看到每个图片的 CDN 地址。

### 第 3 步：验证部署（1分钟）

启动开发服务器：
```bash
npm start
```

打开浏览器，访问 http://localhost:3000

检查：
- ✅ 图片正常显示
- ✅ 右键检查图片地址，应显示 `https://jiuyueice.cloud/imgs/...`

## 🎉 完成！

现在你的博客已经使用 CDN 加速图片加载了！

## 📝 需要帮助？

查看详细文档：[COS_UPLOAD_GUIDE.md](./COS_UPLOAD_GUIDE.md)

## 🔧 常用命令

```bash
# 上传图片到 COS
npm run upload:images

# 优化本地图片
npm run optimize:images

# 启动开发服务器
npm start
```

## ⚠️ 重要提醒

1. **永远不要**将 `.env.local` 文件提交到 Git
2. `.env.local` 已在 `.gitignore` 中，会被自动忽略
3. 如果需要团队共享配置，使用 `.env.example` 作为模板

## 🌐 CDN 地址说明

- **开发环境**：使用相对路径 `/imgs/...`
- **生产环境**：自动使用 CDN `https://jiuyueice.cloud/imgs/...`

只需在 `.env.local` 中配置 `REACT_APP_COS_CDN_DOMAIN`，项目会自动切换！
