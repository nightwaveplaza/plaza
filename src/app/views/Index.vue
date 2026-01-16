<script setup lang="ts">
import { onMounted, watch } from 'vue'
import { useWindows } from '@app/composables/useWindows.ts'
import { useNewsPopup } from '@app/composables/useNewsPopup.ts'
import { useAuth } from '@app/composables/useAuth.ts'
import { Win } from '@app/types'
import { useStatusUpdater } from '@app/composables/useStatusUpdater.ts'
import { useNowPlayingStatus } from '@app/composables/player/useNowPlayingStatus.ts'

const { openWindow, closeWindow } = useWindows()
const { openNewsIfUpdated } = useNewsPopup()
const { fetchUser } = useAuth()
const { song } = useNowPlayingStatus()

// Start status update
useStatusUpdater()

onMounted(() => {
  openWindow(Win.LOADING)
  fetchUser()
  openNewsIfUpdated()
})

// waiting for the first status response then check news and open up player
watch(() => song.id, () => {
  openWindow(Win.PLAYER)
  closeWindow(Win.LOADING)
}, {
  once: true
})
</script>
