import type { App } from 'vue'
import WinButton from '@app/components/basic/WinButton.vue'
import WinList from '@app/components/basic/WinList.vue'
import WinMemo from '@app/components/basic/WinMemo.vue'
import WinPagination from '@app/components/basic/WinPagination.vue'
import WinWindow from '@app/components/basic/WinWindow.vue'
import WinMenu from '@app/components/basic/WinMenu.vue'
import WinGroupBox from '@app/components/basic/WinGroupBox.vue'
import WinPanel from '@app/components/basic/WinPanel.vue'
import WinMenuAction from '@app/components/basic/WinMenuAction.vue'
import WinLoadingBar from '@app/components/basic/WinLoadingBar.vue'

export default {
  install: (Vue: App): void => {
    Vue.component('WinButton', WinButton)
    Vue.component('WinGroupBox', WinGroupBox)
    Vue.component('WinList', WinList)
    Vue.component('WinLoadingBar', WinLoadingBar)
    Vue.component('WinMemo', WinMemo)
    Vue.component('WinMenu', WinMenu)
    Vue.component('WinMenuAction', WinMenuAction)
    Vue.component('WinPagination', WinPagination)
    Vue.component('WinPanel', WinPanel)
    Vue.component('WinWindow', WinWindow)
  },
}
