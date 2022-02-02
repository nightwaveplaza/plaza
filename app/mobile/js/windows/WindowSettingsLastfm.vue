<template>
  <win-window ref="window" :width="250" name="settings-lastfm" title="Scrobbling">
    <div class="p-2">
      <template v-if="!signed">
        <p class="text-center mb-2">Login into your Last.fm account to enable the scrobbling feature.</p>
        <div class="col-10 offset-1">
          <!-- Username -->
          <label for="username">Username:</label>
          <input id="username" v-model="username" class="d-block" type="text"/>
          <!-- Password -->
          <label for="password">Password:</label>
          <input id="password" v-model="password" class="d-block" type="password"/>
        </div>
      </template>
      <div v-else class="memo">
        Last.fm scrobbling is enabled.<br/>
        User: <strong>{{ username }}</strong><br/>
        Status: <strong>{{ status }}</strong>
      </div>

      <!-- Buttons -->
      <div class="row mt-3 no-gutters justify-content-between">
        <div class="col-6">
          <win-btn block class="text-bold" @click="login">{{ buttonText }}</win-btn>
        </div>
        <div class="col-4">
          <win-btn block @click="closeWindow()">Close</win-btn>
        </div>
      </div>

      <!-- Notice -->
      <p v-if="!signed" class="text-center mt-2 mb-0"><small>Your username and password will be used only for
        authentication
        according the Last.fm API methods and will not be saved or provided to 3rd person. <a
            href="http://www.last.fm/api/mobileauth">Learn more</a></small></p>
    </div>
  </win-window>
</template>

<script>
import {scrobbler} from '@common/js/api/api';
import {Native} from '../bridge/native';

export default {
  data() {
    return {
      loading: false,
      signed: false,
      status: '',
      username: '',
      password: '',
    };
  },

  computed: {
    buttonText() {
      return this.signed ? 'Logout' : 'Log in';
    },
  },

  async mounted() {
    this.username = await Native.getLastfmUsername();
    this.signed = this.username !== '';
    if (this.signed) {
      this.status = await Native.getLastfmStatus();
    }
  },

  methods: {
    async login() {
      if (!this.signed) {

        if (this.loading) {
          return;
        }

        let error = await Native.authLastfmUser(this.username, this.password);
        if (error) {
          this.alert(error, 'Failed');
        } else {
          this.toast('Scrobbling enabled.');
          this.closeWindow();
        }
      } else {
        await Native.logoutLastfmUser();
        this.toast('Scrobbling disabled.');
        this.closeWindow();
      }

    }
  },
};
</script>
