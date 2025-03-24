import { reactive, ref, watch } from 'vue'
import { useUserReactionStore } from '@app/stores/userReactionStore.ts'

const song = reactive({
  id: <string|null>null,
  artist: '...',
  title: '...',
  album: '...',
  length: 0,
  artwork_src: '',
  artwork_src_sm: ''
})
const position = ref(0)
const reactions = ref(0)
const listeners = ref(0)
const updatedAt = ref(0)

export function useNowPlayingStatus() {
  const userReaction = useUserReactionStore()

  watch(() => song.id, () => {
    userReaction.reset()
  })

  const setSong = (updatedSong: any) => {
    song.id = updatedSong.id
    song.artist = updatedSong.artist
    song.title = updatedSong.title
    song.album = updatedSong.album
    song.length = updatedSong.length
    song.artwork_src = updatedSong.artwork_src
    song.artwork_src_sm = updatedSong.artwork_sm_src
    position.value = updatedSong.position
    updatedAt.value = Date.now()
  }

  const setReactions = (r: number) => {
    reactions.value = r
  }

  const setListeners = (l: number) => {
    listeners.value = l
  }

  const setPosition = (p: number) => {
    position.value = p
  }

  return {
    setSong, song, setReactions, reactions, listeners, setListeners, position, setPosition, updatedAt
  }
}
