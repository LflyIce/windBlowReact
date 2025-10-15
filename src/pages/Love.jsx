import React, { useState, useEffect, useRef } from "react";
import { Heart, Music, Volume2, Share2, Info, X } from "react-feather";

const Love = () => {
  // 状态管理
  const [scrollY, setScrollY] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hearts, setHearts] = useState([]);

  const audioRef = useRef(null);

  const heartContainerRef = useRef(null);

  // 监听滚动事件，实现视差效果
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 创建随机漂浮的心形元素
  const createHeart = (x, y) => {
    const size = Math.random() * 20 + 10;
    const colors = ["#ff4d6d", "#ff758f", "#ff8fa3", "#ffb3c1", "#fcd5ce"];
    const color = colors[Math.floor(Math.random() * colors.length)];

    const heart = {
      id: Date.now() + Math.random(),
      x,
      y,
      size,
      color,
      opacity: 1,
      top: 0,
      rotate: Math.random() * 60 - 30,
      left: Math.random() * 40 - 20,
    };

    setHearts((prev) => [...prev, heart]);

    // 心形动画帧更新
    const animate = () => {
      setHearts((prev) =>
        prev.map((h) =>
          h.id === heart.id
            ? { ...h, top: h.top - 2, opacity: h.opacity - 0.01 }
            : h
        )
      );
    };

    const interval = setInterval(animate, 30);

    // 移除消失的心形
    setTimeout(() => {
      clearInterval(interval);
      setHearts((prev) => prev.filter((h) => h.id !== heart.id));
    }, 2000);
  };

  // 处理页面点击事件，生成心形效果
  const handleClick = (e) => {
    if (heartContainerRef.current) {
      const rect = heartContainerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // 一次点击生成多个心形
      for (let i = 0; i < 5; i++) {
        setTimeout(() => {
          createHeart(x, y);
        }, i * 100);
      }
    }
  };

  // 分享功能实现
  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: "爱的告白",
          text: "这是给你的特别惊喜",
          url: window.location.href,
        })
        .catch((err) => console.log("分享失败:", err));
    } else {
      // 复制链接到剪贴板
      navigator.clipboard
        .writeText(window.location.href)
        .then(() => alert("链接已复制到剪贴板"))
        .catch((err) => console.log("复制失败:", err));
    }
  };

  return (
    <div
      className="min-h-screen bg-gradient-to-b from-pink-900 via-pink-800 to-purple-900 text-white relative overflow-hidden"
      ref={heartContainerRef}
      onClick={handleClick}
    >
      {/* 背景装饰点 */}
      <div className="fixed inset-0 opacity-20">
        {Array.from({ length: 30 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white animate-float"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              width: `${Math.random() * 3 + 1}px`,
              height: `${Math.random() * 3 + 1}px`,
              animationDuration: `${Math.random() * 10 + 10}s`,
              animationDelay: `${Math.random() * 10}s`,
            }}
          />
        ))}
      </div>

      {/* 动态生成的心形元素 */}
      {hearts.map((heart) => (
        <div
          key={heart.id}
          className="absolute transition-all"
          style={{
            left: `${heart.x + heart.left}px`,
            top: `${heart.y - heart.top}px`,
            width: `${heart.size}px`,
            height: `${heart.size}px`,
            backgroundColor: heart.color,
            opacity: heart.opacity,
            transform: `rotate(${heart.rotate}deg)`,
            clipPath:
              'path("M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z")',
          }}
        />
      ))}

      {/* 标题区域 */}
      <header className="pt-32 pb-20 px-6 text-center relative">
        <h1
          className="text-5xl md:text-7xl lg:text-9xl font-bold mb-6 tracking-tighter"
          style={{
            transform: `translateY(${scrollY * 0.2}px)`,
            opacity: Math.max(0, 1 - scrollY / 600),
          }}
        >
          我爱你
        </h1>
        <p
          className="text-xl md:text-2xl opacity-80 max-w-2xl mx-auto"
          style={{
            transform: `translateY(${scrollY * 0.1}px)`,
            opacity: Math.max(0, 1 - scrollY / 800),
          }}
        >
          从遇见你的那一刻起，我的世界便有了不一样的色彩
        </p>
      </header>

      {/* 主要内容区域 */}
      <main className="max-w-4xl mx-auto px-6 pb-24 relative">
        <div
          className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 md:p-12 shadow-2xl border border-white/20 transform transition-all hover:shadow-pink-500/20"
          style={{
            transform: `translateY(${(scrollY - 300) * 0.1}px)`,
            opacity: Math.max(0, 1 - (scrollY - 200) / 500),
          }}
        >
          <div className="space-y-6 text-lg leading-relaxed">
            <p>
              遇见你是我生命中最美的意外，你的出现像一道光，照亮了我所有的日子。
            </p>
            <p>
              每一次与你相处的时光，都成为我心中最珍贵的记忆。你的笑容，是我见过最美的风景。
            </p>
            <p>
              我想和你一起看遍世间风景，一起经历生活中的点点滴滴，一起慢慢变老。
            </p>
            <p className="text-right text-xl font-semibold mt-10">
              —— 永远爱你的人
            </p>
          </div>
        </div>

        {/* 照片展示区 */}
        <div
          className="mt-24 grid grid-cols-2 md:grid-cols-3 gap-4"
          style={{
            transform: `translateY(${(scrollY - 600) * 0.1}px)`,
            opacity: Math.max(0, 1 - (scrollY - 500) / 500),
          }}
        >
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="rounded-lg overflow-hidden shadow-lg transform transition-transform duration-300 hover:scale-105 hover:shadow-pink-500/30"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <img
                src={`https://picsum.photos/seed/love${i}/400/300`}
                alt={`与爱人的美好回忆 ${i}`}
                className="w-full h-48 object-cover transition-transform duration-700 hover:scale-110"
              />
            </div>
          ))}
        </div>
      </main>

      {/* 全局样式 */}
      <style jsx global>{`
        @keyframes float {
          0% {
            transform: translateY(0) translateX(0);
          }
          25% {
            transform: translateY(-10px) translateX(10px);
          }
          50% {
            transform: translateY(-20px) translateX(0);
          }
          75% {
            transform: translateY(-10px) translateX(-10px);
          }
          100% {
            transform: translateY(0) translateX(0);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .animate-float {
          animation: float infinite linear;
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default Love;
