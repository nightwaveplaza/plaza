<template>
  <win-window ref="win" v-slot="winProps" :is-alert="true" :name="name" :title="title" :width="290">
    <div class="p-2">
      <div class="row no-gutters">
        <div class="col-auto text-center align-self-center">
          <div class="alert-icon" :class="type" />
        </div>
        <div class="col align-self-center">
          <p class="pl-2" style="line-height: 125%">
            {{ text }}
          </p>
        </div>
      </div>

      <div class="text-center">
        <win-btn class="mt-2 mx-auto px-4" @click="winProps.close()">
          {{ t('buttons.ok') }}
        </win-btn>
      </div>
    </div>
  </win-window>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
defineProps<{
  text: string,
  title: string,
  name: string,
  type: string,
}>()

</script>
