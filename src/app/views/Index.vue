<script setup lang="ts">
import { onMounted } from 'vue'
import { useWindows } from '@app/composables/useWindows.ts'
import { useNewsPopup } from '@app/composables/useNewsPopup.ts'
import { useAuth } from '@app/composables/useAuth.ts'
import { Win } from '@app/types'
import { useStatusUpdater } from '@app/composables/useStatusUpdater.ts'

const { openWindow } = useWindows()
const { openNewsIfUpdated } = useNewsPopup()
const { fetchUser } = useAuth()

// Start status update
useStatusUpdater()

onMounted(() => {
  openWindow(Win.LOADING)
  fetchUser()
  openNewsIfUpdated()
})
</script>
