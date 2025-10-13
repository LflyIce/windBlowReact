import { useState } from 'react';
import { Link } from 'react-router-dom';

const Navbar = ({ isScrolled }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
    if (!isSearchOpen) {
      setIsMenuOpen(false); // 关闭菜单当打开搜索时
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    console.log('搜索:', searchQuery);
    // TODO: 实现搜索功能
  };

  return (
    <header 
      className={`fixed w-full top-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-md shadow-lg' 
          : 'bg-white/10 backdrop-blur-md shadow-none'
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* 博客Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <span className="text-gray-800 text-2xl group-hover:text-indigo-600 transition-colors"><i className="fa fa-feather-alt"></i></span>
            <span className="font-bold text-xl text-gray-800 group-hover:text-indigo-600 transition-colors">Persona Blog</span>
          </Link>
          
          {/* 桌面导航菜单 */}
          <nav className="hidden md:flex space-x-8">
            <Link to="/" className="text-gray-800 font-medium hover:text-indigo-600 border-b-2 border-transparent hover:border-indigo-600 transition-all duration-200">首页</Link>
            <Link to="/" className="text-gray-600 font-medium hover:text-indigo-600 border-b-2 border-transparent hover:border-indigo-600 transition-all duration-200">文章</Link>
            <Link to="/" className="text-gray-600 font-medium hover:text-indigo-600 border-b-2 border-transparent hover:border-indigo-600 transition-all duration-200">分类</Link>
            <Link to="/about" className="text-gray-600 font-medium hover:text-indigo-600 border-b-2 border-transparent hover:border-indigo-600 transition-all duration-200">关于</Link>
            <Link to="/contact" className="text-gray-600 font-medium hover:text-indigo-600 border-b-2 border-transparent hover:border-indigo-600 transition-all duration-200">联系</Link>
          </nav>
          
          {/* 搜索按钮 */}
          <div className="hidden md:block">
            <button 
              onClick={toggleSearch}
              className="text-gray-600 hover:text-indigo-600 transition-colors p-2 rounded-full hover:bg-gray-100"
            >
              <i className="fa fa-search text-lg"></i>
            </button>
          </div>
          
          {/* 移动端菜单按钮 */}
          <button 
            id="menu-toggle" 
            className="md:hidden text-gray-800 hover:text-indigo-600 transition-colors p-2"
            onClick={toggleMenu}
          >
            <i className={`fa ${isMenuOpen ? 'fa-times' : 'fa-bars'} text-xl`}></i>
          </button>
        </div>
      </div>
      
      {/* 移动端导航菜单 */}
      <div 
        id="mobile-menu" 
        className={`md:hidden bg-white/95 backdrop-blur-md border-t border-gray-200/50 transition-all duration-300 ${
          isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
        }`}
      >
        <div className="container mx-auto px-4 py-3 space-y-1">
          <Link 
            to="/" 
            className="block text-gray-800 font-medium py-3 px-2 border-l-2 border-transparent hover:border-indigo-600 hover:bg-gray-50 rounded transition-all"
            onClick={toggleMenu}
          >
            首页
          </Link>
          <Link 
            to="/" 
            className="block text-gray-600 font-medium py-3 px-2 border-l-2 border-transparent hover:border-indigo-600 hover:bg-gray-50 rounded transition-all"
            onClick={toggleMenu}
          >
            文章
          </Link>
          <Link 
            to="/" 
            className="block text-gray-600 font-medium py-3 px-2 border-l-2 border-transparent hover:border-indigo-600 hover:bg-gray-50 rounded transition-all"
            onClick={toggleMenu}
          >
            分类
          </Link>
          <Link 
            to="/about" 
            className="block text-gray-600 font-medium py-3 px-2 border-l-2 border-transparent hover:border-indigo-600 hover:bg-gray-50 rounded transition-all"
            onClick={toggleMenu}
          >
            关于
          </Link>
          <Link 
            to="/contact" 
            className="block text-gray-600 font-medium py-3 px-2 border-l-2 border-transparent hover:border-indigo-600 hover:bg-gray-50 rounded transition-all"
            onClick={toggleMenu}
          >
            联系
          </Link>
        </div>
      </div>
      
      {/* 全局搜索框 */}
      <div className={`fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-opacity duration-300 ${isSearchOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <div className="container mx-auto px-4 pt-20">
          <div className="bg-white rounded-xl shadow-xl p-4 max-w-md mx-auto">
            <form onSubmit={handleSearch} className="relative">
              <input 
                type="text" 
                placeholder="搜索文章、标签或关键词..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full py-3 px-5 rounded-lg border border-gray-300 text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                autoFocus
              />
              <button 
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-indigo-600 transition-colors p-1"
              >
                <i className="fa fa-search text-lg"></i>
              </button>
              <button 
                type="button"
                onClick={toggleSearch}
                className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1"
              >
                <i className="fa fa-times text-lg"></i>
              </button>
            </form>
            <p className="text-gray-500 text-sm mt-2 px-1">热门搜索: 日记, 诗歌, 生活感悟, 创意写作</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;