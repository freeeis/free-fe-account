<template>
  <div class="absolute-center recover-content" style="width: 300px;">
    <mourning v-if="!!ctx.modules.mourning"></mourning>
    <q-input
      v-model="info.phone"
      placeholder="请输入手机号"
      ref="phone"
      :rules="[val => !!val || '请输入手机号',phoneChanged]"
    >
      <template v-slot:append>
        <q-btn class="float-right" @click="permformActions({Action: 'sendCode'})">获取验证码</q-btn>
      </template>
    </q-input>
    <q-input
      v-model="info.code"
      placeholder="请输入验证码"
      ref="code"
      :rules="[val => !!val || '请输入验证码']"
    ></q-input>
    <q-input
      v-model="info.pwd"
      placeholder="请设置新密码"
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
      v-model="info.pwdConfirm"
      placeholder="请确认新密码"
      ref="pwdConfirm"
      :rules="[val => (!!val && val === info.pwd) || '请确认密码']"
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
      @click="permformActions({Action: 'recover'})"
      style="width: calc(100% - 40px); margin-top: 30px; margin-left: 20px; margin-right: 20px;"
    >
      找回
      <template v-slot:loading>
        <q-spinner-hourglass class="on-left" />找回中...
      </template>
    </q-btn>

    <div class="float-right q-mt-md text-primary" style="font-size: 12px;">
      已有账号?
      <q-btn type="a" to="/login" flat size="sm">登录</q-btn>
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue';
import { useObjectData, objectDataProps } from 'free-fe-core-modules/composible/useObjectData';

export default defineComponent({
  name: 'RecoverPage',
  props: {
    ...objectDataProps,
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
      loading: false,
      scrollTop: 0,
      isPwd: true,
      isCPwd: true,
      info: {
        phone: '',
        code: '',
        pwd: '',
        pwdConfirm: '',
      },
      Actions: {
        sendCode: (a, that) => {
          if (!that.info.phone || that.info.phone.length < 11) {
            return;
          }

          that
            .getModule('passport')
            .utils.sendCode(that.info.phone)
            .then((d) => {
              if (d && d.msg === 'OK') {
                that.$q.notify('验证码发送成功。');
              } else {
                // that.$q.notify('验证码发送失败。');
              }
            })
            .catch(() => {
              // that.$q.notify('验证码发送失败。');
            });
        },
        recover: (a, that) => {
          if (!this.validate('pwd', 'pwdConfirm', 'phone', 'code')) return;

          if (!that.info.phone || !that.info.code || !that.info.pwd) {
            return;
          }

          that.loading = true;

          that
            .getModule('passport')
            .utils.verifyCode(that.info.phone, that.info.code)
            .then((d) => {
              if (d && d.msg === 'OK') {
                that
                  .getModule('passport')
                  .utils.recover(this.info.phone, this.info.code, this.info.pwd)
                  .then((d) => {
                    if (d && d.msg === 'OK') {
                      that.loading = false;
                      this.$q.notify(this.$t('notifyRecover'));
                      this.$router.replace('/login');
                    } else {
                      that.loading = false;
                      // this.$q.notify(this.$t('notifyRecoverFailed'));
                    }
                  })
                  .catch(() => {
                    that.loading = false;
                    // this.$q.notify(this.$t('notifyRecoverFailed'));
                  });
              } else {
                that.loading = false;
                // that.$q.notify('验证码验证失败！');
              }
            })
            .catch(() => {
              that.loading = false;
              // that.$q.notify('验证码验证失败！');
            });
        },
      },
    };
  },
  beforeCreate() {
    this.getRequest('/portal/contactinfo').then((d) => {
      if (d && d.msg === 'OK' && d.data) {
        this.contactInfo = d.data;
      }
    });
  },
  methods: {
    phoneChanged(p) {
      if (
        !p
        || !/^(0|86|17951)?(13[0-9]|14[0-9]|15[0-9]|16[0-9]|17[0-9]|18[0-9]|19[0-9])[0-9]{8}$/.test(p)
      ) return false;

      return this.getModule('passport')
        .utils.phoneUsed(p)
        .then((d) => {
          if (d && d.msg === 'OK') {
            if (!d.data.used) {
              this.$q.notify(this.$t('notifyPhoneIsNotExists'));
            }
            return d.data.used;
          }
          return true;
        })
        .catch(() => true);
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
        this.$q.notify(`操作不存在(${a.Action})!`);
      }
    },
  },
});
</script>
