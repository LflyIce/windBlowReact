import { useState } from 'react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError('');
    
    // 简单验证
    if (!formData.name || !formData.email || !formData.message) {
      setSubmitError('请填写所有必填字段');
      setIsSubmitting(false);
      return;
    }

    if (!formData.email.includes('@')) {
      setSubmitError('请输入有效的邮箱地址');
      setIsSubmitting(false);
      return;
    }

    // 模拟表单提交
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitSuccess(true);
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
      
      // 3秒后隐藏成功消息
      setTimeout(() => {
        setSubmitSuccess(false);
      }, 3000);
    }, 1000);
  };

  return (
    <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 text-white">联系我</h1>
          <p className="text-xl text-white/80">
            有任何问题、建议或合作意向？请随时与我联系
          </p>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-10">
          {/* 联系信息 */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl shadow-md p-8 border border-white/20">
            <h2 className="text-2xl font-bold mb-6 text-white">联系信息</h2>
            
            <div className="space-y-6">
              <div className="flex items-start">
                <div className="bg-white/20 p-3 rounded-lg mr-4">
                  <i className="fa fa-envelope text-white text-xl"></i>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-1">邮箱</h3>
                  <p className="text-white/80">1489751526@qq.com</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-gray-600 p-3 rounded-lg mr-4">
                  <i className="fa fa-map-marker text-white text-xl"></i>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-1">地址</h3>
                  <p className="text-white/80">广东省深圳市</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-gray-600 p-3 rounded-lg mr-4">
                  <i className="fa fa-clock-o text-white text-xl"></i>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-1">回复时间</h3>
                  <p className="text-white/80">通常会在24-48小时内回复所有消息</p>
                </div>
              </div>
            </div>
            
            {/* 社交媒体链接 */}
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-white mb-4">关注我</h3>
              <div className="flex space-x-4">
                <a 
                  href="#" 
                  className="bg-gray-600 hover:bg-gray-500 text-white p-3 rounded-lg transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <i className="fa fa-twitter text-lg"></i>
                </a>
                <a 
                  href="#" 
                  className="bg-gray-600 hover:bg-gray-500 text-white p-3 rounded-lg transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <i className="fa fa-instagram text-lg"></i>
                </a>
                <a 
                  href="#" 
                  className="bg-gray-600 hover:bg-gray-500 text-white p-3 rounded-lg transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <i className="fa fa-linkedin text-lg"></i>
                </a>
                <a 
                  href="#" 
                  className="bg-gray-600 hover:bg-gray-500 text-white p-3 rounded-lg transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <i className="fa fa-github text-lg"></i>
                </a>
              </div>
            </div>
          </div>
          
          {/* 联系表单 */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl shadow-md p-8 border border-white/20">
            <h2 className="text-2xl font-bold mb-6 text-white">发送消息</h2>
            
            {submitSuccess && (
              <div className="bg-green-500/20 border border-green-500 text-green-300 px-4 py-3 rounded-lg mb-6">
                <p>感谢您的留言！我会尽快回复您。</p>
              </div>
            )}
            
            {submitError && (
              <div className="bg-red-500/20 border border-red-500 text-red-300 px-4 py-3 rounded-lg mb-6">
                <p>{submitError}</p>
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-white mb-2">姓名</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full bg-white/10 border border-white/30 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50"
                  placeholder="请输入您的姓名"
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-white mb-2">邮箱</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full bg-white/10 border border-white/30 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50"
                  placeholder="请输入您的邮箱地址"
                />
              </div>
              
              <div>
                <label htmlFor="subject" className="block text-white mb-2">主题</label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full bg-white/10 border border-white/30 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50"
                  placeholder="请输入消息主题"
                />
              </div>
              
              <div>
                <label htmlFor="message" className="block text-white mb-2">消息</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="5"
                  className="w-full bg-white/10 border border-white/30 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50"
                  placeholder="请输入您的消息"
                ></textarea>
              </div>
              
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-white/20 hover:bg-white/30 text-white font-medium py-3 px-6 rounded-lg transition-colors disabled:opacity-50 border border-white/30"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center">
                    <i className="fa fa-spinner fa-spin mr-2"></i>
                    发送中...
                  </span>
                ) : (
                  '发送消息'
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;