export default (app) => {
  let ret = [
    {
      path: 'login',
      component: () => import('../../view/entry/login.vue'),
    }
  ];

  if (!app.config['account']?.loginOnly) {
    ret = ret.concat([
      {
        path: 'register',
        component: () => import('../../view/entry/register.vue'),
      },
      {
        path: 'recover',
        component: () => import('../../view/entry/recover.vue'),
      }
    ])
  }
  return ret;
};
