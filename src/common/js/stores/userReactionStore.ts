import { defineStore } from 'pinia'
import { usePlayerPlaybackStore } from '@common/js/stores/playerPlaybackStore'
import { prefs } from '@common/js/extras/prefs'

interface State {
  score: number,
  songId: string
}

export const useUserReactionStore = defineStore('userReactionStore', {
  state: (): State => ({
    score: 0,
    songId: '',
  }),

  actions: {
    save () {
      prefs.save('reaction', this.$state)
    },
    load () {
      const playerPlaybackStore = usePlayerPlaybackStore()
      const saved: State = prefs.getObj('reaction', { score: 0, songId: '' })
      if (saved.songId === playerPlaybackStore.songId) {
        this.score = saved.score
        this.songId = saved.songId
      } else {
        this.$reset()
      }
    },
  },
})
