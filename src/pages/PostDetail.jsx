import { useParams, Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Sidebar from '../components/layout/Sidebar';

const PostDetail = ({ getPostById }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // 获取文章详情
    const fetchPost = () => {
      try {
        const postData = getPostById(id);
        if (postData) {
          setPost(postData);
          setIsLoading(false);
        } else {
          throw new Error('文章不存在');
        }
      } catch (err) {
        setError(err.message);
        setIsLoading(false);
      }
    };

    fetchPost();
  }, [id, getPostById]);

  // 处理文章不存在的情况
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex justify-center items-center h-64">
          <i className="fa fa-spinner fa-spin text-4xl text-white"></i>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-red-300 mb-4">文章未找到</h2>
          <p className="text-white/80 mb-6">{error || '很抱歉，请求的文章不存在或已被删除。'}</p>
          <button 
            onClick={() => navigate('/')}
            className="px-6 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-all border border-white/30"
          >
            返回首页
          </button>
        </div>
      </div>
    );
  }

  // 根据分类获取对应的颜色类
  const getCategoryColorClass = (category) => {
    const colorMap = {
      '生活方式': 'blue',
      '健康': 'green',
      '职场': 'purple',
      '阅读': 'yellow'
    };
    return colorMap[category] || 'gray';
  };

  const categoryColor = getCategoryColorClass(post.category);

  return (
    <section className="container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid lg:grid-cols-3 gap-10">
        {/* 文章内容 */}
        <div className="lg:col-span-2">
          <article className="bg-white/10 backdrop-blur-sm rounded-xl shadow-md p-6 md:p-8 mb-8 border border-white/20">
            <div className="mb-6">
              <Link 
                to="/" 
                className="text-white/80 hover:text-white transition-colors inline-flex items-center mb-4"
              >
                <i className="fa fa-arrow-left mr-2"></i> 返回文章列表
              </Link>
              
              <span className={`bg-${categoryColor}-100 text-${categoryColor}-600 text-xs font-medium px-3 py-1 rounded-full`}>
                {post.category}
              </span>
              
              <h1 className="text-3xl md:text-4xl font-bold mt-4 mb-6 text-white">
                {post.title}
              </h1>
              
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center">
                  <img 
                    src={post.author.avatar} 
                    alt={post.author.name} 
                    className="w-10 h-10 rounded-full mr-3 border border-white/30"
                  />
                  <div>
                    <p className="text-white font-medium">{post.author.name}</p>
                    <p className="text-white/70 text-sm">{post.date} · {post.readTime}</p>
                  </div>
                </div>
                
                <div className="flex space-x-3">
                  <button className="text-white/80 hover:text-white transition-colors">
                    <i className="fa fa-bookmark-o"></i>
                  </button>
                  <button className="text-white/80 hover:text-white transition-colors">
                    <i className="fa fa-share-alt"></i>
                  </button>
                </div>
              </div>
            </div>
            
            <div className="mb-8">
              <div className="relative rounded-xl overflow-hidden mb-6">
                <div className="absolute inset-0 bg-gray-200 animate-pulse"></div>
                <img 
                  src={post.image} 
                  alt={post.title} 
                  className="w-full h-96 object-cover rounded-xl"
                  onLoad={(e) => {
                    // 隐藏占位符
                    e.target.previousElementSibling.style.display = 'none';
                  }}
                />
              </div>
              
              <div className="prose text-white">
                {post.content.map((section, index) => (
                  <div key={index} className="mb-6">
                    {section.type === 'paragraph' && (
                      <p className="text-white/90">{section.content}</p>
                    )}
                    
                    {section.type === 'heading' && (
                      <h2 className="text-white border-l-4 border-white/30 pl-4 py-1">{section.content}</h2>
                    )}
                    
                    {section.type === 'subheading' && (
                      <h3 className="text-white/90 border-b border-white/20 pb-2">{section.content}</h3>
                    )}
                    
                    {section.type === 'list' && (
                      <ol className="text-white/90 list-decimal pl-5 space-y-2">
                        {section.items.map((item, i) => (
                          <li key={i}>{item}</li>
                        ))}
                      </ol>
                    )}
                  </div>
                ))}
              </div>
            </div>
            
            <div className="border-t border-white/20 py-6 mb-6">
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag, index) => (
                  <Link 
                    key={index}
                    to="/" 
                    className="bg-white/20 text-white text-sm px-3 py-1 rounded-full hover:bg-white/30 transition-all"
                  >
                    #{tag}
                  </Link>
                ))}
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <button className="text-white/80 hover:text-white transition-colors flex items-center">
                <i className="fa fa-thumbs-o-up mr-2"></i>
                <span>喜欢 ({post.likes})</span>
              </button>
              
              <div className="flex space-x-4">
                <button className="text-white/80 hover:text-white transition-colors">
                  <i className="fa fa-twitter"></i>
                </button>
                <button className="text-white/80 hover:text-white transition-colors">
                  <i className="fa fa-facebook"></i>
                </button>
                <button className="text-white/80 hover:text-white transition-colors">
                  <i className="fa fa-linkedin"></i>
                </button>
                <button className="text-white/80 hover:text-white transition-colors">
                  <i className="fa fa-envelope"></i>
                </button>
              </div>
            </div>
          </article>
          
          {/* 作者信息 */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl shadow-md p-6 md:p-8 mb-8 border border-white/20">
            <div className="flex flex-col md:flex-row items-center">
              <img 
                src={post.author.avatar} 
                alt={post.author.name} 
                className="w-20 h-20 rounded-full object-cover mb-4 md:mb-0 md:mr-6 border-4 border-white/30"
              />
              <div className="text-center md:text-left">
                <h3 className="text-xl font-bold mb-2 text-white">{post.author.name}</h3>
                <p className="text-white/80 mb-3">{post.author.title}</p>
                <p className="text-white/70 mb-4">{post.author.bio}</p>
                <div className="flex justify-center md:justify-start space-x-4">
                  {post.author.socialLinks.map((link, index) => (
                    <a 
                      key={index}
                      href={link.url} 
                      className="text-white/80 hover:text-white transition-colors"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <i className={link.icon}></i>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          {/* 评论区 */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl shadow-md p-6 md:p-8 border border-white/20">
            <h3 className="text-2xl font-bold mb-6 text-white">评论 ({post.comments.length})</h3>
            
            {/* 评论输入框 */}
            <div className="mb-8">
              <textarea 
                placeholder="分享你的想法..." 
                className="w-full p-4 bg-white/20 border border-white/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white resize-none h-24 text-white placeholder-white/60"
              ></textarea>
              <div className="flex justify-end mt-3">
                <button className="px-6 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-all border border-white/30">
                  发表评论
                </button>
              </div>
            </div>
            
            {/* 评论列表 */}
            <div className="space-y-6">
              {post.comments.map((comment, index) => (
                <div key={index} className="border-b border-white/20 pb-6 last:border-0">
                  <div className="flex">
                    <img 
                      src={comment.authorAvatar} 
                      alt={comment.authorName} 
                      className="w-10 h-10 rounded-full mr-3 border border-white/30"
                    />
                    <div>
                      <div className="flex items-center mb-1">
                        <h4 className="font-medium text-white">{comment.authorName}</h4>
                        <span className="text-white/70 text-sm ml-3">{comment.date}</span>
                      </div>
                      <p className="text-white/90">{comment.content}</p>
                      <div className="flex items-center mt-2">
                        <button className="text-white/80 hover:text-white text-sm transition-colors flex items-center">
                          <i className="fa fa-thumbs-o-up mr-1"></i> 
                          <span>{comment.likes}</span>
                        </button>
                        <button className="text-white/80 hover:text-white text-sm transition-colors ml-4">
                          回复
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* 侧边栏 */}
        <Sidebar />
      </div>
    </section>
  );
};

export default PostDetail;