import { computed, ref } from 'vue';
import type { User } from '@app/types';
import { useReactions } from '@app/composables/useReactions.ts';
import { setApiToken } from '@app/api';
import { useApi } from '@app/composables/useApi.ts';
import { userApi } from '@app/api/user.api.ts';

const { execute: getUser } = useApi(userApi.getUser);

const user = ref<User | null>(null);
const resetToken = ref<string | null>(null);

export function useAuth() {
  const { resetReaction } = useReactions();
  const isSigned = computed(() => user.value !== null);

  const fetchUser = async () => {
    try {
      const res = await getUser();
      user.value = res.data;
    } catch {
      console.error('Failed to get user');
    }
  };

  const unsetUser = () => {
    resetReaction();
    setApiToken(null);
    user.value = null;
  };

  return { fetchUser, unsetUser, user, isSigned, resetToken };
}
