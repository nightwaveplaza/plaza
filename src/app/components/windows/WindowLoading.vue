<template>
  <div class="p-3">
    <p class="text-center mb-2">
      <strong>{{ t('loading') }}</strong>
    </p>
    <win-loading-bar />
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>
