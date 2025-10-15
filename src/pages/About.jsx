import { author, categories } from '../utils/data';
import SubscribeForm from '../components/common/SubscribeForm';

const About = () => {
  return (
    <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="grid lg:grid-cols-3 gap-10">
        {/* 主内容区 */}
        <div className="lg:col-span-2 space-y-10">
          {/* 关于我 */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl shadow-md p-8 border border-white/20">
            <h1 className="text-3xl font-bold mb-6 text-white">关于我</h1>
            <div className="flex flex-col md:flex-row gap-8">
              <div className="md:w-1/3">
                <img 
                  src={author.avatar} 
                  alt={author.name} 
                  className="w-full rounded-lg border border-white/20"
                />
              </div>
              <div className="md:w-2/3">
                <h2 className="text-2xl font-bold mb-2 text-white">{author.name}</h2>
                <p className="text-white/80 mb-4">{author.title}</p>
                <p className="text-white/70 leading-relaxed">{author.bio}</p>
                <div className="flex space-x-4 mt-6">
                  {author.socialLinks.map((link, index) => (
                    <a 
                      key={index} 
                      href={link.url} 
                      className="text-white/80 hover:text-white transition-colors"
                    >
                      <i className={`${link.icon} text-xl`}></i>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          {/* 技能和兴趣 */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl shadow-md p-8 border border-white/20">
            <h2 className="text-2xl font-bold mb-6 text-white">技能与兴趣</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-xl font-semibold mb-4 text-white">专业技能</h3>
                <ul className="space-y-2">
                  <li className="flex items-center text-white/80">
                    <i className="fa fa-check-circle text-green-400 mr-2"></i>
                    前端开发 (React, Vue, Angular)
                  </li>
                  <li className="flex items-center text-white/80">
                    <i className="fa fa-check-circle text-green-400 mr-2"></i>
                    UI/UX 设计
                  </li>
                  <li className="flex items-center text-white/80">
                    <i className="fa fa-check-circle text-green-400 mr-2"></i>
                    移动端开发
                  </li>
                  <li className="flex items-center text-white/80">
                    <i className="fa fa-check-circle text-green-400 mr-2"></i>
                    性能优化
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-4 text-white">兴趣爱好</h3>
                <ul className="space-y-2">
                  <li className="flex items-center text-white/80">
                    <i className="fa fa-heart text-red-400 mr-2"></i>
                    阅读科技和人文类书籍
                  </li>
                  <li className="flex items-center text-white/80">
                    <i className="fa fa-heart text-red-400 mr-2"></i>
                    户外徒步和摄影
                  </li>
                  <li className="flex items-center text-white/80">
                    <i className="fa fa-heart text-red-400 mr-2"></i>
                    开源项目贡献
                  </li>
                  <li className="flex items-center text-white/80">
                    <i className="fa fa-heart text-red-400 mr-2"></i>
                    技术博客写作
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        
        {/* 侧边栏 */}
        <div className="space-y-8">
          {/* 分类统计 */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl shadow-md p-6 border border-white/20">
            <h3 className="text-xl font-bold mb-4 text-white">文章分类</h3>
            <ul className="space-y-3">
              {categories.map(category => (
                <li key={category.id} className="flex justify-between items-center py-2 border-b border-white/20 last:border-0">
                  <span className="text-white/80">{category.name}</span>
                  <span className="bg-white/20 text-white text-sm px-2 py-1 rounded-full">
                    {category.count}
                  </span>
                </li>
              ))}
            </ul>
          </div>
          
          {/* 订阅表单 */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl shadow-md p-6 border border-white/20">
            <h3 className="text-xl font-bold mb-4 text-white">订阅博客</h3>
            <p className="text-white/70 mb-4">
              获取最新文章和独家内容
            </p>
            <SubscribeForm 
              inputPlaceholder="输入您的邮箱"
              buttonText="订阅"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;