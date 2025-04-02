import { reactive, ref } from 'vue'
import type { Song, StatusResponse } from '@app/types'

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
  const setSong = (updatedSong: Song) => {
    song.id = updatedSong.id
    song.artist = updatedSong.artist
    song.title = updatedSong.title
    song.album = updatedSong.album
    song.length = updatedSong.length
    song.artwork_src = updatedSong.artwork_src
    song.artwork_src_sm = updatedSong.artwork_sm_src
  }

  const setStatus = (status: StatusResponse): void => {
    setSong(status.song)
    setPosition(status.position)
    setReactions(status.reactions)
    setListeners(status.listeners)
    updatedAt.value = status.updated_at
  }

  const setReactions = (r: number): void => {
    reactions.value = r
  }

  const setListeners = (l: number): void => {
    listeners.value = l
  }

  const setPosition = (p: number): void => {
    position.value = p
  }

  return {
    setSong, song, setReactions, reactions, listeners, setListeners, position, setPosition, updatedAt, setStatus
  }
}
