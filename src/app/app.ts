import { createApp, h } from 'vue'
import { createPinia } from 'pinia'
import { router } from '@app/router'
import { i18n } from '@locales/_i18n'
import plazaComponents from '@app/components/basic'
import plazaWindows from '@app/components/windows'
import App from '@app/views/App.vue'

const app = createApp({
  render: () => h(App),
})

const pinia = createPinia()

app.use(pinia)
app.use(router)
app.use(i18n)

// Components
app.use(plazaComponents)
app.use(plazaWindows)
app.component('App', App)
app.mount('#app')
