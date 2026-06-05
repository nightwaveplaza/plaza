<template>
  <div class="py-2 px-2">
    <win-panel class="mb-3">
      <!-- Current password -->
      <label for="current_password" class="mb-1">{{ t('fields.current_password') }}:</label>
      <input
        id="current_password"
        v-model="fields.current_password"
        class="d-block mb-2"
        type="password"
      />
      <!-- New password password -->
      <label for="password" class="mb-1">{{ t('fields.new_password') }}:</label>
      <input id="password" v-model="fields.password" class="d-block mb-2" type="password" />
      <!-- Repeat password -->
      <label for="password_repeat" class="mb-1">{{ t('fields.repeat_password') }}:</label>
      <input id="password_repeat" v-model="passwordRepeat" class="d-block" type="password" />
    </win-panel>

    <!-- Buttons -->
    <div class="row mt-2 gx-0 justify-content-between">
      <div class="col-6">
        <win-button class="d-block fw-bold" :disabled="isLoading" @click="change">
          {{ t('buttons.change') }}
        </win-button>
      </div>
      <div class="col-4">
        <win-button class="d-block" @click="closeWindow(Win.USER_PASSWORD)">
          {{ t('buttons.close') }}
        </win-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { reactive, ref } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { useWindows } from '@app/composables/useWindows.ts';
  import { type UserPasswordForm, Win } from '@app/types';
  import { useAuth } from '@app/composables/useAuth.ts';
  import { useApi } from '@app/composables/useApi.ts';
  import { userApi } from '@app/api/user.api.ts';
  import type { ApiError } from '@app/utils/apiErrorHandler.ts';

  const { t } = useI18n();
  const { showAlert, closeWindow } = useWindows();
  const { unsetUser } = useAuth();
  const { execute: updatePassword, isLoading } = useApi(userApi.deleteProfile);

  const fields: UserPasswordForm = reactive({
    current_password: '',
    password: '',
  });
  const passwordRepeat = ref('');

  async function change(): Promise<void> {
    try {
      validate();
    } catch (e) {
      return showAlert((e as Error).message, t('errors.error'));
    }

    try {
      await updatePassword(fields);
    } catch (e) {
      return showAlert((e as ApiError).message, t('errors.error'));
    }

    unsetUser();
    showAlert(t('messages.password_changed'), t('messages.success'), 'info');
    closeWindow(Win.USER_PASSWORD);
  }

  function validate(): void {
    if (fields.current_password.length === 0) {
      throw new Error(t('errors.fields.current_password_invalid'));
    }

    if (fields.password!.length < 3) {
      throw new Error(t('errors.fields.password_min'));
    }

    if (fields.password !== passwordRepeat.value) {
      throw new Error(t('errors.fields.password_match'));
    }
  }
</script>
