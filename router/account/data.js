// import Vue from 'vue';
import { canI } from '@/utils/api';
import { getAccount, getOneAccount, createAccount } from './api';

// const bus = new Vue();

export default {
  list: (app) => (route) => ({
    GetData: (o) => getAccount(o).then((data) => {
      const d = (data && data.data) ? data.data : {};

      // add index
      if (d && d.total) {
        for (let i = 0; i < d.docs.length; i += 1) {
          const dc = d.docs[i];

          dc.index = (d.page - 1) * d.limit + i + 1;
        }
      }

      d.summary = [
        {
          text: '账号数',
          number: d.total || '0',
          icon: app.config.countIcon || 'fas fa-calculator',
          relative: true,
        },
        {
          text: '审核中',
          number: d.summary.auditing || '0',
          icon: app.config.ongoingIcon || 'fas fa-running',
          relative: true,
        },
        {
          text: '审核通过',
          number: d.summary.passed || '0',
          icon: app.config.successIcon || 'fas fa-check-square',
          relative: true,
        },
        {
          text: '审核不通过',
          number: d.summary.failed || '0',
          icon: app.config.failIcon || 'fas fa-ban',
          relative: true,
        },
      ];

      // 添加申报按钮
      canI('account/add').then((r) => {
        if (r) {
          d.summary.push({
            text: '添加',
            button: true,
            action: (item) => createAccount().then((newAccount) => {
              if (newAccount && newAccount.msg === 'OK') {
                const account = (newAccount && newAccount.data) ? newAccount.data : {};
                item.route = {
                  path: `${route.fullPath}/${account.id}`,
                };
              } else {
                bus.$MsgDialog(newAccount.msg);
              }
            }).catch((ex) => {
              bus.$MsgDialog(ex);
            }),
          });
        }
      });

      return d;
    }),
    // Bus: bus,
  }),
  details: (route) => ({
    GetData: () => getOneAccount(route.params.id).then((d) => {
      const data = (d && d.data) ? d.data : {};

      data.Labels = data.Labels || [];
      data.Password = '';

      data.CurrentStep = 1;

      return data;
    }),
    actionBtnVisible: () => true,
    // Bus: bus,
  }),
};
