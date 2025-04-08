import type { App } from 'vue'
import WinPlayer from '@mobile/components/WinPlayer.vue'

export default {
  install: (Vue: App): void => {
    Vue.component('WinPlayer', WinPlayer)
  }
}
