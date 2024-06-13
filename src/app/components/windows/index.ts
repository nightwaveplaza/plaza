import type { App } from 'vue'
import WindowAbout from '@app/components/windows/WindowAbout.vue'
import WindowAlert from '@app/components/windows/WindowAlert.vue'
import WindowCredits from '@app/components/windows/WindowCredits.vue'
import WindowHistory from '@app/components/windows/WindowHistory.vue'
import WindowLoading from '@app/components/windows/WindowLoading.vue'
import WindowNews from '@app/components/windows/WindowNews.vue'
import WindowRatings from '@app/components/windows/WindowRatings.vue'
import WindowSettingsLanguage from '@app/components/windows/WindowSettingsLanguage.vue'
import WindowSong from '@app/components/windows/WindowSong.vue'
import WindowUser from '@app/components/windows/WindowUser.vue'
import WindowUserEmail from '@app/components/windows/WindowUserEmail.vue'
import WindowUserFavorites from '@app/components/windows/WindowUserFavorites.vue'
import WindowUserLogin from '@app/components/windows/WindowUserLogin.vue'
import WindowUserPassword from '@app/components/windows/WindowUserPassword.vue'
import WindowUserRegister from '@app/components/windows/WindowUserRegister.vue'
import WindowUserReset from '@app/components/windows/WindowUserReset.vue'
import WindowMobile from '@app/components/windows/WindowMobile.vue'
import WindowPlayer from '@app/components/windows/WindowPlayer.vue'
import WindowSupport from '@app/components/windows/WindowSupport.vue'
import WindowUserResetPassword from '@app/components/windows/WindowUserResetPassword.vue'
import WindowSettings from '@app/components/windows/WindowSettings.vue'
import WindowPlayerTimer from '@app/components/windows/WindowPlayerTimer.vue'

export default {
  install: (Vue: App): void => {
    Vue.component('WindowAbout', WindowAbout)
    Vue.component('WindowAlert', WindowAlert)
    Vue.component('WindowCredits', WindowCredits)
    Vue.component('WindowHistory', WindowHistory)
    Vue.component('WindowLoading', WindowLoading)
    Vue.component('WindowNews', WindowNews)
    Vue.component('WindowRatings', WindowRatings)
    Vue.component('WindowSettings', WindowSettings)
    Vue.component('WindowSettingsLanguage', WindowSettingsLanguage)
    Vue.component('WindowSong', WindowSong)
    Vue.component('WindowUser', WindowUser)
    Vue.component('WindowUserEmail', WindowUserEmail)
    Vue.component('WindowUserFavorites', WindowUserFavorites)
    Vue.component('WindowUserLogin', WindowUserLogin)
    Vue.component('WindowUserPassword', WindowUserPassword)
    Vue.component('WindowUserRegister', WindowUserRegister)
    Vue.component('WindowUserReset', WindowUserReset)
    Vue.component('WindowMobile', WindowMobile)
    Vue.component('WindowPlayer', WindowPlayer)
    Vue.component('WindowPlayerTimer', WindowPlayerTimer)
    Vue.component('WindowSupport', WindowSupport)
    Vue.component('WindowUserResetPassword', WindowUserResetPassword)
  }
}
