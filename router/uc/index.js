import data from './data';

export default (app) => [
  {
    path: 'resetpwd',
    component: () => import('../../view/uc/resetPwd.vue'),
    props: data.resetPwd,
  },
  {
    path: 'resetphone',
    component: () => import('../../view/uc/resetPhone.vue'),
    props: data.resetPhone,
  },
  {
    path: 'sub',
    component: () => import('../../view/uc/Layout.vue'),
    children: [
      {
        path: '',
        component: () => import('../../view/uc/subAccount.vue'),
        props: data.subList(app),
      },
      {
        path: ':id',
        component: () => import('../../view/uc/subDetails.vue'),
        props: data.subDetails,
      },
    ],
  },
  {
    path: 'info',
    component: () => import('../../view/uc/info.vue'),
    props: data.info(app),
  },
  {
    path: 'noty',
    name: 'notifications',
    component: () => import('../../view/uc/notifications.vue'),
  },
];
