/*
 * @Description:
 * @Author: zhiquan <x.zhiquan@gmail.com>
 * @Date: 2022-04-19 11:36:25
 * @LastEditTime: 2023-03-21 18:31:38
 * @LastEditors: zhiquan
 */

import { ref } from 'vue';
import { requests } from '@/boot/axios';
import { getAccount, getOneAccount, createAccount } from './api';

import { i18n } from '@/boot/i18n';
const {global:{t}} = i18n;

export default {
  list: (app) => (route) => ({
    GetData: (o) => getAccount(o).then((data) => {
      const d = ref((data && data.data) ? data.data : {});

      // add index
      if (d.value && d.value.total) {
        for (let i = 0; i < d.value.docs.length; i += 1) {
          const dc = d.value.docs[i];

          dc.index = (d.value.page - 1) * d.value.limit + i + 1;
        }
      }

      d.value.summary = d.value.summary || {};
      d.value.summary = (typeof d.value.summary.auditing === 'undefined') ? [
        {
          text: '账号数',
          number: d.value.total || '0',
          icon: app.config.countIcon || 'fas fa-calculator',
          relative: true,
        },
        {
          text: '已启用',
          number: d.value.summary.passed || '0',
          icon: app.config.successIcon || 'fas fa-check-square',
          relative: true,
        },
        {
          text: '已禁用',
          number: d.value.summary.failed || '0',
          icon: app.config.failIcon || 'fas fa-ban',
          relative: true,
        },
      ] : [
        {
          text: t('账号数'),
          number: d.value.total || '0',
          icon: app.config.countIcon || 'fas fa-calculator',
          relative: true,
        },
        {
          text: t('审核中'),
          number: d.value.summary.auditing || '0',
          icon: app.config.ongoingIcon || 'fas fa-running',
          relative: true,
        },
        {
          text: t('审核通过'),
          number: d.value.summary.passed || '0',
          icon: app.config.successIcon || 'fas fa-check-square',
          relative: true,
        },
        {
          text: t('审核不通过'),
          number: d.value.summary.failed || '0',
          icon: app.config.failIcon || 'fas fa-ban',
          relative: true,
        },
      ];

      // 添加申报按钮
      requests.canI('account/mgmt/add').then((r) => {
        if (r) {
          d.value.summary.push({
            text: t('添加'),
            button: true,
            action: (item) => createAccount().then((newAccount) => {
              if (newAccount && newAccount.msg === 'OK') {
                const account = (newAccount && newAccount.data) ? newAccount.data : {};
                item.route = {
                  path: `${route.fullPath}/${account.id}`,
                };
              } else {
                // bus.$MsgDialog(newAccount.msg);
              }
            }).catch(() => {
              // bus.$MsgDialog(ex);
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
