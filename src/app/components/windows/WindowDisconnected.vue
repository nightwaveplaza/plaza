<template>
  <win-window :width="280" :name="name" title="Connection lost">
    <div class="p-3">
      <div class="text-center">
        <img class="mb-2" src="@app/assets/img/unplug.png" alt="no connection">
        <p class="mb-2">
          <strong>{{ t('win.disconnected.connection_lost') }}</strong>
        </p>
        <p v-if="!isDead" class="mb-2">
          {{ t('win.disconnected.trying') }}
        </p>
        <p v-else class="mb-3">
          {{ t('win.disconnected.click_button') }}
        </p>
        <win-button v-if="isDead" class="px-2" @click="reconnect">
          {{ t('win.disconnected.btn_reconnect') }}
        </win-button>
      </div>
    </div>
  </win-window>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useSocket } from '@app/composables/useSocket.ts'
import { watch } from 'vue'
import { useWindows, WinType } from '@app/composables/useWindows.ts'

const { t } = useI18n()
const { reconnect, isDead, isConnected } = useSocket()
const { closeWindow } = useWindows()

defineProps<{
  name: string
}>()

// Close
watch(() => isConnected.value, (connected) => {
  if (connected) {
    closeWindow(WinType.DISCONNECTED)
  }
})
</script>
