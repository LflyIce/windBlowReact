import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import BackToTop from "./components/common/BackToTop";
import Home from "./pages/Home";
import PostDetail from "./pages/PostDetail";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Love from "./pages/Love";
import MusicPlayer from "./pages/Music";
import Travel from "./pages/Travel";
import NotFound from "./pages/NotFound";
import { postsData } from "./utils/data";
import { useScrollPosition } from "./hooks/useScrollPosition";

function App() {
  // 使用优化的滚动 Hook
  const { isScrolled } = useScrollPosition(50);

  // 获取单篇文章数据
  const getPostById = (id) => {
    return postsData.find((post) => post.id === parseInt(id));
  };

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        // 这里调整背景颜色的明暗
        // rgba(31, 41, 55, 0.8) 中的 31, 41, 55 是灰色的 RGB 值，0.8 是透明度
        // 调整方法：
        // 1. 更改 RGB 值来改变灰色的明暗：
        //    - 更亮的灰色示例：rgba(55, 65, 81, 0.8)
        //    - 更暗的灰色示例：rgba(17, 24, 39, 0.8)
        // 2. 更改透明度值来改变遮罩的浓淡：
        //    - 更透明（更亮）：rgba(31, 41, 55, 0.5)
        //    - 更不透明（更暗）：rgba(31, 41, 55, 0.95)
        // 性能优化: 移除 backgroundAttachment: 'fixed' 以提升滚动性能
        background: "linear-gradient(rgba(31, 41, 55, 0.8), rgba(31, 41, 55, 0.9)), url('/imgs/background.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        // 使用 will-change 提示浏览器优化
        willChange: "scroll-position",
      }}
    >
      <div className="flex flex-col min-h-screen">
        <Navbar isScrolled={isScrolled} />
        <main className="flex-grow pt-24 pb-16">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/love" element={<Love />} />
            <Route path="/music" element={<MusicPlayer />} />
                <Route path="/travel" element={<Travel />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/post/:id" element={<PostDetail getPostById={getPostById} />} />
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