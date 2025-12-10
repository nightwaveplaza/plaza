<template>
  <win-window ref="win" v-slot="winProps" is-alert :name="name" :title="alertParams.title" :width="290">
    <div class="p-2">
      <div class="row no-gutters">
        <div class="col-auto text-center align-self-center">
          <div class="alert-icon" :class="alertParams.type" />
        </div>
        <div class="col align-self-center">
          <p class="pl-2" style="line-height: 125%" v-html="alertParams.text" />
        </div>
      </div>

      <div class="text-center">
        <win-button class="mt-2 mx-auto px-4" @click="winProps.close()">
          {{ t('buttons.ok') }}
        </win-button>
      </div>
    </div>
  </win-window>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { onBeforeMount, reactive } from 'vue'
import type { AlertWindowParams } from '@app/types/types.ts'
import { useWindows } from '@app/composables/useWindows.ts'
const { t } = useI18n()

const { openedWindows } = useWindows()

const props = defineProps<{
  name: string
}>()

const alertParams: AlertWindowParams = reactive({
  type: 'warn',
  title: '',
  text: ''
})

onBeforeMount(() => {
  const params = openedWindows.value[props.name]?.params as AlertWindowParams
  if (params) {
    alertParams.type = params.type
    alertParams.title = params.title
    alertParams.text = params.text
  }
})
</script>

<style lang="scss">
.frame .alert {
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
