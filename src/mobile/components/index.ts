import type { App } from 'vue'
import WinPlayer from '@mobile/components/WinPlayer.vue'
import NativeWatcher from "@mobile/components/NativeWatcher.vue";

export default {
  install: (Vue: App) => {
    Vue.component('WinPlayer', WinPlayer)
    Vue.component('NativeWatcher', NativeWatcher)
  }
}