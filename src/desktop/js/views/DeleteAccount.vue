<template>
  <div class="app-desktop theme-win98">
    <win-window :width="450" name="delete-account" :title="t('win.delete_account.title')" @closed="close()" v-slot="winProps">
      <div class="p-2">
        <win-memo>
          <p class="lead mb-2 text-center">{{ t('win.delete_account.title2') }}</p>
          <i18n-t keypath="win.delete_account.if_you_want" tag="p" class="mb-2">
            <template #email>
              <a href="mailto:mail@plaza.one">mail@plaza.one</a>
            </template>
          </i18n-t>
          <p>{{ t('win.delete_account.will_be_deleted') }}</p>
        </win-memo>

        <div class="text-center mt-3">
          <win-btn class="mx-auto px-4" @click="winProps.close()">{{ t('buttons.close') }}</win-btn>
        </div>
      </div>
    </win-window>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useWindowsStore } from '@common/js/stores/windowsStore'

const { t } = useI18n()
const router = useRouter()
const windowsStore = useWindowsStore()

onMounted(() => {
  windowsStore.pullUp('delete-account')
})

function close () {
  router.push({ name: 'index' })
}
</script>

