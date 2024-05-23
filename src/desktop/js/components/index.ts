import type { App } from 'vue'
import WinMenu from '@desktop/js/components/WinMenu.vue'
import WinPlayer from '@desktop/js/components/WinPlayer.vue'
import WinPlayerStatus from '@desktop/js/components/WinPlayerStatus.vue'
import WinPlayerVolume from '@desktop/js/components/WinPlayerVolume.vue'

export default {
  install: (Vue: App): void => {
    Vue.component('win-menu', WinMenu)
    Vue.component('win-player', WinPlayer)
    Vue.component('win-player-status', WinPlayerStatus)
    Vue.component('win-player-volume', WinPlayerVolume)
  },
}