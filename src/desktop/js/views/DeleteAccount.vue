<template>
  <div class="app-desktop theme-win98">
    <win-window ref="window" :width="450" name="delete-account" title="Delete Account" @closed="close()">
      <div class="p-2">
        <win-memo>
          <p class="lead mb-2 text-center">Account deletion</p>
          <p class="mb-2">If you want to delete your account please contact us on <a href="mailto:mail@plaza.one">mail@plaza.one</a>.</p>
          <p>You account and all associated data will be permanently deleted (favorites and like history).</p>
        </win-memo>

        <div class="text-center mt-3">
          <win-btn class="mx-auto px-4" @click="window.close()">Close</win-btn>
        </div>
      </div>
    </win-window>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { onMounted, ref } from 'vue'
import { useStore } from 'vuex'
import windowsComposable from '@common/js/composables/windowsComposable'

const router = useRouter()
const store = useStore()

const { closeWindow } = windowsComposable('delete-account')

const window = ref('window')

onMounted(() => {
  store.commit('windows/pullUp', 'delete-account')
})

function close () {
  console.log("emit")
  router.push({ name: 'index' })
}
</script>

