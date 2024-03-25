<template>
  <win-window :width="220" name="user" title="My Plaza" v-slot="winProps">
    <div class="p-2 noselect">
      <div class="row">
        <div class="col-10 offset-1">
          <win-btn block class="mb-2" @click="open('user-favorites')" v-if="!isMobile">My Favorites</win-btn>
          <win-btn block class="mb-2" @click="open('user-email')">Change Email</win-btn>
          <win-btn block class="mb-2" @click="open('user-password')">Change Password</win-btn>
          <win-btn block class="mb-2" @click="logout">Logout</win-btn>
          <win-btn block class="close mt-2 mx-auto" @click="winProps.close()">Close</win-btn>
        </div>
      </div>
    </div>
  </win-window>
</template>

<script setup lang="ts">
import { user } from '@common/js/api/api'
import helperComposable from '@common/js/composables/helperComposable'
import { useUserAuthStore } from '@common/js/stores/userAuthStore'
import { useWindowsStore } from '@common/js/stores/windowsStore'

const { isMobile } = helperComposable()
const userAuthStore = useUserAuthStore()
const windowsStore = useWindowsStore()

function open (window: string) {
  windowsStore.open(window)
  windowsStore.close('user')
}

function logout () {
  user.logout().then().finally(() => {
    userAuthStore.logout()
    windowsStore.close('user')
  })
}
</script>
