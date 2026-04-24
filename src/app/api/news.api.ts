import type { NewsCollection, NewsLatestResource } from '@app/types';
import api from '@app/api/index.ts';

// prettier-ignore
export const newsApi = {
  getNews: (data: { page: number }) =>
    api.get<NewsCollection>('v2/news', { ...data }),
  getLastUpdated: () =>
    api.get<NewsLatestResource>('v2/news/latest'),
};
