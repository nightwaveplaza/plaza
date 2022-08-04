import Vue from 'vue';
import VueRouter from 'vue-router';
import store from '@desktop/store';
import ticker from '@common/extras/ticker';
import App from '@desktop/views/App';
import router from '@desktop/router';

Vue.router = router;
Vue.use(VueRouter);

// Plaza components and windows
import '@common/components';
import '@common/windows';
import '@desktop/components';
import '@desktop/windows';

Vue.component('app', App);
Vue.mixin(require('@common/mixins/helpers').default);
Vue.mixin(require('@common/mixins/windows').default);

window.Vue = new Vue({
  router,
  store,

  mounted() {
    requestAnimationFrame(this.tick);
  },

  methods: {
    tick() {
      ticker.tick();
      requestAnimationFrame(this.tick);
    },
  },
}).$mount('#app');
