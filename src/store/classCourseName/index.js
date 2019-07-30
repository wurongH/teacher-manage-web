const state = {
  name: '',
};
export default{
  state,
  mutations:{
    setClassCourseName(state, value) {
      state.name = value;
    },
  },
  actions:{
    setClassCourseName({ commit }, value) {
      commit('setClassCourseName', value)
    },
  },
}
