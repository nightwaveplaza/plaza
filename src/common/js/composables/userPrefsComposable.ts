import { useStore } from 'vuex'
import settings from '@common/js/extras/settings'
import { backgrounds, user } from '@common/js/api/api'
import { useAppearanceStore } from '@common/js/stores/appearanceStore'
import type { IfcBackground } from '@common/js/types'

export default function () {
  const store = useStore()
  const appearanceStore = useAppearanceStore()

  // async function loadBackground() {
  //   let bg: IfcBackground = settings.load('background_v2')
  //
  //   if (bg) {
  //     if (bg.mode === 0) {
  //       bg.image = (await backgrounds.random()).data;
  //     }
  //     appearanceStore.$patch({
  //       background: bg
  //     })
  //   }
  // }
  //
  // function applyBackground(bg: IfcBackground) {
  //   appearanceStore.$patch({
  //     background: bg
  //   })
  //   settings.save('background_v2', bg)
  // }
  //
  // function applyTheme(theme: string) {
  //   appearanceStore.$patch({
  //     theme: theme
  //   })
  //   settings.save('theme', theme)
  // }
  //
  // function loadTheme() {
  //   let theme: string = settings.load('theme') ?? 'win98'
  //   appearanceStore.$patch({
  //     theme: theme
  //   })
  // }

  // function loadUser () {
  //   const token = store.getters.token
  //   if (token) {
  //     store.commit('user/token', token)
  //     user.get().then(result => {
  //       store.commit('user/auth', result.data)
  //     }).catch(() => {})
  //   }
  // }

  return { }
}
