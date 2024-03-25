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
import { enBackgroundMode, type ifcBackground } from '@common/js/types'
import useEmitter from '@mobile/js/extra/useEmitter'

const appearanceStore = useAppearanceStore()
const userAuthStore = useUserAuthStore()
const windowsStore = useWindowsStore()
const emitter = useEmitter()

const backgroundColor = computed(() => {
  return appearanceStore.background.mode === enBackgroundMode.SOLID ? appearanceStore.background.color : 'transparent'
})

function startup () {
  windowsStore.open('loading')

  updateBackground(appearanceStore.background)

  Native.getAuthToken()!.then(t => {
    userAuthStore.token = t as string
    userAuthStore.loadUser()
  })

  Native.getUserAgent()!.then(agent => userAuthStore.agent = agent as string)
}

function updateBackground(bg: ifcBackground) {
  Native.setBackground(bg.mode === enBackgroundMode.SOLID ? 'solid' : bg.image!.src)
}

// Watch background for changes
watch(appearanceStore.$state, (state) => {
  updateBackground(state.background)
}, { deep: true })

// Watch user token for change
watch(() => userAuthStore.token, (t) => {
  Native.setAuthToken(t as string)
})

onMounted(() => {
  startup()

  emitter.on('resume', () => appearanceStore.loadBackground())
  emitter.on('closeWindow', (name: string) => windowsStore.close(name))
  emitter.on('openWindow', (name: string) => {
    if ((name === 'user-favorites' || name === 'user') && !userAuthStore.signed) {
      windowsStore.open('user-login')
      return
    }

    windowsStore.open(name)
  })
})
</script>
