<template>
  <win-window :width="280" name="settings-background" title="Appearance Settings" v-slot="winProps">
    <div class="p-2">
      <div class="group-box p-2 mb-3">
        <div class="gb-label noselect">Background</div>

        <div class="row palette no-gutters" v-if="appearanceStore.background.mode === enBackgroundMode.SOLID">
          <div class="col-auto" v-for="color in palette">
            <button class="color" :style="{backgroundColor: color}" @click="solidBg(color)"/>
          </div>
          <div class="col-3">
            <input class="d-block" :value="appearanceStore.background.color" @input="colorSelected"/>
          </div>
        </div>

        <win-memo v-else>
          <p>
            <b>Background:</b> {{ appearanceStore.background.image?.num }}
          </p>
          <p>
            <b>Source: </b>
            <a v-if="appearanceStore.background.image?.source_link !== ''"
               :href="appearanceStore.background.image?.source_link">
              {{ appearanceStore.background.image?.source }}
            </a>
          </p>
          <p>
            <b>Author: </b>
            <a v-if="appearanceStore.background.image?.author_link !== ''"
               :href="appearanceStore.background.image?.author_link">
              {{ appearanceStore.background.image?.author }}
            </a>
          </p>
        </win-memo>

        <div class="row no-gutters mt-2 noselect">
          <div class="col-2 pr-1">
            <win-btn block @click="nextBg(-1)">&lt;</win-btn>
          </div>
          <div class="col-2 pr-1">
            <win-btn block @click="nextBg(1)">&gt;</win-btn>
          </div>
          <div class="col-4 pr-1">
            <win-btn block @click="randomBg">Random</win-btn>
          </div>
          <div class="col-4">
            <win-btn block :class="{active: appearanceStore.background.mode === enBackgroundMode.SOLID}" @click="solidBg">Solid</win-btn>
          </div>
        </div>

        <div class="mt-1 noselect">
          <small>All background images were found on the Internet. Do you know the author? <a
            href="mailto:mail@plaza.one">Let us know!</a></small>
        </div>
      </div>

      <div class="group-box p-2 mb-2">
        <div class="gb-label noselect">Theme</div>
        <div class="select">
          <select @change="themeSelected">
            <option v-for="item in themes" :value="item[0]" v-html="item[1]" :selected="appearanceStore.theme === item[0]"/>
          </select>
        </div>
      </div>

      <div class="text-center">
        <win-btn class="mx-auto px-4" @click="winProps.close()">Close</win-btn>
      </div>
    </div>
  </win-window>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { backgrounds } from '@common/js/api/api'
import { useAppearanceStore } from '@common/js/stores/appearanceStore'
import { enBackgroundMode, type ifcBackgroundImage } from '@common/js/types'

const appearanceStore = useAppearanceStore()
const backgroundList = ref([])

// Palettes
const palette = [
  '#ffffff', '#000000', '#c0c0c0', '#808080', '#ff0000', '#800000', '#ffff00', '#808000', '#00ff00',
  '#008000', '#00ffff', '#008080', '#0000ff', '#000080', '#ff00ff', '#800080',
]

// Themes
const themes = [
  ['desert', 'Desert'],
  ['contrast', 'High Contrast'],
  ['rainy', 'Rainy Day'],
  ['rose', 'Rose'],
  ['win98', 'Windows Standard'],
]

function colorSelected (e: Event) {
  solidBg((e.target as HTMLInputElement).value)
}

function themeSelected (e: Event) {
  appearanceStore.theme = (e.target as HTMLSelectElement).value
  appearanceStore.saveTheme()
}

function nextBg (dir: number) {
  let index = findIndex(appearanceStore.background.image!) + dir

  if (index < 0) {
    index = backgroundList.value.length - 1
  } else if (index >= backgroundList.value.length) {
    index = 0
  }

  appearanceStore.background.mode = enBackgroundMode.SINGLE
  appearanceStore.background.image = backgroundList.value[index]
  appearanceStore.saveBackground()
}

function randomBg () {
  const image = backgroundList.value[Math.floor(Math.random() * backgroundList.value.length)]

  appearanceStore.background.mode = enBackgroundMode.RANDOM
  appearanceStore.background.image = image
  appearanceStore.saveBackground()
}

function solidBg (color?: string) {
  if (typeof color !== 'undefined') {
    appearanceStore.background.color = color
  }

  appearanceStore.background.mode = enBackgroundMode.SOLID
  appearanceStore.background.image = undefined
  appearanceStore.saveBackground()
}

function findIndex (background: ifcBackgroundImage) {
  const index = backgroundList.value.findIndex((b: any) => {
    return b.id === background.id
  })

  return index < 0 ? 0 : index
}

onMounted(() => {
  // Load background list from server
  backgrounds.get().then((result) => backgroundList.value = result.data)
})
</script>
