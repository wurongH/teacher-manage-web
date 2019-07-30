import Vue from 'vue'
import Router from 'vue-router'
import store from '../store';
import nprogress from 'nprogress'
import 'nprogress/nprogress.css'
import breadcrumb from './breadcrumb.js'

//二级跳转通用视图
const routerView = resolve => require(['components/router-view'], resolve),

//框架首页
Index = resolve => require(['../pages'], resolve),
//登入
Login = resolve => require(['pages/user/login'], resolve),
//注册
Register = resolve => require(['pages/user/register'], resolve),
//绑定手机号
BindPhone = resolve => require(['pages/user/bindphone'], resolve),
//修改密码
UpdataPwd = resolve => require(['pages/user/updatapwd'], resolve),
//个人信息
UserInfo = resolve => require(['pages/user/info'], resolve),
//首页
Home = resolve => require(['pages/home'], resolve),

/* 资源库 */
ResourceList = resolve => require(['pages/resource'], resolve),

/* 师资招募 */
//发起招募
RecruitReview = resolve => require(['pages/recruit/review'], resolve),
//资格审核
RecruitSponsor = resolve => require(['pages/recruit/sponsor'], resolve),

/* 课程模块 */
//课程列表
CourseList = resolve => require(['pages/course'], resolve),
//课程详情
CourseDetails = resolve => require(['pages/course/details'], resolve),
//章节详情
ChapterDetails = resolve => require(['pages/course/chapterDetails'], resolve),
//课程学生详情
CourseStudentDetails = resolve => require(['pages/course/studentDetails'], resolve),

/* 班级模块 */
//班级列表
SchoolClassList = resolve => require(['pages/schoolClass'], resolve),
//班级详情
SchoolClassDetails = resolve => require(['pages/schoolClass/details'], resolve),
//班级学生详情
ClassStudentDetails = resolve => require(['pages/schoolClass/studentDetails'], resolve),

//联系我们
Contact = resolve => require(['pages/contact'], resolve),
//自定义菜单
CustomMenu = resolve => require(['pages/customMenu'], resolve),
//401
Page401 = resolve => require(['pages/errorPage/401.vue'], resolve),
//404
Page404 = resolve => require(['pages/errorPage/404.vue'], resolve);

Vue.use(Router)

const router = new Router({
  routes: [
    //登录
    { path: '/login', name: 'login', component: Login, meta: { requireAuth: false, title: '登录' } },
    //注册
    { path: '/register', name: 'register', component: Register, meta: { requireAuth: false, title: '注册' } },
    //绑定手机号
    { path: '/bindphone', name: 'bindphone', component: BindPhone, meta: { requireAuth: false, title: '绑定手机号' } },
    //修改密码
    { path: '/updatapwd', name: 'updatapwd', component: UpdataPwd, meta: { requireAuth: false, title: '修改密码' } },
    {
      //首页框架
      path: '/', component: Index,
      children: [
        { path: '/', name: 'home', component: Home, meta: { requireAuth: true, activeIndex: '/', title: '首页' } },

        //师资招募
        {
          path: 'recruit', component: routerView,
          children: [
            { path: 'sponsor', name: 'recruit-sponsor', component: RecruitReview, meta: { requireAuth: true, activeIndex: '/resourceList', title: '发起招募' } },
            { path: 'review', name: 'recruit-review', component: RecruitSponsor, meta: { requireAuth: true, activeIndex: '/resourceList', title: '资格审核' } },
          ]
        },

        //资源库
        {
          path: 'resource', component: routerView,
          children: [
            { path: '/', name: 'resourceList', component: ResourceList, meta: { requireAuth: true, activeIndex: '/resourceList', title: '资源库' } },
          //   { path: 'details/:id', name: 'courseDetails', component: CourseDetails, meta: { requireAuth: true, title: '课程详情', breadcrumb: breadcrumb.courseDetails } },
          //   { path: 'chapterDetails/:id/:courseid', name: 'chapterDetails', component: ChapterDetails, meta: { requireAuth: true, title: '章节详情', breadcrumb: breadcrumb.chapterDetails } },
          //   { path: 'studentDetails/:id', name: 'courseStudentDetails', component: CourseStudentDetails, meta: { requireAuth: true, title: '学生详情', breadcrumb: breadcrumb.courseStudentDetails } },
          ]
        },

        //课程模块
        {
          path: 'course', component: routerView,
          children: [
            { path: '/', name: 'courseList', component: CourseList, meta: { requireAuth: true, activeIndex: '/course', title: '我的课程' } },
            { path: 'details/:id', name: 'courseDetails', component: CourseDetails, meta: { requireAuth: true, title: '课程详情', breadcrumb: breadcrumb.courseDetails } },
            { path: 'chapterDetails/:id/:courseid', name: 'chapterDetails', component: ChapterDetails, meta: { requireAuth: true, title: '章节详情', breadcrumb: breadcrumb.chapterDetails } },
            { path: 'studentDetails/:id', name: 'courseStudentDetails', component: CourseStudentDetails, meta: { requireAuth: true, title: '学生详情', breadcrumb: breadcrumb.courseStudentDetails } },
          ]
        },
        //班级模块
        {
          path: 'schoolClass', component: routerView,
          children: [
            { path: '/', name: 'schoolClassList', component: SchoolClassList, meta: { requireAuth: true, activeIndex: '/schoolClass', title: '我的班级' } },
            { path: 'details/:id', name: 'schoolClassDetails', component: SchoolClassDetails, meta: { requireAuth: true, title: '班级详情', breadcrumb: breadcrumb.schoolClassDetails } },
            { path: 'studentDetails/:id', name: 'classStudentDetails', component: ClassStudentDetails, meta: { requireAuth: true, title: '学生详情', breadcrumb: breadcrumb.classStudentDetails } },
          ]
        },

        { path: 'contact', name: 'contact', component: Contact, meta: { requireAuth: true, activeIndex: '/contact', title: '联系我们' } },
        { path: 'userInfo', name: 'userInfo', component: UserInfo, meta: { requireAuth: true, activeIndex: '/userInfo', title: '个人资料' } },
        { path: 'customMenu', name: 'customMenu', component: CustomMenu, meta: { requireAuth: true, activeIndex: '/customMenu', title: '自定义菜单' } },
        { path: '401', name: 'page401', component: Page401, meta: { requireAuth: true, activeIndex: '', title: '401' } },
        { path: '404', name: 'page404', component: Page404, meta: { requireAuth: true, activeIndex: '', title: '404' } },
      ]
    },
  ]
})
router.beforeEach((to, from, next) => {
  // nprogress.start();
  store.dispatch('setActiveRouter', {
    activeIndex: to.meta.activeIndex,
    breadcrumbArr: to.meta.breadcrumb ? to.meta.breadcrumb : [{ text: to.meta.title, path: false }]
  })
  if(!to.name){
    next({ name: 'page404' });
    return;
  }
  var user_info = Vue.prototype.$common.getLocalStorage('userInfo');
  if(to.name == 'login' && user_info){
    next({ name: 'manage' });
    return;
  }
  if(to.meta.requireAuth){
    if(user_info){
      next()
    }else{
      nprogress.done();
      next({ name: 'login' });
    }
  }else
    next();
})

router.afterEach(function (to) {
  nprogress.done();
})




export default router;
