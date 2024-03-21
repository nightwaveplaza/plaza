import { defineStore } from 'pinia'
import { usePlayerPlaybackStore } from '@common/js/stores/playerPlaybackStore'

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
    save() {
      localStorage.setItem('prefs_reaction', JSON.stringify(this.$state))
    },
    load() {
      const playerPlaybackStore = usePlayerPlaybackStore()
      const saved: State = JSON.parse(localStorage.getItem('prefs_reaction'))
      if (saved && saved.songId === playerPlaybackStore.songId) {
        this.score = saved.score
        this.songId = saved.songId
      } else {
        this.$reset()
      }
    }
  }
})
