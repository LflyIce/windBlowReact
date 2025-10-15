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
      title: "夜曲",
      artist: "周杰伦",
      album: "十一月的萧邦",
      duration: "3:45",
      cover: "https://picsum.photos/seed/album1/300/300",
      url: "https://example.com/song1.mp3"
    },
    {
      id: 2,
      title: "青花瓷",
      artist: "周杰伦",
      album: "我很忙",
      duration: "3:58",
      cover: "https://picsum.photos/seed/album2/300/300",
      url: "https://example.com/song2.mp3"
    },
    {
      id: 3,
      title: "稻香",
      artist: "周杰伦",
      album: "魔杰座",
      duration: "4:32",
      cover: "https://picsum.photos/seed/album3/300/300",
      url: "https://example.com/song3.mp3"
    },
    {
      id: 4,
      title: "告白气球",
      artist: "周杰伦",
      album: "周杰伦的床边故事",
      duration: "3:34",
      cover: "https://picsum.photos/seed/album4/300/300",
      url: "https://example.com/song4.mp3"
    },
    {
      id: 5,
      title: "七里香",
      artist: "周杰伦",
      album: "七里香",
      duration: "4:05",
      cover: "https://picsum.photos/seed/album5/300/300",
      url: "https://example.com/song5.mp3"
    },
    {
      id: 6,
      title: "晴天",
      artist: "周杰伦",
      album: "叶惠美",
      duration: "4:29",
      cover: "https://picsum.photos/seed/album6/300/300",
      url: "https://example.com/song6.mp3"
    }
  ];

  // 格式化时间
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // 播放/暂停切换
  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(err => {
        console.log("播放失败:", err);
      });
    }
    setIsPlaying(!isPlaying);
  };

  // 播放指定歌曲
  const playSong = (index) => {
    setCurrentSong(index);
    setIsPlaying(true);
    
    // 模拟播放过程
    setTimeout(() => {
      setDuration(180); // 模拟歌曲时长3分钟
    }, 100);
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
    if (progressRef.current) {
      const progressBar = progressRef.current;
      const clickPosition = e.nativeEvent.offsetX;
      const progressBarWidth = progressBar.offsetWidth;
      const newProgress = (clickPosition / progressBarWidth) * 100;
      setProgress(newProgress);
      
      // 模拟当前时间更新
      const newTime = (newProgress / 100) * duration;
      setCurrentTime(newTime);
    }
  };

  // 更新音量
  const updateVolume = (e) => {
    const newVolume = e.target.value / 100;
    setVolume(newVolume);
  };

  // 模拟时间更新
  useEffect(() => {
    let interval;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime(prev => {
          if (prev >= duration) {
            playNext();
            return 0;
          }
          return prev + 1;
        });
        setProgress((currentTime / duration) * 100);
      }, 1000);
    }
    
    return () => clearInterval(interval);
  }, [isPlaying, currentTime, duration]);

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
                  <span>{songs[currentSong].duration}</span>
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
        onLoadedMetadata={() => {
          // 模拟获取音频时长
          setDuration(180);
        }}
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