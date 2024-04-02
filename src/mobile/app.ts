import { createApp, h } from 'vue'
import { createPinia } from 'pinia'
import { commonComponents } from '@common/js/components'
import { commonWindows } from '@common/js/windows'
import { mobileComponents } from '@mobile/js/components'
import { mobileWindows } from '@mobile/js/windows'
import Index from '@mobile/js/views/Index.vue'
import mitt from 'mitt'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

const app = createApp({
  emitter: null,

  created () {
    window['plaza'].vue = this
  },

  methods: {
    pushData (name: string, data: string) {
      this.emitter.emit(name, data)
    },

    openWindow (name: string) {
      this.emitter.emit('openWindow', name)
    },

    closeWindow (name: string) {
      this.emitter.emit('closeWindow', name)
    },
  },

  render: () => h(Index),
})

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

const emitter = mitt()
app.use(pinia)
app.config.globalProperties.emitter = emitter

commonComponents(app)
commonWindows(app)
mobileComponents(app)
mobileWindows(app)
app.component('app', Index)

app.mount('#app')
