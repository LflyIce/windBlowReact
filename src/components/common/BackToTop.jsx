import { useState, useEffect } from 'react';
import { useScrollPosition } from '../../hooks/useScrollPosition';

const BackToTop = () => {
  // 使用优化的滚动 Hook
  const { scrollY } = useScrollPosition(300);
  const isVisible = scrollY > 300;

  // 平滑滚动到顶部
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <button 
      id="back-to-top" 
      className={`fixed bottom-6 right-6 bg-primary text-white w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 hover:bg-primary/90 ${
        isVisible ? 'opacity-100 visible' : 'opacity-0 invisible'
      }`}
      onClick={scrollToTop}
      aria-label="回到顶部"
    >
      <i className="fa fa-arrow-up"></i>
    </button>
  );
};

export default BackToTop;
