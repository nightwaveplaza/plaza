<template>
  <div :class="settingsStore.themeName" :style="{backgroundColor}" class="app-desktop">
    <component v-for="window in windowsStore.windows" :is="window.form"/>

    <window-song v-for="s in windowsStore.songWindows" :id="s.id" :name="s.name" :key="s.id"/>
    <window-alert v-for="a in windowsStore.alerts" :key="a.id" :name="a.name" :text="a.text" :title="a.title" :type="a.type"/>

    <win-taskbar/>
    <native-watcher />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, watch } from 'vue'
import { Native } from '@mobile/bridge/native'
import { useSettingsStore } from '@app/stores/settingsStore'
import { useUserAuthStore } from '@app/stores/userAuthStore'
import { useWindowsStore } from '@app/stores/windowsStore'
import { enBackgroundMode } from '@app/types/types'
import {useI18n} from 'vue-i18n';

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

onMounted(() => {
  settingsStore.loadSettings()

  windowsStore.open('loading')

  settingsStore.loadSettings()
  if (settingsStore.isBackgroundRandomMode) {
    settingsStore.loadRandomBackground()
  }

  Native.getAuthToken()!.then(t => {
    userAuthStore.token = t as string
    userAuthStore.loadUser()
  })

  Native.getUserAgent()!.then(agent => userAuthStore.agent = agent as string)

})
</script>
