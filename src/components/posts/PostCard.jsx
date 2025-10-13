import { Link } from 'react-router-dom';

const PostCard = ({ post }) => {
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
    <article className="bg-white/10 backdrop-blur-sm rounded-xl overflow-hidden shadow-lg card-hover border border-white/20 transition-all hover:shadow-xl">
      <div className="md:flex">
        <div className="md:w-1/3">
          <div className="relative h-full">
            <div className="absolute inset-0 bg-gray-200 animate-pulse"></div>
            <img 
              src={post.image} 
              alt={post.title} 
              className="w-full h-56 md:h-full object-cover"
              onLoad={(e) => {
                // 隐藏占位符
                e.target.previousElementSibling.style.display = 'none';
              }}
            />
          </div>
        </div>
        <div className="md:w-2/3 p-6 md:p-8">
          <div className="flex items-center mb-4">
            <span className={`bg-${categoryColor}-100 text-${categoryColor}-600 text-xs font-medium px-3 py-1 rounded-full`}>
              {post.category}
            </span>
            <span className="text-white/70 text-sm ml-4">{post.date}</span>
          </div>
          <h3 className="text-xl font-bold mb-3">
            <Link 
              to={`/post/${post.id}`} 
              className="text-white hover:text-blue-200 transition-colors"
            >
              {post.title}
            </Link>
          </h3>
          <p className="text-white/80 mb-4 line-clamp-2">
            {post.excerpt}
          </p>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <img 
                src={post.author.avatar} 
                alt={post.author.name} 
                className="w-8 h-8 rounded-full mr-2 border border-white/30"
              />
              <span className="text-white text-sm">{post.author.name}</span>
            </div>
            <span className="text-white/70 text-sm">{post.readTime}</span>
          </div>
        </div>
      </div>
    </article>
  );
};

export default PostCard;