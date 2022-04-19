export function clearLoginStatus ({ commit }) {
  commit('SET_USER', {});
  commit('SET_TOKEN', '');
}
