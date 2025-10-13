// 作者信息
export const author = {
  id: 1,
  name: "冯行",
  title: "前端开发工程师 | 游戏爱好者 | 社交达人",
  bio: "探索生活的本质，分享关于极简主义、个人成长和可持续生活的思考与实践。",
  avatar: "/imgs/avatar.jpg",
  socialLinks: [
    { icon: "fa fa-twitter", url: "#" },
    { icon: "fa fa-instagram", url: "#" },
    { icon: "fa fa-linkedin", url: "#" },
    { icon: "fa fa-github", url: "#" }
  ]
};

// 分类数据
export const categories = [
  { id: 1, name: "生活方式", count: 12 },
  { id: 2, name: "个人成长", count: 9 },
  { id: 3, name: "阅读", count: 15 },
  { id: 4, name: "职场", count: 7 },
  { id: 5, name: "健康", count: 8 }
];

// 特色文章
export const featuredPost = {
  id: 1,
  title: "如何在数字时代保持专注力和创造力",
  excerpt: "探索在信息爆炸的时代，如何培养深度工作能力，抵抗分心，保持创造性思维的实用方法。",
  category: "生活方式",
  date: "2023年6月15日",
  readTime: "8分钟阅读",
  image: "/imgs/featured.jpg",
  author: author,
  likes: 245,
  tags: ["专注力", "创造力", "数字时代", "深度工作"],
  comments: [
    {
      id: 1,
      authorName: "张华",
      authorAvatar: "/imgs/comment1.jpg",
      date: "2023年6月16日",
      content: "非常有见地的文章！我一直在为分心问题困扰，这些方法很实用。",
      likes: 12
    },
    {
      id: 2,
      authorName: "李娜",
      authorAvatar: "/imgs/comment2.jpg",
      date: "2023年6月17日",
      content: "深度工作的理念真的改变了我的工作方式，感谢分享！",
      likes: 8
    }
  ],
  content: [
    {
      type: "paragraph",
      content: "在当今这个信息爆炸的时代，我们每天都被无数的通知、消息和干扰所包围。这种持续的分心不仅影响我们的工作效率，还会削弱我们的创造力和深度思考能力。"
    },
    {
      type: "heading",
      content: "分心的代价"
    },
    {
      type: "paragraph",
      content: "研究表明，当我们被打断后，平均需要23分钟才能重新专注于原来的任务。这意味着频繁的干扰会严重影响我们的工作效率和质量。更重要的是，分心会阻止我们进入深度工作状态，而这种状态正是创造力和高质量思考的源泉。"
    },
    {
      type: "heading",
      content: "培养深度工作的能力"
    },
    {
      type: "subheading",
      content: "1. 设定无干扰时段"
    },
    {
      type: "paragraph",
      content: "每天安排固定的无干扰时段，在这段时间内关闭所有通知，远离社交媒体和电子邮件。开始时可以从每天30分钟开始，逐渐延长到2-3小时。这段时间应该用于最重要、需要深度思考的工作。"
    },
    {
      type: "subheading",
      content: "2. 创造适合专注的环境"
    },
    {
      type: "paragraph",
      content: "你的工作环境应该支持而不是阻碍专注。这可能意味着找到一个安静的空间，使用噪音消除耳机，或者使用专注应用来屏蔽干扰。保持工作区域整洁也有助于减少视觉干扰。"
    },
    {
      type: "subheading",
      content: "3. 采用时间块工作法"
    },
    {
      type: "paragraph",
      content: "时间块工作法是指将一天划分为多个时间段，每个时间段专注于特定的任务或活动。这种方法可以帮助你避免任务切换带来的效率损失，并确保你有足够的时间深入处理重要工作。"
    },
    {
      type: "heading",
      content: "保持创造力的策略"
    },
    {
      type: "paragraph",
      content: "专注力和创造力是相辅相成的。以下策略可以帮助你在保持专注的同时，也能培养和维持创造力："
    },
    {
      type: "list",
      items: [
        "定期进行无目的的散步，研究表明步行可以提高创造性思维",
        "保持阅读习惯，尤其是跨领域的书籍",
        "实践冥想，提高对思维的控制力和觉察力",
        '安排"创意时间"，专门用于探索新想法和可能性',
        "保持好奇心，对新事物保持开放的态度"
      ]
    },
    {
      type: "heading",
      content: "结论"
    },
    {
      type: "paragraph",
      content: "在数字时代保持专注力和创造力并非易事，但通过有意识的练习和适当的策略，我们可以培养这些重要能力。这不仅能提高我们的工作效率和质量，还能让我们在工作和生活中找到更多的意义和满足感。"
    }
  ]
};

