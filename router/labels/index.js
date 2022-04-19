import data from './data';

export default [{
  path: 'labels',
  component: () => import('../../view/labels/index.vue'),
  props: data.label,
}];
