import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, Heart, Share2, Download } from 'react-feather';

const Music = () => {
  // 音乐播放状态
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSong, setCurrentSong] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  
  const audioRef = useRef(null);
  const progressRef = useRef(null);

  // 音乐列表数据
  const songs = [
    {
      id: 1,
      title: "打火机",
      artist: "Penny",
      album: "打火机",
      duration: "2:33",
      cover: "https://picsum.photos/seed/album1/300/300",
      url: "/audio/yequ.mp3"
    },
    {
      id: 2,
      title: "爱错",
      artist: "王力宏",
      album: "恋爱占星音乐全精选",
      duration: "3:58",
      cover: "https://picsum.photos/seed/album2/300/300",
      url: "/audio/aicuo.mp3"
    },
    
  ];

  // 格式化时间
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // 播放/暂停切换
  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().catch(err => {
        console.log("播放失败:", err);
      });
    }
  };

  // 播放指定歌曲
  const playSong = (index) => {
    setCurrentSong(index);
    setIsPlaying(true);
  };

  // 上一首
  const playPrevious = () => {
    const newIndex = currentSong === 0 ? songs.length - 1 : currentSong - 1;
    playSong(newIndex);
  };

  // 下一首
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

  // 更新音量
  const updateVolume = (e) => {
    const newVolume = e.target.value / 100;
    setVolume(newVolume);
    
    const audio = audioRef.current;
    if (audio) {
      audio.volume = newVolume;
    }
  };

  // 当前歌曲变化时重置状态
  useEffect(() => {
    setCurrentTime(0);
    setProgress(0);
    setDuration(0);
    
    const audio = audioRef.current;
    if (!audio) return;

    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.catch(error => {
        console.log("播放失败:", error);
        setIsPlaying(false);
      });
    }
  }, [currentSong]);

  // 监听音频事件
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => {
      setCurrentTime(audio.currentTime);
      if (audio.duration) {
        setDuration(audio.duration);
        setProgress((audio.currentTime / audio.duration) * 100);
      }
    };

    const updateDuration = () => {
      if (audio.duration) {
        setDuration(audio.duration);
      }
    };

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => {
      setIsPlaying(false);
      playNext();
    };

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [currentSong]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 via-blue-900 to-indigo-900 text-white">
      {/* 音乐页面主内容 */}
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">我的音乐收藏</h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            在这里收藏和播放你最喜欢的音乐，享受美妙的听觉盛宴
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 左侧专辑封面和播放控制 */}
          <div className="lg:col-span-1">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-xl">
              <div className="mb-6">
                <img 
                  src={songs[currentSong].cover} 
                  alt={songs[currentSong].title}
                  className="w-full aspect-square object-cover rounded-xl shadow-lg mb-6"
                />
                <h2 className="text-2xl font-bold text-center mb-2">{songs[currentSong].title}</h2>
                <p className="text-center text-white/80 mb-1">{songs[currentSong].artist}</p>
                <p className="text-center text-white/60 text-sm">{songs[currentSong].album}</p>
              </div>

              {/* 进度条 */}
              <div className="mb-6">
                <div className="flex justify-between text-sm text-white/70 mb-2">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
                <div 
                  className="h-2 bg-white/20 rounded-full cursor-pointer"
                  onClick={updateProgress}
                  ref={progressRef}
                >
                  <div 
                    className="h-full bg-blue-500 rounded-full relative"
                    style={{ width: `${progress}%` }}
                  >
                    <div className="absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full"></div>
                  </div>
                </div>
              </div>

              {/* 播放控制按钮 */}
              <div className="flex justify-center items-center space-x-6 mb-6">
                <button 
                  onClick={playPrevious}
                  className="p-2 rounded-full hover:bg-white/20 transition-colors"
                  aria-label="上一首"
                >
                  <SkipBack className="h-6 w-6" />
                </button>
                
                <button 
                  onClick={togglePlay}
                  className="p-4 bg-white rounded-full hover:bg-gray-200 transition-colors"
                  aria-label={isPlaying ? "暂停" : "播放"}
                >
                  {isPlaying ? <Pause className="h-8 w-8 text-indigo-900" /> : <Play className="h-8 w-8 text-indigo-900" />}
                </button>
                
                <button 
                  onClick={playNext}
                  className="p-2 rounded-full hover:bg-white/20 transition-colors"
                  aria-label="下一首"
                >
                  <SkipForward className="h-6 w-6" />
                </button>
              </div>

              {/* 音量控制 */}
              <div className="flex items-center space-x-3">
                <Volume2 className="h-5 w-5 text-white/70" />
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  value={volume * 100}
                  onChange={updateVolume}
                  className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
                />
              </div>
            </div>
          </div>

          {/* 右侧音乐列表 */}
          <div className="lg:col-span-2">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-xl">
              <h2 className="text-2xl font-bold mb-6">播放列表</h2>
              
              <div className="space-y-4">
                {songs.map((song, index) => (
                  <div 
                    key={song.id}
                    className={`flex items-center p-4 rounded-xl cursor-pointer transition-all ${
                      index === currentSong 
                        ? 'bg-white/20 border border-white/30' 
                        : 'hover:bg-white/10'
                    }`}
                    onClick={() => playSong(index)}
                  >
                    <div className="relative">
                      <img 
                        src={song.cover} 
                        alt={song.title}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      {index === currentSong && isPlaying && (
                        <div className="absolute inset-0 bg-black/40 rounded-lg flex items-center justify-center">
                          <div className="w-6 h-6 border-2 border-white rounded-full animate-ping"></div>
                        </div>
                      )}
                    </div>
                    
                    <div className="ml-4 flex-1">
                      <h3 className="font-bold">{song.title}</h3>
                      <p className="text-white/70 text-sm">{song.artist}</p>
                    </div>
                    
                    <div className="text-white/70 text-sm mr-4">{song.duration}</div>
                    
                    <div className="flex space-x-2">
                      <button className="p-2 rounded-full hover:bg-white/20 transition-colors">
                        <Heart className="h-4 w-4" />
                      </button>
                      <button className="p-2 rounded-full hover:bg-white/20 transition-colors">
                        <Download className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 隐藏的audio元素 */}
      <audio 
        ref={audioRef} 
        src={songs[currentSong].url}
      />

      {/* 全局样式 */}
      <style jsx>{`
        input[type="range"]::-webkit-slider-thumb {
          appearance: none;
          height: 16px;
          width: 16px;
          border-radius: 50%;
          background: white;
          cursor: pointer;
        }
        
        input[type="range"]::-moz-range-thumb {
          height: 16px;
          width: 16px;
          border-radius: 50%;
          background: white;
          cursor: pointer;
          border: none;
        }
      `}</style>
    </div>
  );
};

export default Music;