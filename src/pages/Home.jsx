import { useState, useEffect } from 'react';
import FeaturedPost from '../components/posts/FeaturedPost';
import PostList from '../components/posts/PostList';
import Sidebar from '../components/layout/Sidebar';
import SubscribeForm from '../components/common/SubscribeForm';
import { postsData, featuredPost } from '../utils/data';

const Home = () => {
  // 使用前3篇文章作为轮播图内容
  const [featuredPosts] = useState(() => {
    // 确保featuredPost是第一个，然后添加其他文章
    const filteredPosts = postsData.filter(post => post.id !== featuredPost.id);
    return [featuredPost, ...filteredPosts.slice(0, 2)]; // 总共显示3篇文章
  });
  
  const [currentFeaturedIndex, setCurrentFeaturedIndex] = useState(0);
  
  // 排除特色文章，只显示其他文章
  const regularPosts = postsData.filter(post => 
    !featuredPosts.some(fp => fp.id === post.id)
  );
  
  // 自动轮播效果
  useEffect(() => {
    if (featuredPosts.length <= 1) return; // 只有一篇文章时不轮播
    
    const interval = setInterval(() => {
      setCurrentFeaturedIndex(prevIndex => 
        (prevIndex + 1) % featuredPosts.length
      );
    }, 5000);
    
    return () => clearInterval(interval);
  }, [featuredPosts.length]);
  
  // 手动切换到指定索引
  const goToSlide = (index) => {
    setCurrentFeaturedIndex(index);
  };
  
  // 切换到下一张
  const nextSlide = () => {
    setCurrentFeaturedIndex((prevIndex) => 
      prevIndex === featuredPosts.length - 1 ? 0 : prevIndex + 1
    );
  };
  
  // 切换到上一张
  const prevSlide = () => {
    setCurrentFeaturedIndex((prevIndex) => 
      prevIndex === 0 ? featuredPosts.length - 1 : prevIndex - 1
    );
  };
  
  return (
    <>
      {/* 特色文章轮播 */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="relative h-[500px] overflow-hidden rounded-2xl shadow-2xl">
          {/* 轮播内容 */}
          {featuredPosts.map((post, index) => (
            <div 
              key={post.id}
              className={`absolute inset-0 transition-all duration-1000 ease-in-out rounded-2xl ${
                index === currentFeaturedIndex 
                  ? 'opacity-100 scale-100 z-10' 
                  : 'opacity-0 scale-95 z-0'
              }`}
            >
              <FeaturedPost post={post} />
            </div>
          ))}
          
          {/* 左右切换按钮 */}
          {featuredPosts.length > 1 && (
            <>
              <button 
                onClick={prevSlide}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full backdrop-blur-md transition-all duration-300 opacity-80 hover:opacity-100 z-10 hover:scale-110 shadow-lg"
                aria-label="上一张"
              >
                <i className="fa fa-chevron-left text-lg"></i>
              </button>
              <button 
                onClick={nextSlide}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full backdrop-blur-md transition-all duration-300 opacity-80 hover:opacity-100 z-10 hover:scale-110 shadow-lg"
                aria-label="下一张"
              >
                <i className="fa fa-chevron-right text-lg"></i>
              </button>
            </>
          )}
          
          {/* 轮播指示器 */}
          {featuredPosts.length > 1 && (
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3 z-10">
              {featuredPosts.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === currentFeaturedIndex 
                      ? 'bg-white w-8 hover:w-10' 
                      : 'bg-white/60 hover:bg-white/80'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          )}
          
          {/* 轮播进度条 */}
          {featuredPosts.length > 1 && (
            <div className="absolute bottom-2 left-8 right-8 h-0.5 bg-white/30 rounded-full z-10">
              <div 
                className="absolute top-0 left-0 h-full bg-white rounded-full transition-all duration-500"
                style={{
                  width: `${((currentFeaturedIndex + 1) / featuredPosts.length) * 100}%`,
                  background: 'linear-gradient(90deg, #fff, #9ca3af)'
                }}
              ></div>
            </div>
          )}
        </div>
      </section>
      
      {/* 最新文章和侧边栏 */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2">
            <PostList posts={regularPosts} />
          </div>
          <div>
            <Sidebar />
          </div>
        </div>
      </section>
      
      {/* 订阅区域 */}
      <section className="py-16 mt-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center bg-white/10 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/20">
            <h2 className="text-3xl font-bold mb-4 text-white">不错过任何更新</h2>
            <p className="text-white/80 mb-8 text-lg">
              订阅我的博客，每周收到精选文章和独家内容
            </p>
            <SubscribeForm 
              inputPlaceholder="输入您的邮箱地址"
              buttonText="立即订阅"
              className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto"
            />
            <p className="text-white/70 text-sm mt-4">
              我们重视您的隐私，您可以随时取消订阅
            </p>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;