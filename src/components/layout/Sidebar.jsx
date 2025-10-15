import { useState } from 'react';
import { Link } from 'react-router-dom';
import SubscribeForm from '../common/SubscribeForm';
import { categories, popularPosts } from '../../utils/data';

const Sidebar = () => {
  const [activeTab, setActiveTab] = useState('categories');

  return (
    <div className="space-y-8">
      {/* 分类和热门文章切换 */}
      <div className="bg-white/5 backdrop-blur-sm rounded-xl shadow-md border border-white/10 overflow-hidden">
        {/* 标签切换 */}
        <div className="flex border-b border-white/10">
          <button
            onClick={() => setActiveTab('categories')}
            className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
              activeTab === 'categories'
                ? 'bg-white/20 text-white'
                : 'text-white/70 hover:bg-white/10'
            }`}
          >
            分类
          </button>
          <button
            onClick={() => setActiveTab('popular')}
            className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
              activeTab === 'popular'
                ? 'bg-white/20 text-white'
                : 'text-white/70 hover:bg-white/10'
            }`}
          >
            热门文章
          </button>
        </div>
        
        {/* 内容区域 */}
        <div className="p-6">
          {activeTab === 'categories' ? (
            <ul className="space-y-3">
              {categories.map(category => (
                <li key={category.id}>
                  <Link 
                    to="#" 
                    className="flex justify-between items-center py-2 text-white/70 hover:text-white transition-colors"
                  >
                    <span>{category.name}</span>
                    <span className="bg-white/20 text-white text-xs px-2 py-1 rounded-full">
                      {category.count}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <div className="space-y-4">
              {popularPosts.map(post => (
                <Link 
                  key={post.id} 
                  to={`/post/${post.id}`}
                  className="group flex items-center space-x-3"
                >
                  <div className="w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden border border-white/10">
                    <img 
                      src={post.image} 
                      alt={post.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div>
                    <h3 className="text-white font-medium group-hover:text-white/80 transition-colors line-clamp-2 text-sm">
                      {post.title}
                    </h3>
                    <p className="text-white/50 text-xs mt-1">{post.date}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
      
      {/* 订阅组件 */}
      <div className="bg-white/5 backdrop-blur-sm rounded-xl shadow-md p-6 border border-white/10">
        <h3 className="text-xl font-bold mb-4 text-white">订阅博客</h3>
        <p className="text-white/60 mb-4 text-sm">
          获取最新文章和独家内容
        </p>
        <SubscribeForm 
          inputPlaceholder="输入您的邮箱"
          buttonText="订阅"
        />
      </div>
      
      {/* 标签云 */}
      <div className="bg-white/5 backdrop-blur-sm rounded-xl shadow-md p-6 border border-white/10">
        <h3 className="text-xl font-bold mb-4 text-white">热门标签</h3>
        <div className="flex flex-wrap gap-2">
          {['React', 'JavaScript', 'CSS', 'Tailwind', 'Vue', 'Angular', 'Node.js', 'Python', '设计', '生活'].map((tag, index) => (
            <Link 
              key={index}
              to="#"
              className="px-3 py-1 bg-white/15 hover:bg-white/25 text-white text-sm rounded-full transition-colors duration-200"
            >
              {tag}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;