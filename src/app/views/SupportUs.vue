<script setup lang="ts">
import { onMounted } from 'vue'
import { useWindows } from '@app/composables/useWindows.ts'

const { openWindow, WinType } = useWindows()

onMounted(() => {
  openWindow(WinType.SUPPORT)
})
</script>
