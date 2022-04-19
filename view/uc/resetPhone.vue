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
            placeholder="请输入手机号"
            ref="phone"
            :rules="[val => !!val || '请输入手机号']"
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
            placeholder="请输入验证码"
            ref="code"
            :rules="[val => !!val || '请输入验证码']"
          ></q-input>
        </div>

        <div v-if="currentStep === 2">
          <q-input
            v-model="nphone"
            placeholder="请输入手机号"
            ref="nphone"
            :rules="[val => !!val || '请输入手机号']"
          >
            <template v-slot:append>
              <q-btn
                class="float-right"
                @click="permformActions({Action: 'sendCode'})"
              >获取验证码</q-btn>
            </template>
          </q-input>
          <q-input
            v-model="ncode"
            placeholder="请输入验证码"
            ref="ncode"
            :rules="[val => !!val || '请输入验证码']"
          ></q-input>
        </div>

        <div v-if="currentStep === 3">
          <q-input
            v-model="pwd"
            placeholder="请设置登录密码"
            ref="pwd"
            :rules="[val => !!val || '请输入密码']"
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
            placeholder="请确认登录密码"
            ref="pwdConfirm"
            :rules="[val => (!!val && val === pwd) || '请确认密码']"
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
import mixins from 'free-fe-mixins';
import {defineComponent} from 'vue';

export default defineComponent({
  name: 'ResetPhone',
  mixins: [mixins.ObjectDataMixin],
  props: {
    buttonsVisible: { type: Function, default: () => true },
    StepsDefinition: { type: Array, default: () => [] },
    Fields: { type: Array, default: () => [] },
    changePhone: { type: Function, default: () => { } },
  },
  data() {
    return {
      currentStep: 1,
      isPwd: true,
      isCPwd: true,
      pwd: '',
      pwdConfirm: '',
      Actions: {
        previous: (a, that) => {
          if (that.currentStep > 1) that.currentStep -= 1;
        },
        next: (a, that) => {
          let pName = '';
          let cName = '';
          let vName = '';
          if (that.currentStep === 1) {
            if (!that.validate('phone', 'code')) return;
            pName = 'phone';
            cName = 'code';
            vName = 'verified';
          } else if (that.currentStep === 2) {
            if (!that.validate('nphone', 'ncode')) return;
            pName = 'nphone';
            cName = 'ncode';
            vName = 'nverified';
          } else {
            return;
          }

          that.getModule('passport')
            .utils.verifyCode(that[pName], that[cName])
            .then((d) => {
              if (d && d.msg === 'OK') {
                that.$q.notify(that.$t('notifyCodeVerified'));
                that[vName] = true;
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
          let pName = '';
          if (that.currentStep === 1) {
            pName = 'phone';
          } else if (that.currentStep === 2) {
            pName = 'nphone';
          } else {
            return;
          }

          that.getModule('passport')
            .utils.sendCode(that[pName])
            .then((d) => {
              if (d && d.msg === 'OK') {
                that.$q.notify(that.$t('notifyCodeSent'));
              } else {
                // that.$q.notify(that.$t('notifyCodeSendFailed'));
              }
            })
            .catch(() => {
              // that.$q.notify(that.$t('notifyCodeSendFailed'));
            });
        },
        save: (a, that) => {
          if (!that.phone || !that.code || !that.verified) {
            that.currentStep = 1;
            return;
          }
          if (!that.nphone || !that.ncode || !that.nverified) {
            that.currentStep = 2;
            return;
          }

          if (!that.validate('pwd', 'pwdConfirm')) return;

          const pPort = that.getModule('passport');
          if (pPort) {
            this.changePhone({
              ophone: pPort.utils.encryptPwd(that.phone),
              ocode: that.code,
              phone: pPort.utils.encryptPwd(that.nphone),
              code: that.ncode,
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
        return this.Bus.$store.state.account.phone;
      },
      set(v) {
        this.Bus.$store.commit('account/SET_PHONE', v);
      },
    },
    code: {
      get() {
        return this.Bus.$store.state.account.phoneCode;
      },
      set(v) {
        this.Bus.$store.commit('account/SET_PHONE_CODE', v);
      },
    },
    verified: {
      get() {
        return this.Bus.$store.state.account.codeVerified;
      },
      set(v) {
        this.Bus.$store.commit('account/SET_CODE_VERIFIED', v);
      },
    },
    nphone: {
      get() {
        return this.Bus.$store.state.account.newPhone;
      },
      set(v) {
        this.Bus.$store.commit('account/SET_NEW_PHONE', v);
      },
    },
    ncode: {
      get() {
        return this.Bus.$store.state.account.newPhoneCode;
      },
      set(v) {
        this.Bus.$store.commit('account/SET_NEW_PHONE_CODE', v);
      },
    },
    nverified: {
      get() {
        return this.Bus.$store.state.account.newCodeVerified;
      },
      set(v) {
        this.Bus.$store.commit('account/SET_NEW_CODE_VERIFIED', v);
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
    this.nphone = '';
    this.ncode = '';
    this.nverified = false;
  },
});
</script>
