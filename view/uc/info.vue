<template>
  <div class="relative-position">
    <q-stepper
      :class="`step-left flow-step ${showHead ? '' : 'hide-head'}`"
      v-if="data && data.StepsDefinition && data.StepsDefinition.length"
      v-model="currentStep"
      animated
      :header-nav="ctx.config.flow ? ctx.config.flow?.headerNav : true"
      alternative-labels
    >
      <q-step
        v-for="(step, index) in data.StepsDefinition"
        :key="index"
        :name="step.Index"
        :title="step.Name"
        :caption="$filter('stepCaption',step,data.Enabled,data)"
        :disable="step.Index > data.CurrentStep"
        :done="step.Index > 2 ? (data.Status === '1') : (data.CurrentStep > step.Index)"
        :error="step.Index > 2 ? (data.Status === '-1') : false"
        :class="`flow-step-uc-info flow-step-${step.Status || 'notstarted'}`"
        :icon="`img:${baseUrl}images/admin/灰${step.Index}@2x.png`"
        :active-icon="`img:${baseUrl}images/admin/${data.Status === '-1'
          ? '红' : (data.Status === '0' ? '灰' : '绿')}${step.Index}@2x.png`"
        :active-color="`${data.Status === '-1'
          ? 'red' : (data.Status === '0' ? 'grey' : 'green')}`"
        :error-icon="`img:${baseUrl}images/admin/红${step.Index}@2x.png`"
        :error-color="ctx.config.flow?.flowStep.errorColor"
        :done-icon="`img:${baseUrl}images/admin/绿${step.Index}@2x.png`"
        :done-color="ctx.config.flow?.flowStep.doneColor"
      >
        <div v-if="step.Actions && step.Actions.length" class="flow-action-buttons">
          <span v-for="(action, aIndex) in step.Actions || []" :key="aIndex">
            <q-btn
              :class="`q-ma-sm flow-action-btn-${action.Action || 'unknown'}`"
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
                ></q-btn>
              </span>
            </q-btn-group>
          </span>
        </div>

        <div
          :class="`flow-step-submit-log max-height-${!!ctx.config.flow?.submitLogMaxHeight}`"
          :style="`max-height: ${ctx.config.flow?.submitLogMaxHeight || ''};`"
          v-if="auditLog && auditLog.length > 0"
        >
          <q-timeline class="timeline">
            <q-timeline-entry
              :class="`entry entry-${log.Status}`"
              v-for="(log, lindex) in auditLog"
              :key="lindex"
              :title="`${log
                ? `${log.Title}${log.Description ? ' - ' + log.Description : ''}` : ''}`"
            >
              <div v-if="log && log.Date" class="date">
                <span class="label">{{ctx.config.flow?.submitDateLabel || $t('提交时间')}}：</span>
                {{$filter('dateAndTime',log.Date)}}
              </div>
              <div v-if="log && log.Name" class="name">
                <span class="label">{{ctx.config.flow?.submitterLabel || $t('提交人')}}：</span>
                {{log.Name}}
              </div>
              <div v-if="log && log.Org" class="org">
                <span class="label">{{ctx.config.flow?.submitOrgLabel || $t('提交单位')}}：</span>
                {{log.Org}}
              </div>
              <div v-if="log && log.Reason" class="reason">
                <span class="label">{{ctx.config.flow?.submitReasonLabel || $t('提交意见')}}：</span>
                {{log.Reason}}
              </div>
            </q-timeline-entry>
          </q-timeline>
        </div>

        <div class="flow-step-free-fields">
          <free-field
            v-for="(field, fIndex) in step.Fields || []"
            :key="fIndex"
            :values="data"
            :Field="field"
            @input="fieldChanged"
            ref="fieldsToValid"
          ></free-field>
        </div>
      </q-step>

      <template v-slot:message>
        <q-banner v-if="stepMessage" :class="`flow-step-message`">
          <span class="free-field-warning no-wrap">
            <span class="free-field-warning-icon"></span>
            <span class="free-field-warning-icon-sign-top"></span>
            <span class="free-field-warning-icon-sign-dot"></span>
            <span class="free-field-warning-text ellipsis">{{stepMessage}}</span>
          </span>
        </q-banner>
      </template>
    </q-stepper>

    <sticky-buttons
      v-if="buttonsVisible({Action: 'save'})"
      :actions="[{Action: 'save', icon: 'save', Label:$t('saveButtonText')}]"
      @click="permformActions"
      :fab="false"
    ></sticky-buttons>
  </div>
</template>

<script>
import { defineComponent } from 'vue';
import { useObjectData, objectDataProps } from 'free-fe-core-modules/composible/useObjectData';
import { useFormValidator } from 'free-fe-core-modules/composible/useFormValidator';

import {
  updateMyInfo,
  submitMyInfo,
  editMyInfo,
} from '../../router/uc/api';

export default defineComponent({
  name: 'UCInfo',
  props: {
    ...objectDataProps,
    Fields: { type: Array, default: () => [] },
  },
  setup(props, ctx) {
    const {
      data,
      refreshData,
    } = useObjectData(props, ctx);

    const { validate } = useFormValidator('fieldsToValid');
    ctx.expose({
      validate,
    })

    return {
      data,
      refreshData,
      baseUrl: computed(() => import.meta.env.BASE_URL),
    };
  },
  data() {
    return {
      buttonsVisible: (a) => {
        switch (a.Action) {
          case 'edit':
            return this.data.Status !== void 0 && this.data.ar;
          case 'save':
            if(this.currentStep && this.data && this.data.StepsDefinition){
              const theStep = this.data.StepsDefinition.find(sd => sd.Index === this.currentStep);

              if(theStep && theStep.Actions) {
                return !!theStep.Actions.find(act => act.Action === 'save');
              }
            }

            return false;
          case 'submit':
            return typeof this.data.Status === 'undefined' && this.data.ar;
          default:
            return true;
        }
      },
      currentStep: 1,
      changedFields: [],
      SubmitterCount: 1,
      // StepsDefinition: this.getModule('uc').config.infoStepsDefinition,
      Actions: {
        save: (a, that) => {
          if (!that.changedFields.length) return true;

          const changedData = {};

          that.changedFields.forEach((f) => {
            changedData[f] = that.data[f];
          });

          return updateMyInfo(changedData).then((r) => {
            if (r) {
              that.$q.notify(that.$t('notifySaved'));
              that.refreshData();
              that.changedFields = [];
            } else {
              that.$q.notify(that.$t('notifySaveFailed'));
            }
            return r;
          });
        },
        submit: (a, that) => {
          const changedData = {};

          that.changedFields.forEach((f) => {
            changedData[f] = that.data[f];
          });

          Promise.resolve(
            that.changedFields.length ? updateMyInfo(changedData) : 'ok'
          ).then((ret) => {
            if (ret) {
              const submitFunc = () => {
                // submit
                let auditString = this.$t('提交审核');
                let auditTips = '';
                const auditWarning = '';
                const cStep = this.data.StepsDefinition.find(
                  (sd) => sd.Index === this.currentStep
                );
                if (!cStep) return false;

                if (cStep.Description) {
                  if (Array.isArray(cStep.Description)) {
                    const desc = cStep.Description.find(
                      (dsc) => dsc.Status === a.Value
                    );
                    if (desc && desc.Description) {
                      auditString = desc.Description;
                    }
                  } else if (typeof cStep.Description === 'string') {
                    auditString = cStep.Description;
                  }
                }
                auditTips = this.$t('确认后将自动跳转到下一步');

                return this.$MsgDialog({
                  type: '',
                  content: `${this.$t('请确认')}${auditString}`,
                  warning: auditWarning,
                  tips: auditTips,
                  canCancel: true,
                  size: {
                    w: 550,
                  },
                  okText: this.$t('okButtonText'),
                  cancelText: this.$t('cancelButtonText'),
                })
                  .then(() =>
                    submitMyInfo().then((r) => {
                      if (r) {
                        that.$q.notify(that.$t('notifySaved'));
                        that.refreshData();
                        that.changedFields = [];
                      } else {
                        that.$q.notify(that.$t('notifySaveFailed'));
                      }
                      return r;
                    })
                  )
                  .catch(() => {});
              };
              // validate
              if (!this.validate()) {
                // jump to the failed field
                this.$nextTick(() => {
                  const invalidF = document.querySelectorAll('.hasError');
                  if (invalidF && invalidF.length > 0) {
                    this.$q.notify(this.$t('inputValidateFailed'));
                    const invalidFList = [].slice.call(invalidF);

                    const theLastInvalidF = invalidFList.pop();
                    theLastInvalidF.scrollIntoView({
                      block: 'center',
                      behavior: 'smooth',
                    });
                  } else {
                    submitFunc();
                  }
                });
              } else {
                submitFunc();
              }
            }

            return ret;
          });
        },
        edit: (a, that) => {
          // recall
          let auditString = this.$t('撤回修改');
          const auditTips = '';
          const auditWarning = this.$t('确认后您将失去多数权限，需要重新提交审核。');
          const cStep = this.data.StepsDefinition.find(
            (sd) => sd.Index === this.currentStep
          );
          if (!cStep) return false;

          if (cStep.Description) {
            if (Array.isArray(cStep.Description)) {
              const desc = cStep.Description.find(
                (dsc) => dsc.Status === a.Value
              );
              if (desc && desc.Description) {
                auditString = desc.Description;
              }
            } else if (typeof cStep.Description === 'string') {
              auditString = cStep.Description;
            }
          }

          return this.$MsgDialog({
            type: '',
            content: `${this.$t('请确认')}${auditString}`,
            warning: auditWarning,
            tips: auditTips,
            canCancel: true,
            size: { w: 550 },
            okText: this.$t('okButtonText'),
            cancelText: this.$t('cancelButtonText'),
          })
            .then(() =>
              editMyInfo().then((r) => {
                if (r) {
                  that.$q.notify(that.$t('notifySaved'));
                  that.refreshData();
                } else {
                  that.$q.notify(that.$t('notifySaveFailed'));
                }
                return r;
              })
            )
            .catch(() => {});
        },
      },
    };
  },
  computed: {
    showHead() {
      if (!this.data.StepsDefinition || this.data.StepsDefinition.length <= 0) { return false; }

      const step = this.data.StepsDefinition.find(
        (s) => !!s && s.Index === this.currentStep,
      );
      return !!step && !!step.Info && !!step.Info.ShowHead;
    },
    stepMessage() {
      if (!this.data || !this.data.StepsDefinition) return '';

      const step = this.data.StepsDefinition.find(
        (s) => !!s && s.Index === this.currentStep
      );

      return !!step && !!step.Info && step.Info.Message;
    },
    auditLog() {
      if (this.data && this.data.AuditLog) {
        this.data.AuditLog.forEach((log) => {
          if (log.Status === 'recall') {
            log.Description =
              log.Description || this.$t('submitLogRecallDescription');
          }
        });

        return this.data.AuditLog;
      }

      return [];
    },
  },
  methods: {
    afterRefresh() {
      if (this.data && this.data.CurrentStep) {
        this.currentStep = this.data.CurrentStep;
      }
    },
    permformActions(a) {
      if (!a.Action) return;

      const cStep = this.data.StepsDefinition.find(
        (sd) => sd.Index === this.currentStep
      );

      // notify dialog
      if (cStep && cStep.Info && cStep.Info.Notifications) {
        const noty = cStep.Info.Notifications.find(
          (n) =>
            n.Action === a.Action &&
            (typeof a.Value === 'undefined' || n.Value === a.Value)
        );
        if (noty) {
          this.showNotifyDialog(noty, () => {
            if (
              this.Actions[a.Action] &&
              typeof this.Actions[a.Action] === 'function'
            ) {
              this.Actions[a.Action](a, this);
            }
          });
        } else {
          if (
            this.Actions[a.Action] &&
            typeof this.Actions[a.Action] === 'function'
          ) {
            this.Actions[a.Action](a, this);
          }
        }
      } else {
        if (
          this.Actions[a.Action] &&
          typeof this.Actions[a.Action] === 'function'
        ) {
          this.Actions[a.Action](a, this);
        }
      }
    },
    fieldChanged(field) {
      // field.Name &&
      //       changedFields.indexOf(field.Name) < 0 &&
      //       changedFields.push(field.Name.split('.')[0])
      if (!field || !field.Name) return;
      if (this.changedFields.indexOf(field.Name) < 0) {
        this.changedFields.push(field.Name.split('.')[0]);
      }
    },
    showNotifyDialog(options, func) {
      this.$MsgDialog({ type: '', ...options })
        .then(() => {
          if (func && typeof func === 'function') {
            func();
          }
        })
        .catch(() => {});
    },
  },
});
</script>
