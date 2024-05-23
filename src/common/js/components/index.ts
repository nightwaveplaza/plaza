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
    Vue.component('WinButton', WinButton)
    Vue.component('WinList', WinList)
    Vue.component('WinMemo', WinMemo)
    Vue.component('WinPagination', WinPagination)
    Vue.component('WinPlayerReactions', WinPlayerReactions)
    Vue.component('WinPlayerTime', WinPlayerTime)
    Vue.component('WinStatusBar', WinStatusBar)
    Vue.component('WinTaskbar', WinTaskbar)
    Vue.component('WinWindow', WinWindow)
  },
}
