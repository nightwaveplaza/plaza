import type { App } from 'vue'
import WinButton from '@common/js/components/WinButton.vue'
import WinList from '@common/js/components/WinList.vue'
import WinMemo from '@common/js/components/WinMemo.vue'
import WinPagination from '@common/js/components/WinPagination.vue'
import WinPlayerReactions from '@common/js/components/WinPlayerReactions.vue'
import WinPlayerTime from '@common/js/components/WinPlayerTime.vue'
import WinTaskbar from '@common/js/components/WinTaskbar.vue'
import WinWindow from '@common/js/components/WinWindow.vue'
import WinStatusBar from '@common/js/components/WinStatusBar.vue'

export default {
  install: (Vue: App): void => {
    Vue.component('win-btn', WinButton)
    Vue.component('win-list', WinList)
    Vue.component('win-memo', WinMemo)
    Vue.component('win-pagination', WinPagination)
    Vue.component('win-player-reactions', WinPlayerReactions)
    Vue.component('win-player-time', WinPlayerTime)
    Vue.component('win-status-bar', WinStatusBar)
    Vue.component('win-taskbar', WinTaskbar)
    Vue.component('win-window', WinWindow)
  },
}
