# 图片替换指南

本指南将帮助您将项目中的所有图片替换为poetize.cn网站风格的图片。

## 需要替换的图片列表

### 背景图片
- `/public/imgs/background.jpg` - 网站背景图片

### 作者头像
- `/public/imgs/avatar.jpg` - 主作者头像
- `/public/imgs/author2.jpg` - 作者2头像
- `/public/imgs/author3.jpg` - 作者3头像

### 文章图片
- `/public/imgs/featured.jpg` - 特色文章图片
- `/public/imgs/post2.jpg` - 文章2图片
- `/public/imgs/post3.jpg` - 文章3图片
- `/public/imgs/post4.jpg` - 文章4图片
- `/public/imgs/post5.jpg` - 文章5图片

### 评论用户头像
- `/public/imgs/comment1.jpg` - 评论用户1头像
- `/public/imgs/comment2.jpg` - 评论用户2头像
- `/public/imgs/comment3.jpg` - 评论用户3头像

### 热门文章图片
- `/public/imgs/popular1.jpg` - 热门文章1图片
- `/public/imgs/popular2.jpg` - 热门文章2图片
- `/public/imgs/popular3.jpg` - 热门文章3图片
- `/public/imgs/popular4.jpg` - 热门文章4图片

## 如何获取poetize.cn风格的图片

1. 访问poetize.cn网站
2. 使用浏览器开发者工具（F12）查看网站使用的图片资源
3. 右键点击图片并选择"另存为"保存到本地
4. 或者使用截图工具截取网站上的精美图片

## 推荐的图片风格

- 背景图片：模糊的风景图或抽象图，色调偏暗以突出内容
- 文章图片：清晰的与文章主题相关的图片
- 头像图片：人物肖像或与个人品牌相关的图片
- 热门文章图片：吸引眼球的小图，适合缩略图展示

## 图片尺寸建议

- 背景图片：1920x1080px 或更大
- 文章主图：800x600px
- 头像图片：200x200px
- 缩略图：400x300px
- 评论头像：100x100px

## 替换步骤

1. 准备好所有需要的图片
2. 将图片重命名为上述列出的文件名
3. 将图片放入`/public/imgs/`目录中，替换原有文件
4. 重启开发服务器查看效果

## 注意事项

- 确保所有图片都进行了适当的压缩以优化加载速度
- 保持图片风格的一致性以提升用户体验
- 确保图片内容符合网站主题和定位
- 注意图片的版权问题，尽量使用无版权或自己拍摄的图片