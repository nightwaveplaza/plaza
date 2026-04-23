import api from '@app/api/index.ts'

export const reactionApi = {
  sendReaction: (data: { reaction: number }) => api.post<{ reactions: number }>('v2/reactions', data).then(res => res.data),
}