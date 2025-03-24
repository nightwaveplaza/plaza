import { onBeforeUnmount, onMounted } from 'vue'
import { api } from '@app/api/api.ts'
import { useNowPlayingStatus } from '@app/composables/player/useNowPlayingStatus.ts'

const STATUS_UPDATE_INTERVAL = 10000

export function useStatusUpdater() {
  let unmounted = false
  let intervalId = 0
  const { setSong, setReactions, setListeners, setPosition } = useNowPlayingStatus()

  const updateStatus = (): void => {
    api.status.get().then((res) => {
      setSong(res.data.song)
      setReactions(res.data.song.reactions)
      setListeners(res.data.listeners)
      setPosition(res.data.song.position)
    }).catch(e => {
      console.log(`Failed to update status: ${(e as Error).message}`)
    })

    if (!unmounted) {
      intervalId = window.setTimeout(updateStatus, STATUS_UPDATE_INTERVAL)
    }
  }

  onMounted(() => {
    updateStatus()
  })

  onBeforeUnmount(() => {
    if (intervalId != 0) {
      clearTimeout(intervalId)
    }
    unmounted = true
  })
}
