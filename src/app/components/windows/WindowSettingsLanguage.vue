<template>
  <win-window v-slot="winProps" :width="280" name="settings-language" :title="t('win.settings_language.title')">
    <div class="p-2">
      <win-list>
        <tr v-for="(lang, name) in _locales" :key="name" class="hover">
          <td class="p-2 lang-icon noselect" v-html="_flags[name]" />
          <td class="noselect show-info" :class="{selected: name === settingsStore.language}" @click="switchLanguage(<string>name)">
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
import _flags from '@locales/_flags.ts'
import { nextTick, onMounted, ref } from 'vue'
import type WinList from '@app/components/basic/WinList.vue'

const { t, te } = useI18n()
const settingsStore = useSettingsStore()
const list = ref<InstanceType<typeof WinList>>()

function switchLanguage (name: string): void {
  settingsStore.language = name
  settingsStore.saveLanguage()
}

onMounted(() => {
  nextTick(() => {
    list.value?.scrollTop()
  })
})
</script>

<style lang="scss">
#window-settings-language {
  .list {
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
