<template>
  <win-panel class="overflow-hidden px-2 py-1">
    <div class="row justify-content-between">
      <div class="col-auto align-self-center lh-lg">
        <span class="small">
          <template v-if="!needsInteractive">▶</template><template v-else>▼</template>&nbsp;
        </span>
        <a class="link" role="button" @click="needsInteractive = !needsInteractive">{{
          t('fields.security_check')
        }}</a>
      </div>
      <div class="col align-self-center">
        <win-loading-bar v-if="model === ''" :height="20" />
        <img
          v-else
          src="@app/assets/img/check-0.png"
          style="height: 20px"
          class="float-end"
          alt="ok"
        />
      </div>
    </div>

    <div v-show="needsInteractive" class="mt-1">
      <altcha-widget @statechange="onStateChange" @expired="onExpired" />
    </div>
  </win-panel>
</template>

<script setup lang="ts">
  import { ref } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { State } from 'altcha/types';
  const { t } = useI18n();

  const model = defineModel<string>({ default: '' });

  const needsInteractive = ref(false);

  function onExpired() {
    model.value = '';
    needsInteractive.value = true;
  }

  const onStateChange = (ev: CustomEvent | Event) => {
    if ('detail' in ev) {
      const { payload, state } = ev.detail;
      if (state === State.ERROR) {
        needsInteractive.value = true;
      }

      if (State.VERIFIED && payload) {
        model.value = payload;
      } else {
        model.value = '';
      }
    }
  };
</script>
