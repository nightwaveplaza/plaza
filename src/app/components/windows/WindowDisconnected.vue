<template>
  <win-window :width="400" :name="name" :title="t('win.history.title')">
    <div class="p-2">
      <win-button v-if="isDead" @click="reconnect">Reconnect</win-button>
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
