export interface IfcWindow {
  name: string,
  form: string,
  // alerts
  text?: string,
  type?: string,
  id?: string
}


export interface IfcBackground {
  image?: ifcBackgroundImage,
  color: string,
  index: number,
  mode: enBackgroundMode
}

export enum enBackgroundMode {
  RANDOM,
  SINGLE,
  SOLID
}

export interface ifcBackgroundImage {
  id:	number,
  filename: string
  author: string
  author_link: string
  source: string
  source_link: string
  num: string
  src: string
  video_src: string
}

export interface ifcUserAuth {
  username: string,
  password: string
}

export interface ifcUserRegister {
  username: string,
  email: string,
  password: string,
  captcha_response: string
}

export interface ifcUserEdit {
  current_password: string,
  password: string
}

export interface ifcUserReset {
  email: string,
  captcha_response: string
}

export interface ifcUserResetConfirm {
  token: string,
  password: string
}
