import '@app/styles/dist.scss'
import '@app/styles/ui/ui.scss'
import '@app/styles/app.scss'

import { createApp, h } from 'vue'
import { router } from '@app/router'
import { i18n } from '@locales/_i18n'
import plazaComponents from '@app/components/basic'
import plazaExtraComponents from '@app/components/extra'
import plazaPlayer from '@app/components/player'
import plazaPlayerDesktop from '@app/components/player/desktop.ts'
import plazaWindows from '@app/components/windows'
import App from '@app/views/App.vue'

const app = createApp({
  render: () => h(App),
})

app.use(router)
app.use(i18n)

// Components
app.use(plazaComponents)
app.use(plazaExtraComponents)
app.use(plazaPlayer)
app.use(plazaPlayerDesktop)
app.use(plazaWindows)
app.component('App', App)
app.mount('#app')
