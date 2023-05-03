<template>
  <img class="img-captcha" :src="captchaImage" @click="refresh" alt="captcha"/>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { captcha } from '@common/js/api/api'

// Emits
const emit = defineEmits(['refreshed'])

// Reactive data
const captchaImage = ref('')

function refresh () {
  captcha.get().then((res) => {
    captchaImage.value = res.data.img
    emit('refreshed', res.data.key)
  })
}

onMounted(() => {
  refresh()
})

defineExpose({
  refresh
})
</script>
