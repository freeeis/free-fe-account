import {
  getLabels,
  createLabel, updateLabel, deleteLabel,
} from './api';

import { i18n } from '@/boot/i18n';
const {global:{t}} = i18n;

export default {
  label: () => ({
    GetData: () => getLabels().then((d) => {
      const data = (d && d.data) ? d.data : {};

      // add the extra node for each level
      data.docs = data.docs || [];

      data.docs.push({
        addingNew: true,
        id: 'addingNew',
        Name: t('添加'),
        Index: Infinity,
      });

      data.docs = data.docs.sort(
        (a, b) => (a ? a.Index : 0) - (b ? b.Index : 0),
      );

      data.total = data.total || 0;
      data.total += 1;

      return data;
    }),
    addLabel: (d) => createLabel(d),
    editLabel: (d) => updateLabel(d),
    deleteLabel: (d) => deleteLabel(d),
  }),
};
