import Vue from 'vue';
import ticker from '@base/extras/ticker';
import store from '@mobile/store';
import {Native} from '@mobile/bridge/native';

// Mobile components and windows
import '@base/components';
import '@base/windows';
import '@mobile/components';
import '@mobile/windows';

Vue.component('app', require('@mobile/views/Index').default);
Vue.mixin(require('@base/mixins/helpers').default);
Vue.mixin(require('@base/mixins/windows').default);
Vue.mixin(require('@mobile/mixins/windows-ext').default);

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

