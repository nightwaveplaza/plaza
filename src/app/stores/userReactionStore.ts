import { defineStore } from 'pinia'

interface State {
  score: number,
  songId: string
}

export const useUserReactionStore = defineStore('userReactionStore', {
  state: (): State => ({
    score: 0,
    songId: '',
  })
})
