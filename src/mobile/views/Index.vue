<template>
  <div :class="settingsStore.themeName" :style="{backgroundColor}" class="app-desktop">
    <component v-for="window in windowsStore.windows" :is="window.form"/>

    <window-song v-for="s in windowsStore.songWindows" :id="s.id" :name="s.name" :key="s.id"/>
    <window-alert v-for="a in windowsStore.alerts" :key="a.id" :name="a.name" :text="a.text" :title="a.title" :type="a.type"/>

    <win-taskbar/>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, watch } from 'vue'
import { Native } from '@mobile/bridge/native'
import { useSettingsStore } from '@app/stores/settingsStore'
import { useUserAuthStore } from '@app/stores/userAuthStore'
import { useWindowsStore } from '@app/stores/windowsStore'
import { enBackgroundMode, type Background } from '@app/types/types'
import {useI18n} from "vue-i18n";
import { eventBus } from '@mobile/events/eventBus.ts'

const i18n = useI18n()
const settingsStore = useSettingsStore()
const userAuthStore = useUserAuthStore()
const windowsStore = useWindowsStore()

watch(() => settingsStore.language, () => {
  i18n.locale.value = settingsStore.language
})

const backgroundColor = computed(() => {
  return settingsStore.background.mode === enBackgroundMode.SOLID ? settingsStore.background.color : 'transparent'
})

function registerEmitterEvents () {
  eventBus.on('resume', () => updateBackgroundNative(settingsStore.background))
  eventBus.on('closeWindow', (name: string) => {
    windowsStore.close(name)
  })
  eventBus.on('openWindow', (name: string) => {
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
  settingsStore.loadSettings()
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
