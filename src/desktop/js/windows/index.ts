import type { App } from 'vue'
import WindowMobile from '@desktop/js/windows/WindowMobile.vue'
import WindowPlayer from '@desktop/js/windows/WindowPlayer.vue'
import WindowSupport from '@desktop/js/windows/WindowSupport.vue'
import WindowUserResetPassword from '@desktop/js/windows/WindowUserResetPassword.vue'

export default {
  install: (Vue: App): void => {
    Vue.component('WindowMobile', WindowMobile)
    Vue.component('WindowPlayer', WindowPlayer)
    Vue.component('WindowSupport', WindowSupport)
    Vue.component('WindowUserResetPassword', WindowUserResetPassword)
  },
}
