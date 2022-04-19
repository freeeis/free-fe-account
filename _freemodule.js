export default {
  type: "module",
  routes: [
    {
      path: "account",
      page: {
        default: "layout",
      },
      children: [
        {
          path: "",
          name: "account_list",
          page: {
            default: "account_list",
          },
        },
        {
          name: "account_details",
          path: ":id",
          props: {
            default: {
              id: "{{id}}",
            },
          },
          page: {
            default: "account_details",
          },
        },
      ],
    },
  ],
  pages: [
    {
      name: "layout",
      elements: [
        {
          name: "default",
          tag: "router",
        },
      ],
    },
    {
      name: "account_list",
      params: {
        accounts: {},
        loading: false,
      },
      props: {
        onBeforeMount: [
          {
            type: "action",
            name: "set",
            props: {
              data: true,
            },
            set: {
              loading: "{{value}}",
            },
          },
          {
            type: "action",
            name: "getAccountList",
            set: {
              accounts: "{{accounts}}",
              loading: false,
            },
          },
        ],
      },
      elements: [
        {
          tag: "div",
          slots: {
            default: [
              {
                name: "SummaryHead",
                props: {
                  values: [
                    {
                      text: "账号数",
                      number: "{{accounts.total}}",
                      icon: "fas fa-calculator",
                      relative: true,
                    },
                    {
                      text: "审核中",
                      number: "{{accounts.summary.auditing}}",
                      icon: "fas fa-running",
                      relative: true,
                    },
                    {
                      text: "审核通过",
                      number: "{{accounts.summary.passed}}",
                      icon: "fas fa-check-square",
                      relative: true,
                    },
                    {
                      text: "审核不通过",
                      number: "{{accounts.summary.failed}}",
                      icon: "fas fa-ban",
                      relative: true,
                    },
                  ],
                },
              },
              {
                name: "freeHeighRowList",
                props: {
                  loading: "{{loading}}",
                  flat: true,
                  rows: "{{accounts.docs}}",
                  columns: [
                    {
                      name: "index",
                      label: "#",
                      field: "index",
                      align: "center",
                    },
                    {
                      name: "date",
                      label: "更新日期",
                      field: "LastUpdateDate",
                      filters: "normalDate",
                      style: "max-width: 200px;",
                      align: "center",
                    },
                    {
                      name: "name",
                      label: "姓名",
                      field: "Profile.Name",
                      style: "max-width: 200px;",
                      align: "center",
                    },
                    {
                      name: "phone",
                      label: "手机号",
                      field: "PhoneNumber",
                      align: "center",
                    },
                    {
                      name: "org",
                      label: "所属机构",
                      field: "Org.Name",
                      style: "max-width: 200px;",
                      align: "center",
                    },
                    {
                      name: "status",
                      field: "Status",
                    },
                  ],
                  filters: '{{accounts.Filters}}'
                },
                slots: {},
              },
            ],
          },
        },
      ],
    },
    {
      name: "account_details",
      params: {
        account: {},
        id: '',
      },
      props:{
        class: 'q-pa-md',
        onMounted:{
          type: "action",
          name: 'getOneAccount',
          props: {
            id: '{{id}}'
          },
          set: {
            account: "{{account}}"
          }
        }
      },
      elements: [
        {
          tag: "div",
          slots: {
            default: [
              {
                name: 'FreeField',
                props: {
                  Field: {
                    Type: "String",
                    Name: "UserName",
                    Placeholder: 'user name'
                  },
                  modelValue: "{{account.UserName}}",
                  'onUpdate:modelValue': {
                    type: 'action',
                    name: 'updateValue',
                    set: {
                      "account.UserName": "{{value}}"
                    },
                  }
                },
              },
              {
                name: 'QInput',
                props: {
                  modelValue: "{{account.UserName}}",
                  'onUpdate:modelValue': {
                    type: 'action',
                    name: 'updateValue',
                    set: {
                      "account.UserName": "{{value}}"
                    },
                  }
                },
              },
              {
                tag: 'input',
                emits: ['input'],
                props: {
                  class: 'full-width',
                  value: "{{account.UserName}}",
                  'onInput': {
                    type: 'action',
                    name: 'updateElValue',
                    set: {
                      "account.UserName": "{{value}}"
                    },
                  }
                },
              },
              {
                name: 'QBtn',
                props: {
                  label: "submit",
                  onClick: {
                    type: 'action',
                    name: 'saveAccount',
                    props: {
                      account: "{{account}}"
                    },
                    set: {
                      account: "{{account}}"
                    }
                  }
                }
              }
            ],
          },
        },
      ],
    },
  ],
  components: {
    freeHeighRowList: {
      name: "freeHeighRowList",
      params: {
        loading: false,
        flat: false,
        rows: [],
        columns: [],
        filters: [],
        "row-key": "id",
        rowsPerPage: 8,
        rowsNumber: 10,
        queryFilter: {},
        showFilters: false,
      },
      props: {},
      elements: [
        {
          name: "QTable",
          props: {
            loading: "{{loading}}",
            flat: "{{flat}}",
            rows: "{{rows}}",
            columns: "{{columns}}",
            "row-key": "{{row-key}}",
            pagination: {
              rowsPerPage: "{{rowsPerPage}}",
              rowsNumber: "{{rowsNumber}}",
            },
            "hide-bottom": true,
          },
          slots: {
            "header-cell-status": [
              {
                if: [
                  {
                    s1: "{{filters.length}}",
                    o1: ">",
                    s2: 0,
                  },
                ],
                name: "QTh",
                props: {
                  props: "{{slotProps}}"
                },
                slots: {
                  default: [
                    {
                      name: "QBtn",
                      props: {
                        flat: true,
                        icon: "search",
                        onClick: {
                          type: "action",
                          name: "math",
                          props: {
                            method: "not",
                            target: "{{showFilters}}",
                          },
                          set: {
                            showFilters: "{{value}}",
                          },
                        },
                      },
                      slots: {
                        default: ["查询"],
                      },
                    },
                  ],
                },
              },
            ],
            body: [
              {
                name: 'QTr',
                props: {
                  class: "cursor-pointer",
                  props: '{{slotProps}}',
                  onClick: [
                    {
                      type: "action",
                      name: "tableRowClicked",
                      props: {
                        id: "{{slotProps.row.id}}"
                      }
                    },
                  ]
                },
                slots: {
                  default: [
                    {
                      name: 'QTd',
                      props: {
                        props: "{{slotProps}}",
                        key: '{{col.name}}'
                      },
                      for: '{{slotProps.cols}}',
                      'for-item': 'col',
                      'for-key': 'idx',
                      slots: {
                        default: [{
                          tag: 'div',
                          slots: {
                            default: ['{{col.value}}']
                          }
                        }]
                      }
                    }
                  ]
                }
              }
            ],
            "no-data": [
              {
                tag: "div",
                if: [
                  {
                    s1: "{{loading}}",
                    o1: "!=",
                    s2: true,
                  },
                ],
                slots: {
                  default: ["暂 无 数 据"],
                },
              },
            ],
            loading: ["loading..."],
          },
        },
      ],
    },
  },
  actions: [
    {
      name: "getAccountList",
      props: {},
      process: [
        {
          type: "api",
          props: {
            target: "account/mgmt",
            method: "get",
          },
          set: "accounts",
        },
      ],
      rtn: {
        accounts: "{{accounts}}",
      },
    },
    {
      name: "tableRowClicked",
      props: {
        id: ''
      },
      process: [
        {
          type: "jump",
          target: "{{id}}",
        },
      ],
    },
    {
      name: 'getOneAccount',
      props: {
        id: ''
      },
      process:[
        {
          type: 'api',
          method: 'get',
          target: '/account/mgmt/{{id}}',
          set: "account"
        }
      ],
      rtn: {
        account: "{{account}}"
      }
    },
    {
      name: "saveAccount",
      props: {
        account: '',
      },
      process:[
        {
          type: 'log',
          target: "{{account}}"
        },
        {
          type: 'api',
          method: 'put',
          target: "/account/mgmt",
          props: {
            id: "{{account.id}}",
            UserName: "{{account.UserName}}"
          }
        },
        {
          type: 'api',
          method: 'get',
          target: '/account/mgmt/{{account.id}}',
          set: "account"
        }
      ],
      rtn: {
        account: "{{account}}"
      }
    },
    {
      name: "logout",
      process: [
        {
          type: 'log',
          target: 'logout action in account module'
        }
      ]
    }
  ],
};
