import { Link } from 'react-router-dom';
import PostCard from './PostCard';

const PostList = ({ posts }) => {
  return (
    <div className="lg:col-span-2">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-white">最新文章</h2>
        <Link 
          to="/" 
          className="text-white/80 font-medium hover:text-white transition-colors flex items-center"
        >
          查看全部 <i className="fa fa-long-arrow-right ml-2"></i>
        </Link>
      </div>
      
      {/* 文章卡片列表 */}
      <div className="space-y-10">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
      
      {/* 加载更多按钮 */}
      <div className="mt-10 text-center">
        <button className="px-8 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white font-medium hover:bg-white/20 transition-all inline-flex items-center shadow-lg hover:shadow-xl">
          加载更多 <i className="fa fa-refresh ml-2"></i>
        </button>
      </div>
    </div>
  );
};

export default PostList;