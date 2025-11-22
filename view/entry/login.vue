<template>
  <div class="absolute-center login-content" style="width: 300px;">
    <mourning v-if="!!ctx.modules.mourning"></mourning>
    <q-input v-model="phone" filled hide-bottom-space
      :placeholder="$t('placeholderUserName')"
      style="margin-bottom: 5px;" />
    <q-input v-model="pwd" hide-bottom-space
      :placeholder="$t('placeholderPassword')"
      @keyup.enter="loginClicked"
      filled :type="isPwd ? 'password' : 'text'">
      <template v-slot:append>
        <e-icon
          :name="isPwd ? 'visibility_off' : 'visibility'"
          class="cursor-pointer"
          @click="isPwd = !isPwd"
        />
      </template>
    </q-input>

    <div style="width: 100%;" v-if="!ctx.config['account'].loginOnly">
      <q-btn flat class="float-left" to="/register">{{ $t('极速注册') }}</q-btn>

      <q-btn flat class="float-right" to="/recover">{{ $t('找回密码') }}</q-btn>
    </div>

    <q-btn
      :loading="loading"
      color="primary"
      @click="loginClicked"
      style="width: calc(100% - 40px); margin-top: 30px; margin-left: 20px; margin-right: 20px;"
    >
      {{ $t('登录') }}
      <template v-slot:loading>
        <q-spinner-hourglass class="on-left" />{{ $t('登录中') }}
      </template>
    </q-btn>
  </div>
</template>

<script>
import { defineComponent } from 'vue';
import { useRouter, useRoute } from 'vue-router'

export default defineComponent({
  name: 'LoginPage',
  props: {},
  data() {
    return {
      loading: false,
      phone: '',
      pwd: '',
      isPwd: true,
    };
  },
  setup() {
    const router = useRouter();

    return {
      router,
      route: useRoute(),
    }
  },
  methods: {
    loginClicked() {
      if (!this.phone || !this.pwd) return;

      this.loading = true;

      this.ctx.modules.account
        .utils.login(this.phone, this.pwd)
        .then((d) => {
          this.loading = false;
          if (d && d.msg === 'OK') {
            // set info to store
            const data = (d && d.data) || {};
            this.ctx.modules.account.store().SET_USER(data);

            this.router.replace(this.route.query.redirect ? `${this.route.query.redirect.substring(import.meta.env.BASE_URL.length || 0)}` : '/');
          } else {
            this.$q.notify(this.$t('notifyLoginFailed'));
          }
        })
        .catch(() => {
          this.$q.notify(this.$t('notifyLoginFailed'));
        });
    },
  },
});
</script>
