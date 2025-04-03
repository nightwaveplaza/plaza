<template>
  <win-window v-slot="winProps" :width="280" :name="name" :title="t('win.settings.title')">
    <div class="p-2">
      <!-- Background -->
      <win-group-box class="mb-2">
        <template #title>
          {{ t('win.settings.background') }}
        </template>
        <template #content>
          <div v-if="isColorMode" class="row palette no-gutters">
            <div v-for="color in palette" :key="color" class="col-auto">
              <button class="color" :style="{backgroundColor: color}" @click="setColorBackground(color)" />
            </div>
            <div class="col-3">
              <input class="d-block" :value="background.color" @input="colorSelected">
            </div>
          </div>

          <win-memo v-else>
            <p>
              <b>#{{ background.image?.id }}</b>
            </p>
            <p>
              <b>{{ t('win.settings.source') }}: </b>
              <a v-if="background.image?.source_link !== ''" :href="background.image?.source_link">
                {{ background.image?.source }}
              </a>
            </p>
            <p>
              <b>{{ t('win.settings.author') }}: </b>
              <a v-if="background.image?.author_link !== ''" :href="background.image?.author_link">
                {{ background.image?.author }}
              </a>
            </p>
          </win-memo>

          <div class="row no-gutters mt-2 noselect">
            <div class="col-2 pr-1">
              <win-button block @click="nextBackground(-1)">
                &lt;
              </win-button>
            </div>
            <div class="col-2 pr-1">
              <win-button block @click="nextBackground(1)">
                &gt;
              </win-button>
            </div>
            <div class="col-4 pr-1">
              <win-button block :class="{active: isRandomMode}" @click="setRandomBackground">
                {{ t('win.settings.btn_random') }}
              </win-button>
            </div>
            <div class="col-4">
              <win-button block :class="{active: isColorMode}" @click="setColorBackground">
                {{ t('win.settings.btn_solid') }}
              </win-button>
            </div>
          </div>

          <i18n-t keypath="win.settings.bg_notice" tag="p" class="mt-2 noselect">
            <template #link>
              <a href="mailto:mail@plaza.one">{{ t('win.settings.let_us_know') }}</a>
            </template>
          </i18n-t>
        </template>
      </win-group-box>
      <!-- /Background -->

      <!-- Appearance Settings -->

      <win-group-box class="mb-2">
        <template #title>
          {{ t('win.settings.appearance') }}
        </template>
        <template #content>
          <div class="row no-gutters">
            <div class="col-7 align-content-end">
              <div class="mb-1">
                {{ t('win.settings.theme') }}
              </div>
              <div class="select">
                <select @change="themeSelected">
                  <option v-for="item in themes" :key="item[0]" :value="item[0]" :selected="theme === item[0]">
                    {{ item[1] }}
                  </option>
                </select>
              </div>
            </div>
            <div class="col ml-2 align-content-end">
              <div class="mb-1">
                {{ t('win.settings.taskbar') }}
              </div>

              <div class="select">
                <select @change="taskbarPositionSelected">
                  <option v-for="item in taskbarPositions"
                          :key="item[0]"
                          :value="item[0]"
                          :selected="taskbarPosition === item[0]"
                  >
                    {{ item[1] }}
                  </option>
                </select>
              </div>
            </div>
          </div>
        </template>
      </win-group-box>
      <!-- /Appearance Settings -->

      <!-- App Settings -->
      <win-group-box class="mb-2">
        <template #title>
          {{ t('win.settings.application') }}
        </template>
        <template #content>
          <div class="row">
            <div class="col-6 align-self-center">
              {{ t('win.settings.audio_quality') }}:
            </div>
            <div class="col-6">
              <div class="checkbox mb-1">
                <input id="low_quality" type="checkbox" :checked="lowQuality" @change="qualityChanged">
                <label for="low_quality">{{ t('win.settings.low_quality') }}</label>
              </div>
              <div v-if="!isMobile()" class="checkbox">
                <input id="hls_beta" type="checkbox" :checked="useHls" @change="hlsChanged">
                <label for="hls_beta">HLS</label>
              </div>
            </div>
          </div>
        </template>
      </win-group-box>
      <!-- /App Settings -->

      <div class="d-flex justify-content-between">
        <win-button class="px-2" @click="openLanguageSettings">
          {{ t('win.settings.language') }}
        </win-button>
        <win-button class="px-4" @click="winProps.close()">
          {{ t('buttons.close') }}
        </win-button>
      </div>
    </div>
  </win-window>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { isMobile } from '@app/utils/helpers.ts'
import { useWindows } from '@app/composables/useWindows.ts'
import { useAppSettings } from '@app/composables/useAppSettings.ts'
import { useBackgrounds } from '@app/composables/useBackgrounds.ts'
import { Win } from '@app/types'

const { t } = useI18n()
const { openWindow, closeWindow, winAlert } = useWindows()
const {
  theme, setTheme, taskbarPosition, setTaskbarPosition, useHls, setUseHls,
  lowQuality, setLowQuality
} = useAppSettings()
const {
  background, fetch: fetchBackgrounds, setColorBackground, setRandomBackground, nextBackground,
  isRandomMode, isColorMode
} = useBackgrounds()

defineProps<{
  name: string
}>()

const palette = [
  '#ffffff', '#000000', '#c0c0c0', '#808080', '#ff0000', '#800000', '#ffff00', '#808000', '#00ff00',
  '#008000', '#00ffff', '#008080', '#0000ff', '#000080', '#ff00ff', '#800080',
]

const themes = [
  ['desert', 'Desert'],
  ['contrast', 'High Contrast'],
  ['rainy', 'Rainy Day'],
  ['rose', 'Rose'],
  ['win98', 'Windows Standard'],
]

const taskbarPositions = computed(() => [
  ['bottom', t('win.settings.bottom')],
  ['top', t('win.settings.top')]
])

function colorSelected (e: Event): void {
  setColorBackground((e.target as HTMLInputElement).value)
}

function themeSelected (e: Event): void {
  setTheme((e.target as HTMLSelectElement).value)
}

function taskbarPositionSelected (e: Event): void {
  setTaskbarPosition((e.target as HTMLSelectElement).value)
}

function openLanguageSettings (): void {
  openWindow(Win.SETTINGS_LANGUAGE)
  closeWindow(Win.SETTINGS)
}

function qualityChanged (e: Event): void {
  setLowQuality((e.target as HTMLInputElement).checked)
  winAlert(t('win.settings.quality_changed'), t('messages.saved'), 'info')
}

function hlsChanged (e: Event): void {
  setUseHls((e.target as HTMLInputElement).checked)
  winAlert(t('win.settings.quality_changed'), t('messages.saved'), 'info')
}

onMounted(() => {
  // Load background list from server
  fetchBackgrounds()
})
</script>

<style lang="scss">
#window-settings {
  .palette {
    .color {
      margin: 2px;
      width: 20px;
      height: 20px;

      border: 1px solid;
    }

    input {
      margin: 2px;
      height: 20px;
      line-height: 100%;
    }
  }
}
</style>
