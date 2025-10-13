import { Link } from "react-router-dom";
import { author } from "../utils/data";

const About = () => {
  return (
    <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white/10 backdrop-blur-sm rounded-xl shadow-md p-8 mb-10 border border-white/20">
          <h1 className="text-3xl font-bold mb-6 text-white">关于我</h1>

          <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-1/3">
              <div className="relative rounded-xl overflow-hidden shadow-lg">
                <div className="absolute inset-0 bg-gray-200 animate-pulse"></div>
                <img
                  src={author.avatar}
                  alt={author.name}
                  className="w-full h-auto rounded-xl object-cover shadow-md"
                  onLoad={(e) => {
                    // 隐藏占位符
                    e.target.previousElementSibling.style.display = 'none';
                  }}
                />
              </div>

              <div className="mt-6 flex justify-center space-x-4">
                {author.socialLinks.map((link, index) => (
                  <a
                    key={index}
                    href={link.url}
                    className="text-white/80 hover:text-white transition-colors text-xl"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <i className={link.icon}></i>
                  </a>
                ))}
              </div>
            </div>

            <div className="md:w-2/3">
              <h2 className="text-2xl font-bold mb-4 text-white">{author.name}</h2>
              <p className="text-white/80 text-lg mb-4">{author.title}</p>

              <div className="prose text-white/90">
                <p>
                  你好！我是{author.name}
                  ，一名热爱写作和分享的博主。我专注于探索生活的本质，分享关于极简主义、个人成长和可持续生活的思考与实践。
                </p>
                <p>
                  这个博客诞生于2020年，最初只是我记录个人思考的地方，随着时间的推移，它逐渐成长为一个分享知识和经验的平台。我相信简单的生活才能带来真正的快乐，希望通过我的文字能给你带来一些启发。
                </p>
                <p>
                  除了写作，我还喜欢阅读、旅行和摄影。我认为生活中的每一个瞬间都值得被记录和反思，这也是我坚持写作的动力之一。
                </p>
                <p>
                  如果你对我的文章有任何想法或建议，或者只是想打个招呼，都欢迎通过联系方式与我交流。感谢你的来访！
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
