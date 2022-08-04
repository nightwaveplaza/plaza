<template>
  <win-window ref="window" :width="430" name="user-register" title="Registration">
    <div class="p-2 noselect">
      <div class="row no-gutters">
        <div class="col-sm-4 d-none d-sm-block">
          <img alt="register" class="img-register" src="img/win/register.png"/>
        </div>

        <div class="col-12 col-sm-8 d-flex flex-column">
          <div class="d-flex flex-grow-1 flex-column mb-fix">
            <template v-if="!registered">
              <p class="lead">User Information:</p>
              <p class="mt-2 mb-3">Please fill out the registration form. All fields are required.</p>

              <!-- Username -->
              <div class="row no-gutters mb-2">
                <div class="col-5 align-self-center">
                  <label for="register-username"><u>U</u>sername:</label>
                </div>
                <div class="col-7">
                  <input id="register-username" v-model="fields.username" class="d-block m-0" tabindex="1" type="text"/>
                </div>
              </div>

              <!-- Password -->
              <div class="row no-gutters mb-2">
                <div class="col-5 align-self-center">
                  <label for="register-password"><u>P</u>assword:</label>
                </div>
                <div class="col-7">
                  <input id="register-password" v-model="fields.password" class="d-block m-0" tabindex="2"
                         type="password"/>
                </div>
              </div>

              <!-- Password repeat -->
              <div class="row no-gutters mb-2">
                <div class="col-5 align-self-center">
                  <label for="register-password-repeat"><u>P</u>assword repeat:</label>
                </div>
                <div class="col-7">
                  <input id="register-password-repeat" v-model="passwordR" class="d-block m-0" tabindex="3"
                         type="password"/>
                </div>
              </div>

              <!-- Email -->
              <div class="row no-gutters mb-2">
                <div class="col-5 align-self-center">
                  <label for="register-email"><u>E</u>mail:</label>
                </div>
                <div class="col-7">
                  <input id="register-email" v-model="fields.email" class="d-block m-0" tabindex="4" type="email"/>
                </div>
              </div>

              <!-- Captcha -->
              <div class="row no-gutters">
                <div class="col-5 align-self-center">
                  <label for="register-captcha" class="mb-1"><u>C</u>aptcha:</label>
                </div>
                <div class="col-2 align-self-center">
                  <input id="register-captcha" v-model="fields.captcha" class="d-block m-0" tabindex="5" type="text"/>
                </div>
                <div class="col-5">
                  <div class="pl-2">
                    <win-captcha ref="captcha" @refresh="refreshCaptcha"/>
                  </div>
                </div>
              </div>
            </template>

            <template v-else>
              <p class="lead">Registration complete</p>
              <p class="my-2">Welcome to Nightwave Plaza, <strong>{{ fields.username }}</strong>!</p>
              <p>Now you use the like button.</p>
            </template>
          </div>

          <div class="d-flex flex-grow-0">
            <div class="row no-gutters mt-2 justify-content-between flex-grow-1 mb-fix">
              <div class="col-4">
                <win-btn block v-if="!registered" class="text-bold" @click="register">Register</win-btn>
              </div>
              <div class="col-4">
                <win-btn block @click="close">{{ closeText }}</win-btn>
              </div>
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
  props: {
    direct: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      fields: {
        username: '',
        email: '',
        password: '',
        key: '',
        captcha: '',
      },

      registered: false,
      passwordR: '',
      captchaImage: '',
    };
  },

  computed: {
    closeText() {
      return this.registered ? 'Finish' : 'Cancel';
    },
  },

  async mounted() {
    this.sending = false;
  },

  methods: {
    async refreshCaptcha(key) {
      this.fields.key = key;
      this.fields.captcha = '';
    },

    /**
     * Регистрация пользователя
     */
    register() {
      if (!this.validate() || this.sending) {
        return;
      }

      this.sending = true;

      user.register(this.fields).then(() => {
        this.registered = true;
      }).catch(error => {
        this.alert(error.response.data.error, 'Error');
        this.$refs.captcha.refresh();
      }).finally(() => {
        this.sending = false;
      });
    },

    /**
     * Проверка полей
     * @returns {boolean|void}
     */
    validate() {
      if (/[^a-zA-Z0-9-_]+/.test(this.fields.username)) {
        this.alert('Incorrect username. Only letters, numbers and underscores allowed.', 'Error');
        return false;
      }

      if (this.fields.username.length < 4) {
        this.alert('Username is too short.', 'Error');
        return false;
      }

      if (this.fields.username.length > 32) {
        this.alert('Username is too long.', 'Error');
        return false;
      }

      if (this.fields.password.length < 3) {
        this.alert('Password is too short.', 'Error');
        return false;
      }

      if (this.fields.email.length < 3) {
        this.alert('Email is too short.', 'Error');
        return false;
      }

      if (this.fields.password !== this.passwordR) {
        this.alert('Passwords don\'t match.', 'Error');
        return false;
      }

      return true;
    },

    close() {
      if (this.direct) {
        this.$router.push({name: 'index'});
      } else {
        this.closeWindow();
      }
    },
  },

  beforeDestroy() {
    this.$refs.captcha = null;
  },
};
</script>
