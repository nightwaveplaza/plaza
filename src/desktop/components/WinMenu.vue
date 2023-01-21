<template>
  <div class="menu-bar noselect">
    <div class="row no-gutters">
      <div class="col">
        <div class="action">
          <a role="button" tabindex="0" @click="openWindow2('about')"><u>A</u>bout</a>
        </div>
        <div class="action">
          <a role="button" tabindex="1" @click="openWindow2('history')">Play <u>H</u>istory</a>
        </div>
        <div class="action">
          <a role="button" tabindex="2" @click="openWindow2('ratings')"><u>R</u>atings</a>
        </div>
        <div class="action">
          <a role="button" tabindex="3" @click="openWindow2('support')"><u>S</u>upport Us</a>
        </div>
        <div class="action">
          <a role="button" tabindex="4" @click="openWindow2('mobile')"><u>M</u>obile</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useStore } from 'vuex'
import windowsComposable from '@common/composables/windowsComposable'

const { openWindow2 } = windowsComposable()
const store = useStore()
const auth = computed(() => store.getters['user/auth'])
</script>
