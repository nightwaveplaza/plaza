import { createApp, h } from 'vue'
import { router } from '@desktop/js/router'
import { createPinia } from 'pinia'
import { createI18n, useI18n } from 'vue-i18n'
import locales from '@locales/locales'
import commonComponents from '@common/js/components'
import commonWindows from '@common/js/windows'
import desktopComponents from '@desktop/js/components'
import desktopWindows from '@desktop/js/windows'
import App from '@desktop/js/views/App.vue'

const app = createApp({
  render: () => h(App),
  setup() {
    const { t } = useI18n({ useScope: "global" })
    return { t }
  }
})

app.use(router)

const pinia = createPinia()
app.use(pinia)

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
