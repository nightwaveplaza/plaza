<template>
  <win-window v-slot="winProps" :width="250" name="settings-language" :title="t('win.settings_language.title')">
    <div class="p-2">
      <div class="group-box">
        <div class="gb-label noselect">
          <span>{{ t('win.settings_language.select') }}</span>
        </div>
        <div class="gb-content p-2">
          <div class="select">
            <select @change="switchLanguage">
              <option v-for="(lang, name) in _locales" :key="name" :value="name" :selected="name === settingsStore.language">
                {{ lang.name }}
              </option>
            </select>
          </div>
        </div>
      </div>

      <i18n-t keypath="win.settings_language.help" tag="p" class="mt-2 text-center">
        <template #link>
          <a href="mailto:mail@plaza.one">{{ t('win.settings.let_us_know') }}</a>
        </template>
      </i18n-t>

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
