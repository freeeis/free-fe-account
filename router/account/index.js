import data from './data';

export default (app) => ([
  {
    path: 'account',
    component: () => import('../../view/account/Layout.vue'),
    children: [
      {
        path: '',
        component: () => import('../../view/account/list.vue'),
        props: data.list(app),
      },
      {
        path: ':id',
        component: () => import('../../view/account/details.vue'),
        props: data.details,
      },
    ],
  },
]);
