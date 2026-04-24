<template />

<script setup lang="ts">
  import { onMounted } from 'vue';
  import { useWindows } from '@app/composables/useWindows.ts';
  import { useNewsPopup } from '@app/composables/useNewsPopup.ts';
  import { useAuth } from '@app/composables/useAuth.ts';
  import { Win } from '@app/types';
  import { useNowPlayingStatus } from '@app/composables/player/useNowPlayingStatus.ts';
  import { initAppSocket } from '@app/services/initAppSocket.ts';
  import { watchOnce } from '@vueuse/core';

  const { openWindow, closeWindow } = useWindows();
  const { openNewsIfUpdated } = useNewsPopup();
  const { fetchUser } = useAuth();
  const { song } = useNowPlayingStatus();

  initAppSocket();

  onMounted(() => {
    openWindow(Win.LOADING);
    fetchUser();
  });

  // waiting for the first status response then check news and open up player
  watchOnce(
    () => song.id,
    () => {
      openWindow(Win.PLAYER);
      closeWindow(Win.LOADING);
      openNewsIfUpdated();
    },
  );
</script>
