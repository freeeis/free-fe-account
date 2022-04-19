import data from './data';

export default [{
  path: 'perm',
  component: () => import('../../view/perm/index.vue'),
  props: data.perm,
}];
