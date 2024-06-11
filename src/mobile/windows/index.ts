import type { App } from 'vue'
import WindowPlayer from '@mobile/windows/WindowPlayer.vue'
import WindowPlayerTimer from '@mobile/windows/WindowPlayerTimer.vue'

export default {
  install: (Vue: App) => {
    Vue.component('WindowPlayer', WindowPlayer)
    Vue.component('WindowPlayerTimer', WindowPlayerTimer)
  }
}
