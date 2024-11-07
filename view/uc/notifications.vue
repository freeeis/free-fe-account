<template>
    <div class="uc-notifications-list relative-position">
      <!-- TODO: like outlook?? -->
      <div 
        v-for="(doc, idx) in notifications" :key="idx" @click="read(doc)"
        class="notification-item"
        :class="{
          'cursor-pointer': !doc.Read,
        }">
        <div class="title">{{ doc.Title || '' }}</div>
        <div class="content">{{ doc.Content || '' }}</div>
      </div>
    </div>
  </template>
  
<script>
import { defineComponent } from 'vue';

  export default defineComponent({
    name: 'UCNotifications',
    data() {
      return {
        notifications: [],
      };
    },
    mounted() {
      this.refreshNotifications();
    },
    methods: {
      refreshNotifications() {
        this.getRequest('/uc/noty').then((res) => {
          this.notifications = res.data.docs;
        });
      },
      read(nt) {
        if (!nt?.id || nt.Read) return;
  
        this.putRequest(`/uc/noty/read/${nt.id}`).then(() => {
          this.refreshNotifications();
        });
      },
    },
  });
  </script>
  
  <style lang="scss" scoped>
  .uc-notifications-list {
    background-color: $background;
    .notification-item {
      padding: 10px;
      border-bottom: 1px solid #e8e8e8;
      .title {
        font-weight: bold;
      }
      .content {
        font-size: 12px;
      }
    }
  }
  </style>