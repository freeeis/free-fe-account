import Cookies from 'js-cookie';

export function SET_TOKEN (state, token) {
  state.token = token;
  Cookies.set('token', token);
}

export function SET_USER (state, u) {
  state.user = u;
  localStorage.setItem('user', JSON.stringify(u));
}
