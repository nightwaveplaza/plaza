<script setup lang="ts">
import { onMounted } from 'vue'
import { useWindows } from '@app/composables/useWindows.ts'

const { showAlert } = useWindows()

onMounted(() => {
  showAlert('Page not found.', '404')
})
</script>
