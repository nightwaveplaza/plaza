<template>
  <win-panel>
    <div class="row justify-content-between">
      <div class="col-auto align-self-center lh-1" >
        <span class="small">
          <template v-if="!needsInteractive">▶</template><template v-else>▼</template>&nbsp;
        </span>
        <a class="link" role="button" @click="needsInteractive = !needsInteractive">Security check...</a>
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
        appearance="always"
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
  needsInteractive.value = true
  console.error(error)
}

function onBeforeInteractive() {
  needsInteractive.value = true
}
</script>
