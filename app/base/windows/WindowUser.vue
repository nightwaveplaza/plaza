<template>
  <win-window ref="window" :width="220" name="user" title="My Plaza">
    <div class="p-2 noselect">
      <div class="row">
        <div class="col-10 offset-1">
          <win-btn block class="mb-2" @click="open('user-favorites')" v-if="!isMobile">My Favorites</win-btn>
          <win-btn block class="mb-2" @click="open('user-email')">Change Email</win-btn>
          <win-btn block class="mb-2" @click="open('user-password')">Change Password</win-btn>
          <win-btn block class="mb-2" @click="logout">Logout</win-btn>
          <win-btn block class="close mt-2 mx-auto" @click="closeWindow()">Close</win-btn>
        </div>
      </div>
    </div>
  </win-window>
</template>

<script>
import {user} from '@base/api/api';

export default {
  methods: {
    open(window) {
      this.openWindow(window);
      this.closeWindow();
    },

    async logout() {
      try {
        await user.logout();
      } finally {
        await this.$store.dispatch('logout');
        this.closeWindow();
      }
    },
  },
};
</script>
