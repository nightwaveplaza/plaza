<template>
  <win-window :width="240" name="settings-language" :title="t('win.settings_language.title')" v-slot="winProps">
    <div class="p-2">
      <div class="group-box p-2">
        <div class="gb-label noselect">{{ t('win.settings_language.select') }}</div>
        <div class="select">
          <select @change="switchLanguage">
            <option v-for="(lang, name) in _locales" :value="lang" v-html="lang.name" :selected="name === appearanceStore.language"  />
          </select>
        </div>
      </div>

      <i18n-t keypath="win.settings_language.help" tag="p" class="mt-2 text-center">
        <template #link>
          <a href="mailto:mail@plaza.one">{{ t('win.settings.let_us_know') }}</a>
        </template>
      </i18n-t>

      <div class="text-center mt-3">
        <win-btn class="px-4" @click="winProps.close()">{{ t('buttons.close') }}</win-btn>
      </div>
    </div>
  </win-window>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useAppearanceStore } from '@common/js/stores/appearanceStore.ts'
import _locales from '@locales/_locales'

const { t } = useI18n()
const appearanceStore = useAppearanceStore()

function switchLanguage(e: Event) {
  appearanceStore.language = (e.target as HTMLSelectElement).value
  appearanceStore.saveLanguage()
}
</script>