// 热门文章
export const popularPosts = [
  {
    id: 6,
    title: "如何建立健康的数字习惯，减少屏幕时间",
    date: "2023年3月10日",
    image: "/imgs/popular1.jpg"
  },
  {
    id: 7,
    title: "冥想入门：每天10分钟的平静练习",
    date: "2023年2月25日",
    image: "/imgs/popular2.jpg"
  },
  {
    id: 8,
    title: "一年阅读100本书的实用方法",
    date: "2023年1月18日",
    image: "/imgs/popular3.jpg"
  },
  {
    id: 9,
    title: "建立自信的5个日常练习",
    date: "2022年12月5日",
    image: "/imgs/popular4.jpg"
  }
];

// 文章列表数据
export const postsData = [
  featuredPost,
  {
    id: 2,
    title: "极简主义：给生活做减法的艺术",
    excerpt: "极简主义不只是扔掉东西，更是一种思考方式。本文分享如何通过减少物质依赖，找到生活的真正意义和价值。",
    category: "生活方式",
    date: "2023年5月28日",
    readTime: "6分钟阅读",
    image: "/imgs/post2.jpg",
    author: author,
    likes: 189,
    tags: ["极简主义", "生活方式", "简约", "心理健康"],
    comments: [
      {
        id: 1,
        authorName: "王强",
        authorAvatar: "/imgs/comment3.jpg",
        date: "2023年5月29日",
        content: "一直在尝试极简生活，这篇文章给了我很多新的启发，谢谢分享！",
        likes: 5
      }
    ],
    content: [
      {
        type: "paragraph",
        content: '极简主义近年来越来越受欢迎，但很多人对它的理解还停留在"扔掉东西"的层面。事实上，极简主义远不止于此，它是一种生活哲学和思考方式，旨在通过减少物质干扰，让我们更专注于真正重要的事物。'
      },
      {
        type: "heading",
        content: "什么是真正的极简主义"
      },
      {
        type: "paragraph",
        content: "极简主义不是要我们过苦行僧式的生活，也不是追求拥有尽可能少的物品。相反，它是关于有意识地选择我们所拥有的和所做的，只保留那些真正有价值、能给我们带来快乐和满足感的事物和活动。"
      }
    ]
  },
  {
    id: 3,
    title: "改变人生的5个晨间习惯",
    excerpt: "早晨的时间如何度过，往往决定了一整天的状态。这5个简单却有效的晨间习惯，能帮助你提升效率和幸福感。",
    category: "健康",
    date: "2023年5月15日",
    readTime: "5分钟阅读",
    image: "/imgs/post3.jpg",
    author: {
      id: 2,
      name: "张雨晴",
      title: "健康生活教练",
      bio: "专注于健康生活方式的研究和实践，帮助人们通过简单的习惯改变提升生活质量。",
      avatar: "/imgs/author2.jpg",
      socialLinks: [
        { icon: "fa fa-twitter", url: "#" },
        { icon: "fa fa-instagram", url: "#" }
      ]
    },
    likes: 217,
    tags: ["晨间习惯", "健康", " productivity", "幸福"],
    comments: [],
    content: []
  },
  {
    id: 4,
    title: "远程工作效率指南：如何在家高效工作",
    excerpt: "远程工作已成为新常态，但很多人仍在适应。本文分享提升远程工作效率的实用技巧，帮助你平衡工作与生活。",
    category: "职场",
    date: "2023年5月2日",
    readTime: "7分钟阅读",
    image: "/imgs/post4.jpg",
    author: {
      id: 3,
      name: "达美",
      title: "远程工作顾问",
      bio: "拥有10年远程工作经验，帮助企业和个人建立高效的远程工作模式。",
      avatar: "/imgs/author3.jpg",
      socialLinks: [
        { icon: "fa fa-twitter", url: "#" },
        { icon: "fa fa-linkedin", url: "#" }
      ]
    },
    likes: 156,
    tags: ["远程工作", "效率", "职场", "工作生活平衡"],
    comments: [],
    content: []
  },
  {
    id: 5,
    title: "2023年必读书单：改变思维的5本书",
    excerpt: "这五本书涵盖了心理学、哲学和个人成长等领域，每一本都有可能彻底改变你看待世界和自身的方式。",
    category: "阅读",
    date: "2023年4月20日",
    readTime: "9分钟阅读",
    image: "/imgs/post5.jpg",
    author: author,
    likes: 289,
    tags: ["阅读", "书单", "个人成长", "思维"],
    comments: [],
    content: []
  }
];