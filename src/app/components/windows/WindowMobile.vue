<template>
  <win-window v-slot="winProps" :width="340" :name="name" title="Nightwave Plaza Mobile">
    <div class="p-2">
      <win-panel class="mb-2">
        <div class="row no-gutters">
          <div class="col text-center mr-2">
            {{ t('win.mobile.description') }}
          </div>
          <div class="col-auto">
            <img src="@app/assets/img/mobilen.gif" alt="">
          </div>
        </div>
      </win-panel>

      <win-memo>
        <div class="row no-gutters my-2">
          <div class="col text-center">
            <a href="https://plaza.one/ios" target="_blank" class="app-link">
              <img src="@app/assets/img/app_ios.png" class="app-icon" alt=""><br>
              Apple iOS.app
            </a>
          </div>
          <div class="col text-center">
            <a href="https://plaza.one/googleplay" target="_blank" class="app-link">
              <img src="@app/assets/img/app_android.png" class="app-icon" alt=""><br>
              Android.app
            </a>
          </div>
        </div>
      </win-memo>

      <div class="row justify-content-center mt-3">
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

defineProps<{
  name: string
}>()
</script>

<style lang="scss">
#window-mobile {
  .app-icon {
    width: 36px;
    height: auto;
  }

  .app-link {
    text-decoration: underline;
  }
}
</style>
