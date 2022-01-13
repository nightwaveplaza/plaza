import Vue from 'vue';
import VueRouter from 'vue-router';
import router from './plugins/router';
import {store} from './plugins/store';
import ticker from '@common/js/extras/ticker';

window.Vue = Vue;
Vue.router = router;
Vue.use(VueRouter);

// Pages
Vue.component('app', require('@desktop/js/pages/App').default);

// Common windows
Vue.component('window-about', require('@common/js/windows/WindowAbout').default);
Vue.component('window-credits', require('@common/js/windows/WindowCredits').default);
Vue.component('window-news', require('@common/js/windows/WindowNews').default);
Vue.component('window-history', require('@common/js/windows/WindowHistory').default);
Vue.component('window-ratings', require('@common/js/windows/WindowRatings').default);
Vue.component('window-song-info', require('@common/js/windows/WindowSongInfo').default);
Vue.component('window-settings-background', require('@common/js/windows/WindowSettingsBackground').default);
Vue.component('window-user-password', require('@common/js/windows/WindowUserPassword').default);
Vue.component('window-user-favorites', require('@common/js/windows/WindowUserFavorites').default);
Vue.component('window-support', require('@common/js/windows/WindowSupport').default);
Vue.component('window-user-login', require('@common/js/windows/WindowUserLogin').default);
Vue.component('window-user-email', require('@common/js/windows/WindowUserEmail').default);
Vue.component('window-user-register', require('@common/js/windows/WindowUserRegister').default);
Vue.component('window-user-reset', require('@common/js/windows/WindowUserReset').default);
Vue.component('window-user', require('@common/js/windows/WindowUser').default);

// Common components
Vue.component('win-alert', require('@common/js/windows/components/WinAlert').default);
Vue.component('win-btn', require('@common/js/windows/components/WinButton').default);

Vue.component('win-captcha', require('@common/js/windows/components/WinCaptcha').default);
Vue.component('win-list', require('@common/js/windows/components/WinList').default);
Vue.component('win-memo', require('@common/js/windows/components/WinMemo').default);
Vue.component('win-pagination', require('@common/js/windows/components/WinPagination').default);
Vue.component('win-taskbar', require('@common/js/windows/components/WinTaskbar').default);
Vue.component('win-window', require('@common/js/windows/components/WinWindow').default);
Vue.component('win-player-reactions', require('@common/js/windows/components/WinPlayerReactions').default);
Vue.component('win-player-time', require('@common/js/windows/components/WinPlayerTime').default);


// Web windows
Vue.component('window-mobile', require('./windows/WindowMobile').default);
Vue.component('window-player', require('./windows/WindowPlayer').default);
Vue.component('window-user-reset-password', require('./windows/WindowUserResetPassword').default);

// Web components
Vue.component('win-menu', require('./windows/components/WinMenu').default);
Vue.component('win-player', require('./windows/components/WinPlayer').default);
Vue.component('win-player-status', require('./windows/components/WinPlayerStatus').default);
Vue.component('win-player-visual', require('./windows/components/WinPlayerVisual').default);
Vue.component('win-player-volume', require('./windows/components/WinPlayerVolume').default);

// Mixins
Vue.mixin(require('@common/js/mixins/helpers').default);
Vue.mixin(require('@common/js/mixins/windows').default);

new Vue({
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
  }
}).$mount('#app');

