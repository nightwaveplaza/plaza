<script setup lang="ts">
import { onMounted } from 'vue'
import { useUserAuthStore } from '@app/stores/userAuthStore'
import { useWindows } from '@app/composables/useWindows.ts'
import { useNewsPopup } from '@app/composables/useNewsPopup.ts'

const userAuthStore = useUserAuthStore()
const { openWindow, WinType } = useWindows()
const { openNewsIfUpdated } = useNewsPopup()

onMounted(() => {
  openWindow(WinType.LOADING)
  userAuthStore.loadUser()
  openNewsIfUpdated()
})
</script>
