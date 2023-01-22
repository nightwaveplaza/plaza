import { createApp, h } from 'vue'
import ticker from '@common/extras/ticker'
import App from '@desktop/views/App'
import { router } from '@desktop/router'
import { store } from '@desktop/store'
import { commonComponents } from '@common/components'
import { commonWindows } from '@common/windows'
import { desktopComponents } from '@desktop/components'
import { desktopWindows } from '@desktop/windows'
// import { windowsMixin} from '@common/mixins/windows'

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

  render: ()=>h(App)
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
