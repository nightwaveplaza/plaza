<script setup lang="ts">
// iOS safari status bar

import { onMounted, watch } from 'vue'
import { useAppearanceStore } from '@common/js/stores/appearanceStore'

const themeColors = {
  'win98': '#c0c0c0',
  'contrast': '#000000',
  'rainy': '#8098b0',
  'rose': '#cfafb7',
  'desert': '#d5ccbb'
}

const appearanceStore = useAppearanceStore()

// Safari status bar
watch(() => appearanceStore.theme, (n) => {
  document.body.style.backgroundColor = themeColors[appearanceStore.theme]
})

onMounted(() => {
  document.body.style.backgroundColor = themeColors[appearanceStore.theme]
})
</script>