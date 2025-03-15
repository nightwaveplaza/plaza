<template>
  <win-window v-slot="winProps" :width="280" :name="name" :title="t('win.settings.title')">
    <div class="p-2">
      <!-- Background -->
      <win-group-box class="mb-2">
        <template #title>
          {{ t('win.settings.background') }}
        </template>
        <template #content>
          <div v-if="settingsStore.background.mode === enBackgroundMode.SOLID" class="row palette no-gutters">
            <div v-for="color in palette" :key="color" class="col-auto">
              <button class="color" :style="{backgroundColor: color}" @click="solidBg(color)" />
            </div>
            <div class="col-3">
              <input class="d-block" :value="settingsStore.background.color" @input="colorSelected">
            </div>
          </div>

          <win-memo v-else>
            <p>
              <b>{{ t('win.settings.background') }}:</b> {{ settingsStore.background.image?.num }}
            </p>
            <p>
              <b>{{ t('win.settings.source') }}: </b>
              <a v-if="settingsStore.background.image?.source_link !== ''" :href="settingsStore.background.image?.source_link">
                {{ settingsStore.background.image?.source }}
              </a>
            </p>
            <p>
              <b>{{ t('win.settings.author') }}: </b>
              <a v-if="settingsStore.background.image?.author_link !== ''" :href="settingsStore.background.image?.author_link">
                {{ settingsStore.background.image?.author }}
              </a>
            </p>
          </win-memo>

          <div class="row no-gutters mt-2 noselect">
            <div class="col-2 pr-1">
              <win-button block @click="nextBg(-1)">
                &lt;
              </win-button>
            </div>
            <div class="col-2 pr-1">
              <win-button block @click="nextBg(1)">
                &gt;
              </win-button>
            </div>
            <div class="col-4 pr-1">
              <win-button block :class="{active: settingsStore.background.mode === enBackgroundMode.RANDOM}" @click="randomBg">
                {{ t('win.settings.btn_random') }}
              </win-button>
            </div>
            <div class="col-4">
              <win-button block :class="{active: settingsStore.background.mode === enBackgroundMode.SOLID}" @click="solidBg">
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
                  <option v-for="item in themes" :key="item[0]" :value="item[0]" :selected="settingsStore.theme === item[0]">
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
                          :selected="settingsStore.taskbarPosition === item[0]"
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
                <input id="low_quality" type="checkbox" :checked="settingsStore.lowQuality" @change="qualityChanged">
                <label for="low_quality">{{ t('win.settings.low_quality') }}</label>
              </div>
              <div class="checkbox" v-if="!useMobile()">
                <input id="hls_beta" type="checkbox" :checked="settingsStore.useHls" @change="hlsChanged">
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
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { api } from '@app/api/api'
import { useSettingsStore } from '@app/stores/settingsStore'
import { type BackgroundImage, enBackgroundMode } from '@app/types/types'
import { useMobile } from '@app/composables/useMobile.ts'
import { useWindows } from '@app/composables/useWindows.ts'

const { t } = useI18n()
const settingsStore = useSettingsStore()
const backgroundList = ref<BackgroundImage[]>([])
const { openWindow, closeWindow, WinType, winAlert } = useWindows()

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
  solidBg((e.target as HTMLInputElement).value)
}

function nextBg (dir: number): void {
  let index = findIndex(settingsStore.background.image!) + dir

  if (index < 0) {
    index = backgroundList.value.length - 1
  } else if (index >= backgroundList.value.length) {
    index = 0
  }

  settingsStore.background.mode = enBackgroundMode.SINGLE
  settingsStore.background.image = backgroundList.value[index]
  settingsStore.saveBackground()
}

function randomBg (): void {
  const image = backgroundList.value[Math.floor(Math.random() * backgroundList.value.length)]

  settingsStore.background.mode = enBackgroundMode.RANDOM
  settingsStore.background.image = image
  settingsStore.saveBackground()
}

function solidBg (color?: string): void {
  if (typeof color !== 'undefined') {
    settingsStore.background.color = color
  }

  settingsStore.background.mode = enBackgroundMode.SOLID
  settingsStore.saveBackground()
}

function findIndex (background: BackgroundImage): number {
  const index = backgroundList.value.findIndex((b: BackgroundImage) => {
    return b.id === background.id
  })

  return index < 0 ? 0 : index
}

function themeSelected (e: Event): void {
  settingsStore.theme = (e.target as HTMLSelectElement).value
  settingsStore.saveTheme()
}

function taskbarPositionSelected (e: Event): void {
  settingsStore.taskbarPosition = (e.target as HTMLSelectElement).value
  settingsStore.saveTaskbarPosition()
}

function openLanguageSettings (): void {
  openWindow(WinType.SETTINGS_LANGUAGE)
  closeWindow(WinType.SETTINGS)
}

function qualityChanged (e: Event): void {
  settingsStore.lowQuality = (e.target as HTMLInputElement).checked
  settingsStore.saveQuality()
  winAlert(t('win.settings.quality_changed'), t('messages.saved'), 'info')
}

function hlsChanged (e: Event): void {
  settingsStore.useHls = (e.target as HTMLInputElement).checked
  settingsStore.saveHls()
  winAlert(t('win.settings.quality_changed'), t('messages.saved'), 'info')
}

onMounted(() => {
  // Load background list from server
  api.backgrounds.get().then(res => backgroundList.value = res.data)
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
