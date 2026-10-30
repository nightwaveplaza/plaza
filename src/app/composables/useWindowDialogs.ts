import { useWindows } from '@app/composables/useWindows.ts';
import { Win } from '@app/types';

/**
 * High-level window dialogs (alerts, song info)
 */
export function useWindowDialogs() {
  const { openWindow } = useWindows();

  const showAlert = (text: string, title: string, type = 'warn'): void => {
    const id = Math.random().toString(36).slice(2, 11);
    openWindow(Win.ALERT, id, { text, type, title });
  };

  const showSongInfo = (songId: string): void => {
    openWindow(Win.SONG, songId, { songId });
  };

  return { showAlert, showSongInfo };
}
