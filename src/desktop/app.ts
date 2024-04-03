import { createApp, h } from 'vue'
import { router } from '@desktop/js/router'
import commonComponents from '@common/js/components'
import commonWindows from '@common/js/windows'
import desktopComponents from '@desktop/js/components'
import desktopWindows from '@desktop/js/windows'
import { createPinia } from 'pinia'
import App from '@desktop/js/views/App.vue'

const app = createApp({
  render: () => h(App),
})

const pinia = createPinia()

app.use(pinia)
app.use(router)

// Components
app.use(commonComponents)
app.use(commonWindows)
app.use(desktopComponents)
app.use(desktopWindows)

app.component('app', App)
app.mount('#app')
