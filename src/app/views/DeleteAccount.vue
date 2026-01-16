<template>
  <win-window v-slot="winProps" name="delete-account" :width="450" :title="t('win.delete_account.title')" @closed="close()">
    <div class="p-2">
      <win-memo>
        <p class="lead mb-1">
          Account Deletion
        </p>

        <p class="mb-3">
          Follow these steps to permanently delete your Nightwave Plaza account.
        </p>

        <p class="lead mb-1">
          How to delete your account
        </p>

        <ol class="ml-3 mb-3">
          <li>Sign in to your Nightwave Plaza account.</li>
          <li>Open <strong>My Profile</strong>.</li>
          <li>Go to <strong>Delete Account</strong>.</li>
          <li>Review the warning message.</li>
          <li>Confirm by selecting <strong>I understand, delete my account</strong>.</li>
          <li>Enter your current password if required.</li>
          <li>Click <strong>Delete Account</strong>.</li>
        </ol>

        <p class="lead mb-1">
          Important
        </p>

        <ul class="ml-3 mb-3">
          <li>Account deletion is <strong>permanent</strong> and cannot be undone.</li>
          <li>All associated data will be deleted, including favorites and activity history.</li>
          <li>You can register again using the same username and email if they are available.</li>
        </ul>

        <p class="lead mb-1">
          Need help?
        </p>

        <p>If you cannot delete your account or encounter an error, please contact support.</p>
      </win-memo>

      <div class="text-center mt-3">
        <win-button class="mx-auto px-4" @click="winProps.close()">
          {{ t('buttons.close') }}
        </win-button>
      </div>
    </div>
  </win-window>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useWindows } from '@app/composables/useWindows.ts'

const { t } = useI18n()
const router = useRouter()
const { pullUp } = useWindows()

onMounted(() => {
  pullUp('delete-account')
})

function close (): void {
  router.push({ name: 'index' })
}
</script>

