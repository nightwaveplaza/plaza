<script setup lang="ts">
import { onMounted } from 'vue'
import { useWindows } from '@app/composables/useWindows.ts'
import { useNewsPopup } from '@app/composables/useNewsPopup.ts'
import { useAuth } from '@app/composables/useAuth.ts'

const { openWindow, WinType } = useWindows()
const { openNewsIfUpdated } = useNewsPopup()
const { fetchUser } = useAuth()

onMounted(() => {
  openWindow(WinType.LOADING)
  fetchUser()
  openNewsIfUpdated()
})
</script>
