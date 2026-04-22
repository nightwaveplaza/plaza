<template>
  <div class="win-connection-status me-1" :class="{'connected': isConnected, 'on-off': blink}" />
</template>

<script setup lang="ts">
  import { useSocket } from '@app/composables/useSocket.ts'
  import { ref } from 'vue'

  const { onEvent, isConnected } = useSocket()
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

  onEvent('status', triggerBlink)
  onEvent('listeners', triggerBlink)
  onEvent('reactions', triggerBlink)
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
