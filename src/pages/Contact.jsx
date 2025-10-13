import { useState } from 'react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage('');

    // 简单验证
    if (!formData.name || !formData.email || !formData.message) {
      setSubmitMessage({ type: 'error', text: '请填写所有必填字段' });
      setIsSubmitting(false);
      return;
    }

    if (!formData.email.includes('@')) {
      setSubmitMessage({ type: 'error', text: '请输入有效的邮箱地址' });
      setIsSubmitting(false);
      return;
    }

    // 模拟API请求
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitMessage({ 
        type: 'success', 
        text: '感谢您的留言！我会尽快回复您。' 
      });
      // 重置表单
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
      
      // 5秒后清除消息
      setTimeout(() => setSubmitMessage(''), 5000);
    }, 1500);
  };

  return (
    <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-10">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl shadow-md p-8 border border-white/20">
            <h1 className="text-3xl font-bold mb-6 text-white">联系我</h1>
            <p className="text-white/80 mb-8 text-lg">
              有任何问题、建议或合作意向？请随时与我联系，我会尽快回复您。
            </p>
            
            <div className="space-y-6 mb-8">
              <div className="flex items-start">
                <div className="bg-white/20 p-3 rounded-full text-white mr-4">
                  <i className="fa fa-envelope"></i>
                </div>
                <div>
                  <h3 className="font-medium text-white mb-1">邮箱</h3>
                  <p className="text-white/80">1489751526@qq.com</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-white/20 p-3 rounded-full text-white mr-4">
                  <i className="fa fa-map-marker"></i>
                </div>
                <div>
                  <h3 className="font-medium text-white mb-1">地址</h3>
                  <p className="text-white/80">湖北省黄冈市浠水县</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-white/20 p-3 rounded-full text-white mr-4">
                  <i className="fa fa-clock-o"></i>
                </div>
                <div>
                  <h3 className="font-medium text-white mb-1">回复时间</h3>
                  <p className="text-white/80">通常会在24-48小时内回复所有消息</p>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-xl font-bold mb-4 text-white">关注我</h3>
              <div className="flex space-x-4">
                <a 
                  href="#" 
                  className="bg-white/20 hover:bg-white/30 transition-all w-10 h-10 rounded-full flex items-center justify-center text-white"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <i className="fa fa-twitter"></i>
                </a>
                <a 
                  href="#" 
                  className="bg-white/20 hover:bg-white/30 transition-all w-10 h-10 rounded-full flex items-center justify-center text-white"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <i className="fa fa-instagram"></i>
                </a>
                <a 
                  href="#" 
                  className="bg-white/20 hover:bg-white/30 transition-all w-10 h-10 rounded-full flex items-center justify-center text-white"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <i className="fa fa-linkedin"></i>
                </a>
                <a 
                  href="#" 
                  className="bg-white/20 hover:bg-white/30 transition-all w-10 h-10 rounded-full flex items-center justify-center text-white"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <i className="fa fa-github"></i>
                </a>
              </div>
            </div>
          </div>
          
          <div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl shadow-md p-6 md:p-8 border border-white/20">
              <h2 className="text-2xl font-bold mb-6 text-white">发送消息</h2>
              
              {submitMessage && (
                <div className={`mb-6 p-4 rounded-lg ${
                  submitMessage.type === 'success' 
                    ? 'bg-green-900/50 text-green-300' 
                    : 'bg-red-900/50 text-red-300'
                }`}>
                  {submitMessage.text}
                </div>
              )}
              
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label htmlFor="name" className="block text-white font-medium mb-2">
                    姓名 <span className="text-red-300">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-white/20 border border-white/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white text-white placeholder-white/60"
                    required
                  />
                </div>
                
                <div className="mb-4">
                  <label htmlFor="email" className="block text-white font-medium mb-2">
                    邮箱 <span className="text-red-300">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-white/20 border border-white/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white text-white placeholder-white/60"
                    required
                  />
                </div>
                
                <div className="mb-4">
                  <label htmlFor="subject" className="block text-white font-medium mb-2">
                    主题
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-white/20 border border-white/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white text-white placeholder-white/60"
                  />
                </div>
                
                <div className="mb-6">
                  <label htmlFor="message" className="block text-white font-medium mb-2">
                    消息 <span className="text-red-300">*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows="5"
                    className="w-full px-4 py-2 bg-white/20 border border-white/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white text-white placeholder-white/60 resize-none"
                    required
                  ></textarea>
                </div>
                
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-white/20 text-white font-medium py-3 rounded-lg hover:bg-white/30 transition-all disabled:opacity-70 disabled:cursor-not-allowed border border-white/30 hover:border-white/50"
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center">
                      <i className="fa fa-spinner fa-spin mr-2"></i> 发送中...
                    </span>
                  ) : (
                    '发送消息'
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;