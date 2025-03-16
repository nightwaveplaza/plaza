<script setup lang="ts">
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useWindows } from '@app/composables/useWindows.ts'
import { useUserAuthStore } from '@app/stores/userAuthStore.ts'
const route = useRoute()
const userAuthStore = useUserAuthStore()
const { openWindow, WinType } = useWindows()

onMounted(() => {
  if (route.params.token) {
    userAuthStore.resetToken = route.params.token as string
    openWindow(WinType.USER_RESET_PASSWORD)
  } else {
    openWindow(WinType.USER_RESET)
  }
})
</script>
