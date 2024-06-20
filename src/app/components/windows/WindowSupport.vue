<template>
  <win-window ref="win" :width="450" name="support" :title="t('win.support.title')">
    <div class="p-2">

      <p class="lead mt-2 mb-3 text-center">
        <b>{{ t('win.support.title2') }}</b>
      </p>

      <win-panel>
        <div class="row">
          <div class="col text-center">
            <p class="mb-1">{{ t('win.support.rewards') }}</p>
            <a href="https://boosty.to/nightwaveplaza">{{ t('win.support.boosty') }}</a>
          </div>
          <div class="col-4 align-content-center">
            <a href="https://boosty.to/nightwaveplaza" target="_blank">
              <img class="img-fluid w-100" alt="boosty" src="@app/assets/img/boosty.png">
            </a>
          </div>
        </div>
      </win-panel>

      <win-group-box class="mt-3 mb-2">
        <template #title>
          {{ t('win.support.crypto') }}
        </template>
        <template #content>
          <p class="mb-1"><b>USDT TRC20</b></p>
          <p class="mb-2 address">
            {{ trc }}
          </p>

          <p class="mb-1"><b>USDT TON, TON, NOT</b></p>
          <p class="mb-2 address">
            {{ ton }}
          </p>

          <p class="mb-1"><b>BTC</b></p>
          <p class="address">
            {{ btc }}
          </p>
        </template>
      </win-group-box>

      <p class="mt-3 text-center">
        <b>{{ t('win.support.thanks') }}</b>
      </p>

      <div class="text-center mt-3">
        <win-button class="mx-auto px-4" @click="close()">
          {{ t('buttons.close') }}
        </win-button>
      </div>
    </div>
  </win-window>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { ref } from 'vue'
import WinWindow from '@app/components/basic/WinWindow.vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const router = useRouter()

const props = defineProps({
  direct: {
    type: Boolean,
    default: false,
  },
})

const win = ref<InstanceType<typeof WinWindow>>()
const trc = import.meta.env.VITE_CRYPTO_TRC
const ton = import.meta.env.VITE_CRYPTO_TON
const btc = import.meta.env.VITE_CRYPTO_BTC

function close (): void {
  if (props.direct) {
    router.push({ name: 'index' })
  } else {
    win.value!.close()
  }
}
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