<template>
  <win-window ref="window" :width="250" name="user-reset" title="Reset password">
    <div class="py-2">
      <div class="row no-gutters">
        <div class="col-10 offset-1">
          <!-- Email -->
          <label for="email">Enter your Email:</label>
          <input id="email" v-model="fields.email" class="d-block mb-2" type="email"/>

          <!-- Captcha -->
          <label for="captcha">Captcha:</label>
          <input id="captcha" v-model="fields.captcha" class="d-block mb-2" type="text"/>
          <win-captcha ref="captcha" @refresh="refreshCaptcha" />

          <!-- Buttons -->
          <div class="row mt-2 no-gutters justify-content-between">
            <div class="col-6">
              <win-btn block class="text-bold" @click="reset">Reset</win-btn>
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
import {user} from '@common/api/api';

export default {
  data() {
    return {
      fields: {
        email: '',
        key: '',
        captcha: ''
      },
      sending: false,
    };
  },

  methods: {
    async reset() {
      if (!this.validate() || this.sending) {
        return;
      }

      this.sending = true;
      try {
        await user.reset(this.fields);
        this.alert('Instructions have been sent to your email.', 'Success', 'info');
        this.closeWindow();
      } catch(error) {
        this.alert(error.response.data.error, 'Error');
        this.$refs.captcha.refresh();
      } finally {
        this.sending = false;
      }
    },

    validate() {
      if (this.fields.email.length === 0) {
        this.alert('Enter email.', 'Error');
        return false;
      }
      return true;
    },

    async refreshCaptcha(key) {
      this.fields.key = key;
      this.fields.captcha = '';
    }
  },
};
</script>
