<template>
  <win-window v-slot="winProps" :width="320" name="mobile" title="Nightwave Plaza Mobile">
    <div class="p-2">
      <win-panel class="mb-3">
        <div class="row no-gutters">
          <div class="col text-center mr-4">
            {{ t('win.mobile.description') }}
          </div>
          <div class="col-auto">
            <img src="@app/assets/img/mobilen.gif" alt="">
          </div>
        </div>
      </win-panel>

      <win-panel class="text-center">
        <div class="row no-gutters">
          <div class="col align-self-center">
            <a href="https://plaza.one/googleplay" target="_blank" class="d-block" style="line-height: 0">
              <img src="@app/assets/img/gplay.png" style="height: 38px; width: auto" alt="">
            </a>
          </div>
          <div class="col align-self-center">
            <a href="https://plaza.one/ios" target="_blank" class="d-block" style="line-height: 0">
              <img src="@app/assets/img/appstore.png" style="height: 38px; width: auto" alt="">
            </a>
          </div>
        </div>
      </win-panel>

      <div class="row justify-content-end mt-2">
        <div class="col-auto">
          <win-button class="px-4" @click="winProps.close()">
            {{ t('buttons.close') }}
          </win-button>
        </div>
      </div>
    </div>
  </win-window>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>
