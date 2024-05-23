<template>
  <div :class="settingsStore.themeName" :style="{backgroundColor}" class="app-desktop">
    <component v-for="window in windowsStore.windows" :is="window.form"/>

    <window-song :id="s.id" :name="s.name" v-for="s in windowsStore.songWindows" :key="s.id"/>
    <window-alert v-for="a in windowsStore.alerts" :key="a.id" :name="a.name" :text="a.text" :title="a.title" :type="a.type"/>

    <win-taskbar/>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, watch } from 'vue'
import { Native } from '@mobile/js/bridge/native'
import { useSettingsStore } from '@common/js/stores/settingsStore'
import { useUserAuthStore } from '@common/js/stores/userAuthStore'
import { useWindowsStore } from '@common/js/stores/windowsStore'
import { enBackgroundMode, type Background } from '@common/js/types'
import useEmitter from '@mobile/js/extra/useEmitter'

const settingsStore = useSettingsStore()
const userAuthStore = useUserAuthStore()
const windowsStore = useWindowsStore()
const emitter = useEmitter()

const backgroundColor = computed(() => {
  return settingsStore.background.mode === enBackgroundMode.SOLID ? settingsStore.background.color : 'transparent'
})

function registerEmitterEvents () {
  emitter.on('resume', () => updateBackgroundNative(settingsStore.background))
  emitter.on('closeWindow', (name: string) => windowsStore.close(name))
  emitter.on('openWindow', (name: string) => {
    if ((name === 'user-favorites' || name === 'user') && !userAuthStore.signed) {
      windowsStore.open('user-login')
      return
    }

    windowsStore.open(name)
  })
}

function updateBackgroundNative (bg: Background) {
  Native.setBackground(bg.mode === enBackgroundMode.SOLID ? 'solid' : bg.image!.src)
}

// Watch background for changes
watch(() => settingsStore.background, (b) => {
    if (b.image) {
      updateBackgroundNative(b as Background)
    }
  }, { deep: true },
)

// Watch user token for change
watch(() => userAuthStore.token, (t) => Native.setAuthToken(t as string))

onMounted(() => {
  registerEmitterEvents()

  windowsStore.open('loading')

  settingsStore.loadSettings()
  if (settingsStore.isBackgroundRandomMode) {
    settingsStore.loadRandomBackground()
  } else {
    updateBackgroundNative(settingsStore.background)
  }

  Native.getAuthToken()!.then(t => {
    userAuthStore.token = t as string
    userAuthStore.loadUser()
  })

  Native.getUserAgent()!.then(agent => userAuthStore.agent = agent as string)

})
</script>
