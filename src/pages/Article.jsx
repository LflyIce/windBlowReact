import { useParams, Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { postsData } from '../utils/data';
import Sidebar from '../components/layout/Sidebar';

const Article = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    // 设置文章列表
    setArticles(postsData);
    
    // 如果有id参数，则获取特定文章
    if (id) {
      // 模拟获取文章详情
      const fetchPost = () => {
        try {
          // 在实际应用中，这里会是API调用
          const postData = postsData.find(post => post.id === parseInt(id));
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

      // 模拟网络请求延迟
      const timer = setTimeout(() => {
        fetchPost();
      }, 500);

      return () => clearTimeout(timer);
    } else {
      // 没有id参数时，不显示加载状态
      setIsLoading(false);
    }
  }, [id]);

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

  if (error) {
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

  // 如果有id且找到了文章，则显示文章详情
  if (id && post) {
    // 根据分类获取对应的颜色类
    const getCategoryColorClass = (category) => {
      const colorMap = {
        '生活方式': 'blue',
        '健康': 'green',
        '职场': 'purple',
        '阅读': 'yellow',
        '个人成长': 'indigo'
      };
      return colorMap[category] || 'gray';
    };

    const categoryColor = getCategoryColorClass(post.category);

    // 渲染文章内容
    const renderContent = () => {
      if (!post.content || post.content.length === 0) {
        return (
          <div className="prose prose-lg max-w-none text-white/90">
            <p>这篇文章的内容正在准备中，敬请期待...</p>
          </div>
        );
      }

      return (
        <div className="prose prose-lg max-w-none text-white/90">
          {post.content.map((item, index) => {
            switch (item.type) {
              case 'heading':
                return <h2 key={index} className="text-2xl font-bold mt-8 mb-4 text-white">{item.content}</h2>;
              case 'subheading':
                return <h3 key={index} className="text-xl font-semibold mt-6 mb-3 text-white">{item.content}</h3>;
              case 'paragraph':
                return <p key={index} className="mb-4 leading-relaxed">{item.content}</p>;
              case 'list':
                return (
                  <ul key={index} className="mb-4 list-disc pl-6 space-y-2">
                    {item.items.map((listItem, i) => (
                      <li key={i}>{listItem}</li>
                    ))}
                  </ul>
                );
              default:
                return null;
            }
          })}
        </div>
      );
    };

    return (
      <section className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-3 gap-10">
          {/* 文章内容 */}
          <div className="lg:col-span-2">
            <article className="bg-white/10 backdrop-blur-sm rounded-xl shadow-md p-6 md:p-8 mb-8 border border-white/20">
              <div className="mb-6">
                <Link 
                  to="/article" 
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
                      <p className="font-medium text-white">{post.author.name}</p>
                      <p className="text-sm text-white/70">{post.date} · {post.readTime}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <button className="flex items-center text-white/70 hover:text-white transition-colors">
                      <i className="fa fa-heart mr-1"></i>
                      <span>{post.likes}</span>
                    </button>
                    <button className="flex items-center text-white/70 hover:text-white transition-colors">
                      <i className="fa fa-share-alt mr-1"></i>
                      <span>分享</span>
                    </button>
                  </div>
                </div>
                
                <img 
                  src={post.image} 
                  alt={post.title} 
                  className="w-full h-64 md:h-96 object-cover rounded-lg mb-8 border border-white/20"
                />
                
                <div className="flex flex-wrap gap-2 mb-8">
                  {post.tags && post.tags.map((tag, index) => (
                    <span 
                      key={index} 
                      className="px-3 py-1 bg-white/20 text-white text-sm rounded-full border border-white/30"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
              
              {/* 文章正文内容 */}
              <div className="article-content">
                {renderContent()}
              </div>
            </article>
            
            {/* 评论区域 */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl shadow-md p-6 md:p-8 mb-8 border border-white/20">
              <h3 className="text-xl font-bold mb-6 text-white">评论 ({post.comments ? post.comments.length : 0})</h3>
              
              {post.comments && post.comments.length > 0 ? (
                <div className="space-y-6">
                  {post.comments.map(comment => (
                    <div key={comment.id} className="flex">
                      <img 
                        src={comment.authorAvatar} 
                        alt={comment.authorName} 
                        className="w-10 h-10 rounded-full mr-4 border border-white/30"
                      />
                      <div className="flex-1">
                        <div className="bg-white/10 rounded-lg p-4 border border-white/20">
                          <div className="flex justify-between mb-2">
                            <span className="font-medium text-white">{comment.authorName}</span>
                            <span className="text-sm text-white/70">{comment.date}</span>
                          </div>
                          <p className="text-white/90">{comment.content}</p>
                        </div>
                        <div className="flex items-center mt-2">
                          <button className="flex items-center text-sm text-white/70 hover:text-white transition-colors mr-4">
                            <i className="fa fa-heart mr-1"></i>
                            <span>{comment.likes}</span>
                          </button>
                          <button className="text-sm text-white/70 hover:text-white transition-colors">
                            回复
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-white/70 italic">暂无评论，快来抢沙发吧！</p>
              )}
              
              {/* 发表评论表单 */}
              <div className="mt-8">
                <h4 className="text-lg font-semibold mb-4 text-white">发表评论</h4>
                <form className="space-y-4">
                  <div>
                    <textarea 
                      placeholder="请输入您的评论..." 
                      className="w-full bg-white/10 border border-white/30 rounded-lg p-4 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50"
                      rows="4"
                    ></textarea>
                  </div>
                  <div className="flex justify-end">
                    <button 
                      type="submit"
                      className="px-6 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-all border border-white/30"
                    >
                      发表评论
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
          
          {/* 侧边栏 */}
          <div className="lg:col-span-1">
            <Sidebar />
          </div>
        </div>
      </section>
    );
  }

  // 如果没有id参数，则显示文章列表
  return (
    <section className="container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid lg:grid-cols-3 gap-10">
        {/* 文章列表 */}
        <div className="lg:col-span-2">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl shadow-md p-6 md:p-8 mb-8 border border-white/20">
            <h1 className="text-3xl font-bold mb-8 text-white">文章列表</h1>
            
            <div className="space-y-8">
              {articles.map((article) => (
                <article key={article.id} className="border-b border-white/20 pb-8 last:border-0 last:pb-0">
                  <div className="flex flex-col md:flex-row">
                    <div className="md:w-1/3 mb-4 md:mb-0 md:mr-6">
                      <img 
                        src={article.image} 
                        alt={article.title} 
                        className="w-full h-48 object-cover rounded-lg border border-white/20"
                      />
                    </div>
                    <div className="md:w-2/3">
                      <Link to={`/article/${article.id}`} className="text-white hover:text-white/80 transition-colors">
                        <h2 className="text-2xl font-bold mb-3">{article.title}</h2>
                      </Link>
                      <p className="text-white/70 mb-4 line-clamp-3">{article.excerpt}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <img 
                            src={article.author.avatar} 
                            alt={article.author.name} 
                            className="w-8 h-8 rounded-full mr-2 border border-white/30"
                          />
                          <span className="text-white/80 text-sm">{article.author.name}</span>
                        </div>
                        <span className="text-white/60 text-sm">{article.date}</span>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
        
        {/* 侧边栏 */}
        <div className="lg:col-span-1">
          <Sidebar />
        </div>
      </div>
    </section>
  );
};

export default Article;