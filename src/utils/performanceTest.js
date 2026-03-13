/**
 * 滚动性能测试工具
 * 用于测量和分析滚动性能
 */

/**
 * 测量滚动 FPS
 */
export class ScrollPerformanceMonitor {
  constructor() {
    this.frames = [];
    this.isMonitoring = false;
    this.rafId = null;
    this.lastTime = performance.now();
  }

  /**
   * 开始监控
   */
  start() {
    if (this.isMonitoring) return;
    
    this.isMonitoring = true;
    this.frames = [];
    this.lastTime = performance.now();
    
    this.measureFrame();
  }

  /**
   * 测量每一帧
   */
  measureFrame() {
    if (!this.isMonitoring) return;

    const currentTime = performance.now();
    const deltaTime = currentTime - this.lastTime;
    const fps = 1000 / deltaTime;

    this.frames.push({
      time: currentTime,
      deltaTime,
      fps
    });

    this.lastTime = currentTime;
    this.rafId = requestAnimationFrame(() => this.measureFrame());
  }

  /**
   * 停止监控
   */
  stop() {
    this.isMonitoring = false;
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
    return this.getStats();
  }

  /**
   * 获取统计数据
   */
  getStats() {
    if (this.frames.length === 0) {
      return null;
    }

    const fpsValues = this.frames.map(f => f.fps);
    const avgFps = fpsValues.reduce((a, b) => a + b, 0) / fpsValues.length;
    const minFps = Math.min(...fpsValues);
    const maxFps = Math.max(...fpsValues);

    // 计算低于 30fps 的帧数
    const lowFpsFrames = fpsValues.filter(fps => fps < 30).length;
    const lowFpsPercentage = (lowFpsFrames / fpsValues.length) * 100;

    // 计算卡顿次数 (FPS 下降超过 10 帧的情况)
    let stutterCount = 0;
    for (let i = 1; i < fpsValues.length; i++) {
      if (fpsValues[i - 1] - fpsValues[i] > 10) {
        stutterCount++;
      }
    }

    return {
      avgFps: avgFps.toFixed(2),
      minFps: minFps.toFixed(2),
      maxFps: maxFps.toFixed(2),
      lowFpsPercentage: lowFpsPercentage.toFixed(2),
      stutterCount,
      totalFrames: this.frames.length,
      duration: ((this.frames[this.frames.length - 1].time - this.frames[0].time) / 1000).toFixed(2)
    };
  }

  /**
   * 打印报告
   */
  printReport() {
    const stats = this.getStats();
    if (!stats) {
      console.log('❌ 没有可用的性能数据');
      return;
    }

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
    let rating, color;
    if (avgFps >= 55) {
      rating = '优秀 ⭐⭐⭐⭐⭐';
      color = '🟢';
    } else if (avgFps >= 45) {
      rating = '良好 ⭐⭐⭐⭐';
      color = '🟡';
    } else if (avgFps >= 30) {
      rating = '一般 ⭐⭐⭐';
      color = '🟠';
    } else {
      rating = '较差 ⭐⭐';
      color = '🔴';
    }
    
    console.log('═══════════════════════════════════════');
    console.log(`性能评级: ${color} ${rating}`);
    console.log('═══════════════════════════════════════');
  }
}

/**
 * 监控长任务
 */
export class LongTaskMonitor {
  constructor() {
    this.observer = null;
    this.longTasks = [];
  }

  /**
   * 开始监控长任务
   */
  start() {
    if (!('PerformanceObserver' in window)) {
      console.warn('❌ PerformanceObserver 不可用');
      return;
    }

    try {
      this.observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.duration > 50) {
            this.longTasks.push({
              duration: entry.duration,
              startTime: entry.startTime,
              name: entry.name
            });
          }
        }
      });

      this.observer.observe({ entryTypes: ['measure', 'longtask'] });
    } catch (e) {
      console.warn('❌ 无法监控长任务:', e);
    }
  }

  /**
   * 停止监控
   */
  stop() {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
  }

  /**
   * 获取报告
   */
  getReport() {
    if (this.longTasks.length === 0) {
      return {
        count: 0,
        avgDuration: 0,
        maxDuration: 0,
        totalDuration: 0
      };
    }

    const durations = this.longTasks.map(t => t.duration);
    return {
      count: this.longTasks.length,
      avgDuration: (durations.reduce((a, b) => a + b, 0) / durations.length).toFixed(2),
      maxDuration: Math.max(...durations).toFixed(2),
      totalDuration: durations.reduce((a, b) => a + b, 0).toFixed(2),
      tasks: this.longTasks
    };
  }
}

