<script setup lang="ts">
import { onMounted } from 'vue'
import { useWindows } from '@app/composables/useWindows.ts'
import { Win } from '@app/types'

const { openWindow } = useWindows()

onMounted(() => {
  openWindow(Win.SUPPORT)
})
</script>
