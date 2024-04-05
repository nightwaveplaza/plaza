import type { App } from 'vue'
import WindowDonate from '@mobile/js/windows/WindowDonate.vue'
import WindowPlayer from '@mobile/js/windows/WindowPlayer.vue'
import WindowPlayerTimer from '@mobile/js/windows/WindowPlayerTimer.vue'
import WindowSettings from '@mobile/js/windows/WindowSettings.vue'

export default {
  install: (app: App) => {
    app.component('window-donate', WindowDonate)
    app.component('window-player', WindowPlayer)
    app.component('window-player-timer', WindowPlayerTimer)
    app.component('window-settings', WindowSettings)
  }
}
