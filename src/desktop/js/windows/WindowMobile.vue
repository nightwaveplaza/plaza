<template>
  <win-window :width="320" name="mobile" title="Nightwave Plaza Mobile" v-slot="winProps">
    <div class="p-2">
      <div class="group-box p-2 mb-3">
        <div class="row no-gutters">
          <div class="col text-center mr-4">{{ t('win.mobile.description') }}</div>
          <div class="col-auto">
            <img src="/img/mobilen.gif"/>
          </div>
        </div>
      </div>

      <div class="group-box p-3 text-center">
        <div class="row no-gutters">
          <div class="col">
            <a href="https://plaza.one/googleplay" target="_blank" class="d-block">
              <img src="/img/gplay.png" style="height: 38px; width: auto"/>
            </a>
          </div>
          <div class="col">
            <a href="https://plaza.one/ios" target="_blank" class="d-block">
              <img src="/img/appstore.png" style="height: 38px; width: auto"/>
            </a>
          </div>
        </div>
      </div>

      <div class="row justify-content-end mt-2">
        <div class="col-auto">
          <win-btn class="px-4" @click="winProps.close()">{{ t('buttons.close') }}</win-btn>
        </div>
      </div>
    </div>
  </win-window>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>