import {
  getPerm,
  createPerm, updatePerm, deletePerm,
} from './api';

import { i18n } from '@/boot/i18n';
const {global:{t}} = i18n;

export default {
  perm: () => ({
    GetData: (p, l) => getPerm(p).then((d) => {
      const data = (d && d.data) ? d.data : {};
      const currentLevel = l ? l + 1 : 1;
      if (data.total) {
        data.docs.forEach((o) => {
          o.lazy = true;
          o.level = currentLevel;
        });
      }

      // add the extra node for each level
      data.docs = data.docs || [];
      data.docs.push({
        addingNew: true,
        id: `label_${currentLevel}_new`,
        Title: t(`${currentLevel}级`),
        level: currentLevel,
        Parent: p,
        Index: Infinity,
      });

      data.docs = data.docs.sort(
        (a, b) => (a ? a.Index : 0) - (b ? b.Index : 0),
      );

      data.total += 1;

      return data;
    }),
    addPerm: (d) => createPerm(d),
    editPerm: (d) => updatePerm(d),
    deletePerm: (d) => deletePerm(d),
    // Bus: bus,
  }),
};
