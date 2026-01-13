export interface UserLoginForm {
  username: string,
  password: string,
  remember: boolean
}

export interface UserPasswordForm {
  current_password: string,
  password: string
}

export interface UserProfileForm {
  current_password: string,
  email: string,
  username: string
}

export interface UserRegisterForm {
  username: string,
  email: string,
  password: string,
  captcha_response: string
}

export interface UserResetForm {
  email: string,
  captcha_response: string
}

export interface UserResetConfirmForm {
  password: string
  token: string
}
