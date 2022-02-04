<template>
  <win-window ref="window" name="user-reset-password" title="Reset password" :width="280">
    <div class="py-2">
      <div class="row no-gutters">
        <div class="col-10 offset-1">
          <!-- New password -->
          <label for="password">New password:</label>
          <input class="d-block mb-2" id="password" type="password" v-model="password"/>

          <!-- Repeat password -->
          <label for="password_repeat">Password repeat:</label>
          <input class="d-block" id="password_repeat" type="password" v-model="password_repeat"/>

          <!-- Buttons -->
          <div class="row mt-2 no-gutters justify-content-between">
            <div class="col-6">
              <win-btn block @click="change" class="text-bold">Change</win-btn>
            </div>
            <div class="col-4">
              <win-btn block @click="$router.push({name: 'index'})">Cancel</win-btn>
            </div>
          </div>
        </div>
      </div>
    </div>
  </win-window>
</template>

<script>
import {user} from '@base/js/api/api';

export default {
  props: {
    token: {
      type: String,
      default: ''
    }
  },

  data() {
    return {
      password: '',
      password_repeat: '',
      sending: false,
    };
  },

  methods: {
    async change() {
      if (!this.validate() || this.sending) {
        return;
      }

      this.sending = true;

      try {
        await user.confirmReset({token: this.token, password: this.password});
        this.alert('Password has changed.', 'Success', 'info');
        this.$refs.window.close();
      } catch(error) {
        this.alert(error.response.data.error, 'Error');
      } finally {
        this.sending = false;
      }
    },

    validate() {
      if (this.password.length < 3) {
        this.alert('Password is too short.', 'Error');
        return false;
      }

      if (this.password !== this.password_repeat) {
        this.alert('Passwords didn\'t match.', 'Error');
        return false;
      }

      return true;
    },
  },
};
</script>
