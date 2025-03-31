import { useApi } from '@app/composables/api/useApi.ts'
import {
  type ResultResponse,
  type User,
  type UserEmailForm,
  type UserPasswordForm,
  type UserRegisterForm, type UserResponse
} from '@app/types'

export function useUserApi () {
  const getUser = () => {
    const instance = useApi<UserResponse>()
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
      method: 'PUT',
      url: `v2/users/me/password`
    })
    return { ...instance, fetch }
  }

  const updateEmail = () => {
    const instance = useApi<ResultResponse>()
    const fetch = (data: UserEmailForm) => instance.call({
      data,
      method: 'PUT',
      url: `v2/users/me/email`
    })
    return { ...instance, fetch }
  }

  return {
    getUser, registerUser, updatePassword, updateEmail
  }
}
