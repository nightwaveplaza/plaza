import { computed } from 'vue'
import { useNowPlayingStatus} from '@app/composables/player/useNowPlayingStatus.ts'
import { useLocalStorage } from '@vueuse/core'

interface UserReaction {
  rate: number
  songId: string | null
}

const reaction = useLocalStorage<UserReaction>('user_reaction', {
  rate: 0,
  songId: null
})

export function useReactions() {
  const { song } = useNowPlayingStatus()

  const isCurrent = computed(() => reaction.value.songId === song.id)

  const setReaction = (newReaction: number): void => {
    reaction.value.rate = newReaction
    reaction.value.songId = song.id
  }

  const resetReaction = (): void => {
    reaction.value.rate = 0
    reaction.value.songId = null
  }

  return {
    isCurrent,
    reaction,
    setReaction,
    resetReaction
  }
}