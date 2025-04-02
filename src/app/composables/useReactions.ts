import { computed, reactive, type Ref, type UnwrapNestedRefs } from 'vue'
import { useNowPlayingStatus } from '@app/composables/player/useNowPlayingStatus.ts'
import { prefs } from '@app/utils/prefs.ts'

/**
 * useReactions composable
 * Manages state of current user reaction (like, favorite)
 */

interface UserReaction {
  rate: number,
  songId: string|null
}

// Current reaction
const reaction = reactive(prefs.get<UserReaction>('user_reaction', {
  rate: 0,
  songId: null
}))

/**
 * Main composable function
 */
export function useReactions(): {
  isCurrent: Ref<boolean>;
  reaction: UnwrapNestedRefs<UserReaction>;
  setReaction: (newReaction: number) => void;
  resetReaction: () => void
} {
  const { song } = useNowPlayingStatus()

  // Computed property checking if stored reaction belongs to current song
  const isCurrent = computed(() => reaction.songId === song.id)

  /**
   * Update reaction state with new rating and current song id
   * @param newReaction
   */
  const setReaction = (newReaction: number): void => {
    reaction.rate = newReaction
    reaction.songId = song.id
    save()
  }

  /**
   * Reset reaction state
   */
  const resetReaction = (): void => {
    reaction.rate = 0
    reaction.songId = null
    save()
  }

  /**
   * Persist current reaction state to storage
   * @private
   */
  const save = (): void => {
    prefs.save<UserReaction>('user_reaction', reaction)
  }

  return { isCurrent, reaction, setReaction, resetReaction }
}
