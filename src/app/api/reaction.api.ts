import api from '@app/api/index.ts';

// prettier-ignore
export const reactionApi = {
  sendReaction: (data: { reaction: number }) =>
    api.post<{ reactions: number }>('v2/reactions', data),
};
