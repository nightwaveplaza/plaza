<template>
  <win-window ref="window" :width="250" name="user-password" title="Change Password">
    <div class="py-2">
      <div class="row no-gutters">
        <div class="col-10 offset-1">
          <!-- Current password -->
          <label for="current_password">Current password:</label>
          <input id="current_password" v-model="fields.current_password" class="d-block mb-2" type="password"/>
          <!-- New password password -->
          <label for="password">New password:</label>
          <input id="password" v-model="fields.password" class="d-block mb-2" type="password"/>
          <!-- Repeat password -->
          <label for="password_repeat">Password repeat:</label>
          <input id="password_repeat" v-model="password_repeat" class="d-block" type="password"/>

          <!-- Buttons -->
          <div class="row mt-2 no-gutters justify-content-between">
            <div class="col-6">
              <win-btn block class="text-bold" @click="change">Change</win-btn>
            </div>
            <div class="col-4">
              <win-btn block @click="closeWindow()">Close</win-btn>
            </div>
          </div>
        </div>
      </div>
    </div>
  </win-window>
</template>

<script>
import {user} from '@base/api/api';

export default {
  data() {
    return {
      fields: {
        current_password: '',
        password: '',
      },
      password_repeat: '',
      sending: false,
    };
  },

  methods: {
    /**
     * Изменение пароля
     */
    async change() {
      if (!this.validate() || this.sending) {
        return;
      }

      this.sending = true;

      try {
        await user.edit(this.fields);
        await this.$store.dispatch('logout');
        this.alert('Password has changed!', 'Success', 'info');
        this.closeWindow();
      } catch (error) {
        this.alert(error.response.data.error, 'Error');
      } finally {
        this.sending = false;
      }
    },

    /**
     * Проверка полей
     */
    validate() {
      if (this.fields.current_password.length === 0) {
        this.alert('Enter current password.', 'Error');
        return false;
      }

      if (this.fields.password.length < 3) {
        this.alert('Password too short.', 'Error');
        return false;
      }

      if (this.fields.password !== this.password_repeat) {
        this.alert('Passwords didn\'t match.', 'Error');
        return false;
      }

      return true;
    },
  },
};
</script>
