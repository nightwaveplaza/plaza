<template>
  <div class="app-desktop" :class="appearanceStore.themeName" :style="{backgroundImage, backgroundColor}">
    <component v-for="window in windowsStore.windows" :is="window.form"/>

    <window-song :id="s.id" :name="s.name" v-for="s in windowsStore.songWindows" :key="s.id"/>
    <window-alert v-for="a in windowsStore.alerts" :key="a.id" :name="a.name" :text="a.text" :title="a.title" :type="a.type"/>

    <win-taskbar/>
    <win-status-bar />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useAppearanceStore } from '@common/js/stores/appearanceStore'
import { useUserAuthStore } from '@common/js/stores/userAuthStore'
import { useWindowsStore } from '@common/js/stores/windowsStore'

const appearanceStore = useAppearanceStore()
const userAuthStore = useUserAuthStore()
const windowsStore = useWindowsStore()

// Appearance
const backgroundImage = computed(() => appearanceStore.backgroundSrc)
const backgroundColor = computed(() => appearanceStore.background.color)

onMounted(() => {
  windowsStore.open('loading')

  appearanceStore.loadSettings()
  if (appearanceStore.isBackgroundRandomMode) {
    appearanceStore.loadRandomBackground()
  }
  userAuthStore.loadUser()

})
</script>
