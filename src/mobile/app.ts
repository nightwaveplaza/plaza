import { createApp, h } from 'vue'
import { createPinia } from 'pinia'
import commonComponents from '@app/components/basic'
import commonWindows from '@app/components/windows'
import mobileComponents from '@mobile/components'
import mobileWindows from '@mobile/windows'
import Index from '@mobile/views/Index.vue'
import mitt from 'mitt'

const app = createApp({
  emitter: null,

  created () {
    (window as any).plaza.vue = this
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
app.use(pinia)

const emitter = mitt()
app.config.globalProperties.emitter = emitter

app.use(commonComponents)
app.use(commonWindows)
app.use(mobileComponents)
app.use(mobileWindows)

app.component('app', Index)
app.mount('#app')
