import { createApp, h } from 'vue'
import { createPinia } from 'pinia'
import { router } from '@desktop/js/router'
import { i18n } from '@locales/_i18n'
import commonComponents from '@common/js/components'
import commonWindows from '@common/js/windows'
import desktopComponents from '@desktop/js/components'
import desktopWindows from '@desktop/js/windows'
import App from '@desktop/js/views/App.vue'

const app = createApp({
  render: () => h(App),
})

const pinia = createPinia()

app.use(pinia)
app.use(router)
app.use(i18n)

// Components
app.use(commonComponents)
app.use(commonWindows)
app.use(desktopComponents)
app.use(desktopWindows)
app.component('app', App)
app.mount('#app')
