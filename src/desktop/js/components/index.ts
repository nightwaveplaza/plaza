import type { App } from 'vue'
import WinMenu from '@desktop/js/components/WinMenu.vue'
import WinPlayer from '@desktop/js/components/WinPlayer.vue'
import WinPlayerStatus from '@desktop/js/components/WinPlayerStatus.vue'
import WinPlayerVolume from '@desktop/js/components/WinPlayerVolume.vue'

export default {
  install: (app: App) => {
    app.component('win-menu', WinMenu)
    app.component('win-player', WinPlayer)
    app.component('win-player-status', WinPlayerStatus)
    app.component('win-player-volume', WinPlayerVolume)
  },
}