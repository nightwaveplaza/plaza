import { createApp, h } from 'vue'
import { router } from '@desktop/js/router'
import { commonComponents } from '@common/js/components'
import { commonWindows } from '@common/js/windows'
import { desktopComponents } from '@desktop/js/components'
import { desktopWindows } from '@desktop/js/windows'
import { createPinia } from 'pinia'
import App from '@desktop/js/views/App.vue'


const app = createApp({
  render: () => h(App),
})

const pinia = createPinia()

app.use(pinia)
app.use(router)

// Register components
commonComponents(app)
commonWindows(app)
desktopComponents(app)
desktopWindows(app)
app.component('app', App)
app.mount('#app')
