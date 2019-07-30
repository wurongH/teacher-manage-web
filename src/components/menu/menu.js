export default [
  { title: '首页', icon: 'iconshouye', path: '/', child: [] },

  { title: '资源库', icon: 'iconshouye', path: '/resource', child: [] },

  {
    title: '课程',
    icon: 'iconkechengbiao',
    child: [
      { title: '我的课程', path: '/course', child: [] },
    ],
  },

  {
    title: '师资招募',
    icon: 'iconkechengbiao',
    child: [
      { title: '发起招募', path: '/recruit/sponsor', child: [] },
      { title: '资格审核', path: '/recruit/review', child: [] },
    ],
  },

  {
    title: '班级',
    icon: 'iconxuexiao_banji',
    child: [
      { title: '我的班级', path: '/schoolClass', child: [] },
    ],
  },

  { title: '联系我们', icon: 'iconlianxiwomen', path: '/contact', child: [] },
]
