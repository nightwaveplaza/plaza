import { useApi } from '@app/composables/api/useApi.ts'
import { type SongResponse } from '@app/types'

export function useSongsApi () {
  const getSong = () => {
    const instance = useApi<SongResponse>()
    const fetch = (songId: string) => instance.call({
      url: `v2/songs/${songId}`
    })
    return { ...instance, fetch }
  }

  return {
    getSong
  }
}
