import { reactive, ref } from 'vue';
import type { Song, StatusResource } from '@app/types';

const song = reactive<Song>({
  album: '',
  artist: '',
  artwork_sm_src: '',
  artwork_src: '',
  id: '',
  length: 0,
  preview_src: '',
  title: '',
});
const position = ref(0);
const reactions = ref(0);
const listeners = ref(0);
const updatedAt = ref(0);

export function useNowPlayingStatus() {
  const setStatus = (status: StatusResource): void => {
    Object.assign(song, status.song);
    position.value = status.position;
    reactions.value = status.reactions;
    listeners.value = status.listeners;
    updatedAt.value = status.updated_at;
  };

  return {
    song,
    position,
    reactions,
    listeners,
    updatedAt,
    setStatus,
  };
}
