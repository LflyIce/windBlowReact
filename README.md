# 个人博客网站 (React + Tailwind CSS)

一个现代化、响应式的个人博客网站实现，基于React 18和Tailwind CSS构建，具有优雅的UI设计和流畅的用户体验。

## 功能特点

- 响应式设计，完美适配移动端、平板和桌面设备
- 动态导航栏，滚动时自动调整样式
- 特色文章展示区，突出优质内容
- 文章卡片布局，带有精美的悬停动画效果
- 分类导航系统，方便内容浏览
- 作者信息展示和社交链接
- 邮件订阅功能，便于用户获取更新
- 平滑滚动和回到顶部功能

## 技术栈

- **前端框架**: React 18
- **路由管理**: React Router v6
- **样式解决方案**: Tailwind CSS 3
- **图标库**: Font Awesome 4.7
- **字体**: Inter (Google Fonts)

## 项目结构
src/
├── components/          # 可复用组件
│   ├── layout/          # 布局组件
│   │   ├── Navbar.jsx   # 导航栏
│   │   ├── Footer.jsx   # 页脚
│   │   └── Sidebar.jsx  # 侧边栏
│   ├── posts/           # 文章相关组件
│   │   ├── FeaturedPost.jsx  # 特色文章
│   │   ├── PostCard.jsx      # 文章卡片
│   │   └── PostList.jsx      # 文章列表
│   └── common/          # 通用组件
│       └── SubscribeForm.jsx # 订阅表单
├── pages/               # 页面组件
│   ├── Home.jsx         # 首页
│   ├── PostDetail.jsx   # 文章详情页
│   ├── About.jsx        # 关于页面
│   ├── Contact.jsx      # 联系页面
│   └── NotFound.jsx     # 404页面
├── utils/               # 工具函数和数据
│   └── data.js          # 静态数据
├── App.js               # 根组件
└── index.js             # 入口文件

## 图片替换指南

本项目默认使用占位图片，您可以按照以下步骤替换为poetize.cn风格的图片：

1. 参考 `IMAGE_REPLACEMENT_GUIDE.md` 文件中的详细说明
2. 准备符合要求的图片文件
3. 将图片文件放入 `public/imgs/` 目录中
4. 替换同名文件以更新网站中的图片

推荐使用与poetize.cn网站风格一致的图片，包括：
- 深色或柔和色调的背景图片
- 高质量的文章配图
- 专业的作者头像
- 一致的视觉风格

## 安装和运行

1. 克隆项目到本地
   ```
   git clone <项目地址>
   ```

2. 进入项目目录
   ```
   cd my-blog
   ```

3. 安装依赖
   ```
   npm install
   ```

4. 启动开发服务器
   ```
   npm start
   ```

5. 在浏览器中访问 http://localhost:3000 查看网站

## 构建生产版本

运行以下命令构建生产版本：

```
npm run build
```

构建后的文件将位于 `build/` 目录中，可以部署到任何静态网站托管服务上。

## 自定义配置

- **Tailwind CSS配置**: `tailwind.config.js`
- **PostCSS配置**: `postcss.config.js`
- **全局样式**: `src/index.css`
- **静态数据**: `src/utils/data.js`

## 浏览器支持

项目支持所有现代浏览器，包括：
- Chrome (最新2个版本)
- Firefox (最新2个版本)
- Safari (最新2个版本)
- Edge (最新2个版本)

## 许可证

本项目仅供学习和参考使用。
