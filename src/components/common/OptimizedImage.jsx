import { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';

/**
 * 优化的图片组件
 * 支持懒加载、占位符、错误处理、加载动画
 */
const OptimizedImage = ({
  src,
  alt,
  className = '',
  placeholder = null,
  fallback = null,
  lazy = true,
  threshold = 0.01,
  rootMargin = '50px',
  onLoad,
  onError,
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(!lazy);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef(null);

  // 设置 Intersection Observer 进行懒加载
  useEffect(() => {
    if (!lazy || isInView) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold, rootMargin }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [lazy, isInView, threshold, rootMargin]);

  // 图片加载完成处理
  const handleLoad = (e) => {
    setIsLoaded(true);
    if (onLoad) onLoad(e);
  };

  // 图片加载错误处理
  const handleError = () => {
    setHasError(true);
    if (onError) onError();
  };

  // 如果有错误且有 fallback,显示 fallback
  if (hasError && fallback) {
    return <img src={fallback} alt={alt} className={className} {...props} />;
  }

  return (
    <div ref={imgRef} className={`relative ${className}`}>
      {/* 占位符 */}
      {placeholder && !isLoaded && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse">
          {placeholder}
        </div>
      )}

      {/* 实际图片 */}
      {isInView && (
        <img
          src={src}
          alt={alt}
          className={`transition-opacity duration-300 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          } ${className}`}
          onLoad={handleLoad}
          onError={handleError}
          loading={lazy ? 'lazy' : 'eager'}
          {...props}
        />
      )}
    </div>
  );
};

OptimizedImage.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
  className: PropTypes.string,
  placeholder: PropTypes.node,
  fallback: PropTypes.string,
  lazy: PropTypes.bool,
  threshold: PropTypes.number,
  rootMargin: PropTypes.string,
  onLoad: PropTypes.func,
  onError: PropTypes.func
};

export default OptimizedImage;
