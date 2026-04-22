<template>
  <div class="win-connection-status me-1" :class="{'connected': isConnected, 'on-off': blink}" />
</template>

<script setup lang="ts">
  import { ref, watch } from 'vue'
  import { useNowPlayingStatus } from '@app/composables/player/useNowPlayingStatus.ts'
  import { useSocketStore } from '@app/composables/useSocketStore.ts'

  const { listeners, song, reactions } = useNowPlayingStatus()
  const { isConnected } = useSocketStore()

  const blink = ref(false)
  let blinkTimer: ReturnType<typeof setTimeout> | null = null

  function triggerBlink(): void {
    blink.value = true

    if (blinkTimer) {
      clearTimeout(blinkTimer)
    }

    blinkTimer = setTimeout(() => {
      blink.value = false
    }, 750)
  }

  watch(listeners, () => triggerBlink)
  watch(reactions, () => triggerBlink)
  watch(song, () => triggerBlink)
</script>

<style lang="scss">
  .win-connection-status {
    margin-top: -1px;
    margin-left: 6px;
    height: 16px;
    width: 16px;
    float: left;
    background-repeat: no-repeat;
    background-size: cover;
    animation: swap-status 1s steps(1) infinite;
    image-rendering: pixelated;

    &.connected {
      animation: none;
      background-position: 0 0;
      background-image: url('@app/assets/img/conn_pcs_on_on.png');
    }

    &.on-off {
      background-image: url('@app/assets/img/conn_pcs_on_off.png') !important;
    }
  }

  @keyframes swap-status {
    0% {
      background-image: url('@app/assets/img/conn_pcs_off_on.png');
    }
    50% {
      background-image: url('@app/assets/img/conn_pcs_on_off.png');
    }
  }
</style>
