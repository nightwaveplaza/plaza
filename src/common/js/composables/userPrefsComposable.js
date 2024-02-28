import { useStore } from 'vuex'
import settings from '@common/js/extras/settings'
import { background, user } from '@common/js/api/api'

export default function () {
  const store = useStore()

  async function loadBackground() {
    let bg = settings.load('background_v2')

    if (bg) {
      if (bg.mode === 0) {
        bg.image = (await background.random()).data;
      }
      store.commit('appearance/background', bg)
    }
  }

  function applyBackground(bg) {
    store.commit('appearance/background', bg)
    settings.save('background_v2', bg)
  }

  function applyTheme(theme) {
    store.commit('appearance/theme', theme)
    settings.save('theme', theme)
  }

  function loadTheme() {
    let theme = settings.load('theme') ?? 'win98'
    store.commit('appearance/theme', theme)
  }

  function loadUser () {
    const token = store.getters.token
    if (token) {
      store.commit('user/token', token)
      user.get().then(result => {
        store.commit('user/auth', result.data)
      }).catch(() => {})
    }
  }

  return { applyBackground, loadBackground, applyTheme, loadTheme, loadUser }
}
