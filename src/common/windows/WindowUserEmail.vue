<template>
  <win-window ref="window" :width="250" name="user-email" title="Change Email">
    <div class="py-2 px-3">
      <!-- Email -->
      <label for="email">Email:</label>
      <input id="email" :disabled="disabled" v-model="fields.email" class="d-block" type="email"/>

      <!-- Current password -->
      <label for="password">Current password:</label>
      <input id="password" :disabled="disabled" v-model="fields.current_password" class="d-block mb-2" type="password"/>

      <!-- Buttons -->
      <div class="row mt-3 no-gutters justify-content-between">
        <div class="col-6">
          <win-btn block class="text-bold" @click="update">Change</win-btn>
        </div>
        <div class="col-4">
          <win-btn block @click="closeWindow()">Close</win-btn>
        </div>
      </div>
    </div>
  </win-window>
</template>

<script>
import {user} from '@common/api/api';

export default {
  data() {
    return {
      fields: {
        current_password: '',
        email: '',
      },
      disabled: true,
      sending: false,
    };
  },

  mounted() {
    this.fetchUser();
  },

  methods: {
    async fetchUser() {
      try {
        const res = await user.get();
        this.fields.email = res.data.email;
        this.disabled = false;
      } catch (err) {
        this.alert('Can\'t fetch user data.', 'Failed');
        this.closeWindow();
      }
    },

    update() {
      if (!this.validate() || this.sending) {
        return;
      }

      this.sending = true;

      user.edit(this.fields).then(() => {
        this.$store.commit('email', this.fields.email);
        this.alert('Email has changed!', 'Success', 'info');
        this.closeWindow('user-email');
      }).catch(error => {
        this.alert(error.response.data.error, 'Error');
      }).finally(() => {
        this.sending = false;
      });
    },

    validate() {
      if (this.fields.current_password.length === 0) {
        this.alert('Enter current password.', 'Error');
        return false;
      }

      return true;
    },
  },
};
</script>
