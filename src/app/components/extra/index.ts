import type { App } from 'vue'
import WinConnectionStatus from '@app/components/extra/WinConnectionStatus.vue'
import WinTaskbar from '@app/components/extra/WinTaskbar.vue'

export default {
  install: (Vue: App): void => {
    Vue.component('WinConnectionStatus', WinConnectionStatus)
    Vue.component('WinTaskbar', WinTaskbar)
  }
}
