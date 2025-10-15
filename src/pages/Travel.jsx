import React, { useState } from "react";
import { MapPin, Heart, X, Star } from "react-feather";

const Travel = () => {
  // 状态管理
  const [activeCategory, setActiveCategory] = useState("all");
  const [selectedImage, setSelectedImage] = useState(null); // 用于存储选中的图片

  // 目的地数据
  const destinations = [
    {
      id: 1,
      name: "巴厘岛",
      country: "印度尼西亚",
      image: "https://picsum.photos/id/1036/600/400",
      rating: 4.8,
      category: "beach",
    },
    {
      id: 2,
      name: "京都",
      country: "日本",
      image: "https://picsum.photos/id/1037/600/400",
      rating: 4.7,
      category: "culture",
    },
    {
      id: 3,
      name: "瑞士阿尔卑斯",
      country: "瑞士",
      image: "https://picsum.photos/id/1039/600/400",
      rating: 4.9,
      category: "nature",
    },
    {
      id: 4,
      name: "马尔代夫",
      country: "马尔代夫",
      image: "https://picsum.photos/id/1040/600/400",
      rating: 4.9,
      category: "beach",
    },
    {
      id: 5,
      name: "巴塞罗那",
      country: "西班牙",
      image: "https://picsum.photos/id/1041/600/400",
      rating: 4.6,
      category: "city",
    },
    {
      id: 6,
      name: "圣托里尼",
      country: "希腊",
      image: "https://picsum.photos/id/1043/600/400",
      rating: 4.8,
      category: "beach",
    },
  ];

  // 筛选目的地
  const filteredDestinations =
    activeCategory === "all"
      ? destinations
      : destinations.filter((dest) => dest.category === activeCategory);

  // 打开图片放大查看
  const openImageModal = (image) => {
    setSelectedImage(image);
  };

  // 关闭图片放大查看
  const closeImageModal = () => {
    setSelectedImage(null);
  };

  return (
    <div className="min-h-screen bg-white text-gray-800 font-sans">
      {/* 图片放大模态框 */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
          onClick={closeImageModal}
        >
          <div
            className="relative max-w-6xl max-h-full"
            onClick={(e) => e.stopPropagation()} // 防止点击图片时关闭模态框
          >
            <img
              src={selectedImage.image}
              alt={selectedImage.name}
              className="max-w-full max-h-full object-contain"
            />
            <button
              className="absolute top-4 right-4 text-white bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-75 transition-all"
              onClick={closeImageModal}
            >
              <X className="h-6 w-6" />
            </button>
            <div className="absolute bottom-4 left-0 right-0 text-center text-white bg-black bg-opacity-50 py-2 mx-4 rounded">
              <h3 className="text-xl font-bold">{selectedImage.name}</h3>
              <p className="text-gray-300">{selectedImage.country}</p>
            </div>
          </div>
        </div>
      )}

      {/* 目的地部分 */}
      <section id="destinations" className="py-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">时空相册</h2>
              <p className="text-gray-600 max-w-2xl">
                每一张照片都是记录美好生活
              </p>
            </div>

            <div className="flex flex-wrap gap-2 mt-6 md:mt-0">
              <button
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeCategory === "all"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
                onClick={() => setActiveCategory("all")}
              >
                全部
              </button>
              <button
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeCategory === "beach"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
                onClick={() => setActiveCategory("beach")}
              >
                海滩
              </button>
              <button
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeCategory === "culture"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
                onClick={() => setActiveCategory("culture")}
              >
                文化
              </button>
              <button
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeCategory === "nature"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
                onClick={() => setActiveCategory("nature")}
              >
                自然
              </button>
              <button
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeCategory === "city"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
                onClick={() => setActiveCategory("city")}
              >
                城市
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredDestinations.map((destination) => (
              <div
                key={destination.id}
                className="bg-white rounded-xl shadow-md overflow-hidden group hover:shadow-xl transition-shadow"
              >
                <div className="relative h-60 overflow-hidden">
                  <img
                    src={destination.image}
                    alt={destination.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 cursor-pointer"
                    onClick={() => openImageModal(destination)} // 点击图片打开模态框
                  />
                  <button className="absolute top-4 right-4 bg-white/80 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-colors">
                    <Heart className="h-5 w-5 text-gray-600" />
                  </button>
                  <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium">
                    <MapPin className="h-3 w-3 mr-1 inline" />
                    {destination.country}
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold">{destination.name}</h3>
                    <div className="flex items-center bg-blue-50 text-blue-600 px-2 py-1 rounded text-sm">
                      <Star className="h-3 w-3 mr-1 fill-current" />
                      <span>{destination.rating}</span>
                    </div>
                  </div>

                  <p className="text-gray-600 mb-4">
                    探索这个令人惊叹的目的地，体验独特的文化和美景
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Travel;
