import type { App } from 'vue'
import WindowAbout from '@common/js/windows/WindowAbout.vue'
import WindowAlert from '@common/js/windows/WindowAlert.vue'
import WindowCredits from '@common/js/windows/WindowCredits.vue'
import WindowHistory from '@common/js/windows/WindowHistory.vue'
import WindowLoading from '@common/js/windows/WindowLoading.vue'
import WindowNews from '@common/js/windows/WindowNews.vue'
import WindowRatings from '@common/js/windows/WindowRatings.vue'
import WindowSettingsBackground from '@common/js/windows/WindowSettingsBackground.vue'
import WindowSettingsLanguage from '@common/js/windows/WindowSettingsLanguage.vue'
import WindowSong from '@common/js/windows/WindowSong.vue'
import WindowUser from '@common/js/windows/WindowUser.vue'
import WindowUserEmail from '@common/js/windows/WindowUserEmail.vue'
import WindowUserFavorites from '@common/js/windows/WindowUserFavorites.vue'
import WindowUserLogin from '@common/js/windows/WindowUserLogin.vue'
import WindowUserPassword from '@common/js/windows/WindowUserPassword.vue'
import WindowUserRegister from '@common/js/windows/WindowUserRegister.vue'
import WindowUserReset from '@common/js/windows/WindowUserReset.vue'

export default {
  install: (Vue: App): void => {
    Vue.component('window-about', WindowAbout)
    Vue.component('window-alert', WindowAlert)
    Vue.component('window-credits', WindowCredits)
    Vue.component('window-history', WindowHistory)
    Vue.component('window-loading', WindowLoading)
    Vue.component('window-news', WindowNews)
    Vue.component('window-ratings', WindowRatings)
    Vue.component('window-settings-background', WindowSettingsBackground)
    Vue.component('window-settings-language', WindowSettingsLanguage)
    Vue.component('window-song', WindowSong)
    Vue.component('window-user', WindowUser)
    Vue.component('window-user-email', WindowUserEmail)
    Vue.component('window-user-favorites', WindowUserFavorites)
    Vue.component('window-user-login', WindowUserLogin)
    Vue.component('window-user-password', WindowUserPassword)
    Vue.component('window-user-register', WindowUserRegister)
    Vue.component('window-user-reset', WindowUserReset)
  }
}
