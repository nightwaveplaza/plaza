import { defineStore } from 'pinia'

interface State {
  songId: string,
  artist: string,
  album: string,
  title: string,
  position: number,
  length: number,
  reactions: number
  listeners: number,
  artwork_src: string,
  artwork_sm_src: string
}

export const usePlayerSongStore = defineStore('playerSongStore', {
  state: (): State => ({
    songId: '',
    artist: '...',
    album: '...',
    title: '...',
    position: 0,
    length: 0,
    reactions: 0,
    listeners: 0,
    artwork_src: 'https://i.plaza.one/artwork_dead.jpg',
    artwork_sm_src: 'https://i.plaza.one/artwork_dead.jpg'
  }),
})
