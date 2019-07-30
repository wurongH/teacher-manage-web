const state = {
  //菜单默认选择路由
  activeMenu: {
    activeIndex: '',
    breadcrumbArr: []
  },
};
export default{
  state,
  mutations:{
    setActiveRouter(state, obj) {
      state.activeMenu = { ...obj };
    },
  },
  actions:{
    setActiveRouter({ commit }, obj) {
      commit('setActiveRouter', obj)
    },
  },
}
