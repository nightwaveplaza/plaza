import { createApp, h } from 'vue'
import { router } from '@desktop/js/router'
import commonComponents from '@common/js/components'
import commonWindows from '@common/js/windows'
import desktopComponents from '@desktop/js/components'
import desktopWindows from '@desktop/js/windows'
import { createPinia } from 'pinia'
import { createI18n } from 'vue-i18n'
import App from '@desktop/js/views/App.vue'
import locales from '@locales/locales.ts'

const app = createApp({
  render: () => h(App),
})

const pinia = createPinia()

app.use(pinia)
app.use(router)

// Locale
const i18n = createI18n({
  legacy: false,
  locale: 'en',
  fallbackLocale: 'en',
  messages: locales
})
app.use(i18n)

// Components
app.use(commonComponents)
app.use(commonWindows)
app.use(desktopComponents)
app.use(desktopWindows)
app.component('app', App)
app.mount('#app')
