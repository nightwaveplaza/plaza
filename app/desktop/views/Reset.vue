<template>
  <div class="app-desktop theme-win98">
    <window-user-reset-password v-if="isWindowOpen('user-reset-password')" :token="token"/>
    <window-user-reset v-if="isWindowOpen('user-reset')"/>

    <win-alert :title="a.title" :text="a.text" :name="a.name" :type="a.type" :key="a.id" v-for="a in alerts"/>
  </div>
</template>

<script>
import {mapGetters} from 'vuex';

export default {
  data() {
    return {
      token: '',
    };
  },

  computed: {
    ...mapGetters('windows', ['alerts', 'isWindowOpen']),
    changePassword() {
      return this.$route.params.token;
    },
  },

  watch: {
    alerts(n) {
      if (n.length === 0 && !this.isWindowOpen('user-reset-password') && !this.isWindowOpen('user-reset')) {
        this.$router.push({name: 'index'});
      }
    },
  },

  mounted() {
    if (this.$route.params.token) {
      this.token = this.$route.params.token;
      this.openWindow('user-reset-password');
    } else {
      this.openWindow('user-reset');
    }
  },
};
</script>
