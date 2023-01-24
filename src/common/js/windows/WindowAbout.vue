<template>
  <win-window ref="window" :width="440" fluidHeight name="about" title="About">
    <div class="content-fluid p-2">
      <div class="d-flex flex-column h-100">
        <div class="d-flex flex-grow-1 align-items-stretch">
          <div style="position: relative" class="w-100">
            <win-memo scroll>
              <p class="lead">Welcome to Nightwave Plaza!</p>
              <p>Nightwave Plaza is a free 24/7 online vaporwave radio station. The broadcast also includes some future
                funk
                and experimental genres. We hope you enjoy.</p>
              <p>Join our community <a href="https://plaza.one/discord">Discord server</a>!</p>

              <p class="lead mt-3">Submissions</p>
              <p>Please use <a href="https://plaza.one/submissions" target="blank">this form</a> to send music for
                broadcasting.</p>

              <p class="lead mt-3">Contact Information</p>
              <p>Please send any enquiries you may have to <a href="mailto:mail@plaza.one">mail@plaza.one</a>.</p>
              <p>Any updates or upcoming maintenance on Nightwave Plaza can be found on our official Twitter account: <a
                  href="https://twitter.com/nightwaveplaza/" target="_blank">@NightwavePlaza</a>.</p>
              <p>Nightwave Plaza can also be found on <a href="https://plaza.one/youtube" target="_blank">YouTube</a>,
                <a
                    href="https://plaza.one/facebook" target="_blank">Facebook</a>,
                <a href="https://plaza.one/vk" target="_blank">VK</a>, <a href="https://plaza.one/lastfm"
                                                                          target="_blank">Last.fm</a> and <a
                    href="https://plaza.one/tunein" target="_blank">TuneIn</a>.
              </p>

              <p class="lead mt-3">Streaming Links</p>
              <p>You are able to listen to Nightwave Plaza's broadcasts through your favorite music player instead of a
                browser! Use the following links:</p>
              <p class="mt-2">
                <b>Playlists</b><br/>
                <a href="https://plaza.one/plaza.m3u" target="_blank">m3u file for Winamp</a><br/>
                <a href="https://plaza.one/plaza.pls" target="_blank">pls file for foobar2k</a><br/>
              </p>
              <p class="mt-2">
                <b>Streams</b><br/>
                <a href="http://radio.plaza.one/opus" target="_blank">http://radio.plaza.one/opus</a> (opus /
                96kbps)<br/>
                <a href="http://radio.plaza.one/opus_low" target="_blank">http://radio.plaza.one/opus_low</a> (opus /
                64kbps)<br/>
                <a href="http://radio.plaza.one/mp3" target="_blank">http://radio.plaza.one/mp3</a> (mp3 / 128kbps)<br/>
                <a href="http://radio.plaza.one/mp3_low" target="_blank">http://radio.plaza.one/mp3_low</a> (mp3 /
                96kbps)<br/>
              </p>

              <p class="mt-4">
                <a href="https://plaza.one/privacy" target="_blank">Privacy policy</a>
              </p>
              <p class="mt-2">
                Build date: __APP_VERSION__
              </p>
            </win-memo>
          </div>
        </div>

        <div class="d-flex">
          <div class="row buttons no-gutters mt-2 w-100">
            <div class="col-auto">
              <win-btn class="px-4 mr-2" @click="openCredits">Credits</win-btn>
            </div>
            <div class="col-auto">
              <win-btn class="px-4 mr-2" @click="openNews">News</win-btn>
            </div>
            <div class="col-auto ml-auto">
              <win-btn class="px-4" @click="closeWindow2">Close</win-btn>
            </div>
          </div>
        </div>
      </div>

    </div>
  </win-window>
</template>

<script setup>
import { useStore } from 'vuex'
import windowsComposable from '@common/js/composables/windowsComposable'

const store = useStore()

// Composable
const { openWindow2, closeWindow2 } = windowsComposable('about')

// Methods
const openCredits = () => {
  openWindow2('credits')
  closeWindow2()
}

const openNews = () => {
  openWindow2('news')
  closeWindow2()
}
</script>
