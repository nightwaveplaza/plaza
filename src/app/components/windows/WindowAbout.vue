<template>
  <win-window ref="win" v-slot="winProps" :width="380" :name="name" :title="t('win.about.title')">
    <div class="content p-2">
      <div class="row mb-4">
        <div class="col align-self-center text-center">
          <p class="lead mb-1">
            Nightwave Plaza
          </p>
          <p><i>{{ t('win.about.welcome') }}</i></p>
        </div>
        <div class="col-auto align-self-center">
          <img src="@app/assets/img/pc.png" style="width: 70px" alt="">
        </div>
      </div>

      <win-panel class="mb-3">
        <p>
          <strong>{{ t('win.about.contact_info') }}</strong><br>
        </p>
        <i18n-t keypath="win.about.send_enquires" tag="p">
          <template #link>
            <a href="mailto:mail@plaza.one" target="_blank">mail@plaza.one</a>
          </template>
        </i18n-t>

        <i18n-t keypath="win.about.discord" tag="p" class="mb-2">
          <template #discord>
            <a href="https://plaza.one/discord" target="_blank">Discord</a>
          </template>
        </i18n-t>

        <p>
          <strong>{{ t('win.about.submissions') }}</strong><br>
        </p>
        <i18n-t keypath="win.about.submission_form" tag="p" class="mb-2">
          <template #link>
            <a href="https://plaza.one/submissions" target="_blank">{{ t('win.about.submission_link') }}</a>
          </template>
        </i18n-t>

        <p class="mb-2">
          <strong>{{ t('win.about.mobile') }}</strong><br>
          <a role="button" @click="openMobile">{{ t('win.about.show_more') }}</a>
        </p>

        <p>
          <strong>{{ t('win.about.useful_links') }}</strong><br>
        </p>
        <p class="mb-2">
          {{ t('win.about.playlists') }}<br>
          <a href="https://plaza.one/plaza.m3u" target="_blank">M3U (Winamp)</a>
          <a class="ml-3" href="https://plaza.one/plaza.pls" target="_blank">PLS (Foobar2000)</a>
        </p>
        <p>
          {{ t('win.about.streams') }}<br>
          <a href="http://radio.plaza.one/mp3" target="_blank">http://radio.plaza.one/mp3</a> (mp3 / 128kbps)<br>
          <a href="http://radio.plaza.one/ogg" target="_blank">http://radio.plaza.one/ogg</a> (opus / 96kbps)<br>
          <a href="http://radio.plaza.one/hls" target="_blank">http://radio.plaza.one/hls</a> (hls / aac)
        </p>
      </win-panel>

      <div class="row buttons no-gutters w-100">
        <div class="col-auto">
          <win-button class="px-4 mr-2" @click="openCredits">
            {{ t('win.about.btn_credits') }}
          </win-button>
        </div>
        <div class="col-auto">
          <win-button class="px-4 mr-2" @click="openNews">
            {{ t('win.about.btn_news') }}
          </win-button>
        </div>
        <div class="col-auto ml-auto">
          <win-button class="px-4" @click="winProps.close()">
            {{ t('buttons.close') }}
          </win-button>
        </div>
      </div>
    </div>

    <div class="statusbar row no-gutters">
      <div class="col cell">
        {{ t('win.about.version') }}: {{ appVersion }}{{ version }}
      </div>
    </div>
  </win-window>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import WinWindow from '@app/components/basic/WinWindow.vue'
import { useMobile } from '@app/composables/useMobile.ts'
import { onMounted, ref } from 'vue'
import { Native } from '@mobile/bridge/native.ts'
import { useWindows } from '@app/composables/useWindows.ts'
import { WinType } from '@app/types/types.ts'

const { t } = useI18n()
const { openWindow, closeWindow } = useWindows()

defineProps<{
  name: string
}>()

const version = __APP_VERSION__ ?? 'n/a'
const appVersion = ref('')

onMounted(() => {
  if (useMobile()) {
    Native.getAppVersion().then(version => {
      appVersion.value = version + ' / '
    })
  }
})

function openCredits (): void {
  openWindow(WinType.CREDITS)
  closeWindow(WinType.ABOUT)
}

function openNews (): void {
  openWindow(WinType.NEWS)
  closeWindow(WinType.ABOUT)
}

function openMobile (): void {
  openWindow(WinType.MOBILE)
  closeWindow(WinType.ABOUT)
}
</script>

<style lang="scss">
#window-about {
  p {
    font-size: 12px;
    line-height: 150%;

    &.lead {
      font-size: 14px;
      font-style: italic;
      font-weight: 700;
    }
  }
}
</style>
