<template>
  <win-window v-slot="winProps" :width="230" name="settings-language" :title="t('win.settings_language.title')">
    <div class="p-2">
      <win-group-box>
        <template #title>{{ t('win.settings_language.select') }}</template>
        <template #content>
          <div class="select">
            <select @change="switchLanguage">
              <option v-for="(lang, name) in _locales" :key="name" :value="name" :selected="name === settingsStore.language">
                {{ lang.name }}
              </option>
            </select>
          </div>
        </template>
      </win-group-box>

      <win-panel class="mt-2 text-center">
        <i18n-t keypath="win.settings_language.help" tag="p">
          <template #link>
            <a href="mailto:mail@plaza.one">{{ t('win.settings.let_us_know') }}</a>
          </template>
        </i18n-t>
      </win-panel>

      <div class="text-center mt-3">
        <win-button class="px-4" @click="winProps.close()">
          {{ t('buttons.close') }}
        </win-button>
      </div>
    </div>
  </win-window>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useSettingsStore } from '@app/stores/settingsStore'
import _locales from '@locales/_locales'

const { t } = useI18n()
const settingsStore = useSettingsStore()

function switchLanguage(e: Event): void {
  settingsStore.language = (e.target as HTMLSelectElement).value
  settingsStore.saveLanguage()
}
</script>
