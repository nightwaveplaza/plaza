<script setup lang="ts">
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useWindows } from '@app/composables/useWindows.ts'
import { useAuth } from '@app/composables/useAuth.ts'
const route = useRoute()
const { openWindow, WinType } = useWindows()
const { setResetToken } = useAuth()

onMounted(() => {
  if (route.params.token) {
    setResetToken(route.params.token as string)
    openWindow(WinType.USER_RESET_PASSWORD)
  } else {
    openWindow(WinType.USER_RESET)
  }
})
</script>
