<template>
  <div>
    <q-stepper
      class="step-left flow-step uc-sub-account-details-wrapper"
      v-if="StepsDefinition && StepsDefinition.length"
      v-model="currentStep"
      animated
      header-nav
    >
      <q-step
        v-for="(step, index) in StepsDefinition"
        :key="index"
        :name="step.Index"
        :title="step.Name"
        :caption="$filter('stepCaption',step,data.Enabled)"
        :icon="step.Icon"
        :prefix="step.Index"
      >
        <div
          v-if="step.Actions && step.Actions.length"
          class="flow-action-buttons"
        >
          <span
            v-for="(action, aIndex) in step.Actions || []"
            :key="aIndex"
          >
            <q-btn
              :class="`q-ma-md flow-action-btn-${action.Action || 'unknown'}`"
              v-if="!Array.isArray(action) && buttonsVisible(action)"
              :label="action.Label"
              :icon="action.Icon"
              @click="permformActions(action)"
            ></q-btn>
            <q-btn-group
              v-if="Array.isArray(action)"
              push
              class="q-ma-sm"
            >
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
                      || 'unknown'} ${subAction.Value === data.Enabled ?
                    ' selected': ''}`"
                ></q-btn>
              </span>
            </q-btn-group>
          </span>
        </div>

        <div class="flow-step-free-fields">
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
  </div>
</template>

<script>
import { useObjectData, objectDataProps } from 'free-fe-core-modules/composible/useObjectData';

import {
  createSubAccount,
  updateSubAccount,
  deleteSubAccount,
} from '../../router/uc/api';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'SubAccountDetails',
  props: {
    ...objectDataProps,
    buttonsVisible: { type: Function, default: () => true },
    StepsDefinition: { type: Array, default: () => [] },
    Fields: { type: Array, default: () => [] },
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
      changedFields: [],
      currentStep: 1,
      Actions: {
        create: (a, that) => {
          if (that.changedFields.length) {
            return createSubAccount(that.data).then((r) => {
              if (r && r.msg === 'OK') {
                that.$router.replace({
                  path: `${that.$route.fullPath.substr(
                    0,
                    that.$route.fullPath.length - '/new'.length,
                  )}/${r.data.id}`,
                });
                that.changedFields = [];
              } else {
                that.$q.notify(that.$t('notifySaveFailed'));
              }
            });
          }
          return true;
        },
        save: (a, that) => {
          if (!that.changedFields.length) return true;
          if (!that.data.id) return true;

          const changedData = {};

          that.changedFields.forEach((f) => {
            changedData[f] = that.data[f];
            
            if (f === 'Password') {
              // encrypt password
              changedData[f] = that.ctx.modules.account.utils.encryptPwd(that.data[f]);
            }
          });

          changedData.id = that.data.id;

          return updateSubAccount(that.data.id, changedData).then((r) => {
            if (r && r.msg === 'OK') {
              that.$q.notify(that.$t('notifySaved'));
              that.refreshData();
              that.changedFields = [];
            } else {
              that.$q.notify(that.$t('notifySaveFailed'));
            }
          });
        },

        enable: (a, that) => {
          if (that.data.Enabled === a.Value) return true;
          return updateSubAccount(that.data.id, { Enabled: a.Value }).then((r) => {
            if (r && r.msg === 'OK') {
              that.$q.notify(that.$t('notifySaved'));
              that.refreshData();
            } else {
              that.$q.notify(that.$t('notifySaveFailed'));
            }
          });
        },
        remove: (a, that) => {
          if (!that.data.id) return true;
          return deleteSubAccount(that.data.id).then((r) => {
            if (r && r.msg === 'OK') {
              that.$router.replace({
                path: `${that.$route.fullPath.substr(
                  0,
                  that.$route.fullPath.lastIndexOf('/'),
                )}`,
              });
            } else {
              that.$q.notify(that.$t('notifyDeleteFailed'));
            }
          });
        },
        edit: () => { },
      },
    };
  },
  methods: {
    validate(...refs) {
      refs = refs || [];
      let result = true;
      for (let i = 0; i < refs.length; i += 1) {
        this.$refs[refs[i]][0].validate();
        result = result && !this.$refs[refs[i]][0].hasError;
      }

      return result;
    },
    permformActions(a) {
      if (!a.Action) return;

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
      // field.Name &&
      //       changedFields.indexOf(field.Name) < 0 &&
      //       changedFields.push(field.Name.split('.')[0])
      if (!field || !field.Name) return;
      if (this.changedFields.indexOf(field.Name) < 0) { this.changedFields.push(field.Name.split('.')[0]); }
    },
  },
  beforeUnmount() { },
});
</script>
