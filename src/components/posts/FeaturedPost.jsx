import { Link } from 'react-router-dom';

const FeaturedPost = ({ post }) => {
  return (
    <div className="bg-gradient-to-r from-black/80 to-black/60 rounded-2xl overflow-hidden shadow-xl h-full relative">
      {/* 背景图片 */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gray-200 animate-pulse"></div>
        <img 
          src={post.image} 
          alt={post.title} 
          className="absolute inset-0 w-full h-full object-cover"
          onLoad={(e) => {
            // 隐藏占位符
            e.target.previousElementSibling.style.display = 'none';
          }}
        />
        {/* 渐变遮罩 */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent"></div>
      </div>
      
      {/* 内容 */}
      <div className="relative z-10 grid md:grid-cols-2 gap-8 h-full">
        <div className="p-8 md:p-12 flex flex-col justify-center">
          <span className="text-white/90 text-sm font-medium bg-white/10 px-3 py-1 rounded-full inline-block mb-4 w-fit backdrop-blur-sm">
            特色文章
          </span>
          <h1 className="text-[clamp(1.75rem,4vw,2.5rem)] font-bold text-white leading-tight mb-4 line-clamp-2 h-[calc(1.75rem*2*1.2*2)]">
            {post.title}
          </h1>
          <p className="text-white/90 text-lg mb-6 line-clamp-3 h-[calc(1.5rem*3)]">
            {post.excerpt}
          </p>
          <div className="flex items-center mb-8">
            <img 
              src={post.author.avatar} 
              alt={post.author.name} 
              className="w-10 h-10 rounded-full object-cover mr-3 border-2 border-white/30"
            />
            <div>
              <p className="text-white font-medium">{post.author.name}</p>
              <p className="text-white/80 text-sm">{post.date} · {post.readTime}</p>
            </div>
          </div>
          <Link 
            to={`/post/${post.id}`}
            className="inline-flex items-center text-white font-medium bg-white/20 hover:bg-white/30 transition-all px-6 py-3 rounded-lg backdrop-blur-sm w-fit border border-white/30 hover:border-white/50"
          >
            阅读全文
            <i className="fa fa-arrow-right ml-2"></i>
          </Link>
        </div>
        <div className="hidden md:block"></div>
      </div>
    </div>
  );
};

export default FeaturedPost;