import api from '@app/api/index.ts';
import { type RatingsCollection, RatingsRange } from '@app/types';

// prettier-ignore
export const ratingsApi = {
  getRatings: (data: { page: number }, range: RatingsRange) =>
    api.get<RatingsCollection>(`v2/ratings/${range}`, { ...data }),
};
