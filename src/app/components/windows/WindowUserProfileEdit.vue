<template>
  <win-menu class="text-end">
    <win-menu-action @click="open(Win.USER_PROFILE_DELETE)">
      {{ t('win.user_profile_delete.title') }}
    </win-menu-action>
  </win-menu>

  <div class="py-2 px-2">
    <win-group-box class="mb-3">
      <template #title>
        {{ t('fields.user_details') }}
      </template>
      <template #content>
        <!-- Username -->
        <label for="username">{{ t('fields.username') }}:</label>
        <input id="username" v-model="fields.username" class="d-block mb-2" type="text" />

        <!-- Email -->
        <label for="email">{{ t('fields.email') }}:</label>
        <input id="email" v-model="fields.email" class="d-block" type="email" />
      </template>
    </win-group-box>

    <win-panel class="mb-3">
      <!-- Current password -->
      <label for="password">{{ t('fields.current_password') }}:</label>
      <input id="password" v-model="fields.current_password" class="d-block" type="password" />
    </win-panel>

    <!-- Buttons -->
    <div class="row mt-3 gx-0 justify-content-between">
      <div class="col-6">
        <win-button :disabled="isLoading" class="d-block fw-bold" @click="update">
          {{ t('buttons.save') }}
        </win-button>
      </div>
      <div class="col-4">
        <win-button class="d-block" @click="closeWindow(Win.USER_PROFILE_EDIT)">
          {{ t('buttons.close') }}
        </win-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { onMounted, reactive } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { useWindows } from '@app/composables/useWindows.ts';
  import { type UserProfileForm, Win } from '@app/types';
  import { useAuth } from '@app/composables/useAuth.ts';
  import { useApi } from '@app/composables/useApi.ts';
  import { userApi } from '@app/api/user.api.ts';
  import type { ApiError } from '@app/utils/apiErrorHandler.ts';

  const { t } = useI18n();
  const { showAlert, closeWindow, openWindow } = useWindows();
  const { user } = useAuth();
  const { execute: updateProfile, isLoading } = useApi(userApi.updateProfile);

  const fields: UserProfileForm = reactive({
    current_password: '',
    email: '',
    username: '',
  });

  function fetchUser(): void {
    fields.email = user.value?.email ?? '';
    fields.username = user.value?.username ?? '';
  }

  async function update() {
    if (fields.current_password.length === 0) {
      return showAlert(t('errors.fields.current_password_required'), t('errors.error'));
    }

    try {
      const res = await updateProfile(fields);
      user.value = res.data;
    } catch (e) {
      return showAlert((e as ApiError).message, t('errors.error'));
    }

    closeWindow(Win.USER_PROFILE_EDIT);
  }

  function open(window: Win): void {
    openWindow(window);
    closeWindow(Win.USER_PROFILE_EDIT);
  }

  onMounted(() => {
    fetchUser();
  });
</script>
