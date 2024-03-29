<template>
  <win-window ref="window" :width="250" name="user-email" title="Change Email">
    <div class="py-2 px-3">
      <!-- Email -->
      <label for="email">Email:</label>
      <input id="email" :disabled="disabled" v-model="fields.email" class="d-block mb-2" type="email"/>

      <!-- Current password -->
      <label for="password">Current password:</label>
      <input id="password" :disabled="disabled" v-model="fields.current_password" class="d-block mb-2" type="password"/>

      <!-- Buttons -->
      <div class="row mt-3 no-gutters justify-content-between">
        <div class="col-6">
          <win-btn block class="text-bold" @click="update">Change</win-btn>
        </div>
        <div class="col-4">
          <win-btn block @click="closeWindow">Close</win-btn>
        </div>
      </div>
    </div>
  </win-window>
</template>

<script setup>
import { user } from '@common/js/api/api'
import { onMounted, reactive, ref } from 'vue'
import windowsComposable from '@common/js/composables/windowsComposable'
import { useStore } from 'vuex'

// Composable
const { alert2, closeWindow, openWindow } = windowsComposable('user-email')

const store = useStore()

// Reactive data
const fields = reactive({
  current_password: '',
  email: '',
})
const disabled = ref(true)

// Non-reactive
let sending = false

function fetchUser () {
  user.get().then((res) => {
    fields.email = res.data.email
    disabled.value = false
  }).catch(err => {
    alert2('Can\'t fetch user data.', 'Failed')
    closeWindow()
  })
}

function update () {
  if (!validate() || sending) {
    return
  }

  sending = true

  user.edit(fields).then(() => {
    alert2('Email has changed!', 'Success', 'info')
    closeWindow()
  }).catch(error => {
    alert2(error.response.data.error, 'Error')
  }).finally(() => {
    sending = false
  })
}

function validate () {
  if (fields.current_password.length === 0) {
    alert2('Enter current password.', 'Error')
    return false
  }

  return true
}

onMounted(() => {
  fetchUser()
})
</script>
