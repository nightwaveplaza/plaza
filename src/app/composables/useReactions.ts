import { computed, reactive } from 'vue'
import { useNowPlayingStatus } from '@app/composables/player/useNowPlayingStatus.ts'
import { prefs } from '@app/utils/prefs.ts'

interface UserReaction {
  rate: number,
  songId: string|null
}

const reaction = reactive(prefs.get<UserReaction>('user_reaction', {
  rate: 0,
  songId: null
}))

export function useReactions() {
  const { song } = useNowPlayingStatus()

  const isCurrent = computed(() => reaction.songId === song.id)

  const setReaction = (newReaction: number) => {
    reaction.rate = newReaction
    reaction.songId = song.id
  }

  const resetReaction = (): void => {
    reaction.rate = 0
    reaction.songId = null
    save()
  }

  const save = (): void => {
    prefs.save<UserReaction>('user_reaction', reaction)
  }

  return { isCurrent, reaction, setReaction, resetReaction }
}
