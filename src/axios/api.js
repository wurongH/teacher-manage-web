import Vue from 'vue'
var api = {
  /* 发送验证码 */
  sendVerifyCode: '/message-boot/message/sms/sendVerifyCode',

  /* 初步验证短信验证码 */
  preliminarySubmitVerifyCode: '/message-boot/message/sms/preliminarySubmitVerifyCode',

  /* 绑定手机号 */
  bindPhone: '/oauth-boot/oauth/bindPhone',

  /* 找回密码 */
  findPwd: '/oauth-boot/oauth/findPwd',

  /* 用户注册 */
  register: '/oauth-boot/oauth/register',

  /* 用户登录 */
  login: '/oauth-boot/oauth/login',

  /* 用户注销 */
  logout: '/oauth-boot/oauth/logout',

  /* 获取子菜单列表 */
  listSubMenu: '/basics-boot/menu/treeMenu',

  /* 文件上传 */
  upload: '/fastdfs-boot/upload',

  /* 获取OSS签名 */
  getOssSign: '/basics-boot/oss/getSign',

  /* 用户 */
  user: {
    //获取教师个人信息
    getTeacherInfo: '/basics-boot/info/getTeacherInfo',
    //教师修改个人信息
    modifyTeacherInfo: '/basics-boot/info/modifyTeacherInfo',
    //教师获取学生信息
    getStudentInfo: '/basics-boot/info/teacherGetStudentInfo',
    //学生修改个人信息
    modifyStudentInfo: '/basics-boot/info/modifyStudentInfo'
  },

  /* 师资招募 */
  recruit: {
    
  },

  /* 课程 */
  course: {
    //（教师）获取我的课程列表
    listTcMyCourses: '/classroom-boot/courseInfo/listTcMyCourses',
    //教师创建班级时下拉框获取课程列表
    coursesList: '/classroom-boot/classInfo/coursesList',
    //创建课程
    createCourses: '/classroom-boot/courseInfo/createCourses',
    //教师删除课程
    deleteCoursesInfo: '/classroom-boot/courseInfo/deleteCoursesInfo',
    //修改课程信息
    modifyCoursesInfo: '/classroom-boot/courseInfo/modifyCoursesInfo',
    //查询该班级所有关联的课程，未关联的课程
    listClassCourses: '/classroom-boot/classInfo/listClassCourses',
    //批量关联课程
    relateCourses: '/classroom-boot/classInfo/relateCourses',
    //获取章节列表
    listCoursesChapters: '/classroom-boot/chapterInfo/listCoursesChapters',
    //分页获取章节列表
    pageCoursesChapters: '/classroom-boot/chapterInfo/pageCoursesChapters',
    //新建章节
    createChapter: '/classroom-boot/chapterInfo/createChapter',
    //删除章节
    deleteChapterInfo: '/classroom-boot/chapterInfo/deleteChapterInfo',
    //修改章节信息
    modifyChapterInfo: '/classroom-boot/chapterInfo/modifyChapterInfo',
    //查看课程详细信息
    getCoursesInfo: '/classroom-boot/courseInfo/getCoursesInfo',
    //分页获取课程学生
    pageCoursesStudent: '/classroom-boot/courseInfo/pageCoursesStudent',
    //查看章节信息
    getChapterInfo: '/classroom-boot/chapterInfo/getChapterInfo',
    //上个课程下个课程
    preOrNextCourses: '/classroom-boot/courseInfo/preOrNextCourses',
    //上个章节下个章节
    preOrNextChapter: '/classroom-boot/chapterInfo/preOrNextChapter',
    //修改章节排序，chapterArray只传排好的Id
    updateChapterSortById: '/classroom-boot/chapterInfo/updateChapterSortById',
    //删除课程学生
    deleteCoursesStudent: '/classroom-boot/courseInfo/deleteCoursesStudent'
  },

  /* 班级 */
  schoolClass: {
    //获取班级列表
    listTcMyClass: '/classroom-boot/classInfo/listTcMyClass',
    //（教师）获取关联的班级列表
    listCoursesClass: '/classroom-boot/courseInfo/listCoursesClass',
    //教师创建班级
    createClass: '/classroom-boot/classInfo/createClass',
    //教师删除班级信息
    deleteClassInfo: '/classroom-boot/classInfo/deleteClassInfo',
    //分页获取班级学生
    pageClassStudent: '/classroom-boot/classInfo/pageClassStudent',
    //获取班级详情
    getClassInfo: '/classroom-boot/classInfo/getClassInfo',
    //修改班级信息
    modifyClassInfo: '/classroom-boot/classInfo/modifyClassInfo',

    //上一个班级下一个班级
    preOrNextClass: '/classroom-boot/classInfo/preOrNextClass',
    //删除班级学生
    deleteClassStudent: '/classroom-boot/classInfo/deleteClassStudent',
    //批量关联班级
    relateClass: '/classroom-boot/courseInfo/relateClass',
    //批量添加课程学生到班级
    addClassStudentByChecked: '/classroom-boot/classInfo/addClassStudentByChecked'
  }
}
Vue.prototype.$api = api;

export default api;
