<script setup lang="ts">
// iOS safari status bar

import { onMounted, watch } from 'vue'
import { useAppSettings } from '@app/composables/useAppSettings.ts'

const themeColors = {
  'win98': '#c0c0c0',
  'contrast': '#000000',
  'rainy': '#8098b0',
  'rose': '#cfafb7',
  'desert': '#d5ccbb'
}

const { theme } = useAppSettings()

// Safari status bar
watch(() => theme.value, () => {
  document!.querySelector('meta[name="theme-color"]')!.setAttribute('content', themeColors[theme.value as keyof typeof themeColors])
})

onMounted(() => {
  document!.querySelector('meta[name="theme-color"]')!.setAttribute('content', themeColors[theme.value as keyof typeof themeColors])
})
</script>
