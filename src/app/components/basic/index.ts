import type { App } from 'vue'
import WinButton from '@app/components/basic/WinButton.vue'
import WinList from '@app/components/basic/WinList.vue'
import WinMemo from '@app/components/basic/WinMemo.vue'
import WinPagination from '@app/components/basic/WinPagination.vue'
import WinPlayerReactions from '@app/components/basic/WinPlayerReactions.vue'
import WinPlayerTime from '@app/components/basic/WinPlayerTime.vue'
import WinTaskbar from '@app/components/basic/WinTaskbar.vue'
import WinWindow from '@app/components/basic/WinWindow.vue'
import WinMenu from '@app/components/basic/WinMenu.vue'
import WinPlayer from '@app/components/basic/WinPlayer.vue'
import WinPlayerVolume from '@app/components/basic/WinPlayerVolume.vue'
import WinGroupBox from '@app/components/basic/WinGroupBox.vue'
import WinPanel from '@app/components/basic/WinPanel.vue'

export default {
  install: (Vue: App): void => {
    Vue.component('WinButton', WinButton)
    Vue.component('WinGroupBox', WinGroupBox)
    Vue.component('WinList', WinList)
    Vue.component('WinMemo', WinMemo)
    Vue.component('WinPagination', WinPagination)
    Vue.component('WinPanel', WinPanel)
    Vue.component('WinPlayerReactions', WinPlayerReactions)
    Vue.component('WinPlayerTime', WinPlayerTime)
    Vue.component('WinTaskbar', WinTaskbar)
    Vue.component('WinWindow', WinWindow)
    Vue.component('WinMenu', WinMenu)
    Vue.component('WinPlayer', WinPlayer)
    Vue.component('WinPlayerVolume', WinPlayerVolume)
  },
}
