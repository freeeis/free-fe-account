import {
  getSubAccounts, getSubAccount, getMyInfo, changePwd, changePhone,
} from './api';

import useAccountStore from '../../stores/module-account';

export default {
  resetPwd: () => ({
    StepsDefinition: [
      {
        Name: '验证手机号',
        Index: 1,
        Description: '请验证',
        Actions: [
          {
            Label: '下一步',
            Action: 'next',
          },
        ],
      },
      {
        Name: '修改密码',
        Index: 2,
        Description: '请修改',
        Actions: [
          {
            Label: '保存',
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
        Name: '原手机号',
        Index: 1,
        Description: '请验证',
        Actions: [
          {
            Label: '下一步',
            Action: 'next',
          },
        ],
      },
      {
        Name: '新手机号',
        Index: 2,
        Description: '请验证',
        Actions: [
          {
            Label: '上一步',
            Action: 'previous',
          },
          {
            Label: '下一步',
            Action: 'next',
          },
        ],
      },
      {
        Name: '新密码',
        Index: 3,
        Description: '请设置',
        Actions: [
          {
            Label: '上一步',
            Action: 'previous',
          },
          {
            Label: '保存',
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
          text: '子账号数',
          number: data.total || '0',
          icon: app.config.countIcon || 'fas fa-calculator',
          relative: true,
        },
        {
          text: '运行中',
          number: data.summary.enabled || '0',
          icon: app.config.successIcon || 'fas fa-check-square',
          relative: true,
        },
        {
          text: '已禁用',
          number: data.summary.disabled || '0',
          icon: app.config.failIcon || 'fas fa-ban',
          relative: true,
        },
      ];

      // 添加按钮
      data.summary.push({
        text: '添加',
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
        Name: '子账号信息',
        Index: 1,
        Description: [{ Status: true, Description: '已启用' }, { Status: false, Description: '未启用' }],
        Actions: [
          {
            Label: '创建',
            Action: 'create',
          },
          // {
          //   Label: '修改',
          //   Action: 'edit',
          // },
          {
            Label: '保存',
            Action: 'save',
          },
          [
            {
              Label: '启用',
              Action: 'enable',
              Value: true,
            },
            {
              Label: '禁用',
              Action: 'enable',
              Value: false,
            },
          ],
          {
            Label: '删除',
            Action: 'remove',
          },
        ],
        Fields: [
          {
            Label: '账号设置',
            Type: 'Category',
          },
          {
            Type: 'String',
            Label: '登录手机号',
            Name: 'PhoneNumber',
            Index: 1,
          },
          {
            Type: 'Password',
            Label: '登录密码',
            Name: 'Password',
            Index: 2,
          },
          {
            Type: 'Password',
            Label: '确认密码',
            Name: 'pwdConfirm',
            Index: 3,
          },
          {
            Label: '用户信息',
            Type: 'Category',
            Index: 6,
          },
          {
            Type: 'String',
            Label: '姓名',
            Name: 'Profile.Name',
            Index: 7,
          },
          {
            Type: 'String',
            Label: '邮箱',
            Name: 'Profile.Email',
            Index: 8,
          },
          {
            Type: 'String',
            Label: '职务',
            Name: 'Profile.Title',
            Index: 9,
          },
          // {
          //   Label: '权限设置',
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
