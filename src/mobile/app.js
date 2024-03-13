import { createApp, h } from 'vue'
import store from '@mobile/js/store.js'
import ticker from '@common/js/extras/ticker.js'
import Index from '@mobile/js/views/Index.vue'

import { commonComponents } from '@common/js/components'
import { commonWindows } from '@common/js/windows'
import { mobileComponents } from '@mobile/js/components'
import { mobileWindows } from '@mobile/js/windows'

const app = createApp({
  mounted () {
    requestAnimationFrame(this.tick)
  },

  created () {
    window['plaza'].vue = this
  },

  methods: {
    tick () {
      ticker.tick()
      requestAnimationFrame(this.tick)
    },

    pushData (name, data) {
      this.$store.commit('pushData', { name, data })
    },

    openWindow (name) {
      this.$store.dispatch('windows/open', {
        name, form: 'window-' + name,
      })
    },

    closeWindow (name) {
      this.$store.dispatch('windows/close', name)
    },
  },

  render: () => h(Index),
})

app.use(store)
commonComponents(app)
commonWindows(app)
mobileComponents(app)
mobileWindows(app)
app.component('app', Index)
app.mount('#app')
