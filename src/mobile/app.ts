import { createApp, h } from 'vue'
import { createPinia } from 'pinia'
import commonComponents from '@app/components/basic'
import commonWindows from '@app/components/windows'
import mobileComponents from '@mobile/components'
import mobileWindows from '@mobile/windows'
import Index from '@mobile/views/Index.vue'
import mitt from 'mitt'
import {i18n} from "@locales/_i18n.ts";

window.emitter = mitt()

const app = createApp({
  render: () => h(Index),
})

const pinia = createPinia()
app.use(pinia)
app.use(i18n)


app.use(commonComponents)
app.use(commonWindows)

delete app._context.components["WinPlayer"]
delete app._context.components["WindowPlayer"]

app.use(mobileComponents)
app.use(mobileWindows)

app.component('app', Index)
app.mount('#app')
