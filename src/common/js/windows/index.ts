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
    Vue.component('WindowAbout', WindowAbout)
    Vue.component('WindowAlert', WindowAlert)
    Vue.component('WindowCredits', WindowCredits)
    Vue.component('WindowHistory', WindowHistory)
    Vue.component('WindowLoading', WindowLoading)
    Vue.component('WindowNews', WindowNews)
    Vue.component('WindowRatings', WindowRatings)
    Vue.component('WindowSettingsBackground', WindowSettingsBackground)
    Vue.component('WindowSettingsLanguage', WindowSettingsLanguage)
    Vue.component('WindowSong', WindowSong)
    Vue.component('WindowUser', WindowUser)
    Vue.component('WindowUserEmail', WindowUserEmail)
    Vue.component('WindowUserFavorites', WindowUserFavorites)
    Vue.component('WindowUserLogin', WindowUserLogin)
    Vue.component('WindowUserPassword', WindowUserPassword)
    Vue.component('WindowUserRegister', WindowUserRegister)
    Vue.component('WindowUserReset', WindowUserReset)
  }
}
