import { createApp, h } from 'vue'
import commonComponents from '@app/components/basic'
import commonWindows from '@app/components/windows'
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

app.use(commonComponents)
app.use(commonWindows)

delete app._context.components['WinPlayer']
app.use(mobileComponents)

app.component('app', App)
app.mount('#app')
