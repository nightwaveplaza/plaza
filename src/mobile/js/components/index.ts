import type { App } from 'vue'
import WinPlayer from '@mobile/js/components/WinPlayer.vue'
import WinPlayerStatus from '@app/components/basic/WinPlayerStatus.vue'

export default {
  install: (Vue: App) => {
    Vue.component('WinPlayer', WinPlayer)
    Vue.component('WinPlayerStatus', WinPlayerStatus)
  }
}