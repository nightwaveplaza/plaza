import { createApp, h } from 'vue'
import ticker from '@common/extras/ticker'
import App from '@desktop/views/App'
import { router } from '@desktop/router'
import { store } from '@desktop/store'
import { commonComponents } from '@common/components'
import { commonWindows } from '@common/windows'
import { desktopComponents } from '@desktop/components'
import { desktopWindows } from '@desktop/windows'
import { windowsMixin} from '@common/mixins/windows'

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

// Register components
commonComponents(app)
commonWindows(app)
desktopComponents(app)
desktopWindows(app)

// Register the rest of plugins, mixins, etc
app.use(router)
app.use(store)
app.mixin(require('@common/mixins/helpers').default)
app.mixin(windowsMixin)
app.component('app', App)
app.mount('#app')
