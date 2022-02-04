import Vue from 'vue';
import ticker from '@base/js/extras/ticker';
import {store} from '@mobile/js/plugins/store';
import {Native} from '@mobile/js/bridge/native';

// Mobile components and windows
import '@base/js/ui/components';
import '@base/js/ui/windows';
import '@mobile/js/ui/components';
import '@mobile/js/ui/windows';

Vue.component('app', require('@mobile/js/pages/Index').default);
Vue.mixin(require('@base/js/mixins/helpers').default);
Vue.mixin(require('@base/js/mixins/windows').default);
Vue.mixin(require('@mobile/js/mixins/windows-ext').default);

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

