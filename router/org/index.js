import data from './data';

export default [{
  path: 'org',
  component: () => import('../../view/org/index.vue'),
  props: data.org,
}];
