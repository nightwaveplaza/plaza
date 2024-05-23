import type { App } from 'vue'
import WinMenu from '@desktop/js/components/WinMenu.vue'
import WinPlayer from '@desktop/js/components/WinPlayer.vue'
import WinPlayerStatus from '@desktop/js/components/WinPlayerStatus.vue'
import WinPlayerVolume from '@desktop/js/components/WinPlayerVolume.vue'

export default {
  install: (Vue: App): void => {
    Vue.component('WinMenu', WinMenu)
    Vue.component('WinPlayer', WinPlayer)
    Vue.component('WinPlayerStatus', WinPlayerStatus)
    Vue.component('WinPlayerVolume', WinPlayerVolume)
  },
}
