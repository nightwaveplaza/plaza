<template>
  <win-window ref="win" :width="450" name="support" :title="t('win.support.title')">
    <div class="p-2">
      <div class="text-center">
        <win-memo>
          <p class="lead mb-2">
            {{ t('win.support.title2') }}
          </p>
          <p>{{ t('win.support.rewards') }}</p>

          <p class="my-3">
            <a class="pp-link" href="https://boosty.to/nightwaveplaza" target="_blank">
              <img alt="boosty" src="/img/boosty.png"><br>{{ t('win.support.boosty') }}
            </a>
          </p>

          <p class="mt-2">
            {{ t('win.support.thanks') }}
          </p>
        </win-memo>
      </div>

      <div class="text-center mt-3">
        <win-btn class="mx-auto px-4" @click="close()">
          {{ t('buttons.close') }}
        </win-btn>
      </div>
    </div>
  </win-window>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { ref } from 'vue'
import WinWindow from '@common/js/components/WinWindow.vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const router = useRouter()

const props = defineProps({
  direct: {
    type: Boolean,
    default: false,
  },
})

const win = ref<InstanceType<typeof WinWindow>>()

function close (): void {
  if (props.direct) {
    router.push({ name: 'index' })
  } else {
    win.value!.close()
  }
}
</script>
