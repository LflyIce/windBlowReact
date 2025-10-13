import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12 border-t border-gray-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <span className="text-emerald-400 text-2xl"><i className="fa fa-feather-alt"></i></span>
              <span className="font-bold text-xl">Persona Blog</span>
            </div>
            <p className="text-gray-400 mb-6 leading-relaxed max-w-md">
              探索生活的本质，分享关于极简主义、个人成长和可持续生活的思考与实践。
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-emerald-400 transition-colors duration-200">
                <i className="fab fa-twitter text-lg"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-emerald-400 transition-colors duration-200">
                <i className="fab fa-instagram text-lg"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-emerald-400 transition-colors duration-200">
                <i className="fab fa-github text-lg"></i>
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-semibold text-gray-200 mb-4 uppercase tracking-wider">导航</h4>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-400 hover:text-white transition-colors duration-200 text-sm">首页</Link></li>
              <li><Link to="/" className="text-gray-400 hover:text-white transition-colors duration-200 text-sm">所有文章</Link></li>
              <li><Link to="/about" className="text-gray-400 hover:text-white transition-colors duration-200 text-sm">关于我</Link></li>
              <li><Link to="/contact" className="text-gray-400 hover:text-white transition-colors duration-200 text-sm">联系我</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-sm font-semibold text-gray-200 mb-4 uppercase tracking-wider">分类</h4>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-400 hover:text-white transition-colors duration-200 text-sm">生活方式</Link></li>
              <li><Link to="/" className="text-gray-400 hover:text-white transition-colors duration-200 text-sm">个人成长</Link></li>
              <li><Link to="/" className="text-gray-400 hover:text-white transition-colors duration-200 text-sm">阅读</Link></li>
              <li><Link to="/" className="text-gray-400 hover:text-white transition-colors duration-200 text-sm">职场</Link></li>
              <li><Link to="/" className="text-gray-400 hover:text-white transition-colors duration-200 text-sm">健康</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-gray-800 mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm">
              &copy; {new Date().getFullYear()} Persona Blog. 保留所有权利。
            </p>
            <p className="text-gray-500 text-sm mt-4 md:mt-0">
              Made with passion for thoughtful living.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;