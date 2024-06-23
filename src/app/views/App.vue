<template>
  <router-view />
</template>

<script setup lang="ts">
import { onMounted, watch } from 'vue'

import { useSettingsStore } from '@app/stores/settingsStore'
import { useI18n } from 'vue-i18n'

const settingsStore = useSettingsStore()
const i18n = useI18n()

watch(() => settingsStore.language, () => {
  i18n.locale.value = settingsStore.language
})

onMounted(() => {
  settingsStore.loadSettings()
})
</script>
