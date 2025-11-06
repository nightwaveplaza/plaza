<template>
  <win-window v-slot="winProps" ref="win" :width="450" :name="name" :title="t('win.support.title')">
    <div class="p-2">
      <p class="lead mt-2 mb-3 text-center">
        <b>{{ t('win.support.title2') }}</b>
      </p>

      <win-panel>
        <div class="row">
          <div class="col text-center">
            <p class="mb-1">
              {{ t('win.support.rewards') }}
            </p>
            <a href="https://boosty.to/nightwaveplaza">{{ t('win.support.boosty') }}</a>
          </div>
          <div class="col-4 align-content-center">
            <a href="https://boosty.to/nightwaveplaza" target="_blank">
              <img class="img-fluid w-100" alt="boosty" src="@app/assets/img/boosty.png">
            </a>
          </div>
        </div>
      </win-panel>

      <p class="mt-3 text-center">
        <b>{{ t('win.support.thanks') }}</b>
      </p>

      <div class="text-center mt-3">
        <win-button class="mx-auto px-4" @click="winProps.close()">
          {{ t('buttons.close') }}
        </win-button>
      </div>
    </div>
  </win-window>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import WinWindow from '@app/components/basic/WinWindow.vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

defineProps<{
  name: string
}>()

const win = ref<InstanceType<typeof WinWindow>>()
</script>

<style lang="scss">
#window-support {
  p.lead {
    font-size: 14px !important;
    line-height: 14px;
  }

  .address {
    font-family: monospace;
    word-break: break-all;

    &:hover {
      cursor: pointer;
    }
  }
}
</style>
