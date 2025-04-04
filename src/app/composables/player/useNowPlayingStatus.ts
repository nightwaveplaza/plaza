import { reactive, type Ref, ref, type UnwrapNestedRefs, type UnwrapRef } from 'vue'
import type { Song, StatusResource } from '@app/types'

const song = reactive<Song>({
  album: '', artist: '', artwork_sm_src: '', artwork_src: '', id: '', length: 0, preview_src: '', title: ''
})
const position = ref(0)
const reactions = ref(0)
const listeners = ref(0)
const updatedAt = ref(0)

export function useNowPlayingStatus (): {
  setSong: (updatedSong: Song) => void
  song: UnwrapNestedRefs<Song>
  setReactions: (r: number) => void
  reactions: Ref<UnwrapRef<number>>
  listeners: Ref<UnwrapRef<number>>
  setListeners: (l: number) => void
  position: Ref<UnwrapRef<number>>
  setPosition: (p: number) => void
  updatedAt: Ref<UnwrapRef<number>>
  setStatus: (status: StatusResource) => void
} {
  const setSong = (updatedSong: Song): void => {
    Object.assign(song, updatedSong)
  }

  const setStatus = (status: StatusResource): void => {
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
