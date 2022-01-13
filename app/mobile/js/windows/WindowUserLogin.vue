<template>
  <win-window ref="window" :width="480" name="user-login" title="Login">
    <div class="noselect">
      <div class="row no-gutters p-2">
        <div class="col-12 d-block d-sm-none mb-3 p-0">
          Type a username and password to log on to Nightwave Plaza.
        </div>

        <div class="col-auto d-none d-sm-block pr-3">
          <img alt="" class="img-key" height="48" src="/img/win/plaza-key.png" width="45"/>
        </div>

        <div class="col pl-0 pr-2">
          <div class="row no-gutters d-none d-sm-block mb-2">
            <div class="col-12">
              Type a username and password to log in to Nightwave Plaza.
            </div>
          </div>

          <!-- Username -->
          <div class="row no-gutters">
            <div class="col-12 col-sm-3 align-self-center">
              <label class="mt-0" for="username"><u>U</u>sername:</label>
            </div>
            <div class="col-12 col-sm-9">
              <input id="username" v-model="username" class="mr-0 ml-0" type="text"/>
            </div>
          </div>

          <!-- Password -->
          <div class="row mt-1 no-gutters">
            <div class="col-12 col-sm-3 align-self-center">
              <label class="mt-0" for="password"><u>P</u>assword:</label>
            </div>
            <div class="col-12 col-sm-9">
              <input id="password" v-model="password" class="mr-0 ml-0" type="password"/>
              &nbsp;<a role="button" @click="openReset">Reset</a>
            </div>
          </div>
        </div>

        <!-- Buttons -->
        <div class="col-auto col-sm-2 p-0 login-buttons">
          <win-btn class="mb-2 text-bold" @click="login">Sign In</win-btn>
          <a class="button d-block mb-2" href="https://beta.plaza.one/register" target="_blank">Register</a>
          <win-btn @click="closeWindow()">Cancel</win-btn>
        </div>
      </div>
    </div>
  </win-window>
</template>

<script>
import {user} from '@common/js/api/api';
import {Native} from '../bridge/native';

export default {
  data() {
    return {
      username: '',
      password: '',
      remember: false,
      sending: false,
    };
  },

  methods: {
    async login() {
      if (!this.validate() || this.sending) {
        return;
      }

      try {
        const res = await user.login(this.username, this.password);
        await this.$store.dispatch('login', res.data.token);
        this.toast('Authentication successful!');
        this.closeWindow();
      } catch (err) {
        this.alert(err.response.data.error, 'Failed');
      }
    },

    openReset() {
      this.openWindow('user-reset');
      this.closeWindow();
    },

    validate() {
      if (this.username.length === 0 || this.password.length === 0) {
        this.alert('Wrong username or password.', 'Error');
        return false;
      }

      return true;
    },
  },
};
</script>
