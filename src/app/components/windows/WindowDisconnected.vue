<template>
  <win-window :width="280" :name="name" title="Connection lost">
    <div class="p-3">
      <div class="text-center">
        <img class="mb-2" src="@app/assets/img/unplug.png" />
        <p class="mb-2"><strong>{{ t('win.disconnected.connection_lost') }}</strong></p>
        <p class="mb-2" v-if="!isDead">{{ t('win.disconnected.trying') }}</p>
        <p class="mb-3" v-else>{{ t('win.disconnected.click_button') }}</p>
        <win-button class="px-2" v-if="isDead" @click="reconnect">{{ t('win.disconnected.btn_reconnect') }}</win-button>
      </div>
    </div>
  </win-window>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useSocket } from '@app/composables/useSocket.ts'

const { t } = useI18n()
const { reconnect, isDead } = useSocket()

defineProps<{
  name: string
}>()
</script>
