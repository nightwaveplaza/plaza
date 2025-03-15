import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { usePrefs } from '@app/composables/usePrefs.ts'
import { usePlayerSongStore } from '@app/stores/playerSongStore.ts'

interface UserReaction {
  score: number,
  songId: string
}

export const useUserReactionStore = defineStore('userReactionStore', () => {
  const playerSongStore = usePlayerSongStore()
  const score = ref(0)
  const songId = ref('')

  const reaction = usePrefs.get<UserReaction>('user_reaction')
  if (reaction) {
    score.value = reaction.score
    songId.value = reaction.songId
  }

  const isCurrent = computed(() => songId.value === playerSongStore.songId)

  const setUserReaction = (newReaction: number): void => {
    score.value = newReaction
    songId.value = playerSongStore.songId
    save()
  }

  const reset = (): void => {
    score.value = 0
    songId.value = ''
    save()
  }

  const save = (): void => {
    usePrefs.save('user_reaction', <UserReaction>{ score: score.value, songId: songId.value })
  }

  return { score, songId, reset, setUserReaction, isCurrent }
})
