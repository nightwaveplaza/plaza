<template>
  <win-window :width="280" name="settings-background" :title="t('win.settings.title')" v-slot="winProps">
    <div class="p-2">
      <!-- Background -->
      <div class="group-box p-2 mb-3">
        <div class="gb-label noselect">{{ t('win.settings.background') }}</div>

        <div class="row palette no-gutters" v-if="settingsStore.background.mode === enBackgroundMode.SOLID">
          <div class="col-auto" v-for="color in palette">
            <button class="color" :style="{backgroundColor: color}" @click="solidBg(color)"/>
          </div>
          <div class="col-3">
            <input class="d-block" :value="settingsStore.background.color" @input="colorSelected"/>
          </div>
        </div>

        <win-memo v-else>
          <p>
            <b>{{ t('win.settings.background') }}:</b> {{ settingsStore.background.image?.num }}
          </p>
          <p>
            <b>{{ t('win.settings.source') }}: </b>
            <a v-if="settingsStore.background.image?.source_link !== ''"
               :href="settingsStore.background.image?.source_link">
              {{ settingsStore.background.image?.source }}
            </a>
          </p>
          <p>
            <b>{{ t('win.settings.author') }}: </b>
            <a v-if="settingsStore.background.image?.author_link !== ''"
               :href="settingsStore.background.image?.author_link">
              {{ settingsStore.background.image?.author }}
            </a>
          </p>
        </win-memo>

        <div class="row no-gutters mt-2 noselect">
          <div class="col-2 pr-1">
            <win-btn block @click="nextBg(-1)">&lt;</win-btn>
          </div>
          <div class="col-2 pr-1">
            <win-btn block @click="nextBg(1)">&gt;</win-btn>
          </div>
          <div class="col-4 pr-1">
            <win-btn block :class="{active: settingsStore.background.mode === enBackgroundMode.RANDOM}" @click="randomBg">{{ t('win.settings.btn_random') }}</win-btn>
          </div>
          <div class="col-4">
            <win-btn block :class="{active: settingsStore.background.mode === enBackgroundMode.SOLID}" @click="solidBg">{{ t('win.settings.btn_solid') }}</win-btn>
          </div>
        </div>

        <i18n-t keypath="win.settings.bg_notice" tag="p" class="mt-2 noselect">
          <template #link>
            <a href="mailto:mail@plaza.one">{{ t('win.settings.let_us_know') }}</a>
          </template>
        </i18n-t>
      </div>
      <!-- /Background -->

      <!-- Appearance Settings -->
      <div class="group-box p-2 mb-3">
        <div class="gb-label noselect">{{ t('win.settings.appearance') }}</div>
        <div class="row no-gutters">
          <div class="col-7">
            <div class="mb-1">{{ t('win.settings.theme') }}</div>
            <div class="select">
              <select @change="themeSelected">
                <option v-for="item in themes" :value="item[0]" v-html="item[1]" :selected="settingsStore.theme === item[0]"/>
              </select>
            </div>
          </div>
          <div class="col ml-2">
            <div class="mb-1">{{ t('win.settings.taskbar') }}</div>

              <div class="select">
                <select @change="taskbarPositionSelected">
                  <option v-for="item in taskbarPositions" :value="item[0]" v-html="item[1]" :selected="settingsStore.taskbarPosition === item[0]" />
                </select>
              </div>
          </div>
        </div>

      </div>
      <!-- /Appearance Settings -->

      <!-- App Settings -->
      <div class="group-box p-2 mb-3">
        <div class="gb-label noselect">{{ t('win.settings.application') }}</div>

        <div class="row">
          <div class="col-5 align-self-center">{{ t('win.settings.audio_quality') }}:</div>
          <div class="col-5">
            <div class="checkbox">
              <input id="low_quality" type="checkbox" @change="qualityChanged" />
              <label for="low_quality">{{ t('win.settings.low_quality') }}</label>
            </div>
          </div>
        </div>
      </div>
      <!-- /App Settings -->

      <div class="d-flex justify-content-between">
        <win-btn class="px-2" @click="openLanguageSettings">{{ t('win.settings.language') }}</win-btn>
        <win-btn class="px-4" @click="winProps.close()">{{ t('buttons.close') }}</win-btn>
      </div>
    </div>
  </win-window>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { api } from '@common/js/api/api'
import { useWindowsStore } from '@common/js/stores/windowsStore.ts'
import { useSettingsStore } from '@common/js/stores/settingsStore'
import { enBackgroundMode, type BackgroundImage } from '@common/js/types'

const { t } = useI18n()
const windowsStore = useWindowsStore()
const settingsStore = useSettingsStore()
const backgroundList = ref<BackgroundImage[]>([])

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

function colorSelected (e: Event) {
  solidBg((e.target as HTMLInputElement).value)
}

function nextBg (dir: number) {
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

function randomBg () {
  const image = backgroundList.value[Math.floor(Math.random() * backgroundList.value.length)]

  settingsStore.background.mode = enBackgroundMode.RANDOM
  settingsStore.background.image = image
  settingsStore.saveBackground()
}

function solidBg (color?: string) {
  if (typeof color !== 'undefined') {
    settingsStore.background.color = color
  }

  settingsStore.background.mode = enBackgroundMode.SOLID
  settingsStore.saveBackground()
}

function findIndex (background: BackgroundImage) {
  const index = backgroundList.value.findIndex((b: any) => {
    return b.id === background.id
  })

  return index < 0 ? 0 : index
}

function themeSelected (e: Event) {
  settingsStore.theme = (e.target as HTMLSelectElement).value
  settingsStore.saveTheme()
}

function taskbarPositionSelected (e: Event) {
  settingsStore.taskbarPosition = (e.target as HTMLSelectElement).value
  settingsStore.saveTaskbarPosition()
}

function openLanguageSettings() {
  windowsStore.open('settings-language')
  windowsStore.close('settings-background')
}

function qualityChanged(e: Event) {
  settingsStore.lowQuality = Number((e.target as HTMLInputElement).checked)
  settingsStore.saveQuality()
  windowsStore.alert(t('win.settings.quality_changed'), t('messages.saved'), 'info')
}

onMounted(() => {
  // Load background list from server
  api.backgrounds.get().then(res => backgroundList.value = res.data)
})
</script>
