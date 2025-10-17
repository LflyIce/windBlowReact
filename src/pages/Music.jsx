import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Heart, Share2, Music, X, List, ChevronLeft, ChevronRight } from 'react-feather';

// 粒子背景组件
const ParticleBackground = ({ isPlaying }) => {
  const canvasRef = useRef(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let particles = [];
    let animationFrameId;
    
    // 设置canvas尺寸
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // 创建粒子
    const createParticles = () => {
      particles = [];
      const count = isPlaying ? 150 : 80;
      
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius: Math.random() * 4 + 1,
          color: isPlaying 
            ? `rgba(${255 * Math.random()}, ${150 + Math.random() * 50}, ${255 * Math.random()}, 0.7)`
            : `rgba(100, 100, 150, 0.2)`,
          speedX: (Math.random() - 0.5) * (isPlaying ? 3 : 0.8),
          speedY: (Math.random() - 0.5) * (isPlaying ? 3 : 0.8),
        });
      }
    };
    
    // 绘制粒子
    const drawParticles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach((particle, index) => {
        // 更新位置
        particle.x += particle.speedX;
        particle.y += particle.speedY;
        
        // 边界检查
        if (particle.x < 0 || particle.x > canvas.width) particle.speedX *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.speedY *= -1;
        
        // 绘制粒子
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.fill();
        
        // 连接附近的粒子
        if (isPlaying) {
          for (let j = index + 1; j < particles.length; j++) {
            const other = particles[j];
            const dx = particle.x - other.x;
            const dy = particle.y - other.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 120) {
              ctx.beginPath();
              ctx.strokeStyle = `rgba(255, 180, 255, ${0.8 - distance/150})`;
              ctx.lineWidth = 0.7;
              ctx.moveTo(particle.x, particle.y);
              ctx.lineTo(other.x, other.y);
              ctx.stroke();
            }
          }
        }
      });
      
      animationFrameId = requestAnimationFrame(drawParticles);
    };
    
    createParticles();
    drawParticles();
    
    // 当播放状态变化时更新粒子
    const handlePlayingChange = () => {
      createParticles();
    };
    
    handlePlayingChange();
    
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isPlaying]);
  
  return (
    <canvas 
      ref={canvasRef} 
      className="fixed top-0 left-0 w-full h-full pointer-events-none z-0"
    />
  );
};

