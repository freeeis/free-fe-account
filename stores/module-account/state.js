import Cookies from 'js-cookie';

export default () => ({
  token: Cookies.get('token'),
  user: JSON.parse(localStorage.getItem('user')),

  phone: '',
  phoneCode: '',
  codeVerified: false,
  newPhone: '',
  newPhoneCode: '',
  newCodeVerified: false,
});
