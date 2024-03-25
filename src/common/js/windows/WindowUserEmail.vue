<template>
  <win-window ref="win" :width="250" name="user-email" title="Change Email" v-slot="winProps">
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
          <win-btn block @click="winProps.close()">Close</win-btn>
        </div>
      </div>
    </div>
  </win-window>
</template>

<script setup lang="ts">
import { user } from '@common/js/api/api'
import { onMounted, reactive, ref } from 'vue'
import type { ifcUserEdit } from '@common/js/types'
import { useWindowsStore } from '@common/js/stores/windowsStore'
import WinWindow from '@common/js/components/WinWindow.vue'

const windowsStore = useWindowsStore()

const win = ref<InstanceType<typeof WinWindow>>()
const fields: ifcUserEdit = reactive({
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
    windowsStore.alert('Can\'t fetch user data.', 'Failed')
    win.value!.close()
  })
}

function update () {
  if (!validate() || sending) {
    return
  }

  sending = true

  user.edit(fields).then(() => {
    windowsStore.alert('Email has changed!', 'Success', 'info')
    win.value!.close()
  }).catch(error => {
    windowsStore.alert(error.response.data.error, 'Error')
  }).finally(() => {
    sending = false
  })
}

function validate () {
  if (fields.current_password.length === 0) {
    windowsStore.alert('Enter current password.', 'Error')
    return false
  }

  return true
}

onMounted(() => {
  fetchUser()
})
</script>
