<template>
  <div class="menu-bar noselect">
    <div class="row no-gutters">
      <div class="col">
        <div class="action">
          <a role="button" tabindex="0" @click="openWindow('about')"><u>A</u>bout</a>
        </div>
        <div class="action">
          <a role="button" tabindex="1" @click="openWindow('history')">Play <u>H</u>istory</a>
        </div>
        <div class="action">
          <a role="button" tabindex="2" @click="openWindow('ratings')"><u>R</u>atings</a>
        </div>
        <div class="action">
          <a role="button" tabindex="3" @click="openWindow('support')"><u>S</u>upport Us</a>
        </div>
        <div class="action">
          <a role="button" tabindex="4" @click="openWindow('mobile')"><u>M</u>obile</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useStore } from 'vuex'
import windowsComposable from '@common/js/composables/windowsComposable'

const { openWindow } = windowsComposable()
const store = useStore()
const auth = computed(() => store.getters['user/auth'])
</script>
