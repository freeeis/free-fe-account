// import Vue from 'vue';
import { requests } from "boot/axios";

import enums from "./enum";
import utils from "./utils";
import useAccountStore from './stores/module-account';

import routers from "./router";

const encrypt = (d, k) => utils.encoder.desEncode(d, k);

export default (app) => {
  let k = app.config && app.config.account && app.config.account.desKey;
  k = k || "eis,is,s,2020";

  return {
    store: () => useAccountStore(),
    config: {
      dependencies: ['core-modules'],
      backendDependencies: ["account"],

      loginOnly: false,

      desKey: "",

      detailsStepsDefinition: [
        {
          Name: "账号信息",
          Index: 1,
          Description: [
            { Status: "1", Description: "已启用" },
            { Status: "-1", Description: "已禁用" },
            { Status: "0", Description: "已禁用" },
          ],
          Icon: "menu",
          Actions: [
            {
              Label: "保存",
              Action: "save",
            },
            // [
            //   {
            //     Label: '审核通过',
            //     Action: 'submit',
            //     Value: 1,
            //   },
            //   {
            //     Label: '审核中',
            //     Action: 'submit',
            //     Value: 0,
            //   },
            //   {
            //     Label: '审核不通过',
            //     Action: 'submit',
            //     Value: -1,
            //   },
            // ],
            [
              {
                Label: "启用",
                Action: "enable",
                Value: true,
              },
              {
                Label: "禁用",
                Action: "enable",
                Value: false,
              },
            ],
            {
              Label: "重置密码",
              Action: "resetpwd",
            },
          ],
          Fields: [
            {
              Type: "Category",
              Label: "账号设置",
            },
            {
              Type: "String",
              Label: "登陆手机号",
              Name: "PhoneNumber",
              Index: 1,
            },
            {
              Type: "String",
              Label: "登陆用户名",
              Name: "UserName",
              Index: 1,
            },
            {
              Type: "Password",
              Label: "登陆密码",
              Name: "Password",
              Index: 2,
            },
            {
              Type: "Category",
              Label: "账号信息",
            },
            {
              Type: "Search",
              Label: "所属组织机构",
              Index: 0,
              Name: "Org",
              Options: {
                SearchUrl: "account/org/search",
                SearchField: "id",
                SearchDisplayField: "Name",
                SearchColumns: [
                  {
                    Label: "#",
                    Name: "index",
                    style: "max-width: 80px;",
                  },
                  {
                    Label: "日期",
                    Name: "LastUpdateDate",
                    filters: "normalDate",
                  },
                  {
                    Label: "名称",
                    Name: "Name",
                    style: "max-width: 160px;",
                    classes: "ellipsis",
                  },
                ],
              },
            },
            {
              Type: "String",
              Label: "姓名",
              Name: "Profile.Name",
              Index: 1,
            },
            {
              Type: "String",
              Label: "昵称",
              Name: "Profile.NickName",
              Index: 2,
            },
            {
              Type: "String",
              Label: "邮箱",
              Name: "Profile.Email",
              Index: 3,
            },
            {
              Type: "String",
              Label: "职务",
              Name: "Profile.Title",
              Index: 4,
            },
            {
              Type: "Labels",
              Label: "权限标签",
              Name: "Labels",
              Index: 5,
            },
          ],
        },
      ],

      orgFields: [
        {
          Type: "Category",
          Label: "组织机构信息",
        },
        {
          Name: "Name",
          Label: "名称",
          Type: "String",
          Required: true,
        },
        {
          Name: "Index",
          Label: "序号",
          Type: "Number",
        },
        {
          Name: "IsVirtual",
          Label: "虚拟组织",
          Type: "Check",
        },
        {
          Type: "Category",
          Label: "权限配置",
        },
        {
          Name: "Permission",
          Label: "权限",
          Type: "Permission",
          ServiceList: "_service_list",
          NoDataScope: true,
        },
      ],

      labelFields: [
        {
          Type: "Category",
          Label: "角色信息",
        },
        {
          Name: "Index",
          Label: "序号",
          Type: "Number",
        },
        {
          Name: "Name",
          Label: "名称",
          Type: "String",
        },
        {
          Name: 'Description',
          Label: '说明',
          Type: 'Text',
        },
        {
          Name: "Enabled",
          Label: "激活",
          Type: "Check",
        },
        {
          Name: 'Negative',
          Label: '负角色',
          Type: 'Check',
        },
        {
          Type: "Category",
          Label: "权限配置",
        },
        {
          Name: "Permission",
          Label: "权限",
          Type: "Permission",
          ServiceList: "_service_list",
        },
      ],
    },
    utils: {
      func1: {
        n: "",
        l: "function1",
        d: "",
        p: ["第一个参数说明", "第二个参数说明"],
        f: (u, p) =>
          requests.postRequest("/login", {
            ...opts,
            username: encrypt(u, k),
            password: encrypt(p, k),
          }),
      },
      encryptPwd: (d) => encrypt(d, k),
      login: (u, p, opts) =>
        requests.postRequest("/login", {
          ...opts,
          username: encrypt(u, k),
          password: encrypt(p, k),
        }),
      logout: () => requests.postRequest("/logout"),
      register: (p, c, pwd, opts) =>
        requests.postRequest("/register", {
          ...opts,
          PhoneNumber: encrypt(p, k),
          code: c,
          Password: pwd,
        }),
      recover: (p, c, pwd, opts) =>
        requests.postRequest("/recover", {
          ...opts,
          PhoneNumber: encrypt(p, k),
          code: c,
          Password: pwd,
        }),
      sendCode: (p, t, e) =>
        requests.postRequest("/register/sms", { PhoneNumber: encrypt(p, k), smsTemp: t, exists: e }),
      verifyCode: (p, c) =>
        requests.postRequest("/register/verify", {
          PhoneNumber: encrypt(p, k),
          code: c,
        }),
      phoneUsed: (p) =>
        requests.postRequest("/register/verify/phone", {
          PhoneNumber: encrypt(p, k),
        }),
      isLogedin: () =>
        requests
          .postRequest("/logedin")
          .then((d) => {
            if (d && d.msg === "OK") {
              return true;
            } else if (typeof d === "undefined") {
              return undefined;
            }
            return false;
          })
          .catch(() => {
            return false;
          }),
    },
    ...enums,
    routers,
    filters: {
      arrayString: (a) => {
        if (Array.isArray(a)) {
          return a.join(",");
        }
        return a;
      },
    },
  };
};
