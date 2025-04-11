import type { App } from 'vue'
import WinPlayerReactions from '@app/components/player/WinPlayerReactions.vue'
import WinPlayerTime from '@app/components/player/WinPlayerTime.vue'

export default {
  install: (Vue: App): void => {
    Vue.component('WinPlayerReactions', WinPlayerReactions)
    Vue.component('WinPlayerTime', WinPlayerTime)
  },
}
