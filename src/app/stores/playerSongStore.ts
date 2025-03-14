import { defineStore } from 'pinia'
import { ref } from 'vue'

export const usePlayerSongStore = defineStore('playerSongStore', () => {
  const songId = ref('')
  const artist = ref('...')
  const album = ref('...')
  const title = ref('...')
  const position = ref(0)
  const length = ref(0)
  const reactions = ref(0)
  const listeners = ref(0)
  const artwork_src = ref('https://i.plaza.one/artwork_dead.jpg')
  const artwork_sm_src = ref('https://i.plaza.one/artwork_dead.jpg')

  return { songId, artist, album, title, position, length, reactions, listeners, artwork_src, artwork_sm_src }
})
