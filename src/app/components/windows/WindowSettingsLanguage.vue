<template>
  <div class="p-2">
    <win-list scroll>
      <tr v-for="(lang, n) in _locales" :key="n" class="hover">
        <td class="p-2 lang-icon noselect" v-html="_flags[n]" />
        <td class="noselect show-info" :class="{selected: n === language}" @click="switchLanguage(<string>n)">
          {{ lang.name }}
        </td>
      </tr>
    </win-list>

    <win-panel class="mt-2 text-center">
      <i18n-t v-if="te('win.settings_language.translation_author_name')" keypath="win.settings_language.translation_by" tag="p" class="mb-1">
        <template #author>
          <a :href="t('win.settings_language.translation_author_link')" target="_blank">
            {{ t('win.settings_language.translation_author_name') }}
          </a>
        </template>
      </i18n-t>
      <i18n-t keypath="win.settings_language.help" tag="p">
        <template #link>
          <br><a href="mailto:mail@plaza.one">{{ t('win.settings.let_us_know') }}</a>
        </template>
      </i18n-t>
    </win-panel>

    <div class="text-center mt-3">
      <win-button class="px-4" @click="closeWindow(Win.SETTINGS_LANGUAGE)">
        {{ t('buttons.close') }}
      </win-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import _locales from '@locales/_locales'
import _flags from '@locales/_flags.ts'
import { nextTick, onMounted, ref } from 'vue'
import type WinList from '@app/components/basic/WinList.vue'
import { useAppSettings } from '@app/composables/useAppSettings.ts'
import { Win } from '@app/types'
import { useWindows } from '@app/composables/useWindows.ts'

const { t, te } = useI18n()
const list = ref<InstanceType<typeof WinList>>()
const { language, setLanguage } = useAppSettings()
const { closeWindow } = useWindows()

function switchLanguage (lang: string): void {
  setLanguage(lang)
}

onMounted(() => {
  nextTick(() => {
    list.value?.scrollTop()
  })
})
</script>

<style lang="scss">
#window-settings-language {
  .win-list {
    height: 175px;

    svg {
      width: 100%;
    }

    .lang-icon {
      width: 36px;
      line-height: 0;
    }

    .selected {
      font-weight: bold;
    }
  }
}
</style>
