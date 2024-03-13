<template>
  <win-window :width="280" name="settings-background" title="Appearance Settings" v-slot="winProps">
    <div class="p-2">
      <div class="group-box p-2 mb-3">
        <div class="gb-label noselect">Background</div>

        <div class="row palette no-gutters" v-if="currentBg.mode === 2">
          <div class="col-auto" v-for="color in palette">
            <button class="color" :style="{backgroundColor: color}" @click="solidBg(color)"/>
          </div>
          <div class="col-3">
            <input class="d-block" :value="currentBg.color" @input="colorSelected"/>
          </div>
        </div>

        <win-memo v-else>
          <p>
            <b>Background:</b> {{ currentBg.image.num }}
          </p>
          <p>
            <b>Source: </b>
            <a v-if="currentBg.image.source_link !== ''"
               :href="currentBg.image.source_link">
              {{ currentBg.image.source }}
            </a>
          </p>
          <p>
            <b>Author: </b>
            <a v-if="currentBg.image.author_link !== ''"
               :href="currentBg.image.author_link">
              {{ currentBg.image.author }}
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
            <win-btn block :class="{active: currentBg.mode === 2}" @click="solidBg">Solid</win-btn>
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
            <option v-for="item in themes" :value="item[0]" v-html="item[1]" :selected="theme === item[0]"/>
          </select>
        </div>
      </div>

      <div class="text-center">
        <win-btn class="mx-auto px-4" @click="winProps.close()">Close</win-btn>
      </div>
    </div>
  </win-window>
</template>

<script setup>
import { onBeforeMount, onMounted, ref } from 'vue'
import { background } from '@common/js/api/api'
import { useStore } from 'vuex'
import userPrefs from '@common/js/composables/userPrefsComposable'

const store = useStore()
const { applyBackground, applyTheme } = userPrefs()

const backgroundList = ref([])
const theme = ref('win98')

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

function colorSelected (e) {
  solidBg(e.target.value)
}

function themeSelected (event) {
  applyTheme(event.target.value)
}

const MODE_RANDOM = 0
const MODE_SINGLE = 1
const MODE_SOLID = 2

const currentBg = ref({})

function nextBg (dir) {
  let index = findIndex(currentBg.value.image) + dir

  if (index < 0) {
    index = backgroundList.value.length - 1
  } else if (index >= backgroundList.value.length) {
    index = 0
  }

  currentBg.value.mode = MODE_SINGLE
  currentBg.value.image = backgroundList.value[index]

  applyBackground(currentBg.value)
}

function randomBg () {
  const image = backgroundList.value[Math.floor(Math.random() * backgroundList.value.length)]

  currentBg.value.mode = MODE_RANDOM
  currentBg.value.image = image

  applyBackground(currentBg.value)
}

function solidBg (color) {
  if (color !== undefined) {
    currentBg.value.color = color
  }

  currentBg.value.mode = MODE_SOLID
  currentBg.value.image = ''

  applyBackground(currentBg.value)
}

function findIndex (background) {
  const index = backgroundList.value.findIndex((b) => {
    return b.id === background.id
  })

  return index < 0 ? 0 : index
}

onBeforeMount(() => {
  currentBg.value = store.getters['appearance/background']
  theme.value = store.getters['appearance/theme']
})

onMounted(() => {
  // Load background list from server
  background.get().then((result) => backgroundList.value = result.data)
})
</script>