/**
 * 滚动性能评分
 */
export function scoreScrollPerformance(stats) {
  let score = 100;

  // FPS 评分
  const avgFps = parseFloat(stats.avgFps);
  if (avgFps < 30) score -= 40;
  else if (avgFps < 45) score -= 20;
  else if (avgFps < 55) score -= 10;

  // 卡顿评分
  score -= stats.stutterCount * 2;

  // 低帧率评分
  const lowFpsPercent = parseFloat(stats.lowFpsPercentage);
  score -= lowFpsPercent * 0.5;

  return Math.max(0, Math.min(100, score)).toFixed(0);
}

/**
 * 快速性能测试
 */
export async function quickPerformanceTest() {
  console.log('🚀 开始滚动性能测试...');
  console.log('请上下滚动页面 5 秒钟');

  const monitor = new ScrollPerformanceMonitor();
  monitor.start();

  await new Promise(resolve => setTimeout(resolve, 5000));

  const stats = monitor.stop();
  monitor.printReport();

  const score = scoreScrollPerformance(stats);
  console.log(`\n🎯 性能评分: ${score}/100`);

  if (score >= 80) {
    console.log('✅ 滚动性能优秀!');
  } else if (score >= 60) {
    console.log('⚠️ 滚动性能良好,但有优化空间');
  } else {
    console.log('❌ 滚动性能需要优化');
  }

  return stats;
}

/**
 * 检测常见的性能问题
 */
export function detectPerformanceIssues() {
  const issues = [];

  // 检查 background-attachment: fixed
  const elements = document.querySelectorAll('*');
  for (const el of elements) {
    const style = window.getComputedStyle(el);
    if (style.backgroundAttachment === 'fixed') {
      issues.push({
        type: 'background-attachment-fixed',
        element: el.tagName,
        severity: 'high',
        message: '使用了 background-attachment: fixed,会严重影响滚动性能'
      });
    }
  }

  // 检查未节流的滚动事件监听器
  const scrollListeners = window.getEventListeners?.?.scroll?.length || 0;
  if (scrollListeners > 3) {
    issues.push({
      type: 'too-many-scroll-listeners',
      count: scrollListeners,
      severity: 'medium',
      message: `检测到 ${scrollListeners} 个滚动监听器,可能导致性能问题`
    });
  }

  // 检查固定定位元素
  const fixedElements = document.querySelectorAll('[style*="position: fixed"], .fixed');
  if (fixedElements.length > 5) {
    issues.push({
      type: 'too-many-fixed-elements',
      count: fixedElements.length,
      severity: 'low',
      message: `检测到 ${fixedElements.length} 个固定定位元素`
    });
  }

  return issues;
}

/**
 * 打印性能建议
 */
export function printPerformanceRecommendations(issues) {
  if (issues.length === 0) {
    console.log('✅ 未检测到明显的性能问题');
    return;
  }

  console.log('⚠️ 检测到以下性能问题:');
  console.log('');

  issues.forEach((issue, index) => {
    const icon = issue.severity === 'high' ? '🔴' : 
                 issue.severity === 'medium' ? '🟡' : '🟢';
    
    console.log(`${icon} ${index + 1}. ${issue.message}`);
    
    if (issue.type === 'background-attachment-fixed') {
      console.log('   建议: 使用伪元素或 transform 替代');
    } else if (issue.type === 'too-many-scroll-listeners') {
      console.log('   建议: 使用节流或防抖减少监听器触发频率');
    } else if (issue.type === 'too-many-fixed-elements') {
      console.log('   建议: 考虑使用 CSS Containment');
    }
    console.log('');
  });
}

// 导出便捷函数
export const testScrollPerformance = quickPerformanceTest;
export const checkPerformanceIssues = detectPerformanceIssues;
