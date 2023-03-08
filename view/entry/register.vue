<template>
  <div class="absolute-center register-content" style="width: 300px;">
    <mourning v-if="!!ctx.modules.mourning"></mourning>
    <q-input
      v-model="phone"
      placeholder="请输入手机号"
      ref="phone"
      :rules="[val => !!val || '请输入手机号',phoneChanged]"
    >
      <template v-slot:append>
        <q-btn class="float-right" @click="permformActions({Action: 'sendCode'})">获取验证码</q-btn>
      </template>
    </q-input>
    <q-input v-model="code" placeholder="请输入验证码" ref="code" :rules="[val => !!val || '请输入验证码']"></q-input>
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

    <q-btn
      :loading="loading"
      color="primary"
      @click="permformActions({Action: 'register'})"
      style="width: calc(100% - 40px); margin-top: 30px; margin-left: 20px; margin-right: 20px;"
    >
      注册
      <template v-slot:loading>
        <q-spinner-hourglass class="on-left" />注册中...
      </template>
    </q-btn>
  </div>
</template>

<script>
import { defineComponent } from 'vue';
import mixins from 'free-fe-mixins';

export default defineComponent({
  name: 'RegisterPage',
  mixins: [mixins.ObjectDataMixin],
  data() {
    return {
      loading: false,
      phone: '',
      code: '',
      pwd: '',
      pwdConfirm: '',
      isPwd: true,
      isCPwd: true,
      Actions: {
        sendCode: (a, that) => {
          that
            .getModule('passport')
            .utils.sendCode(that.phone)
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
        register: (a, that) => {
          if (!this.validate('pwd', 'pwdConfirm', 'phone', 'code')) return;

          if (!that.phone || !that.code || !that.pwd) {
            return;
          }

          that.loading = true;

          that
            .getModule('passport')
            .utils.verifyCode(that.phone, that.code)
            .then((d) => {
              if (d && d.msg === 'OK') {
                that
                  .getModule('passport')
                  .utils.register(this.phone, this.code, this.pwd)
                  .then((d) => {
                    if (d && d.msg === 'OK') {
                      that.loading = false;
                      this.$q.notify(this.$t('notifyRegister'));
                      this.$router.replace('/login');
                    } else {
                      that.loading = false;
                      // this.$q.notify(this.$t('notifyRegisterFailed'));
                    }
                  })
                  .catch(() => {
                    // this.$q.notify(this.$t('notifyRegisterFailed'));
                    that.loading = false;
                  });
              } else {
                that.$q.notify(that.$t('notifyCodeVerifyFailed'));
                that.loading = false;
              }
            })
            .catch(() => {
              that.$q.notify(that.$t('notifyCodeVerifyFailed'));
              that.loading = false;
            });
        },
      },
    };
  },
  methods: {
    phoneChanged(p) {
      if (!p || !/^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/.test(p)) return false;

      const passport = this.getModule('passport');
      if (passport) {
        return passport.utils
          .phoneUsed(p)
          .then((d) => {
            if (d && d.msg === 'OK') {
              if (d.data.used) {
                this.$q.notify(this.$t('notifyPhoneIsExists'));
              }
              return !d.data.used;
            }
            return true;
          })
          .catch(() => true);
      }
      return true;
    },
    validate(...refs) {
      refs = refs || [];
      let result = true;
      for (let i = 0; i < refs.length; i += 1) {
        this.$refs[refs[i]].validate();
        result = result && !this.$refs[refs[i]].hasError;
      }

      return result;
    },
    permformActions(a) {
      if (!a.Action) return;

      if (this.Actions[a.Action] && typeof this.Actions[a.Action] === 'function') {
        this.Actions[a.Action](a, this);
      } else {
        this.$q.notify(`(${a.Action})${this.$t('notifyActionNotExist')}`);
      }
    },
  },
});
</script>
