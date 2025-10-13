import { useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();
  
  return (
    <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="max-w-2xl mx-auto text-center">
        <div className="text-9xl font-bold text-white/20 mb-6">404</div>
        <h1 className="text-3xl font-bold mb-4 text-white">页面未找到</h1>
        <p className="text-white/80 mb-8 text-lg">
          抱歉，您请求的页面不存在或已被移动。
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button 
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-white/20 text-white font-medium rounded-lg hover:bg-white/30 transition-all border border-white/30"
          >
            返回首页
          </button>
          <button 
            onClick={() => navigate(-1)}
            className="px-6 py-3 bg-white/20 text-white font-medium rounded-lg hover:bg-white/30 transition-all border border-white/30"
          >
            返回上一页
          </button>
        </div>
      </div>
    </section>
  );
};

export default NotFound;