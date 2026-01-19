import '@mobile/styles/dist.scss'
import '@app/styles/ui/ui.scss'
import '@mobile/styles/app.scss'

import { createApp, h } from 'vue'
import plazaComponents from '@app/components/basic'
import plazaExtraComponents from '@app/components/extra'
import plazaPlayer from '@app/components/player'
import plazaWindows from '@app/components/windows'
import mobileComponents from '@mobile/components'
import App from '@mobile/App.vue'
import { i18n } from '@locales/_i18n.ts'
import { eventBus } from '@mobile/emitter.ts'

// Register event bus
window.emitter = eventBus

const app = createApp({
  render: () => h(App)
})

app.use(i18n)

app.use(plazaComponents)
app.use(plazaExtraComponents)
app.use(plazaPlayer)
app.use(plazaWindows)

delete app._context.components['WinPlayer']
app.use(mobileComponents)

app.component('app', App)
app.mount('#app')
