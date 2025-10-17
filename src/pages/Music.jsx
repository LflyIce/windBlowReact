import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Heart, Share2, Music, X, List } from 'react-feather';

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
      className="fixed top-0 left-0 w-full h-full pointer-events-none z-[-1]"
    />
  );
};

const MusicPlayer = () => {
  // 状态管理
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSong, setCurrentSong] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [showVisualizer, setShowVisualizer] = useState(true);
  const [activePanel, setActivePanel] = useState('playlist'); // 'lyrics', 'playlist', 'none'
  const [currentLyricIndex, setCurrentLyricIndex] = useState(-1); // 当前歌词索引

  // 引用
  const audioRef = useRef(null);
  const lyricsContainerRef = useRef(null);
  const canvasRef = useRef(null);
  const animationFrameRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const sourceRef = useRef(null);

  // 音乐列表数据
  const songs = useMemo(() => [
    {
      id: 1,
      title: "爱错",
      artist: "王力宏",
      album: "恋爱占星音乐全精选",
      duration: "3:58",
      cover: "https://picsum.photos/seed/album2/600/600",
      url: "/audio/aicuo.mp3",
      color: ["#38bdf8", "#0ea5e9"] // 专辑主题色 - 亮蓝到深蓝渐变
    },
    {
      id: 2,
      title: "SoundHelix Song 2",
      artist: "SoundHelix",
      album: "Demo Album",
      duration: "3:58",
      cover: "https://picsum.photos/seed/album2/600/600",
      url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
      color: ["#38bdf8", "#0ea5e9"] // 专辑主题色 - 亮蓝到深蓝渐变
    },
    {
      id: 3,
      title: "SoundHelix Song 3",
      artist: "SoundHelix",
      album: "Demo Album",
      duration: "4:45",
      cover: "https://picsum.photos/seed/album3/600/600",
      url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
      color: ["#f97316", "#ea580c"] // 专辑主题色 - 亮橙到深橙渐变
    },
    {
      id: 4,
      title: "SoundHelix Song 4",
      artist: "SoundHelix",
      album: "Demo Album",
      duration: "3:35",
      cover: "https://picsum.photos/seed/album4/600/600",
      url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
      color: ["#818cf8", "#6366f1"] // 专辑主题色 - 浅紫到靛蓝渐变
    }
  ], []);

  // 格式化时间
  const formatTime = (time) => {
    if (isNaN(time) || time === undefined || time === null) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };
  
  // 处理进度条拖拽
  const handleSeek = (e) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };
  
  // 音频时间更新
  const handleTimeUpdate = useCallback(() => {
    if (audioRef.current) {
      const newTime = audioRef.current.currentTime;
      setCurrentTime(newTime);
      console.log("音频时间更新:", newTime); // 临时添加日志以便调试
    }
  }, []);

  // 音频加载元数据
  const handleLoadedMetadata = useCallback(() => {
    if (audioRef.current) {
      const dur = audioRef.current.duration;
      setDuration(dur);
      console.log("音频元数据加载完成，时长:", dur);
    }
  }, []);

  // 音频错误处理
  const handleError = useCallback((e) => {
    console.error("音频播放错误:", e);
    setIsPlaying(false);
  }, []);

  // 音频可播放
  const handleCanPlay = useCallback(() => {
    console.log("音频可以播放");
  }, []);

  // 播放指定歌曲
  const playSong = useCallback(async (index) => {
    setCurrentSong(index);
    setCurrentLyricIndex(-1);
    
    const audio = audioRef.current;
    if (!audio) return;
    
    try {
      // 加载并播放新歌曲
      audio.src = songs[index].url;
      await audio.load();
      await audio.play();
      setIsPlaying(true);
      
      // 初始化可视化
      if (!sourceRef.current) {
        // 延迟调用确保函数已完全初始化
        setTimeout(() => {
          setupVisualizer();
        }, 0);
      } else if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
        await audioContextRef.current.resume();
      }
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

  const playNext = useCallback(() => {
    const newIndex = currentSong === songs.length - 1 ? 0 : currentSong + 1;
    playSong(newIndex);
  }, [currentSong, songs, playSong]);

  // 音频播放结束
  const handleEnded = useCallback(() => {
    playNext();
  }, [playNext]);

  // 处理音频进度更新
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);
    audio.addEventListener('canplay', handleCanPlay);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
      audio.removeEventListener('canplay', handleCanPlay);
    };
  }, [handleTimeUpdate, handleLoadedMetadata, handleEnded, handleError, handleCanPlay]);

  // 播放/暂停切换
  const togglePlay = () => {
    console.log("切换播放状态，当前状态:", isPlaying);
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        console.log("音频已暂停");
      } else {
        // 尝试播放音频
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              // 音频播放成功
              console.log("音频播放成功");
            })
            .catch((error) => {
              // 自动播放失败，可能需要用户交互
              console.error("音频播放失败:", error);
            });
        }
      }
      setIsPlaying(!isPlaying);
    }
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
    if (!audioContextRef.current) {
      try {
        audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      } catch (error) {
        console.error("创建 AudioContext 失败:", error);
        setShowVisualizer(false);
        return;
      }
    }
    
    // 如果音频上下文被挂起，则恢复它
    if (audioContextRef.current.state === 'suspended') {
      audioContextRef.current.resume();
    }
    
    // 创建分析器
    if (!analyserRef.current) {
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 512; // 增加FFT大小以获得更详细的频谱
    }
    
    // 创建源节点并连接（如果尚未连接）
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
  }, [isPlaying, showVisualizer, songs, currentSong]);

  // 歌词滚动逻辑
  const handleLyricsScroll = useCallback(() => {
    // 歌词数据
    const lyrics = {
      1: [
        { time: 0, text: "SoundHelix Song 1" },
        { time: 10, text: "This is a sample lyric line" },
        { time: 20, text: "Another line of lyrics" },
        { time: 30, text: "More lyrics for demonstration" },
        { time: 40, text: "Lyrics keep appearing" },
        { time: 50, text: "As the song plays" },
        { time: 60, text: "Time passes by" },
        { time: 70, text: "And lyrics change" },
        { time: 80, text: "Just like this one" },
        { time: 90, text: "And this one too" },
      ],
      2: [
        { time: 0, text: "SoundHelix Song 2" },
        { time: 15, text: "This is a different song" },
        { time: 25, text: "With different lyrics" },
        { time: 35, text: "Each song has its own" },
        { time: 45, text: "Set of lyrics" },
        { time: 55, text: "To display" },
        { time: 65, text: "As it plays" },
        { time: 75, text: "In the music player" },
        { time: 85, text: "On the right panel" },
        { time: 95, text: "Or on mobile devices" },
      ],
      3: [
        { time: 0, text: "SoundHelix Song 3" },
        { time: 12, text: "Yet another song" },
        { time: 22, text: "With more lyrics" },
        { time: 32, text: "To show how" },
        { time: 42, text: "The lyrics panel works" },
        { time: 52, text: "With multiple songs" },
        { time: 62, text: "And their lyrics" },
        { time: 72, text: "All in one place" },
        { time: 82, text: "For the user" },
        { time: 92, text: "To enjoy" },
      ],
      4: [
        { time: 0, text: "SoundHelix Song 4" },
        { time: 18, text: "The final demo song" },
        { time: 28, text: "In this music player" },
        { time: 38, text: "Shows how lyrics" },
        { time: 48, text: "Are displayed" },
        { time: 58, text: "In the panel" },
        { time: 68, text: "On the right" },
        { time: 78, text: "On desktop" },
        { time: 88, text: "And can be toggled" },
        { time: 98, text: "On mobile" },
      ]
    };
    
    const currentLyrics = lyrics[songs[currentSong].id] || [];
    if (currentLyrics.length === 0) return;
    
    // 找到当前时间对应的歌词索引
    let newIndex = -1;
    for (let i = 0; i < currentLyrics.length; i++) {
      if (currentTime >= currentLyrics[i].time && 
          (i === currentLyrics.length - 1 || currentTime < currentLyrics[i + 1].time)) {
        newIndex = i;
        break;
      }
    }
    
    console.log("计算歌词索引:", newIndex, "当前时间:", currentTime);
    
    // 只有当索引真正改变时才更新状态
    if (newIndex !== currentLyricIndex && newIndex !== -1) {
      console.log("更新歌词索引:", currentLyricIndex, "->", newIndex);
      setCurrentLyricIndex(newIndex);
    }
    
    // 平滑滚动到当前歌词
    const lyricsContainer = lyricsContainerRef.current;
    if (lyricsContainer && newIndex >= 0) {
      const lyricElements = lyricsContainer.querySelectorAll('.lyric-item');
      const activeLyric = lyricElements[newIndex];
      
      if (activeLyric) {
        const containerHeight = lyricsContainer.clientHeight;
        const lyricHeight = activeLyric.offsetHeight;
        const lyricTop = activeLyric.offsetTop;
        
        // 计算滚动位置，使当前歌词居中
        const scrollPosition = lyricTop - (containerHeight / 2) + (lyricHeight / 2);
        
        // 使用smooth滚动实现平滑效果
        lyricsContainer.scrollTo({
          top: scrollPosition,
          behavior: 'smooth'
        });
      }
    }
  }, [currentTime, currentLyricIndex, currentSong, songs]);

  // 歌词更新
  useEffect(() => {
    console.log("歌词更新 - 当前时间:", currentTime, "当前歌词索引:", currentLyricIndex);
    handleLyricsScroll();
  }, [currentTime, currentLyricIndex, handleLyricsScroll]);

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

  // 处理窗口大小变化时的面板显示
  useEffect(() => {
    const handleResize = () => {
      const isDesktop = window.innerWidth >= 1024; // lg breakpoint
      // 如果是桌面端且面板处于隐藏状态，则默认显示播放列表
      if (isDesktop && activePanel === 'none') {
        setActivePanel('playlist');
      }
    };

    handleResize(); // 初始化检查
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [activePanel]);

  // 组件卸载时清理
  useEffect(() => {
    return () => {
      cleanupAudio();
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, [cleanupAudio]);

  // 当播放状态改变时，确保可视化正确运行
  useEffect(() => {
    if (isPlaying && showVisualizer) {
      // 延迟调用确保函数已完全初始化
      setTimeout(() => {
        setupVisualizer();
      }, 0);
    }
  }, [isPlaying, showVisualizer, setupVisualizer]);

  // 切换面板显示
  const togglePanel = (panel) => {
    console.log("切换面板到:", panel, "当前面板:", activePanel);
    if (activePanel === panel) {
      setActivePanel('none');
    } else {
      setActivePanel(panel);
    }
  };

  // 获取当前歌曲的主题色
  const [primaryColor, secondaryColor] = songs[currentSong].color;
  
  // 添加缺失的ref
  const playerRef = useRef(null);
  const panelRef = useRef(null);

  return (
    <div 
      ref={playerRef}
      className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] text-white relative"
    >
      {/* 动态粒子背景 */}
      <ParticleBackground isPlaying={isPlaying} />
      
      {/* 主内容区 */}
      <main className="container mx-auto px-4 pt-8 pb-20 relative z-10">
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
                  className="mb-8 rounded-xl overflow-hidden p-2 transform transition-all duration-300 hover:shadow-lg relative z-0"
                  style={{ 
                    background: `rgba(255, 255, 255, 0.03)`,
                    boxShadow: `0 0 20px ${primaryColor}10`
                  }}
                >
                  <canvas ref={canvasRef} className="w-full h-36 rounded-lg"></canvas>
                </div>
              )}
              
              {/* 歌词面板 */}
              {activePanel === 'lyrics' && (
                <div 
                  ref={lyricsContainerRef}
                  className="h-full overflow-y-auto pr-2 scrollbar-thin flex flex-col justify-start py-10"
                  style={{
                    scrollbarColor: `${primaryColor} transparent`,
                  }}
                >
                  <div className="flex flex-col items-center space-y-6">
                    {(() => {
                      console.log("渲染歌词面板，当前歌曲ID:", songs[currentSong].id);
                      // 歌词数据
                      const lyrics = {
                        1: [
                          { time: 0, text: "SoundHelix Song 1" },
                          { time: 10, text: "This is a sample lyric line" },
                          { time: 20, text: "Another line of lyrics" },
                          { time: 30, text: "More lyrics for demonstration" },
                          { time: 40, text: "Lyrics keep appearing" },
                          { time: 50, text: "As the song plays" },
                          { time: 60, text: "Time passes by" },
                          { time: 70, text: "And lyrics change" },
                          { time: 80, text: "Just like this one" },
                          { time: 90, text: "And this one too" },
                        ],
                        2: [
                          { time: 0, text: "SoundHelix Song 2" },
                          { time: 15, text: "This is a different song" },
                          { time: 25, text: "With different lyrics" },
                          { time: 35, text: "Each song has its own" },
                          { time: 45, text: "Set of lyrics" },
                          { time: 55, text: "To display" },
                          { time: 65, text: "As it plays" },
                          { time: 75, text: "In the music player" },
                          { time: 85, text: "On the right panel" },
                          { time: 95, text: "Or on mobile devices" },
                        ],
                        3: [
                          { time: 0, text: "SoundHelix Song 3" },
                          { time: 12, text: "Yet another song" },
                          { time: 22, text: "With more lyrics" },
                          { time: 32, text: "To show how" },
                          { time: 42, text: "The lyrics panel works" },
                          { time: 52, text: "With multiple songs" },
                          { time: 62, text: "And their lyrics" },
                          { time: 72, text: "All in one place" },
                          { time: 82, text: "For the user" },
                          { time: 92, text: "To enjoy" },
                        ],
                        4: [
                          { time: 0, text: "SoundHelix Song 4" },
                          { time: 18, text: "The final demo song" },
                          { time: 28, text: "In this music player" },
                          { time: 38, text: "Shows how lyrics" },
                          { time: 48, text: "Are displayed" },
                          { time: 58, text: "In the panel" },
                          { time: 68, text: "On the right" },
                          { time: 78, text: "On desktop" },
                          { time: 88, text: "And can be toggled" },
                          { time: 98, text: "On mobile" },
                        ]
                      };
                      
                      const currentSongLyrics = lyrics[songs[currentSong].id] || [];
                      console.log("当前歌曲歌词:", currentSongLyrics);
                      
                      if (currentSongLyrics.length === 0) {
                        return (
                          <div className="text-center py-10">
                            <p className="text-white/50">暂无歌词111</p>
                          </div>
                        );
                      }
                      
                      return currentSongLyrics.map((lyric, index) => (
                        <div 
                          key={index}
                          className={`lyric-item transition-all duration-300 py-4 px-6 rounded-xl transform-gpu ${
                            index === currentLyricIndex 
                              ? 'text-2xl font-bold scale-105 opacity-100 active' 
                              : 'text-lg opacity-50 hover:opacity-90'
                          }`}
                          style={{
                            textShadow: index === currentLyricIndex ? `0 0 20px ${primaryColor}80` : 'none',
                            color: index === currentLyricIndex ? primaryColor : 'inherit',
                            transition: 'all 0.3s ease-out'
                          }}
                        >
                          {lyric.text}
                        </div>
                      ));
                    })()}
                  </div>
                </div>
              )}
              {/* 进度条 */}
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-xs text-white/70 w-10 text-right">
                  {formatTime(currentTime)}
                </span>
                <input
                  type="range"
                  min="0"
                  max={duration || 100}
                  value={currentTime}
                  onChange={handleSeek}
                  className="flex-1 h-1.5 rounded-full appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, ${primaryColor}, ${secondaryColor})`,
                  }}
                />
                <span className="text-xs text-white/70 w-10">
                  {formatTime(duration)}
                </span>
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
                ? 'hidden lg:block' 
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
            <div className="p-4 h-[calc(100vh-180px)] overflow-y-auto">
              {/* 歌词面板 */}
              {activePanel === 'lyrics' && (
                <div 
                  ref={lyricsContainerRef}
                  className="h-full overflow-y-auto pr-2 scrollbar-thin flex flex-col justify-start py-10"
                  style={{
                    scrollbarColor: `${primaryColor} transparent`,
                  }}
                >
                  <div className="flex flex-col items-center space-y-6">
                    {(() => {
                      console.log("渲染歌词面板，当前歌曲ID:", songs[currentSong].id);
                      // 歌词数据
                      const lyrics = {
                        1: [
                          { time: 0, text: "SoundHelix Song 1" },
                          { time: 10, text: "This is a sample lyric line" },
                          { time: 20, text: "Another line of lyrics" },
                          { time: 30, text: "More lyrics for demonstration" },
                          { time: 40, text: "Lyrics keep appearing" },
                          { time: 50, text: "As the song plays" },
                          { time: 60, text: "Time passes by" },
                          { time: 70, text: "And lyrics change" },
                          { time: 80, text: "Just like this one" },
                          { time: 90, text: "And this one too" },
                        ],
                        2: [
                          { time: 0, text: "SoundHelix Song 2" },
                          { time: 15, text: "This is a different song" },
                          { time: 25, text: "With different lyrics" },
                          { time: 35, text: "Each song has its own" },
                          { time: 45, text: "Set of lyrics" },
                          { time: 55, text: "To display" },
                          { time: 65, text: "As it plays" },
                          { time: 75, text: "In the music player" },
                          { time: 85, text: "On the right panel" },
                          { time: 95, text: "Or on mobile devices" },
                        ],
                        3: [
                          { time: 0, text: "SoundHelix Song 3" },
                          { time: 12, text: "Yet another song" },
                          { time: 22, text: "With more lyrics" },
                          { time: 32, text: "To show how" },
                          { time: 42, text: "The lyrics panel works" },
                          { time: 52, text: "With multiple songs" },
                          { time: 62, text: "And their lyrics" },
                          { time: 72, text: "All in one place" },
                          { time: 82, text: "For the user" },
                          { time: 92, text: "To enjoy" },
                        ],
                        4: [
                          { time: 0, text: "SoundHelix Song 4" },
                          { time: 18, text: "The final demo song" },
                          { time: 28, text: "In this music player" },
                          { time: 38, text: "Shows how lyrics" },
                          { time: 48, text: "Are displayed" },
                          { time: 58, text: "In the panel" },
                          { time: 68, text: "On the right" },
                          { time: 78, text: "On desktop" },
                          { time: 88, text: "And can be toggled" },
                          { time: 98, text: "On mobile" },
                        ]
                      };
                      
                      const currentSongLyrics = lyrics[songs[currentSong].id] || [];
                      console.log("当前歌曲歌词:", currentSongLyrics);
                      
                      if (currentSongLyrics.length === 0) {
                        return (
                          <div className="text-center py-10">
                            <p className="text-white/50">暂无歌词</p>
                          </div>
                        );
                      }
                      
                      return currentSongLyrics.map((lyric, index) => (
                        <div 
                          key={index}
                          className={`lyric-item transition-all duration-300 py-4 px-6 rounded-xl transform-gpu ${
                            index === currentLyricIndex 
                              ? 'text-2xl font-bold scale-105 opacity-100 active' 
                              : 'text-lg opacity-50 hover:opacity-90'
                          }`}
                          style={{
                            textShadow: index === currentLyricIndex ? `0 0 20px ${primaryColor}80` : 'none',
                            color: index === currentLyricIndex ? primaryColor : 'inherit',
                            transition: 'all 0.3s ease-out'
                          }}
                        >
                          {lyric.text}
                        </div>
                      ));
                    })()}
                  </div>
                </div>
              )}
              
              {/* 播放列表面板 */}
              {activePanel === 'playlist' && (
                <div className="space-y-2 max-h-full overflow-y-auto h-full">
                  {songs.map((song, index) => (
                    <div 
                      key={song.id}
                      className={`flex items-center p-3 rounded-xl transition-all duration-300 cursor-pointer ${
                        index === currentSong 
                          ? 'bg-white/10 scale-[1.02]' 
                          : 'hover:bg-white/5'
                      }`}
                      style={{
                        boxShadow: index === currentSong 
                          ? `0 0 15px ${primaryColor}50` 
                          : 'none'
                      }}
                      onClick={() => playSong(index)}
                    >
                      {/* 专辑封面 */}
                      <div className="relative">
                        <img 
                          src={song.cover} 
                          alt={song.title} 
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                        {index === currentSong && isPlaying && (
                          <div 
                            className="absolute inset-0 rounded-lg border-2 border-white/30 animate-ping"
                            style={{ borderColor: `${primaryColor}50` }}
                          ></div>
                        )}
                      </div>
                      
                      {/* 歌曲信息 */}
                      <div className="ml-3 flex-1 min-w-0">
                        <h3 className={`font-medium truncate ${
                          index === currentSong ? 'text-white' : 'text-white/80'
                        }`}>
                          {song.title}
                        </h3>
                        <p className="text-sm text-white/60 truncate">{song.artist}</p>
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
            onClick={() => {
              console.log("点击歌词按钮");
              togglePanel('lyrics');
            }}
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
        preload="auto"
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
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
        
        /* 歌词面板滚动条样式 */
        .scrollbar-thin::-webkit-scrollbar {
          width: 6px;
        }
        
        .scrollbar-thin::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
        }
        
        .scrollbar-thin::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #ff4ecd, #a855f7);
          border-radius: 10px;
        }
        
        .scrollbar-thin::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #a855f7, #ff4ecd);
        }
        
        /* 歌词项动画 */
        .lyric-item {
          will-change: transform, opacity, color;
        }
      `}</style>
    </div>
  );
};

export default MusicPlayer;