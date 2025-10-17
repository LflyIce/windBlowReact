import { Link } from 'react-router-dom';
import { author } from '../../utils/data';

const Footer = () => {
  const navLinks = [
    { name: '首页', path: '/' },
    { name: '文章', path: '/article' },
    { name: '关于', path: '/about' },
    { name: '联系', path: '/contact' }
  ];

  return (
    <footer className="bg-white/10 border-t border-white/20 pt-16 pb-8 backdrop-blur-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* 关于 */}
          <div className="md:col-span-1">
            <h3 className="text-xl font-bold text-white mb-4">我的博客</h3>
            <p className="text-white/70 mb-4">
              分享技术、生活和思考的个人博客网站。
            </p>
            <div className="flex space-x-4">
              {author.socialLinks.map((link, index) => (
                <a 
                  key={index} 
                  href={link.url} 
                  className="text-white/80 hover:text-white transition-colors"
                >
                  <i className={`${link.icon} text-lg`}></i>
                </a>
              ))}
            </div>
          </div>
          
          {/* 导航链接 */}
          <div className="md:col-span-2">
            <h3 className="text-xl font-bold text-white mb-4">快速链接</h3>
            <div className="grid grid-cols-2 gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="text-white/80 hover:text-white transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
          
          {/* 联系信息 */}
          <div className="md:col-span-1">
            <h3 className="text-xl font-bold text-white mb-4">联系信息</h3>
            <ul className="space-y-2 text-white/70">
              <li className="flex items-start">
                <i className="fa fa-envelope mt-1 mr-3 text-white/80"></i>
                <span>1489751526@qq.com</span>
              </li>
              <li className="flex items-start">
                <i className="fa fa-map-marker mt-1 mr-3 text-white/80"></i>
                <span>广东省深圳市</span>
              </li>
            </ul>
          </div>
        </div>
        
        {/* 版权信息 */}
        <div className="border-t border-white/20 pt-8 text-center">
          <p className="text-white/70">
            &copy; {new Date().getFullYear()} 我的博客. 保留所有权利。
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;