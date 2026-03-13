import { useState } from 'react';
import { 
  quickPerformanceTest, 
  detectPerformanceIssues,
  printPerformanceRecommendations,
  ScrollPerformanceMonitor
} from '../utils/performanceTest';

/**
 * 性能测试页面
 * 用于测试和诊断滚动性能问题
 */
const PerformanceTest = () => {
  const [isTesting, setIsTesting] = useState(false);
  const [results, setResults] = useState(null);
  const [issues, setIssues] = useState([]);

  /**
   * 运行滚动性能测试
   */
  const runTest = async () => {
    setIsTesting(true);
    setResults(null);

    console.clear();
    console.log('🚀 开始滚动性能测试...');
    console.log('请上下滚动页面 5 秒钟');

    const monitor = new ScrollPerformanceMonitor();
    monitor.start();

    // 等待 5 秒
    await new Promise(resolve => setTimeout(resolve, 5000));

    const stats = monitor.stop();
    setResults(stats);

    // 打印详细报告
    console.log('═══════════════════════════════════════');
    console.log('📊 滚动性能报告');
    console.log('═══════════════════════════════════════');
    console.log(`平均 FPS: ${stats.avgFps}`);
    console.log(`最低 FPS: ${stats.minFps}`);
    console.log(`最高 FPS: ${stats.maxFps}`);
    console.log(`低帧率占比: ${stats.lowFpsPercentage}%`);
    console.log(`卡顿次数: ${stats.stutterCount}`);
    console.log(`总帧数: ${stats.totalFrames}`);
    console.log(`监控时长: ${stats.duration}秒`);

    // 性能评级
    const avgFps = parseFloat(stats.avgFps);
    let rating, color, ratingClass;
    if (avgFps >= 55) {
      rating = '优秀 ⭐⭐⭐⭐⭐';
      color = '🟢';
      ratingClass = 'text-green-500';
    } else if (avgFps >= 45) {
      rating = '良好 ⭐⭐⭐⭐';
      color = '🟡';
      ratingClass = 'text-yellow-500';
    } else if (avgFps >= 30) {
      rating = '一般 ⭐⭐⭐';
      color = '🟠';
      ratingClass = 'text-orange-500';
    } else {
      rating = '较差 ⭐⭐';
      color = '🔴';
      ratingClass = 'text-red-500';
    }

    console.log('═══════════════════════════════════════');
    console.log(`性能评级: ${color} ${rating}`);
    console.log('═══════════════════════════════════════');

    setIsTesting(false);
  };

  /**
   * 检测性能问题
   */
  const detectIssues = () => {
    const detectedIssues = detectPerformanceIssues();
    setIssues(detectedIssues);
    
    if (detectedIssues.length === 0) {
      console.log('✅ 未检测到明显的性能问题');
    } else {
      console.log('⚠️ 检测到以下性能问题:');
      printPerformanceRecommendations(detectedIssues);
    }
  };

  /**
   * 获取性能评级
   */
  const getPerformanceRating = (avgFps) => {
    if (avgFps >= 55) return { text: '优秀', class: 'text-green-500', stars: 5 };
    if (avgFps >= 45) return { text: '良好', class: 'text-yellow-500', stars: 4 };
    if (avgFps >= 30) return { text: '一般', class: 'text-orange-500', stars: 3 };
    return { text: '较差', class: 'text-red-500', stars: 2 };
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-white">🔍 滚动性能测试</h1>

        {/* 控制面板 */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-8 border border-white/20">
          <h2 className="text-xl font-semibold mb-4 text-white">测试控制</h2>
          
          <div className="flex gap-4 mb-6">
            <button
              onClick={runTest}
              disabled={isTesting}
              className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {isTesting ? '🚀 测试中... (请滚动页面)' : '▶️ 开始 5 秒测试'}
            </button>

            <button
              onClick={detectIssues}
              className="px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
            >
              🔍 检测性能问题
            </button>
          </div>

          {/* 使用说明 */}
          <div className="text-white/80 text-sm space-y-2">
            <p>💡 <strong>使用说明:</strong></p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>点击"开始测试"后,请快速上下滚动页面</li>
              <li>测试将持续 5 秒钟</li>
              <li>测试完成后将显示详细报告</li>
              <li>打开浏览器控制台可查看更多详细信息</li>
            </ul>
          </div>
        </div>

        {/* 测试结果 */}
        {results && (
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-8 border border-white/20">
            <h2 className="text-xl font-semibold mb-4 text-white">📊 测试结果</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* FPS 统计 */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-white/80">平均 FPS:</span>
                  <span className="text-2xl font-bold text-white">{results.avgFps}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/80">最低 FPS:</span>
                  <span className="text-xl font-semibold text-white">{results.minFps}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/80">最高 FPS:</span>
                  <span className="text-xl font-semibold text-white">{results.maxFps}</span>
                </div>
              </div>

              {/* 其他统计 */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-white/80">低帧率占比:</span>
                  <span className="text-xl font-semibold text-white">{results.lowFpsPercentage}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/80">卡顿次数:</span>
                  <span className="text-xl font-semibold text-white">{results.stutterCount}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/80">总帧数:</span>
                  <span className="text-xl font-semibold text-white">{results.totalFrames}</span>
                </div>
              </div>
            </div>

            {/* 性能评级 */}
            <div className="mt-6 pt-6 border-t border-white/20">
              <div className="text-center">
                <p className="text-white/80 mb-2">性能评级</p>
                <p className={`text-4xl font-bold ${getPerformanceRating(parseFloat(results.avgFps)).class}`}>
                  {getPerformanceRating(parseFloat(results.avgFps)).text} 
                  {'⭐'.repeat(getPerformanceRating(parseFloat(results.avgFps)).stars)}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* 检测到的问题 */}
        {issues.length > 0 && (
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-8 border border-white/20">
            <h2 className="text-xl font-semibold mb-4 text-white">⚠️ 检测到的问题</h2>
            
            <div className="space-y-4">
              {issues.map((issue, index) => (
                <div key={index} className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">
                      {issue.severity === 'high' ? '🔴' : 
                       issue.severity === 'medium' ? '🟡' : '🟢'}
                    </span>
                    <div className="flex-1">
                      <p className="text-white font-medium mb-2">{issue.message}</p>
                      <div className="text-sm text-white/70">
                        {issue.type === 'background-attachment-fixed' && (
                          <p>💡 建议: 使用伪元素或 transform 替代 background-attachment: fixed</p>
                        )}
                        {issue.type === 'too-many-scroll-listeners' && (
                          <p>💡 建议: 使用节流或防抖减少监听器触发频率</p>
                        )}
                        {issue.type === 'too-many-fixed-elements' && (
                          <p>💡 建议: 考虑使用 CSS Containment 优化固定元素</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 优化建议 */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
          <h2 className="text-xl font-semibold mb-4 text-white">💡 优化建议</h2>
          
          <div className="space-y-3 text-white/80">
            <p>1. <strong>使用 RAF 节流:</strong> 滚动事件处理使用 requestAnimationFrame</p>
            <p>2. <strong>避免 fixed 背景:</strong> 移除 background-attachment: fixed</p>
            <p>3. <strong>Passive 监听器:</strong> 添加 passive: true 到滚动事件</p>
            <p>4. <strong>减少重绘:</strong> 使用 transform 而不是 top/left</p>
            <p>5. <strong>虚拟滚动:</strong> 长列表使用虚拟滚动技术</p>
          </div>

          <div className="mt-6 pt-6 border-t border-white/20">
            <p className="text-white/60 text-sm">
              📚 详细优化指南请查看: <code className="bg-white/10 px-2 py-1 rounded">SCROLL_PERFORMANCE_OPTIMIZATION.md</code>
            </p>
          </div>
        </div>

        {/* 测试内容 */}
        <div className="mt-8 space-y-4">
          <h2 className="text-xl font-semibold text-white">📜 测试滚动区域</h2>
          {[...Array(20)].map((_, i) => (
            <div key={i} className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10">
              <h3 className="text-lg font-semibold text-white mb-2">测试内容块 {i + 1}</h3>
              <p className="text-white/70">
                这是一个用于测试滚动性能的内容块。请快速上下滚动页面,
                系统将测量帧率、卡顿次数等性能指标。
              </p>
              <div className="mt-4 grid grid-cols-3 gap-2">
                {[...Array(3)].map((_, j) => (
                  <div key={j} className="aspect-square bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg"></div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PerformanceTest;
