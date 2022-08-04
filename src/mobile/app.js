import Vue from 'vue';
import ticker from '@common/extras/ticker';
import store from '@mobile/store';
import {Native} from '@mobile/bridge/native';

// Mobile components and windows
import '@common/components';
import '@common/windows';
import '@mobile/components';
import '@mobile/windows';

Vue.component('app', require('@mobile/views/Index').default);
Vue.mixin(require('@common/mixins/helpers').default);
Vue.mixin(require('@common/mixins/windows').default);

window.Vue = new Vue({
  store,

  created() {
    window.plaza.vue = this;
  },

  async mounted() {
    requestAnimationFrame(this.tick);

    // Load token
    const token = await Native.getAuthToken();
    const userAgent = await Native.getUserAgent();
    this.$store.commit('user/token', token);
    this.$store.commit('user/agent', userAgent);
  },

  methods: {
    pushData(name, data) {
      this.$store.commit('pushData', {name, data});
    },

    tick() {
      ticker.tick();
      requestAnimationFrame(this.tick);
    },
  },
}).$mount('#app');

