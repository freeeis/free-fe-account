<template>
  <div class="relative-position">
    <q-stepper
      class="step-left flow-step"
      v-if="StepsDefinition && StepsDefinition.length"
      v-model="currentStep"
    >
      <q-step
        v-for="(step, index) in StepsDefinition"
        :key="index"
        :name="step.Index"
        :title="step.Name"
        :caption="step.Description"
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
              class="q-ma-md"
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
                ></q-btn>
              </span>
            </q-btn-group>
          </span>
        </div>

        <div v-if="currentStep === 1">
          <q-input
            v-model="phone"
            :placeholder="$t('请输入手机号')"
            ref="phone"
            :rules="[val => !!val || $t('请输入手机号')]"
          >
            <template v-slot:append>
              <q-btn
                class="float-right"
                @click="permformActions({Action: 'sendCode'})"
              >获取验证码</q-btn>
            </template>
          </q-input>
          <q-input
            v-model="code"
            :placeholder="$t('请输入验证码')"
            ref="code"
            :rules="[val => !!val || $t('请输入验证码')]"
          ></q-input>
        </div>
        <div v-if="currentStep === 2">
          <q-input
            v-model="pwd"
            :placeholder="$t('请设置登录密码')"
            ref="pwd"
            :rules="[val => !!val || $t('请输入密码')]"
            filled
            :type="isPwd ? 'password' : 'text'"
          >
            <template v-slot:append>
              <e-icon
                :name="isPwd ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                @click="isPwd = !isPwd"
              />
            </template>
          </q-input>

          <q-input
            v-model="pwdConfirm"
            :placeholder="$t('请确认登录密码')"
            ref="pwdConfirm"
            :rules="[val => (!!val && val === pwd) || $t('请确认密码')]"
            filled
            :type="isCPwd ? 'password' : 'text'"
          >
            <template v-slot:append>
              <e-icon
                :name="isCPwd ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                @click="isCPwd = !isCPwd"
              />
            </template>
          </q-input>
        </div>
      </q-step>
    </q-stepper>
  </div>
</template>

<script>
import { defineComponent } from 'vue';
import { useObjectData, objectDataProps } from 'free-fe-core-modules/composible/useObjectData';

export default defineComponent({
  name: 'ResetPassword',
  props: {
    ...objectDataProps,
    buttonsVisible: { type: Function, default: () => true },
    StepsDefinition: { type: Array, default: () => [] },
    Fields: { type: Array, default: () => [] },
    changePwd: { type: Function, default: () => { } },
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
      isPwd: true,
      isCPwd: true,
      pwd: '',
      pwdConfirm: '',
      Actions: {
        next: (a, that) => {
          if (!that.validate('phone', 'code')) return;

          that.getModule('passport').utils
            .verifyCode(that.phone, that.code)
            .then((d) => {
              if (d && d.msg === 'OK') {
                that.$q.notify(that.$t('notifyCodeVerified'));
                that.verified = true;
                that.currentStep += 1;
              } else {
                // that.$q.notify(that.$t('notifyCodeVerifyFailed'));
              }
            })
            .catch(() => {
              // that.$q.notify(that.$t('notifyCodeVerifyFailed'));
            });
        },
        sendCode: (a, that) => {
          that.getModule('passport').utils.sendCode(that.phone).then((d) => {
            if (d && d.msg === 'OK') {
              that.$q.notify(that.$t('notifyCodeSent'));
            } else {
              // that.$q.notify(that.$t('notifyCodeSendFailed'));
            }
          }).catch(() => {
            // that.$q.notify(that.$t('notifyCodeSendFailed'));
          });
        },
        save: (a, that) => {
          if (!that.phone || !that.code || !that.verified) {
            that.currentStep = '1';
            return;
          }

          if (!that.validate('pwd', 'pwdConfirm')) return;

          const pPort = that.getModule('passport');
          if (pPort) {
            this.changePwd({
              phone: pPort.utils.encryptPwd(that.phone),
              code: that.code,
              Password: that.pwd,
            })
              .then((d) => {
                if (d && d.msg === 'OK') {
                  that.$q.notify(that.$t('notifyChanged'));
                } else {
                  // that.$q.notify(that.$t('notifyChangeFailed'));
                }
              })
              .catch(() => {
                // that.$q.notify(that.$t('notifyChangeFailed'));
              });
          }
        },
      },
    };
  },
  computed: {
    phone: {
      get() {
        return this.Bus.phone;
      },
      set(v) {
        this.Bus.phone = v;
      },
    },
    code: {
      get() {
        return this.Bus.phoneCode;
      },
      set(v) {
        this.Bus.phoneCode = v;
      },
    },
    verified: {
      get() {
        return this.Bus.codeVerified;
      },
      set(v) {
        this.Bus.codeVerified = v;
      },
    },
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
  },
  beforeUnmount() {
    this.phone = '';
    this.code = '';
    this.verified = false;
  },
});
</script>
