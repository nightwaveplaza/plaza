import { useApi } from '@app/composables/api/useApi.ts'
import {
  type ResultResponse,
  type User,
  type UserEmailForm,
  type UserPasswordForm,
  type UserRegisterForm
} from '@app/types'

export function useUserApi () {
  const get = () => {
    const instance = useApi<User>()
    const fetch = () => instance.call({
      url: `v2/users/me`
    })
    return { ...instance, fetch }
  }

  const registerUser = () => {
    const instance = useApi<User>()
    const fetch = (data: UserRegisterForm) => instance.call({
      data,
      method: 'POST',
      url: `v2/users`
    })
    return { ...instance, fetch }
  }

  const updatePassword = () => {
    const instance = useApi<ResultResponse>()
    const fetch = (data: UserPasswordForm) => instance.call({
      data,
      method: 'POST',
      url: `v2/users/me/password`
    })
    return { ...instance, fetch }
  }

  const updateEmail = () => {
    const instance = useApi<ResultResponse>()
    const fetch = (data: UserEmailForm) => instance.call({
      data,
      method: 'POST',
      url: `v2/users/me/email`
    })
    return { ...instance, fetch }
  }

  return {
    get, registerUser, updatePassword, updateEmail
  }
}
