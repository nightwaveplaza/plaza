<script setup lang="ts">
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useWindows } from '@app/composables/useWindows.ts'
import { useAuth } from '@app/composables/useAuth.ts'
import { Win } from '@app/types'
const route = useRoute()
const { openWindow } = useWindows()
const { setResetToken } = useAuth()

onMounted(() => {
  if (route.params.token) {
    setResetToken(route.params.token as string)
    openWindow(Win.USER_RESET_PASSWORD)
  } else {
    openWindow(Win.USER_RESET)
  }
})
</script>
