import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
import { useNowPlayingStatus } from '@app/composables/player/useNowPlayingStatus';
import { useSocketStore } from '@app/composables/useSocketStore.ts';
import type { StatusResource } from '@app/types';
import { isMobile } from '@app/utils/helpers.ts';
import { useEventListener } from '@vueuse/core';

let isInitialized = false;

export function initAppSocket(): void {
  if (isInitialized) return;
  isInitialized = true;

  const { setStatus, listeners, reactions } = useNowPlayingStatus();
  const { isConnected, isDead } = useSocketStore();

  const appId = import.meta.env.VITE_REVERB_APP_ID;
  if (!appId) {
    isDead.value = true;
    return;
  }

  // wsPath is prefixed to /app/<key>, so the socket is wss://plaza.one/echo/app/<key>
  const echo = new Echo({
    broadcaster: 'reverb',
    Pusher,
    key: appId,
    wsHost: 'plaza.one',
    wsPort: 80,
    wssPort: 443,
    forceTLS: true,
    enabledTransports: ['ws', 'wss'],
    wsPath: '/echo',
    disableStats: true,
    withoutInterceptors: true,
  });

  echo.connector.onConnectionChange(status => {
    isConnected.value = status === 'connected';
    if (status === 'failed') {
      isDead.value = true;
    }
  });

  // Leading dot keeps the broadcast name as sent (status, listeners, reactions)
  echo
    .channel('status')
    .listen('.status', (data: StatusResource) => setStatus(data))
    .listen('.listeners', (data: { listeners: number }) => {
      listeners.value = data.listeners;
    })
    .listen('.reactions', (data: { reactions: number }) => {
      reactions.value = data.reactions;
    });

  if (isMobile()) {
    const connection = () => echo.connector.pusher.connection;

    useEventListener(window, 'app:stop', () => {
      if (connection().state === 'connected') {
        echo.connector.pusher.disconnect();
      }
    });

    useEventListener(window, 'app:start', () => {
      const state = connection().state;
      if (state !== 'connected' && state !== 'connecting') {
        echo.connector.pusher.connect();
      }
    });
  }
}
