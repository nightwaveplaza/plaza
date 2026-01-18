<template>
  <div class="p-2">
    <div class="row no-gutters">
      <div class="col-auto text-center align-self-center">
        <div class="alert-icon" :class="params.type" />
      </div>
      <div class="col align-self-center">
        <p class="pl-2" style="line-height: 125%" v-html="params.text" />
      </div>
    </div>

    <div class="text-center">
      <win-button class="mt-2 mx-auto px-4" @click="closeWindow(winId!)">
        {{ t('buttons.ok') }}
      </win-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { computed, inject, type Ref } from 'vue'
import type { AlertWindowParams } from '@app/types/types.ts'
import { useWindows } from '@app/composables/useWindows.ts'
const { t } = useI18n()

const { openedWindows, closeWindow } = useWindows()
const winId: Ref<string> | undefined = inject('windowId')

const params = computed(() => openedWindows.value[winId!.value]?.params as AlertWindowParams)
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
