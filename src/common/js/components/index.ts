import WinButton from '@common/js/components/WinButton.vue'
import WinList from '@common/js/components/WinList.vue'
import WinMemo from '@common/js/components/WinMemo.vue'
import WinPagination from '@common/js/components/WinPagination.vue'
import WinPlayerReactions from '@common/js/components/WinPlayerReactions.vue'
import WinPlayerTime from '@common/js/components/WinPlayerTime.vue'
import WinTaskbar from '@common/js/components/WinTaskbar.vue'
import WinWindow from '@common/js/components/WinWindow.vue'
import type { App } from 'vue'

export const commonComponents = (app: App) => {
  app.component('win-btn', WinButton)
  app.component('win-list', WinList)
  app.component('win-memo', WinMemo)
  app.component('win-pagination', WinPagination)
  app.component('win-player-reactions', WinPlayerReactions)
  app.component('win-player-time', WinPlayerTime)
  app.component('win-taskbar', WinTaskbar)
  app.component('win-window', WinWindow)
}
