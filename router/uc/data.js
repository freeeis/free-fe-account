import {
  getSubAccounts, getSubAccount, getMyInfo, changePwd, changePhone,
} from './api';

import useAccountStore from '../../stores/module-account';

import { i18n } from '@/boot/i18n';
const {global:{t}} = i18n;

export default {
  resetPwd: () => ({
    StepsDefinition: [
      {
        Name: t('验证手机号'),
        Index: 1,
        Description: t('请验证'),
        Actions: [
          {
            Label: t('下一步'),
            Action: 'next',
          },
        ],
      },
      {
        Name: t('修改密码'),
        Index: 2,
        Description: t('请修改'),
        Actions: [
          {
            Label: t('保存'),
            Action: 'save',
          },
        ],
      },
    ],
    changePwd,
    Bus: useAccountStore(),
  }),
  resetPhone: () => ({
    StepsDefinition: [
      {
        Name: t('原手机号'),
        Index: 1,
        Description: t('请验证'),
        Actions: [
          {
            Label: t('下一步'),
            Action: 'next',
          },
        ],
      },
      {
        Name: t('新手机号'),
        Index: 2,
        Description: t('请验证'),
        Actions: [
          {
            Label: t('上一步'),
            Action: 'previous',
          },
          {
            Label: t('下一步'),
            Action: 'next',
          },
        ],
      },
      {
        Name: t('新密码'),
        Index: 3,
        Description: t('请设置'),
        Actions: [
          {
            Label: t('上一步'),
            Action: 'previous',
          },
          {
            Label: t('保存'),
            Action: 'save',
          },
        ],
      },
    ],
    changePhone,
    Bus: useAccountStore(),
  }),
  subList: (app) => (route) => ({
    GetData: (o) => getSubAccounts(o).then((d) => {
      const data = (d && d.data) ? d.data : {};
      if (data && data.total) {
        for (let i = 0; i < data.docs.length; i += 1) {
          const dc = data.docs[i];

          dc.index = (data.page - 1) * data.limit + i + 1;
        }
      }

      data.summary = [
        {
          text: t('子账号数'),
          number: data.total || '0',
          icon: app.config.countIcon || 'fas fa-calculator',
          relative: true,
        },
        {
          text: t('运行中'),
          number: data.summary.enabled || '0',
          icon: app.config.successIcon || 'fas fa-check-square',
          relative: true,
        },
        {
          text: t('已禁用'),
          number: data.summary.disabled || '0',
          icon: app.config.failIcon || 'fas fa-ban',
          relative: true,
        },
      ];

      // 添加按钮
      data.summary.push({
        text: t('添加'),
        button: true,
        route: `${route.fullPath}/new`,
      });

      return data;
    }),
    Bus: useAccountStore(),
  }),
  subDetails: (route) => ({
    GetData: () => {
      if (route.params.id === 'new') {
        return {
          Enabled: true,
        };
      }
      return getSubAccount(route.params.id).then((d) => {
        const data = (d && d.data) ? d.data : {};

        return data;
      });
    },
    buttonsVisible: (a) => {
      switch (a.Action) {
        case 'create':
          return route.params.id === 'new';
        case 'save':
        case 'enable':
        case 'disable':
        case 'remove':
          return route.params.id !== 'new';
        default:
          return false;
      }
    },
    StepsDefinition: [
      {
        Name: t('子账号信息'),
        Index: 1,
        Description: [{ Status: true, Description: t('已启用') }, { Status: false, Description: t('未启用') }],
        Actions: [
          {
            Label: t('创建'),
            Action: 'create',
          },
          // {
          //   Label: t('修改'),
          //   Action: 'edit',
          // },
          {
            Label: t('保存'),
            Action: 'save',
          },
          [
            {
              Label: t('启用'),
              Action: 'enable',
              Value: true,
            },
            {
              Label: t('禁用'),
              Action: 'enable',
              Value: false,
            },
          ],
          {
            Label: t('删除'),
            Action: 'remove',
          },
        ],
        Fields: [
          {
            Label: t('账号设置'),
            Type: 'Category',
          },
          {
            Type: 'String',
            Label: t('登录手机号'),
            Name: 'PhoneNumber',
            Index: 1,
          },
          {
            Type: 'Password',
            Label: t('登录密码'),
            Name: 'Password',
            Index: 2,
          },
          {
            Type: 'Password',
            Label: t('确认密码'),
            Name: 'pwdConfirm',
            Index: 3,
          },
          {
            Label: t('用户信息'),
            Type: 'Category',
            Index: 6,
          },
          {
            Type: 'String',
            Label: t('姓名'),
            Name: 'Profile.Name',
            Index: 7,
          },
          {
            Type: 'String',
            Label: t('邮箱'),
            Name: 'Profile.Email',
            Index: 8,
          },
          {
            Type: 'String',
            Label: t('职务'),
            Name: 'Profile.Title',
            Index: 9,
          },
          // {
          //   Label: t('权限设置'),
          //   Type: 'Category',
          //   Index: 10,
          // },
          // {
          //   Type: 'Permission',
          //   Name: 'Permission',
          //   ServiceList: '_service_list',
          //   Index: 11,
          // },
        ],
      },
    ],
    Bus: useAccountStore(),
  }),
  info: () => () => ({
    GetData: () => getMyInfo().then((d) => {
      const data = (d && d.data) ? d.data : {};

      data.Labels = data.Labels || [];

      // const AuditStatus = app.modules.passport.AccountAuditStatus;
      // switch (data.Status) {
      //   case AuditStatus.Passed:
      //   case AuditStatus.Failed:
      //   case AuditStatus.Auditing:
      //     data.CurrentStep = 2;
      //     break;
      //   default:
      //     data.CurrentStep = 1;
      //     break;
      // }

      return data;
    }),
    Bus: useAccountStore(),
  }),
};
