<template>
  <div class="menu-bar noselect">
    <div class="row no-gutters">
      <div class="col">
        <div class="action">
          <a role="button" tabindex="0" @click="windowsStore.open('about')"><u>A</u>bout</a>
        </div>
        <div class="action">
          <a role="button" tabindex="1" @click="windowsStore.open('history')">Play <u>H</u>istory</a>
        </div>
        <div class="action">
          <a role="button" tabindex="2" @click="windowsStore.open('ratings')"><u>R</u>atings</a>
        </div>
        <div class="action">
          <a role="button" tabindex="3" @click="windowsStore.open('support')"><u>S</u>upport Us</a>
        </div>
        <div class="action">
          <a role="button" tabindex="4" @click="windowsStore.open('mobile')"><u>M</u>obile</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useWindowsStore } from '@common/js/stores/windowsStore'

const windowsStore = useWindowsStore()
</script>
