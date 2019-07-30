const state = {
  data: {
    headIcon: '',
    userName: ''
  },
};
export default{
  state,
  mutations:{
    setUserInfo(state, obj) {
      state.data = { ...obj };
    },
  },
  actions:{
    setUserInfo({ commit }, obj) {
      commit('setUserInfo', obj)
    },
  },
}
