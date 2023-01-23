import WindowAbout from '@common/js/windows/WindowAbout.vue'
import WindowAlert from '@common/js/windows/WindowAlert.vue'
import WindowCredits from '@common/js/windows/WindowCredits.vue'
import WindowHistory from '@common/js/windows/WindowHistory.vue'
import WindowNews from '@common/js/windows/WindowNews.vue'
import WindowRatings from '@common/js/windows/WindowRatings.vue'
import WindowSettingsBackground from '@common/js/windows/WindowSettingsBackground.vue'
import WindowSong from '@common/js/windows/WindowSong.vue'
import WindowUser from '@common/js/windows/WindowUser.vue'
import WindowUserEmail from '@common/js/windows/WindowUserEmail.vue'
import WindowUserFavorites from '@common/js/windows/WindowUserFavorites.vue'
import WindowUserLogin from '@common/js/windows/WindowUserLogin.vue'
import WindowUserPassword from '@common/js/windows/WindowUserPassword.vue'
import WindowUserRegister from '@common/js/windows/WindowUserRegister.vue'
import WindowUserReset from '@common/js/windows/WindowUserReset.vue'

export const commonWindows = (app) => {
  app.component('window-about', WindowAbout)
  app.component('window-alert', WindowAlert)
  app.component('window-credits', WindowCredits)
  app.component('window-history', WindowHistory)
  app.component('window-news', WindowNews)
  app.component('window-ratings', WindowRatings)
  app.component('window-settings-background', WindowSettingsBackground)
  app.component('window-song', WindowSong)
  app.component('window-user', WindowUser)
  app.component('window-user-email', WindowUserEmail)
  app.component('window-user-favorites', WindowUserFavorites)
  app.component('window-user-login', WindowUserLogin)
  app.component('window-user-password', WindowUserPassword)
  app.component('window-user-register', WindowUserRegister)
  app.component('window-user-reset', WindowUserReset)
}
