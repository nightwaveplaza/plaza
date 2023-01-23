import WindowMobile from '@desktop/js/windows/WindowMobile.vue'
import WindowPlayer from '@desktop/js/windows/WindowPlayer.vue'
import WindowSupport from '@desktop/js/windows/WindowSupport.vue'
import WindowUserResetPassword from '@desktop/js/windows/WindowUserResetPassword.vue'

export const desktopWindows = (app) => {
  app.component('window-mobile', WindowMobile)
  app.component('window-player', WindowPlayer)
  app.component('window-support', WindowSupport)
  app.component('window-user-reset-password', WindowUserResetPassword)
}
