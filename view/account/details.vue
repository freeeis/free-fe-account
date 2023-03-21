<template>
  <div>
    <q-stepper
      class="step-left flow-step account-details-stepper"
      v-if="localStepsDefinition && localStepsDefinition.length"
      v-model="currentStep"
      alternative-labels
      done-color="green"
    >
      <q-step
        v-for="(step, index) in localStepsDefinition"
        :key="index"
        :name="step.Index"
        :title="step.Name"
        :caption="$filter('stepCaption',step, data.Enabled)"
        :icon="step.Icon"
        :prefix="step.Index"
        :disable="step.Index > data.CurrentStep"
      >
        <div v-if="step.Actions && step.Actions.length" class="flow-action-buttons">
          <span v-for="(action, aIndex) in step.Actions || []" :key="aIndex">
            <q-btn
              :class="`q-ma-md flow-action-btn-${action.Action || 'unknown'}`"
              v-if="!Array.isArray(action) && buttonsVisible(action)"
              :label="action.Label"
              :icon="action.Icon"
              @click="permformActions(action)"
            ></q-btn>
            <q-btn-group v-if="Array.isArray(action)" push class="q-ma-sm">
              <span
                v-for="(subAction, saIndex) in action"
                :key="saIndex"
                :class="saIndex < action.length - 1 ? 'q-mr-sm' : ''"
              >
                <q-btn
                  v-if="buttonsVisible(subAction)"
                  :label="subAction.Label"
                  :icon="subAction.Icon"
                  @click="permformActions(subAction)"
                  :class="`flow-action-btn-${subAction.Action
                      || 'unknown'} ${((subAction.Value === data.Status)
                    || (subAction.Value === data.Enabled)) ?
                    ' selected': ''}`"
                ></q-btn>
              </span>
            </q-btn-group>
          </span>
        </div>

        <div class="flow-step-input-fields">
          <free-field
            v-for="(field, fIndex) in step.Fields || []"
            :key="fIndex"
            :values="data"
            :Field="field"
            @input="fieldChanged"
          ></free-field>
        </div>
      </q-step>
    </q-stepper>

    <sticky-buttons
      :buttonsVisible="buttonsVisible"
      :actions="currentStepActions"
      @click="permformActions"
      :offset="[36, 128]"
    ></sticky-buttons>
  </div>
</template>

<script>
import { defineComponent } from 'vue';
import { useObjectData, objectDataProps } from 'free-fe-core-modules/composible/useObjectData';
import { updateAccount, resetAccountPwd } from '../../router/account/api';

export default defineComponent({
  name: 'AccountDetails',
  props: {
    ...objectDataProps,
    buttonsVisible: { type: Function, default: () => true },
  },
  setup(props, ctx) {
    const {
      data,
      refreshData,
    } = useObjectData(props, ctx);

    return {
      data, 
      refreshData,
    };
  },
  data() {
    return {
      currentStep: 1,
      changedFields: [],
      SubmitterCount: 1,
      localStepsDefinition: [],
      Actions: {
        save: (a, that) => {
          if (!that.changedFields.length) return true;

          const changedData = {};

          that.changedFields.forEach((f) => {
            changedData[f] = that.data[f];
          });

          return updateAccount({ id: that.data.id, ...changedData }).then((r) => {
            if (r) {
              that.$q.notify(that.$t('notifySaved'));
              that.changedFields = [];
            } else {
              that.$q.notify(that.$t('notifySaveFailed'));
            }
            return r;
          });
        },
        enable: (a, that) => {
          if (!a || typeof a.Value === 'undefined') return false;

          return updateAccount({ id: that.data.id, Enabled: a.Value }).then(
            (r) => {
              if (r) {
                that.$q.notify(that.$t('notifySaved'));
                this.refreshData();
              } else {
                that.$q.notify(that.$t('notifySaveFailed'));
              }
              return r;
            },
          );
        },
        resetpwd: (a, that) => {
          if (!a) return false;

          return this.$MsgDialog({
            type: '',
            content: '请确认重置密码！',
            warning: '重置后此账号只能使用新密码登录！',
            canCancel: true,
            size: { w: 460 },
            okText: this.$t('okButtonText'),
            cancelText: this.$t('cancelButtonText'),
          })
            .then(() => resetAccountPwd(that.data.id).then(
              (r) => {
                if (r && r.msg === 'OK') {
                  if (r.data && r.data.newPwd) {
                    this.$MsgDialog({
                      type: '',
                      content: '密码重置成功',
                      warning: '新密码只显示一次，请记录！',
                      fields: [
                        {
                          ReadOnly: true,
                          Default: r.data.newPwd,
                          Info: {
                            Style: 'font-size: 30px;',
                          },
                        },
                      ],
                      size: {
                        w: 460,
                      },
                      okText: this.$t('okButtonText'),
                    });
                  } else {
                    that.$q.notify(that.$t('notifySucceed'));
                  }
                } else {
                  that.$q.notify(that.$t('notifyFailed'));
                }

                return false;
              },
            ))
            .catch(() => false);
        },
      },
    };
  },
  mounted() {
    this.localStepsDefinition = this.getModule(
      'account',
    ).config.detailsStepsDefinition.map((sf) => {
      if (sf.Index === 1 && this.data && this.data.Permission !== '*') {
        return {
          ...sf,
          ...{
            Fields: sf.Fields.concat(
              {
                Type: 'Category',
                Label: '权限配置',
                Info: {
                  ShowWhen: 'data.Permission !== "*"',
                },
              },
              {
                Name: 'Permission',
                Label: '权限',
                Type: 'Permission',
                ServiceList: '_service_list',
                Info: {
                  ShowWhen: 'data.Permission !== "*"',
                },
              },
            ),
          },
        };
      }
      return sf;
    });
  },
  computed: {
    currentStepActions() {
      if (!this.data || !this.localStepsDefinition || !this.data.CurrentStep) return [];

      const step = this.localStepsDefinition.find(
        (s) => !!s && s.Index === this.data.CurrentStep,
      );

      return (!!step && step.Actions) || [];
    },
    // localStepsDefinition() {
    //   return this.getModule(
    //     'account',
    //   ).config.detailsStepsDefinition.map((sf) => {
    //     if (sf.Index === 1 && this.data && this.data.Permission !== '*') {
    //       return {
    //         ...sf,
    //         ...{
    //           Fields: sf.Fields.concat(
    //             {
    //               Type: 'Category',
    //               Label: '权限配置',
    //             },
    //             {
    //               Name: 'Permission',
    //               Label: '权限',
    //               Type: 'Permission',
    //               ServiceList: '_service_list',
    //             },
    //           ),
    //         },
    //       };
    //     }
    //     return sf;
    //   });
    // },
  },
  methods: {
    permformActions(act) {
      const a = typeof act === 'object' ? act : (this.currentStepActions || []).find((action) => action.Action === a);
      if (!a || !a.Action) return;

      if (
        this.Actions[a.Action]
        && typeof this.Actions[a.Action] === 'function'
      ) {
        this.Actions[a.Action](a, this);
      } else {
        this.$q.notify(`(${a.Action})${this.$t('notifyActionNotExist')}`);
      }
    },
    fieldChanged(field) {
      if (!field || !field.Name) return;
      if (this.changedFields.indexOf(field.Name) < 0) {
        this.changedFields.push(field.Name.split('.')[0]);
      }
    },
  },
});
</script>
