export interface BackgroundImage {
  id: number,
  filename: string
  author: string
  author_link: string
  source: string
  source_link: string
  src: string
  video_src: string
}

export interface History {
  played_at: number
  song: Song
}

export interface News {
  id: number
  text: string
  author: string
  created_at: number
}

export interface Rating {
  song: Song,
  likes: number
}

export interface Song {
  id: string
  artist: string
  album: string
  title: string
  length: number
  artwork_src: string
  artwork_sm_src: string
  preview_src: string
}

export interface User {
  id: number
  username: string
  email: string
}
