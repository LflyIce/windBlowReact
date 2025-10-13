import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import BackToTop from './components/common/BackToTop';
import Home from './pages/Home';
import PostDetail from './pages/PostDetail';
import About from './pages/About';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound';
import { postsData } from './utils/data';

function App() {
  const [isScrolled, setIsScrolled] = useState(false);

  // 监听滚动事件，用于导航栏样式变化
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 获取单篇文章数据
  const getPostById = (id) => {
    return postsData.find(post => post.id === parseInt(id));
  };

  return (
    <div 
      className="min-h-screen flex flex-col bg-cover bg-fixed bg-center bg-no-repeat"
      style={{
        backgroundImage: "url('/imgs/background.jpg')",
      }}
    >
      {/* 背景遮罩层，使内容更易读 */}
      <div className="absolute inset-0 bg-black/70"></div>
      
      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar isScrolled={isScrolled} />
        
        <main className="flex-grow pt-24 pb-16">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/post/:id" element={<PostDetail getPostById={getPostById} />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        
        <Footer />
        <BackToTop />
      </div>
    </div>
  );
}

export default App;