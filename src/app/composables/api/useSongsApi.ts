import { useAxios } from '@app/composables/api/useAxios.ts'
import { type SongResponse } from '@app/types'

export function useSongsApi () {
  const getSong = () => {
    const instance = useAxios<SongResponse>()
    const fetch = (songId: string) => instance.call({
      url: `v2/songs/${songId}`
    })
    return { ...instance, fetch }
  }

  return {
    getSong
  }
}
