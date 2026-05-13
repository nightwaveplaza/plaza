<template>
  <win-menu class="mb-1">
    <win-menu-action @click="open(Win.USER_PROFILE_EDIT)">
      {{ t('win.user_profile_edit.title') }}
    </win-menu-action>
    <win-menu-action @click="open(Win.USER_PASSWORD)">
      {{ t('win.user_password.title') }}
    </win-menu-action>
    <win-menu-action @click="logout">
      {{ t('win.user.btn_logout') }}
    </win-menu-action>
  </win-menu>

  <div class="p-2">
    <win-panel class="p-2 mb-2">
      <div class="row gx-0">
        <div class="col-2 align-self-center noselect">
          <img src="@app/assets/img/user_card.png" alt="user" />
        </div>
        <div class="col ps-2">
          <div class="username mb-1">
            {{ user?.username }}
          </div>
          <div class="text-muted">
            {{ user?.email }}
          </div>
        </div>
      </div>
    </win-panel>

    <div class="row gx-0 mb-3">
      <div class="col">
        <win-group-box>
          <template #title>
            {{ t('win.user.statistics') }}
          </template>
          <template #content>
            <table style="width: 100%">
              <colgroup>
                <col style="width: 75px" />
                <col style="width: auto" />
              </colgroup>
              <tbody>
                <tr>
                  <td>
                    <b>{{ t('win.user.likes') }}:</b>
                  </td>
                  <td>{{ reactions ?? '...' }}</td>
                </tr>
                <tr>
                  <td>
                    <b>{{ t('win.user.favorites') }}:</b>
                  </td>
                  <td>{{ favorites ?? '...' }}</td>
                </tr>
              </tbody>
            </table>
          </template>
        </win-group-box>
      </div>
      <div class="col ps-2">
        <win-group-box>
          <template #title>
            {{ t('win.user.account') }}
          </template>
          <template #content>
            <table>
              <tbody>
                <tr>
                  <td>
                    <b>{{ t('win.user.registered') }}:</b>
                  </td>
                </tr>
                <tr>
                  <td>{{ fmtDate(user?.created_at ?? 0) }}</td>
                </tr>
              </tbody>
            </table>
          </template>
        </win-group-box>
      </div>
    </div>

    <div class="row noselect justify-content-between">
      <div class="col">
        <win-button class="px-3" @click="openWindow(Win.USER_FAVORITES)">
          {{ t('win.user_favorites.title') }}
        </win-button>
      </div>
      <div class="col-4">
        <win-button class="d-block" @click="closeWindow(Win.USER)">
          {{ t('buttons.close') }}
        </win-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { useI18n } from 'vue-i18n';
  import { fmtDate } from '@app/utils/timeFormats.ts';
  import { useWindows } from '@app/composables/useWindows.ts';
  import { useAuth } from '@app/composables/useAuth.ts';
  import { Win } from '@app/types';
  import { onBeforeMount, onMounted, ref } from 'vue';
  import { useApi } from '@app/composables/useApi.ts';
  import { authApi } from '@app/api/auth.api.ts';
  import { userApi } from '@app/api/user.api.ts';

  const { t } = useI18n();
  const { isSigned } = useAuth();
  const { openWindow, closeWindow } = useWindows();
  const { execute: doLogout } = useApi(authApi.logout);
  const { execute: getUserStats } = useApi(userApi.getUserStats);

  const { user, unsetUser } = useAuth();

  const reactions = ref<number | null>(null);
  const favorites = ref<number | null>(null);

  function open(window: Win): void {
    openWindow(window);
    closeWindow(Win.USER);
  }

  async function logout(): Promise<void> {
    await doLogout();
    unsetUser();
    closeWindow(Win.USER);
  }

  onBeforeMount(() => {
    if (!isSigned.value) {
      closeWindow(Win.USER);
      openWindow(Win.USER_LOGIN);
    }
  });

  onMounted(async () => {
    try {
      const res = await getUserStats();
      reactions.value = res.data.reactions;
      favorites.value = res.data.favorites;
    } catch (e) {
      console.log('Failed to get user stats', e);
    }
  });
</script>

<style lang="scss">
  #window-user {
    .username {
      font-size: 14px;
      font-weight: 700;
    }

    a {
      text-decoration: none;
      &:hover {
        text-decoration: underline;
      }
    }
  }
</style>
