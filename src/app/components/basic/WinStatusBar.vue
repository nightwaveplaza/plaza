<script setup lang="ts">
// iOS safari status bar

import { onMounted, watch } from 'vue'
import { useSettingsStore } from '@app/stores/settingsStore'

const themeColors = {
  'win98': '#c0c0c0',
  'contrast': '#000000',
  'rainy': '#8098b0',
  'rose': '#cfafb7',
  'desert': '#d5ccbb'
}

const settingsStore = useSettingsStore()

// Safari status bar
watch(() => settingsStore.theme, () => {
  document!.querySelector('meta[name="theme-color"]')!.setAttribute("content", themeColors[settingsStore.theme as keyof typeof themeColors])
})

onMounted(() => {
  document!.querySelector('meta[name="theme-color"]')!.setAttribute("content", themeColors[settingsStore.theme as keyof typeof themeColors])
})
</script>
