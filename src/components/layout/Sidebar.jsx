import { Link } from 'react-router-dom';
import SubscribeForm from '../common/SubscribeForm';
import { categories, popularPosts, author } from '../../utils/data';

const Sidebar = () => {
  return (
    <div className="lg:col-span-1">
      {/* 作者信息 */} 
      <div className="bg-white/10 backdrop-blur-sm rounded-xl shadow-md p-6 mb-8 text-center border border-white/20">
        <img 
          src={author.avatar} 
          alt={author.name} 
          className="w-24 h-24 rounded-full object-cover mx-auto mb-4 border-4 border-white/30"
        />
        <h3 className="text-xl font-bold mb-2 text-white">{author.name}</h3>
        <p className="text-white/80 mb-4">{author.title}</p>
        <p className="text-white/70 text-sm mb-6">
          {author.bio}
        </p>
        <div className="flex justify-center space-x-4">
          {author.socialLinks.map((link, index) => (
            <a 
              key={index}
              href={link.url} 
              className="text-white/70 hover:text-white transition-colors text-lg"
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className={link.icon}></i>
            </a>
          ))}
        </div>
      </div>
      
      {/* 分类 */} 
      <div className="bg-white/10 backdrop-blur-sm rounded-xl shadow-md p-6 mb-8 border border-white/20">
        <h3 className="text-xl font-bold mb-4 text-white">分类</h3>
        <ul className="space-y-3">
          {categories.map((category) => (
            <li key={category.id}>
              <Link 
                to="/" 
                className="flex justify-between items-center text-white/80 hover:text-white transition-colors py-2"
              >
                <span>{category.name}</span>
                <span className="bg-white/20 text-white text-xs font-medium px-2 py-1 rounded-full">
                  {category.count}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
      
      {/* 热门文章 */} 
      <div className="bg-white/10 backdrop-blur-sm rounded-xl shadow-md p-6 mb-8 border border-white/20">
        <h3 className="text-xl font-bold mb-4 text-white">热门文章</h3>
        <div className="space-y-4">
          {popularPosts.map((post) => (
            <Link 
              key={post.id}
              to={`/post/${post.id}`}
              className="flex items-center group"
            >
              <div className="relative w-16 h-16 flex-shrink-0 mr-4">
                <div className="absolute inset-0 bg-gray-200 animate-pulse rounded"></div>
                <img 
                  src={post.image} 
                  alt={post.title} 
                  className="w-full h-full object-cover rounded"
                  onLoad={(e) => {
                    // 隐藏占位符
                    e.target.previousElementSibling.style.display = 'none';
                  }}
                />
              </div>
              <div>
                <h4 className="text-white font-medium group-hover:text-blue-200 transition-colors line-clamp-2">
                  {post.title}
                </h4>
                <p className="text-white/70 text-sm mt-1">{post.date}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
      
      {/* 订阅表单 */} 
      <div className="bg-white/10 backdrop-blur-sm rounded-xl shadow-md p-6 border border-white/20">
        <h3 className="text-xl font-bold mb-4 text-white">订阅更新</h3>
        <p className="text-white/80 mb-4 text-sm">
          获取最新的文章和独家内容
        </p>
        <SubscribeForm 
          inputPlaceholder="您的邮箱地址"
          buttonText="订阅"
          className="space-y-3"
        />
      </div>
    </div>
  );
};

export default Sidebar;