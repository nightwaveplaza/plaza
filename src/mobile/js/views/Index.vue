<template>
  <div :class="appearanceStore.themeName" :style="{backgroundColor}" class="app-desktop">
    <component v-for="window in windowsStore.windows" :is="window.form"/>

    <window-song :id="s.id" :name="s.name" v-for="s in windowsStore.songWindows" :key="s.id"/>
    <window-alert v-for="a in windowsStore.alerts" :key="a.id" :name="a.name" :text="a.text" :title="a.title" :type="a.type"/>

    <win-taskbar/>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, watch } from 'vue'
import { Native } from '@mobile/js/bridge/native'
import { useAppearanceStore } from '@common/js/stores/appearanceStore'
import { useUserAuthStore } from '@common/js/stores/userAuthStore'
import { useWindowsStore } from '@common/js/stores/windowsStore'
import { enBackgroundMode, type Background } from '@common/js/types'
import useEmitter from '@mobile/js/extra/useEmitter'
import { api } from '@common/js/api/api'
import { prefs } from '@common/js/extras/prefs'

const appearanceStore = useAppearanceStore()
const userAuthStore = useUserAuthStore()
const windowsStore = useWindowsStore()
const emitter = useEmitter()

const backgroundColor = computed(() => {
  return appearanceStore.background.mode === enBackgroundMode.SOLID ? appearanceStore.background.color : 'transparent'
})

function registerEmitterEvents() {
  emitter.on('resume', () => updateBackgroundNative(appearanceStore.background))
  emitter.on('closeWindow', (name: string) => windowsStore.close(name))
  emitter.on('openWindow', (name: string) => {
    if ((name === 'user-favorites' || name === 'user') && !userAuthStore.signed) {
      windowsStore.open('user-login')
      return
    }

    windowsStore.open(name)
  })
}

function checkNews() {
  api.news.latest().then(res => {
    const latestNewsRead = prefs.get<number>('latestNewsRead', 0)!
    if (latestNewsRead < res.data.id) {
      windowsStore.open('news')
      prefs.save('latestNewsRead', res.data.id)
    }
  })
}


function updateBackgroundNative(bg: Background) {
  Native.setBackground(bg.mode === enBackgroundMode.SOLID ? 'solid' : bg.image!.src)
}

// Watch background for changes
watch(appearanceStore.$state, (state) => updateBackgroundNative(state.background), { deep: true })

// Watch user token for change
watch(() => userAuthStore.token, (t) => Native.setAuthToken(t as string))

onMounted(() => {
  registerEmitterEvents()
  checkNews()

  windowsStore.open('loading')

  appearanceStore.loadSettings()
  if (appearanceStore.isBackgroundRandomMode) {
    appearanceStore.loadRandomBackground()
  } else {
    updateBackgroundNative(appearanceStore.background)
  }

  Native.getAuthToken()!.then(t => {
    userAuthStore.token = t as string
    userAuthStore.loadUser()
  })

  Native.getUserAgent()!.then(agent => userAuthStore.agent = agent as string)

})
</script>
