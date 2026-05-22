<template>
  <div class="p-2 noselect">
    <div class="row">
      <!-- Login -->
      <div class="col">
        <div class="row">
          <div class="col-12 col-sm-auto">
            <div class="row mb-3">
              <div class="col-auto">
                <img alt="" class="img-key" height="48" width="45" src="@app/assets/img/key.png" />
              </div>
              <!-- For small screens -->
              <div class="d-flex d-sm-none col align-self-center">
                {{ t('win.user_login.type_username') }}
              </div>
            </div>
          </div>

          <div class="col">
            <div class="d-grid gap-2">
              <!-- For large screens -->
              <div class="d-none d-sm-flex pb-1">
                {{ t('win.user_login.type_username') }}
              </div>

              <!-- Username -->
              <div class="row">
                <div class="col-12 col-sm-5 align-self-center">
                  <label class="mt-0" for="username"> {{ t('fields.username') }}: </label>
                </div>
                <div class="col">
                  <input id="username" v-model="fields.username" class="d-block" type="text" />
                </div>
              </div>

              <!-- Password -->
              <div class="row">
                <div class="col-12 col-sm-5 align-self-center">
                  <label class="mt-0" for="password"> {{ t('fields.password') }}: </label>
                </div>
                <div class="col">
                  <input id="password" v-model="fields.password" class="d-block" type="password" />
                </div>
              </div>

              <div class="row justify-content-between">
                <!-- Remember Me -->
                <div v-if="!isMobile()" class="col-auto col-sm-12 offset-sm-5">
                  <win-checkbox v-model="fields.remember">
                    {{ t('win.user_login.remember_me') }}
                  </win-checkbox>
                </div>

                <!-- Forgot password -->
                <div class="col-auto col-sm-12 offset-sm-5 mt-sm-1">
                  <a role="button" class="link" @click="openReset">
                    {{ t('win.user_login.btn_forgot_password') }}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Buttons -->
      <div class="col-sm-3 mt-3 mt-sm-0">
        <div class="d-flex flex-row flex-sm-column gap-2">
          <win-button :disabled="isLoading" class="fw-bold d-block" @click="login">
            {{ t('win.user_login.btn_sign_in') }}
          </win-button>
          <win-button class="d-block" @click="openRegister">
            {{ t('win.user_login.btn_register') }}
          </win-button>
          <win-button class="d-block" @click="closeWindow(Win.USER_LOGIN)">
            {{ t('buttons.cancel') }}
          </win-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { reactive } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { isMobile } from '@app/utils/helpers.ts';
  import { useWindows } from '@app/composables/useWindows.ts';
  import { type UserLoginForm, Win } from '@app/types';
  import { useAuth } from '@app/composables/useAuth.ts';
  import { setApiToken } from '@app/api';
  import { useApi } from '@app/composables/useApi.ts';
  import { authApi } from '@app/api/auth.api.ts';
  import type { ApiError } from '@app/utils/apiErrorHandler.ts';

  const { t } = useI18n();
  const { openWindow, closeWindow, showAlert } = useWindows();
  const { execute: loginUser, isLoading } = useApi(isMobile() ? authApi.token : authApi.login);
  const { user } = useAuth();

  const fields: UserLoginForm = reactive({
    username: '',
    password: '',
    remember: false,
  });

  async function login(): Promise<void> {
    if (fields.username.length === 0 || fields.password.length === 0) {
      return showAlert(t('errors.enter_user_pass'), t('errors.error'));
    }

    try {
      const res = await loginUser(fields);
      user.value = res.data;
      if (res.token) {
        setApiToken(res.token);
      }
    } catch (e) {
      showAlert((e as ApiError).message, t('errors.error'));
      return;
    }

    showAlert(t('messages.auth_success'), t('messages.success'), 'info');
    closeWindow(Win.USER_LOGIN);
  }

  function openRegister(): void {
    openWindow(Win.USER_REGISTER);
    closeWindow(Win.USER_LOGIN);
  }

  function openReset(): void {
    openWindow(Win.USER_RESET);
    closeWindow(Win.USER_LOGIN);
  }
</script>

<style lang="scss">
  #window-user-login {
    .img-key {
      width: 45px;
      height: 48px;
    }

    //.login-buttons button {
    //  width: 76px;
    //  display: block;
    //}

    label[for='username']::first-letter,
    label[for='password']::first-letter {
      text-decoration: underline;
    }
  }
</style>
