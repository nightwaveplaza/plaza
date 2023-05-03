import { createApp, h } from 'vue'
import ticker from '@common/js/extras/ticker.js'
import { router } from '@desktop/js/router'
import store from '@desktop/js/store'
import { commonComponents } from '@common/js/components'
import { commonWindows } from '@common/js/windows'
import { desktopComponents } from '@desktop/js/components'
import { desktopWindows } from '@desktop/js/windows'
import App from '@desktop/js/views/App.vue'

const app = createApp({
  mounted () {
    requestAnimationFrame(this.tick)
  },

  methods: {
    tick () {
      ticker.tick()
      requestAnimationFrame(this.tick)
    },
  },

  render: () => h(App),
})

app.use(router)
app.use(store)

// Register components
commonComponents(app)
commonWindows(app)
desktopComponents(app)
desktopWindows(app)
app.component('app', App)
app.mount('#app')
