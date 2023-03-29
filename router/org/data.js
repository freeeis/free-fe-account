import {
  getOrgs,
  createOrg, updateOrg, deleteOrg,
} from './api';

const CHINA_NUMBERS = ' 一二三四五六七八九十';

export default {
  org: () => ({
    GetData: (p, l) => getOrgs(p).then((d) => {
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
        Name: `${CHINA_NUMBERS[currentLevel] || currentLevel}级`,
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
    addOrg: (d) => createOrg(d),
    editOrg: (d) => updateOrg(d),
    deleteOrg: (d) => deleteOrg(d),
  }),
};
