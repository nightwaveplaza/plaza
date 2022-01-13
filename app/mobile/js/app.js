import Vue from 'vue';
import {store} from './plugins/store';
import ticker from '@common/js/extras/ticker';

Vue.component('app', require('./Index').default);

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
Vue.component('window-user-reset', require('@common/js/windows/WindowUserReset').default);
Vue.component('window-user-register', require('@common/js/windows/WindowUserRegister').default);
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

// Mobile windows
Vue.component('window-loading', require('./windows/WindowLoading').default);
Vue.component('window-player', require('./windows/WindowPlayer').default);
Vue.component('window-player-timer', require('./windows/WindowPlayerTimer').default);
Vue.component('window-settings', require('./windows/WindowSettings').default);
Vue.component('window-settings-lastfm', require('./windows/WindowSettingsLastfm').default);

// Mobile components
Vue.component('win-player', require('./windows/components/WinPlayer').default);
Vue.component('win-player-status', require('./windows/components/WinPlayerStatus').default);

// Mixins
Vue.mixin(require('@common/js/mixins/helpers').default);
Vue.mixin(require('@common/js/mixins/windows').default);
Vue.mixin(require('@mobile/js/mixins/windows-ext').default);

window.Vue = new Vue({
  store,

  created() {
    window.plaza.vue = this;
  },

  mounted() {
    requestAnimationFrame(this.tick);

    // if (process.env.NODE_ENV !== 'production') {
    //   this.$store.subscribe((mutation, state) => {
    //     console.log('VUEX: ' + mutation.type);
    //   });
    // }
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

