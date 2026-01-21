<template>
  <win-panel>
    <div class="row justify-content-between">
      <div class="col-auto align-self-center lh-1">
        Security check...
      </div>
      <div class="col">
        <win-loading-bar v-if="model === ''" :height="20" />
        <img v-else src="@app/assets/img/check-0.png" style="height: 20px" class="float-end"  alt="ok"/>
      </div>
    </div>
    <vue-turnstile
        v-show="needsInteractive"
        v-model="model"
        :site-key="turnstileKey"
        size="flexible"
        appearance="interaction-only"
        class="mt-3 lh-1"
        @before-interactive="onBeforeInteractive"
        @error="onError"
    />
  </win-panel>
</template>

<script setup lang="ts">
import VueTurnstile from 'vue-turnstile'
import { ref } from 'vue'

const turnstileKey = import.meta.env.VITE_TURNSTILE_KEY

const model = defineModel<string>({ default: '' })

const needsInteractive = ref(false)

function onError(error: number) {
  console.error(error)
}

function onBeforeInteractive() {
  needsInteractive.value = true
}
</script>
