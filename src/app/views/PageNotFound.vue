<script setup lang="ts">
import { onMounted } from 'vue'
import { useWindows } from '@app/composables/useWindows.ts'

const { winAlert } = useWindows()

onMounted(() => {
  winAlert('Page not found.', '404')
})
</script>
