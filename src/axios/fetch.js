import Vue from 'vue'
import API from './api'
import tool from './tool'
import router from '../router/index'

var fetch = {
  //退出登录
  loginOut(){
    Vue.prototype.post(API.logout)
    tool.removeLocalStorage('userInfo')
    router.push({ path: '/login' })
  },
}

Vue.prototype.$fetch = fetch;
