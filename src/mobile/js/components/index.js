import WinPlayer from '@mobile/js/components/WinPlayer.vue'
import WinPlayerStatus from '@mobile/js/components/WinPlayerStatus.vue'

export const mobileComponents = (app) => {
  app.component('win-player', WinPlayer)
  app.component('win-player-status', WinPlayerStatus)
}
