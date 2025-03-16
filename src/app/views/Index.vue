<script setup lang="ts">
import { onMounted } from 'vue'
import { useUserAuthStore } from '@app/stores/userAuthStore'
import { useWindows } from '@app/composables/useWindows.ts'

const userAuthStore = useUserAuthStore()
const { openWindow, WinType } = useWindows()

onMounted(() => {
  openWindow(WinType.LOADING)
  userAuthStore.loadUser()
})
</script>