const MusicPlayer = () => {
  // 状态管理
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSong, setCurrentSong] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [currentLyricIndex, setCurrentLyricIndex] = useState(-1);
  const [showVisualizer, setShowVisualizer] = useState(true);
  const [activePanel, setActivePanel] = useState('none'); // 'lyrics', 'playlist', 'none'
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // 引用
  const audioRef = useRef(null);
  const progressRef = useRef(null);
  const lyricsContainerRef = useRef(null);
  const canvasRef = useRef(null);
  const animationFrameRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const sourceRef = useRef(null);
  const playerRef = useRef(null);
  const panelRef = useRef(null);

  // 音乐列表数据
  const songs = [
    {
      id: 1,
      title: "打火机",
      artist: "Penny",
      album: "打火机",
      duration: "2:33",
      cover: "https://picsum.photos/seed/album1/600/600",
      url: "/audio/yequ.mp3",
      color: ["#ff4ecd", "#a855f7"] // 专辑主题色 - 粉色到紫色渐变
    },
    {
      id: 2,
      title: "爱错",
      artist: "王力宏",
      album: "恋爱占星音乐全精选",
      duration: "3:58",
      cover: "https://picsum.photos/seed/album2/600/600",
      url: "/audio/aicuo.mp3",
      color: ["#38bdf8", "#0ea5e9"] // 专辑主题色 - 亮蓝到深蓝渐变
    },
    {
      id: 3,
      title: "星空",
      artist: "五月天",
      album: "第二人生",
      duration: "4:45",
      cover: "https://picsum.photos/seed/album3/600/600",
      url: "/audio/xingkong.mp3",
      color: ["#f97316", "#ea580c"] // 专辑主题色 - 亮橙到深橙渐变
    },
    {
      id: 4,
      title: "小幸运",
      artist: "田馥甄",
      album: "我的少女时代 电影原声带",
      duration: "3:35",
      cover: "https://picsum.photos/seed/album4/600/600",
      url: "/audio/xiaoxingyun.mp3",
      color: ["#818cf8", "#6366f1"] // 专辑主题色 - 浅紫到靛蓝渐变
    }
  ];

  // 歌词数据
  const lyrics = {
    1: [
      { time: 0, text: "打火机 - Penny" },
      { time: 10, text: "风 吹过 你的侧脸" },
      { time: 15, text: "带着一点 无奈的疲倦" },
      { time: 20, text: "我 沉默 站在你身边" },
      { time: 25, text: "看着远方 灰色的天" },
      { time: 30, text: "我们都太倔强" },
      { time: 35, text: "谁都不愿意先放" },
      { time: 40, text: "用沉默 代替了体谅" },
      { time: 45, text: "爱 像风中的打火机" },
      { time: 50, text: "火苗颤抖 快要熄灭" },
      { time: 55, text: "心 还在 原地盘旋" },
      { time: 60, text: "等一个 不可能的 明天" },
      { time: 65, text: "我们都太好强" },
      { time: 70, text: "谁都不肯先说原谅" },
      { time: 75, text: "用冷战 消耗了过往" },
      { time: 80, text: "爱 像风中的打火机" },
      { time: 85, text: "火苗颤抖 快要熄灭" },
      { time: 90, text: "心 还在 原地盘旋" },
      { time: 95, text: "等一个 不可能的 明天" },
      { time: 100, text: "爱 像风中的打火机" },
      { time: 105, text: "最后一点 微弱的光" },
      { time: 110, text: "梦 早已 灰飞烟灭" },
      { time: 115, text: "只剩下 回忆在 蔓延" },
      { time: 120, text: "只剩下 回忆在 蔓延" },
    ],
    2: [
      { time: 0, text: "爱错 - 王力宏" },
      { time: 15, text: "北风毫不留情 把叶子吹落" },
      { time: 20, text: "脆弱的她选择了逃脱" },
      { time: 25, text: "叶子失去消息 风才感觉寂寞" },
      { time: 30, text: "整个冬天 北风的痛 没人能说" },
      { time: 35, text: "我从来没想过 我会这样做" },
      { time: 40, text: "从来没想过 如此的难过" },
      { time: 45, text: "反复回想 过去的我 现在的你 失去了什么" },
      { time: 50, text: "我安静的提醒自己 不要哭泣" },
      { time: 55, text: "我从来没想过 我会这样做" },
      { time: 60, text: "从来没想过 如此的难过" },
      { time: 65, text: "反复回想 过去的我 现在的你 失去了什么" },
      { time: 70, text: "我安静的提醒自己 不要哭泣" },
      { time: 75, text: "冰冷的空气 穿透我的身体" },
      { time: 80, text: "冰冻我的心" },
      { time: 85, text: "曾经的约定 浮现出回忆" },
      { time: 90, text: "差点 温暖了我的心" },
      { time: 95, text: "请原谅我 爱错" },
    ]
  };

  // 格式化时间
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // 处理音频进度更新
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
      setProgress((audio.currentTime / audio.duration) * 100 || 0);
    };

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
    };

    const handleEnded = () => {
      playNext();
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);

  // 切换播放/暂停
  const togglePlay = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio) return;
    
    try {
      if (isPlaying) {
        await audio.pause();
        setIsPlaying(false);
      } else {
        // 确保音频上下文已准备好
        if (!audioContextRef.current) {
          setupVisualizer();
        } else if (audioContextRef.current.state === 'suspended') {
          await audioContextRef.current.resume();
        }
        
        await audio.play();
        setIsPlaying(true);
      }
    } catch (err) {
      console.log("播放控制错误:", err);
      setIsPlaying(false);
    }
  }, [isPlaying]);

  // 播放指定歌曲
  const playSong = useCallback(async (index) => {
    // 清理之前的音频连接
    cleanupAudio();
    
    setCurrentSong(index);
    setCurrentLyricIndex(-1);
    setProgress(0);
    
    const audio = audioRef.current;
    if (!audio) return;
    
    try {
      // 加载并播放新歌曲
      audio.src = songs[index].url;
      await audio.load();
      await audio.play();
      setIsPlaying(true);
      
      // 初始化可视化
      setupVisualizer();
    } catch (error) {
      console.log("播放歌曲失败:", error);
      setIsPlaying(false);
    }
  }, [songs]);

  // 上一首/下一首
  const playPrevious = () => {
    const newIndex = currentSong === 0 ? songs.length - 1 : currentSong - 1;
    playSong(newIndex);
  };

  const playNext = () => {
    const newIndex = currentSong === songs.length - 1 ? 0 : currentSong + 1;
    playSong(newIndex);
  };

  // 更新进度条
  const updateProgress = (e) => {
    const audio = audioRef.current;
    const progressBar = progressRef.current;
    
    if (!audio || !progressBar) return;
    
    const clickPosition = e.nativeEvent.offsetX;
    const progressBarWidth = progressBar.offsetWidth;
    const newProgress = (clickPosition / progressBarWidth) * 100;
    const newTime = (newProgress / 100) * (audio.duration || duration);
    
    setProgress(newProgress);
    audio.currentTime = newTime;
  };

  // 音量控制
  const updateVolume = (e) => {
    const newVolume = e.target.value / 100;
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
    
    const audio = audioRef.current;
    if (audio) {
      audio.volume = newVolume;
    }
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;
    
    setIsMuted(!isMuted);
    audio.volume = isMuted ? volume : 0;
  };

  // 歌词滚动逻辑
  const handleLyricsScroll = useCallback(() => {
    const currentLyrics = lyrics[songs[currentSong].id] || [];
    if (currentLyrics.length === 0) return;
    
    // 找到当前时间对应的歌词索引
    let newIndex = currentLyricIndex;
    for (let i = 0; i < currentLyrics.length; i++) {
      if (currentTime >= currentLyrics[i].time && 
          (i === currentLyrics.length - 1 || currentTime < currentLyrics[i + 1].time)) {
        newIndex = i;
        break;
      }
    }
    
    if (newIndex !== currentLyricIndex) {
      setCurrentLyricIndex(newIndex);
      
      // 平滑滚动到当前歌词
      const lyricsContainer = lyricsContainerRef.current;
      const activeLyric = document.querySelector('.lyric-item.active');
      
      if (lyricsContainer && activeLyric) {
        const containerRect = lyricsContainer.getBoundingClientRect();
        const lyricRect = activeLyric.getBoundingClientRect();
        const offset = lyricRect.top - containerRect.top - containerRect.height / 2 + lyricRect.height / 2;
        
        // 平滑滚动动画
        const scrollToPosition = lyricsContainer.scrollTop + offset;
        const startPosition = lyricsContainer.scrollTop;
        const distance = scrollToPosition - startPosition;
        const duration = 300;
        let startTime = null;
        
        const scrollAnimation = (timestamp) => {
          if (!startTime) startTime = timestamp;
          const progress = Math.min((timestamp - startTime) / duration, 1);
          // 使用easeOutQuad缓动函数
          const easeProgress = 1 - (1 - progress) * (1 - progress);
          lyricsContainer.scrollTop = startPosition + distance * easeProgress;
          
          if (progress < 1) {
            requestAnimationFrame(scrollAnimation);
          }
        };
        
        requestAnimationFrame(scrollAnimation);
      }
    }
  }, [currentTime, currentLyricIndex, currentSong, songs]);

  // 清理音频上下文
  const cleanupAudio = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    
    if (sourceRef.current) {
      try {
        sourceRef.current.disconnect();
      } catch (e) {
        console.log("断开 source 连接:", e);
      }
      sourceRef.current = null;
    }
    
    if (analyserRef.current) {
      analyserRef.current = null;
    }
    
    if (audioContextRef.current) {
      try {
        if (audioContextRef.current.state !== 'closed') {
          audioContextRef.current.suspend();
        }
      } catch (e) {
        console.log("暂停 audioContext:", e);
      }
    }
  }, []);

  // 高级音频可视化
  const setupVisualizer = useCallback(() => {
    const audio = audioRef.current;
    const canvas = canvasRef.current;
    if (!audio || !canvas) return;
    
    // 恢复或创建音频上下文
    if (audioContextRef.current) {
      if (audioContextRef.current.state === 'suspended') {
        audioContextRef.current.resume();
      }
    } else {
      try {
        audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      } catch (error) {
        console.error("创建 AudioContext 失败:", error);
        setShowVisualizer(false);
        return;
      }
    }
    
    // 创建分析器
    if (!analyserRef.current) {
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 512; // 增加FFT大小以获得更详细的频谱
    }
    
    // 创建源节点并连接
    if (!sourceRef.current) {
      sourceRef.current = audioContextRef.current.createMediaElementSource(audio);
      sourceRef.current.connect(analyserRef.current);
      analyserRef.current.connect(audioContextRef.current.destination);
    }
    
    const bufferLength = analyserRef.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    const barWidth = canvas.width / bufferLength * 2.5;
    
    // 可视化渲染
    const renderFrame = () => {
      if (!showVisualizer || !isPlaying || !audioContextRef.current) {
        animationFrameRef.current = requestAnimationFrame(renderFrame);
        return;
      }
      
      animationFrameRef.current = requestAnimationFrame(renderFrame);
      analyserRef.current.getByteFrequencyData(dataArray);
      
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // 获取当前歌曲的主题色
      const [color1, color2] = songs[currentSong].color;
      
      // 绘制频谱柱状图
      let x = 0;
      for (let i = 0; i < bufferLength; i++) {
        const barHeight = (dataArray[i] / 255) * canvas.height;
        
        // 创建随频率变化的渐变
        const gradient = ctx.createLinearGradient(0, canvas.height, 0, canvas.height - barHeight);
        gradient.addColorStop(0, color1);
        gradient.addColorStop(1, color2);
        
        // 添加发光效果
        ctx.shadowColor = color1;
        ctx.shadowBlur = 15;
        
        // 绘制圆角矩形
        const radius = 4;
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.moveTo(x + radius, canvas.height);
        ctx.lineTo(x + radius, canvas.height - barHeight);
        ctx.arcTo(x, canvas.height - barHeight, x, canvas.height - barHeight - radius, radius);
        ctx.lineTo(x, canvas.height - barHeight);
        ctx.lineTo(x + barWidth, canvas.height - barHeight);
        ctx.arcTo(x + barWidth, canvas.height - barHeight, x + barWidth + radius, canvas.height - barHeight, radius);
        ctx.lineTo(x + barWidth, canvas.height);
        ctx.arcTo(x + barWidth, canvas.height, x + barWidth - radius, canvas.height, radius);
        ctx.lineTo(x, canvas.height);
        ctx.arcTo(x, canvas.height, x, canvas.height - radius, radius);
        ctx.closePath();
        ctx.fill();
        
        x += barWidth + 1;
      }
      
      // 绘制波形线
      if (isPlaying) {
        analyserRef.current.getByteTimeDomainData(dataArray);
        
        ctx.lineWidth = 2;
        ctx.strokeStyle = color2;
        ctx.beginPath();
        
        const sliceWidth = canvas.width / bufferLength;
        let x = 0;
        
        for (let i = 0; i < bufferLength; i++) {
          const v = dataArray[i] / 128.0;
          const y = v * canvas.height / 4; // 缩小波形高度
          
          if (i === 0) {
            ctx.moveTo(x, y + canvas.height * 0.75); // 将波形放在底部
          } else {
            ctx.lineTo(x, y + canvas.height * 0.75);
          }
          
          x += sliceWidth;
        }
        
        ctx.lineTo(canvas.width, canvas.height * 0.75);
        ctx.stroke();
      }
    };
    
    renderFrame();
  }, [isPlaying, showVisualizer, currentSong, songs]);

  // 歌词更新
  useEffect(() => {
    handleLyricsScroll();
  }, [currentTime, handleLyricsScroll]);

  // 调整canvas大小
  useEffect(() => {
    const resizeCanvas = () => {
      const canvas = canvasRef.current;
      if (canvas) {
        const container = canvas.parentElement;
        if (container) {
          canvas.width = container.clientWidth;
          canvas.height = 180;
        }
      }
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  // 组件卸载时清理
  useEffect(() => {
    return () => {
      cleanupAudio();
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, [cleanupAudio]);

  // 切换面板显示
  const togglePanel = (panel) => {
    if (activePanel === panel) {
      setActivePanel('none');
    } else {
      setActivePanel(panel);
    }
    setIsMobileMenuOpen(false);
  };

  // 获取当前歌曲的主题色
  const [primaryColor, secondaryColor] = songs[currentSong].color;
  
  return (
    <div 
      ref={playerRef}
      className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] text-white relative"
    >
      {/* 动态粒子背景 */}
      <ParticleBackground isPlaying={isPlaying} />
      
      {/* 顶部导航栏 - 确保不会被遮挡 */}
      <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-lg bg-black/30 px-6 py-4 flex justify-between items-center border-b border-white/10">
        <div className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-purple-600 flex items-center gap-2">
          <Music size={24} />
          <span>音乐空间</span>
        </div>
        <div className="flex items-center gap-4">
          {/* 桌面端面板切换按钮 */}
          <div className="hidden md:flex items-center gap-2">
            <button 
              onClick={() => togglePanel('lyrics')}
              className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                activePanel === 'lyrics' 
                  ? `bg-gradient-to-r from-${primaryColor} to-${secondaryColor} text-white`
                  : 'bg-white/10 hover:bg-white/20'
              }`}
            >
              歌词
            </button>
            <button 
              onClick={() => togglePanel('playlist')}
              className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                activePanel === 'playlist' 
                  ? `bg-gradient-to-r from-${primaryColor} to-${secondaryColor} text-white`
                  : 'bg-white/10 hover:bg-white/20'
              }`}
            >
              播放列表
            </button>
          </div>
          
          {/* 移动端菜单按钮 */}
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-full hover:bg-white/10 transition-all md:hidden"
            aria-label="菜单"
          >
            {isMobileMenuOpen ? <X size={20} /> : <List size={20} />}
          </button>
        </div>
        
        {/* 移动端菜单 */}
        {isMobileMenuOpen && (
          <div className="absolute top-full right-0 mt-2 w-48 rounded-lg shadow-xl backdrop-blur-lg bg-black/60 border border-white/10 py-2 md:hidden z-50 animate-fadeIn">
            <button 
              onClick={() => togglePanel('lyrics')}
              className="w-full text-left px-4 py-2 hover:bg-white/10 transition-colors flex items-center gap-2"
            >
              <Music size={18} /> 歌词
            </button>
            <button 
              onClick={() => togglePanel('playlist')}
              className="w-full text-left px-4 py-2 hover:bg-white/10 transition-colors flex items-center gap-2"
            >
              <List size={18} /> 播放列表
            </button>
          </div>
        )}
      </header>

      {/* 主内容区 - 从导航栏下方开始，避免遮挡 */}
      <main className="container mx-auto px-4 pt-24 pb-20 relative z-10">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* 中央主播放区 */}
          <div className="lg:w-3/5 mx-auto lg:mx-0">
            <div 
              className="rounded-2xl p-6 md:p-8 border border-white/10 shadow-xl transform transition-all duration-500 hover:shadow-purple-500/20 backdrop-blur-xl bg-white/5"
              style={{ 
                boxShadow: `0 0 30px rgba(0, 0, 0, 0.3)`
              }}
            >
              {/* 3D旋转专辑封面 */}
              <div className="relative mb-8 flex justify-center perspective-1000">
                <div 
                  className={`w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden border-4 shadow-2xl relative transform-style-3d transition-transform duration-10000 ${
                    isPlaying ? 'rotate-y-360' : ''
                  }`}
                  style={{
                    borderColor: primaryColor,
                    boxShadow: `0 0 40px ${primaryColor}60`
                  }}
                >
                  <img 
                    src={songs[currentSong].cover} 
                    alt={songs[currentSong].title}
                    className="w-full h-full object-cover rounded-full"
                  />
                  {/* 中心装饰 */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div 
                      className="w-16 h-16 rounded-full backdrop-blur-md border border-opacity-20"
                      style={{
                        background: `radial-gradient(circle, transparent 50%, ${primaryColor}20 100%)`,
                        borderColor: primaryColor
                      }}
                    ></div>
                  </div>
                  {/* 光晕效果 */}
                  <div 
                    className="absolute -inset-4 rounded-full blur-xl opacity-30"
                    style={{ background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})` }}
                  ></div>
                </div>
              </div>

              {/* 歌曲信息 */}
              <div className="text-center mb-8 transform transition-all duration-300 hover:scale-105">
                <h2 className="text-2xl md:text-3xl font-bold mb-2 tracking-tight">{songs[currentSong].title}</h2>
                <p className="text-white/80 mb-1">{songs[currentSong].artist}</p>
                <p className="text-white/60 text-sm">{songs[currentSong].album}</p>
              </div>

              {/* 增强版音频可视化 */}
              {showVisualizer && (
                <div 
                  className="mb-8 rounded-xl overflow-hidden p-2 transform transition-all duration-300 hover:shadow-lg"
                  style={{ 
                    background: `rgba(255, 255, 255, 0.03)`,
                    boxShadow: `0 0 20px ${primaryColor}10`
                  }}
                >
                  <canvas ref={canvasRef} className="w-full h-36 rounded-lg"></canvas>
                </div>
              )}

              {/* 进度条 */}
              <div className="mb-8">
                <div className="flex justify-between text-sm text-white/70 mb-2">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
                <div 
                  className="h-2 rounded-full cursor-pointer group relative overflow-hidden"
                  style={{ background: `rgba(255, 255, 255, 0.1)` }}
                  onClick={updateProgress}
                  ref={progressRef}
                >
                  <div 
                    className="h-full relative transition-all duration-200"
                    style={{ 
                      width: `${progress}%`,
                      background: `linear-gradient(90deg, ${primaryColor}, ${secondaryColor})`
                    }}
                  >
                    <div 
                      className="absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-all duration-300 scale-90 group-hover:scale-110"
                      style={{ 
                        background: 'white',
                        boxShadow: `0 0 10px ${primaryColor}`
                      }}
                    ></div>
                    {/* 进度条发光效果 */}
                    <div 
                      className="absolute top-0 left-0 right-0 bottom-0 blur-md opacity-70"
                      style={{ 
                        background: `linear-gradient(90deg, ${primaryColor}, ${secondaryColor})`
                      }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* 主播放控制按钮 */}
              <div className="flex justify-center items-center space-x-8 mb-6">
                <button 
                  onClick={playPrevious}
                  className="p-4 rounded-full transition-all transform hover:scale-110 hover:shadow-lg hover:bg-white/10"
                  style={{ 
                    background: `rgba(255, 255, 255, 0.05)`,
                    boxShadow: `0 0 15px ${primaryColor}10`
                  }}
                  aria-label="上一首"
                >
                  <SkipBack className="h-6 w-6" />
                </button>
                
                <button 
                  onClick={togglePlay}
                  className="p-6 rounded-full transition-all transform hover:scale-105 hover:shadow-xl hover:shadow-pink-500/30"
                  style={{ 
                    background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
                    boxShadow: `0 0 25px ${primaryColor}50`
                  }}
                  aria-label={isPlaying ? "暂停" : "播放"}
                >
                  {isPlaying ? <Pause className="h-8 w-8 text-white" /> : <Play className="h-8 w-8 text-white ml-1" />}
                </button>
                
                <button 
                  onClick={playNext}
                  className="p-4 rounded-full transition-all transform hover:scale-110 hover:shadow-lg hover:bg-white/10"
                  style={{ 
                    background: `rgba(255, 255, 255, 0.05)`,
                    boxShadow: `0 0 15px ${primaryColor}10`
                  }}
                  aria-label="下一首"
                >
                  <SkipForward className="h-6 w-6" />
                </button>
              </div>

              {/* 音量控制 */}
              <div className="flex items-center space-x-3 p-3 rounded-xl bg-white/5">
                <button 
                  onClick={toggleMute} 
                  className="p-2 rounded-full transition-all hover:bg-white/10"
                >
                  {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                </button>
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  value={isMuted ? 0 : volume * 100}
                  onChange={updateVolume}
                  className="w-full h-2 rounded-lg appearance-none cursor-pointer"
                  style={{
                    background: `rgba(255, 255, 255, 0.1)`,
                  }}
                />
              </div>
            </div>
          </div>

          {/* 侧边面板 - 歌词或播放列表 */}
          <div 
            ref={panelRef}
            className={`lg:w-2/5 rounded-2xl border border-white/10 shadow-xl backdrop-blur-xl bg-white/5 overflow-hidden transition-all duration-500 ease-in-out z-20 ${
              activePanel === 'none' 
                ? 'hidden lg:hidden' 
                : activePanel === 'lyrics'
                  ? 'block' 
                  : 'block'
            }`}
            style={{
              boxShadow: `0 0 30px rgba(0, 0, 0, 0.3)`,
              maxHeight: 'calc(100vh - 120px)',
            }}
          >
            {/* 面板头部 */}
            <div className="p-4 border-b border-white/10 flex justify-between items-center">
              <h2 className="text-xl font-bold">
                <span 
                  className="bg-clip-text text-transparent bg-gradient-to-r"
                  style={{ backgroundImage: `linear-gradient(to right, ${primaryColor}, ${secondaryColor})` }}
                >
                  {activePanel === 'lyrics' ? '歌词' : '播放列表'}
                </span>
              </h2>
              <button 
                onClick={() => setActivePanel('none')}
                className="p-2 rounded-full hover:bg-white/10 transition-all"
                aria-label="关闭"
              >
                <X size={18} />
              </button>
            </div>
            
            {/* 面板内容 */}
            <div className="p-4">
              {activePanel === 'lyrics' ? (
                <div 
                  ref={lyricsContainerRef}
                  className="h-[calc(100vh-220px)] overflow-y-auto pr-2 scrollbar-thin"
                  style={{
                    scrollbarColor: `${primaryColor} transparent`,
                  }}
                >
                  <div className="flex flex-col items-center justify-center space-y-6 text-center px-4">
                    {(lyrics[songs[currentSong].id] || []).map((lyric, index) => (
                      <div 
                        key={index}
                        className={`lyric-item transition-all duration-500 py-2 px-4 rounded-lg ${
                          index === currentLyricIndex 
                            ? 'scale-110 font-medium opacity-100 active' 
                            : 'opacity-70 hover:opacity-90'
                        }`}
                        style={{
                          textShadow: index === currentLyricIndex ? `0 0 20px ${primaryColor}80` : 'none',
                          color: index === currentLyricIndex ? primaryColor : 'inherit'
                        }}
                      >
                        {lyric.text}
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-4 max-h-[calc(100vh-220px)] overflow-y-auto pr-2 scrollbar-thin"
                  style={{
                    scrollbarColor: `${primaryColor} transparent`,
                  }}>
                  {songs.map((song, index) => (
                    <div 
                      key={song.id}
                      className={`flex items-center p-3 rounded-xl cursor-pointer transition-all duration-300 transform hover:scale-[1.02] ${
                        index === currentSong 
                          ? '' 
                          : 'hover:bg-white/10'
                      }`}
                      style={{
                        background: index === currentSong 
                          ? `linear-gradient(90deg, ${song.color[0]}20, ${song.color[1]}20)` 
                          : 'rgba(255, 255, 255, 0.03)',
                        border: index === currentSong 
                          ? `1px solid ${song.color[0]}50` 
                          : 'none',
                        boxShadow: index === currentSong 
                          ? `0 4px 20px ${song.color[0]}30` 
                          : 'none'
                      }}
                      onClick={() => playSong(index)}
                    >
                      {/* 专辑封面 */}
                      <div className="relative w-16 h-16 flex-shrink-0">
                        <img 
                          src={song.cover} 
                          alt={song.title}
                          className="w-full h-full object-cover rounded-lg shadow-md transition-transform duration-500 hover:scale-110"
                        />
                        {/* 播放状态指示器 */}
                        {index === currentSong && isPlaying && (
                          <div className="absolute inset-0 bg-black/30 rounded-lg flex items-center justify-center">
                            <div className="w-2 h-2 bg-white rounded-full animate-ping mr-2"></div>
                            <div className="w-2 h-2 bg-white rounded-full animate-ping ml-2" style={{ animationDelay: '0.2s' }}></div>
                          </div>
                        )}
                      </div>
                      
                      {/* 歌曲信息 */}
                      <div className="ml-4 flex-1 min-w-0">
                        <h3 className="font-bold truncate">{song.title}</h3>
                        <p className="text-white/70 text-sm truncate">{song.artist}</p>
                      </div>
                      
                      {/* 时长和操作按钮 */}
                      <div className="text-white/70 text-sm mr-4">{song.duration}</div>
                      
                      <div className="flex space-x-1">
                        <button className="p-2 rounded-full hover:bg-white/10 transition-colors">
                          <Heart className="h-4 w-4" />
                        </button>
                        <button className="p-2 rounded-full hover:bg-white/10 transition-colors">
                          <Share2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* 底部控制栏 - 小屏幕时显示 */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 backdrop-blur-md z-40 p-4 border-t border-white/10 bg-black/30">
        <div className="flex justify-center items-center space-x-6">
          <button onClick={playPrevious} aria-label="上一首" className="p-2 hover:bg-white/10 rounded-full transition-all">
            <SkipBack className="h-6 w-6" />
          </button>
          <button 
            onClick={togglePlay}
            className="p-3 rounded-full"
            style={{ 
              background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
              color: 'white',
              boxShadow: `0 0 15px ${primaryColor}50`
            }}
            aria-label={isPlaying ? "暂停" : "播放"}
          >
            {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 ml-0.5" />}
          </button>
          <button onClick={playNext} aria-label="下一首" className="p-2 hover:bg-white/10 rounded-full transition-all">
            <SkipForward className="h-6 w-6" />
          </button>
          <button 
            onClick={() => togglePanel('lyrics')}
            className="p-2 hover:bg-white/10 rounded-full transition-all ml-auto"
            aria-label="歌词"
          >
            <Music className="h-5 w-5" />
          </button>
          <button 
            onClick={() => togglePanel('playlist')}
            className="p-2 hover:bg-white/10 rounded-full transition-all"
            aria-label="播放列表"
          >
            <List className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* 隐藏的audio元素 */}
      <audio 
        ref={audioRef} 
        src={songs[currentSong].url}
        preload="metadata"
      />

      {/* 全局样式 */}
      <style jsx global>{`
        @keyframes rotate-y {
          from { transform: rotateY(0deg); }
          to { transform: rotateY(360deg); }
        }
        
        @keyframes ping {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        .rotate-y-360 {
          animation: rotate-y 20s linear infinite;
        }
        
        .animate-ping {
          animation: ping 1s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
        
        input[type="range"]::-webkit-slider-thumb {
          appearance: none;
          height: 16px;
          width: 16px;
          border-radius: 50%;
          background: white;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
        }
        
        input[type="range"]::-webkit-slider-thumb:hover {
          transform: scale(1.2);
          box-shadow: 0 0 10px rgba(255, 100, 200, 0.8);
        }
        
        ::-webkit-scrollbar {
          width: 4px;
        }
        
        ::-webkit-scrollbar-track {
          background: transparent;
        }
        
        ::-webkit-scrollbar-thumb {
          border-radius: 20px;
        }
        
        .perspective-1000 {
          perspective: 1000px;
        }
        
        .transform-style-3d {
          transform-style: preserve-3d;
        }
      `}</style>
    </div>
  );
};

export default MusicPlayer;
