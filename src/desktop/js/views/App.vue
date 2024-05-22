<template>
  <router-view></router-view>
</template>

<script setup lang="ts">
import { onMounted, watch } from 'vue'

import { useAppearanceStore } from '@common/js/stores/appearanceStore.js'
import { useI18n } from 'vue-i18n'

const appearanceStore = useAppearanceStore()
const i18n = useI18n()

watch(() => appearanceStore.language, () => {
  i18n.locale.value = appearanceStore.language
})

onMounted(() => {
  appearanceStore.loadSettings()
})
</script>