<template>
  <div class="p-2">
    <WinTabs class="mb-3">
      <!-- About tab -->
      <WinTab name="about" label="About">
        <div class="row mb-3">
          <div class="col-auto align-content-center pe-2">
            <img src="@app/assets/img/pc.png" style="width: 64px" alt="" />
          </div>
          <div class="col align-content-center">
            <p class="lead">Nightwave Plaza</p>
            <p>{{ t('win.about.version') }}: {{ appVersion }}{{ version }}</p>
            <p>&copy; 2015-2026 Nightwave Plaza</p>
          </div>
        </div>

        <p class="mb-3">{{ t('win.about.welcome') }}</p>

        <WinGroupBox class="mb-3">
          <template #title> {{ t('win.about.contact_info') }} </template>
          <template #content>
            <table class="is-selectable">
              <tbody>
                <tr>
                  <td style="width: 54px">Email:</td>
                  <td><a href="mailto:mail.plaza.one" target="_blank">mail@plaza.one</a></td>
                </tr>
                <tr>
                  <td>Discord:</td>
                  <td>
                    <a href="https://discord.gg/nightwaveplaza" target="_blank"
                      >discord.gg/nightwaveplaza</a
                    >
                  </td>
                </tr>
                <tr>
                  <td>GitHub:</td>
                  <td>
                    <a href="https://github.com/nightwaveplaza" target="_blank"
                      >github.com/nightwaveplaza</a
                    >
                  </td>
                </tr>
                <tr>
                  <td>Crowdin:</td>
                  <td>
                    <a href="https://translate.plaza.one" target="_blank">translate.plaza.one</a>
                  </td>
                </tr>
              </tbody>
            </table>
          </template>
        </WinGroupBox>

        <WinGroupBox class="mb-2">
          <template #title> {{ t('win.about.submissions') }} </template>
          <template #content>
            <p class="mb-0">
              {{ t('win.about.submission_form') }}
              <a href="https://plaza.one/submissions" target="_blank" class="text-nowrap">
                https://plaza.one/submissions
              </a>
            </p>
          </template>
        </WinGroupBox>

        <p class="mb-0 text-end">
          <small
            ><a href="https://plaza.one/privacy" target="_blank">{{
              t('win.about.privacy_policy')
            }}</a></small
          >
        </p>
      </WinTab>

      <!-- Clients tab -->
      <WinTab name="Apps" :label="t('win.about.tab_apps')">
        <win-panel class="mb-2">
          <div class="row">
            <div class="col">
              <p class="text-center mb-0">{{ t('win.about.mobile_apps') }}</p>
            </div>
            <div class="col-auto">
              <img src="@app/assets/img/mobilen.gif" alt="" />
            </div>
          </div>
        </win-panel>
        <win-memo>
          <div class="row gx-0 my-2">
            <div class="col text-center">
              <a href="https://plaza.one/ios" target="_blank" class="app-link">
                <img src="@app/assets/img/app_ios.png" class="app-icon" alt="" /><br />
                Apple iOS.app
              </a>
            </div>
            <div class="col text-center">
              <a href="https://plaza.one/googleplay" target="_blank" class="app-link">
                <img src="@app/assets/img/app_android.png" class="app-icon" alt="" /><br />
                Android.app
              </a>
            </div>
          </div>
        </win-memo>
      </WinTab>

      <!-- Streams tab -->
      <WinTab name="streams" :label="t('win.about.tab_streams')">
        <p>
          <strong>{{ t('win.about.playlists') }}:</strong>
        </p>
        <WinPanel class="mb-3">
          <table>
            <tbody>
              <tr>
                <td style="width: 96px">Winamp</td>
                <td><a href="https://plaza.one/plaza.m3u" target="_blank">plaza.m3u</a></td>
              </tr>
              <tr>
                <td>foobar2000</td>
                <td><a href="https://plaza.one/plaza.pls" target="_blank">plaza.pls</a></td>
              </tr>
            </tbody>
          </table>
        </WinPanel>

        <p>
          <strong>{{ t('win.about.streams') }}:</strong>
        </p>
        <WinPanel>
          <table>
            <tbody>
              <tr>
                <td style="width: 96px">mp3 / 128kbps</td>
                <td>
                  <a href="http://radio.plaza.one/mp3" target="_blank">radio.plaza.one/mp3</a>
                </td>
              </tr>
              <tr>
                <td>opus / 96kbps</td>
                <td>
                  <a href="http://radio.plaza.one/ogg" target="_blank">radio.plaza.one/ogg</a>
                </td>
              </tr>
              <tr>
                <td>hls @ aac</td>
                <td>
                  <a href="http://radio.plaza.one/hls" target="_blank">radio.plaza.one/hls</a>
                </td>
              </tr>
            </tbody>
          </table>
        </WinPanel>
      </WinTab>

      <!-- Credits tab -->
      <WinTab name="credits" :label="t('win.about.tab_credits')">
        <WinMemo>
          <i18n-t keypath="win.about.credits.created_by" tag="p" class="mb-2">
            <template #nightwave_plaza>
              <strong>Nightwave Plaza</strong>
            </template>
            <template #author>
              <a href="https://discordapp.com/users/104038869388775424" target="_blank">
                <strong>Alexander Morozov</strong>
              </a>
            </template>
          </i18n-t>

          <i18n-t keypath="win.about.credits.music_backgrounds" tag="p" class="mb-2" />
          <i18n-t keypath="win.about.credits.content_by" tag="p" class="mb-0">
            <template #email>
              <a href="mailto:mail@plaza.one" target="_blank">mail@plaza.one</a>
            </template>
          </i18n-t>
        </WinMemo>
      </WinTab>
    </WinTabs>

    <div class="row gx-0 w-100">
      <div class="col-auto">
        <win-button class="px-4" @click="openNews">
          {{ t('win.about.btn_news') }}
        </win-button>
      </div>
      <div class="col-auto ms-auto">
        <win-button class="px-4" @click="closeWindow(Win.ABOUT)">
          {{ t('buttons.close') }}
        </win-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { useI18n } from 'vue-i18n';
  import { isMobile } from '@app/utils/helpers.ts';
  import { onMounted, ref } from 'vue';
  import { Native } from '@mobile/bridge/native.ts';
  import { useWindows } from '@app/composables/useWindows.ts';
  import { Win } from '@app/types';

  const { t } = useI18n();
  const { openWindow, closeWindow } = useWindows();

  const version = __APP_VERSION__ ?? 'n/a';
  const appVersion = ref('');

  onMounted(() => {
    if (isMobile()) {
      Native.getAppVersion().then(version => {
        appVersion.value = version + ' / ';
      });
    }
  });

  function openNews(): void {
    openWindow(Win.NEWS);
  }
</script>

<style lang="scss">
  #window-about {
    p {
      line-height: 150%;

      &.lead {
        font-size: 14px;
        font-style: italic;
        font-weight: 700;
      }
    }

    table {
      td {
        padding: 2px 0;
        line-height: 150%;
      }
    }

    .app-icon {
      width: 36px;
      height: auto;
    }

    .app-link {
      text-decoration: underline;
    }
  }
</style>
