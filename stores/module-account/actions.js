import Cookies from 'js-cookie';

export default {
  clearLoginStatus() {
    this.SET_TOKEN();
    this.SET_USER();

  },
  SET_TOKEN(token) {
    this.token = token || '';
    Cookies.set('token', token || '');
  },

  SET_USER(u) {
    this.user = u || {};
    localStorage.setItem('user', JSON.stringify(u || {}));
  }
}
