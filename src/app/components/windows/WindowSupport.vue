<template>
  <div class="p-3">
    <div class="row mb-3">
      <div class="col-auto align-content-center pe-1">
        <img src="@app/assets/img/plaza.png" style="width: 64px" class="simple-border" alt="" />
      </div>
      <div class="col">
        <i18n-t keypath="win.support.description" tag="p" class="mb-0">
          <template #nightwave_plaza>
            <strong>Nightwave Plaza</strong>
          </template>
        </i18n-t>
      </div>
    </div>

    <WinGroupBox class="mb-3">
      <template #title> {{ t('win.support.select_platform') }} </template>
      <template #content>
        <WinMemo>
          <div class="row gx-0 my-2">
            <div class="col text-center">
              <a href="https://www.patreon.com/nightwaveplaza" target="_blank" class="app-link">
                <img src="@app/assets/img/patreon.png" class="app-icon" alt="" /><br />
                Patreon
              </a>
            </div>
            <div class="col text-center">
              <a href="https://boosty.to/nightwaveplaza" target="_blank" class="app-link">
                <img src="@app/assets/img/boosty.png" class="app-icon" alt="" /><br />
                Boosty
              </a>
            </div>
            <div class="col text-center">
              <a href="https://www.paypal.com/paypalme/potatoru" target="_blank" class="app-link">
                <img src="@app/assets/img/paypal.png" class="app-icon" alt="" /><br />
                PayPal
              </a>
            </div>
          </div>
        </WinMemo>
      </template>
    </WinGroupBox>

    <p class="mt-3">
      <b>{{ t('win.support.thanks') }}</b>
    </p>

    <div class="mt-3 text-end">
      <win-button class="px-4" @click="closeWindow(Win.SUPPORT)">
        {{ t('buttons.close') }}
      </win-button>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { useI18n } from 'vue-i18n';
  import { useWindows } from '@app/composables/useWindows.ts';
  import { Win } from '@app/types';

  const { t } = useI18n();
  const { closeWindow } = useWindows();
</script>

<style lang="scss">
  #window-support {
    .app-icon {
      width: 40px;
      height: auto;
    }

    .app-link {
      text-decoration: none;
    }
  }
</style>
