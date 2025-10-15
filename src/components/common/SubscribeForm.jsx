import { useState } from 'react';

const SubscribeForm = ({ 
  inputPlaceholder = "输入您的邮箱", 
  buttonText = "订阅",
  className = ""
}) => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [error, setError] = useState('');

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!email) {
      setError('请输入邮箱地址');
      return;
    }

    if (!validateEmail(email)) {
      setError('请输入有效的邮箱地址');
      return;
    }

    // 模拟订阅过程
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubscribed(true);
      setEmail('');
      
      // 3秒后重置订阅状态
      setTimeout(() => {
        setIsSubscribed(false);
      }, 3000);
    }, 1000);
  };

  return (
    <form onSubmit={handleSubmit} className={className}>
      <div className="flex flex-col sm:flex-row gap-3 flex-grow">
        <div className="flex-grow">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={inputPlaceholder}
            className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50"
            disabled={isSubmitting || isSubscribed}
          />
          {error && <p className="text-red-300 text-sm mt-1">{error}</p>}
        </div>
        <button
          type="submit"
          disabled={isSubmitting || isSubscribed}
          className="px-6 py-3 bg-white/20 hover:bg-white/30 text-white font-medium rounded-lg transition-colors disabled:opacity-50 whitespace-nowrap border border-white/30"
        >
          {isSubmitting ? (
            <span className="flex items-center">
              <i className="fa fa-spinner fa-spin mr-2"></i> 订阅中...
            </span>
          ) : isSubscribed ? (
            <span className="flex items-center">
              <i className="fa fa-check mr-2"></i> 订阅成功
            </span>
          ) : (
            buttonText
          )}
        </button>
      </div>
      
      {isSubscribed && (
        <p className="text-green-300 text-sm mt-2 text-center">
          感谢您的订阅！确认邮件已发送到您的邮箱。
        </p>
      )}
    </form>
  );
};

export default SubscribeForm;