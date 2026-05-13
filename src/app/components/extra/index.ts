import type { App } from 'vue';
import WinConnectionStatus from '@app/components/extra/WinConnectionStatus.vue';
import WinTaskbar from '@app/components/extra/WinTaskbar.vue';
import WinCaptcha from '@app/components/extra/WinCaptcha.vue';
import WinStartMenu from '@app/components/extra/WinStartMenu.vue';
import WinStartButton from '@app/components/extra/WinStartButton.vue';

export default {
  install: (Vue: App): void => {
    Vue.component('WinCaptcha', WinCaptcha);
    Vue.component('WinConnectionStatus', WinConnectionStatus);
    Vue.component('WinStartButton', WinStartButton);
    Vue.component('WinStartMenu', WinStartMenu);
    Vue.component('WinTaskbar', WinTaskbar);
  },
};
