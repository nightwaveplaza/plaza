import Vue from 'vue';
import VueRouter from 'vue-router';
import {store} from '@desktop/js/plugins/store';
import ticker from '@base/js/extras/ticker';
import App from '@desktop/js/pages/App';

// Plaza components and windows
import '@base/js/ui/components';
import '@base/js/ui/windows';
import '@desktop/js/ui/components';
import '@desktop/js/ui/windows';

// Desktop router
import router from '@desktop/js/plugins/router';

Vue.router = router;
Vue.use(VueRouter);

Vue.component('app', App);
Vue.mixin(require('@base/js/mixins/helpers').default);
Vue.mixin(require('@base/js/mixins/windows').default);

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
