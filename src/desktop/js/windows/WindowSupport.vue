<template>
  <win-window ref="window" :width="450" name="support" title="Support Us">
    <div class="p-2">
      <div class="text-center">
        <win-memo>
          <p class="lead mb-2">Love Nightwave Plaza?</p>
          <p>You can support the radio station and further updates by donating via Boosty and get special Discord
            rewards!</p>

          <p class="my-3">
            <a class="pp-link" href="https://boosty.to/nightwaveplaza" target="_blank">
              <img alt="boosty" src="/img/boosty.png"/><br/>Support on Boosty
            </a>
          </p>

          <p class="mt-2">Thank you for donations, they will go straight into funding the station.</p>
        </win-memo>
      </div>

      <div class="text-center mt-3">
        <win-btn class="mx-auto px-4" @click="close()">Close</win-btn>
      </div>
    </div>
  </win-window>
</template>

<script setup>
import { useRouter } from 'vue-router'
import windowsComposable from '@common/js/composables/windowsComposable'

const { closeWindow2 } = windowsComposable('support')

const router = useRouter()

const props = defineProps({
  direct: {
    type: Boolean,
    default: false,
  },
})

function close () {
  if (props.direct) {
    router.push({ name: 'index' })
  } else {
    closeWindow2()
  }
}
</script>
