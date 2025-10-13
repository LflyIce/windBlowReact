import { useState } from 'react';

const SubscribeForm = ({ 
  inputPlaceholder = "输入您的邮箱地址", 
  buttonText = "立即订阅",
  className = ""
}) => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // 简单的邮箱验证
    if (!email.includes('@')) {
      setMessage('请输入有效的邮箱地址');
      return;
    }
    
    setIsSubmitting(true);
    setMessage('');
    
    // 模拟API请求
    setTimeout(() => {
      setIsSubmitting(false);
      setMessage('订阅成功！感谢您的关注。');
      setEmail('');
      
      // 5秒后清除消息
      setTimeout(() => setMessage(''), 5000);
    }, 1500);
  };

  return (
    <form onSubmit={handleSubmit} className={className}>
      <input 
        type="email" 
        placeholder={inputPlaceholder}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full px-4 py-3 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-white/50 bg-white/90 backdrop-blur-sm border border-white/30"
        required
      />
      <button 
        type="submit" 
        disabled={isSubmitting}
        className="w-full bg-white/20 text-white font-medium py-3 rounded-lg hover:bg-white/30 transition-all disabled:opacity-70 disabled:cursor-not-allowed backdrop-blur-sm border border-white/30 hover:border-white/50"
      >
        {isSubmitting ? (
          <span className="flex items-center justify-center">
            <i className="fa fa-spinner fa-spin mr-2"></i> 处理中...
          </span>
        ) : (
          buttonText
        )}
      </button>
      
      {message && (
        <p className={`text-xs mt-2 ${message.includes('成功') ? 'text-green-300' : 'text-red-300'}`}>
          {message}
        </p>
      )}
    </form>
  );
};

export default SubscribeForm;