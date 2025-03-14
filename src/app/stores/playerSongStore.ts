import { defineStore } from 'pinia'
import { type Ref, ref } from 'vue'

export const usePlayerSongStore = defineStore('playerSongStore', () => {
  const songId: Ref<string> = ref('')
  const artist: Ref<string> = ref('...')
  const album: Ref<string> = ref('...')
  const title: Ref<string> = ref('...')
  const position: Ref<number> = ref(0)
  const length: Ref<number> = ref(0)
  const reactions: Ref<number> = ref(0)
  const listeners: Ref<number> = ref(0)
  const artwork_src: Ref<string> = ref('https://i.plaza.one/artwork_dead.jpg')
  const artwork_sm_src: Ref<string> = ref('https://i.plaza.one/artwork_dead.jpg')

  return { songId, artist, album, title, position, length, reactions, listeners, artwork_src, artwork_sm_src }
})
