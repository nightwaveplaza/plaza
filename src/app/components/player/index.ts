import type { App } from 'vue';
import WinPlayerReactions from '@app/components/player/WinPlayerReactions.vue';
import WinPlayerTime from '@app/components/player/WinPlayerTime.vue';
import WinPlayer from '@app/components/player/WinPlayer.vue';
import WinPlayerVolume from '@app/components/player/WinPlayerVolume.vue';
import { isMobile } from '@app/utils/helpers.ts';

export default {
  install: (Vue: App): void => {
    Vue.component('WinPlayerReactions', WinPlayerReactions);
    Vue.component('WinPlayerTime', WinPlayerTime);
    Vue.component('WinPlayer', WinPlayer);

    if (!isMobile()) {
      Vue.component('WinPlayerVolume', WinPlayerVolume);
    }
  },
};
