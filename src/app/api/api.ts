import Repository from '@app/api/axios'
import type {
  UserReset,
  UserResetConfirm,
} from '@app/types/types'
import type { AxiosResponse } from 'axios'

export const api = {
  user: {
    reset: (data: UserReset):
      Promise<AxiosResponse> =>
      Repository.post('user/reset', data),
    confirmReset: (data: UserResetConfirm):
      Promise<AxiosResponse> =>
      Repository.post('user/reset/confirm', data),
  },
}
