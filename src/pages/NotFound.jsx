import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="max-w-2xl mx-auto text-center bg-white/10 backdrop-blur-sm rounded-2xl p-12 shadow-xl border border-white/20">
        <div className="text-6xl font-bold text-white mb-6">404</div>
        <h1 className="text-3xl font-bold text-white mb-4">页面未找到</h1>
        <p className="text-white/80 mb-8 text-lg">
          抱歉，您访问的页面不存在或已被移除。
        </p>
        <Link 
          to="/" 
          className="inline-block px-8 py-3 bg-white/20 hover:bg-white/30 text-white font-medium rounded-lg transition-colors border border-white/30"
        >
          返回首页
        </Link>
      </div>
    </section>
  );
};

export default NotFound;