import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'

import menu from './menu'
import classCourseName from './classCourseName'
import userInfo from './userInfo'
Vue.use(Vuex);

export default new Vuex.Store({
  plugins: [createPersistedState()],
  modules: {
    menu,
    classCourseName,
    userInfo
  }
})
