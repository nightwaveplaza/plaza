import WinPlayer from '@app/components/player/WinPlayer.vue'
import WinPlayerVolume from '@app/components/player/WinPlayerVolume.vue'
import type { App } from 'vue'

export default {
  install: (Vue: App): void => {
    Vue.component('WinPlayer', WinPlayer)
    Vue.component('WinPlayerVolume', WinPlayerVolume)
  },
}
