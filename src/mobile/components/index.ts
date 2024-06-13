import type { App } from 'vue'
import WinPlayer from '@mobile/components/WinPlayer.vue'
import NativeWatcher from "@mobile/components/NativeWatcher.vue";
import WindowPlayer from '@mobile/components/WindowPlayer.vue'

export default {
  install: (Vue: App) => {
    Vue.component('WinPlayer', WinPlayer)
    Vue.component('WindowPlayer', WindowPlayer)
    Vue.component('NativeWatcher', NativeWatcher)
  }
}