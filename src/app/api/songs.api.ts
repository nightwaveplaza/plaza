import api from '@app/api/index.ts'
import type { SongResource } from '@app/types'

export const songApi = {
  getSong: (id: string) => api.get<SongResource>(`v2/songs/${id}`).then(res => res.data),
}