import type { App } from 'vue'
import WinPlayer from '@mobile/js/components/WinPlayer.vue'
import WinPlayerStatus from '@desktop/js/components/WinPlayerStatus.vue'

export default {
  install: (app: App) => {
    app.component('win-player', WinPlayer)
    app.component('win-player-status', WinPlayerStatus)
  }
}