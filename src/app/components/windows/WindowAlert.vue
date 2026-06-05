<template>
  <div class="p-2">
    <div class="row mb-2">
      <div class="col-3 align-self-center pe-2">
        <div class="alert-icon mx-auto" :class="params.type" />
      </div>
      <div class="col ps-0 align-self-center">
        <p class="mb-0 lh-sm" v-html="params.text" />
      </div>
    </div>

    <div class="text-center">
      <win-button class="px-4" @click="closeWindow(winId!)">
        {{ t('buttons.ok') }}
      </win-button>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { useI18n } from 'vue-i18n';
  import { computed, inject, type Ref } from 'vue';
  import type { AlertWindowParams } from '@app/types/types.ts';
  import { useWindows } from '@app/composables/useWindows.ts';
  const { t } = useI18n();

  const { openedWindows, closeWindow } = useWindows();
  const winId: Ref<string> | undefined = inject('windowId');

  const params = computed(() => openedWindows.value[winId!.value]?.params as AlertWindowParams);
</script>

<style lang="scss">
  .window-alert {
    .alert-icon {
      width: 32px;
      height: 32px;

      &.info {
        background-image: url('@app/assets/img/msg_info.png');
      }

      &.warn {
        background-image: url('@app/assets/img/msg_warning.png');
      }
    }
  }
</style>
