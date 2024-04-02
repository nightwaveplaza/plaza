import WinPlayer from '@mobile/js/components/WinPlayer.vue'
import WinPlayerStatus from '@desktop/js/components/WinPlayerStatus.vue'
import type { App } from 'vue'

export const mobileComponents = (app: App) => {
  app.component('win-player', WinPlayer)
  app.component('win-player-status', WinPlayerStatus)
}
