import { ref, shallowRef } from 'vue';
import { type ApiError, handleError } from '@app/utils/apiErrorHandler.ts';

/**
 * API request handler with state management
 *
 * Handles API calls and tracks loading state, data and errors.
 */
export function useApi<T, Args extends unknown[]>(apiFunction: (...args: Args) => Promise<T>) {
  const data = shallowRef<T | null>(null);
  const error = shallowRef<ApiError | null>(null);
  const isLoading = ref(false);

  // Make API request
  const execute = async (...args: Args): Promise<T> => {
    isLoading.value = true;
    error.value = null;

    try {
      const result = await apiFunction(...args);
      data.value = result;
      return result;
    } catch (err) {
      error.value = handleError(err);
      throw error.value;
    } finally {
      isLoading.value = false;
    }
  };

  return {
    data: data,
    error: error,
    isLoading: isLoading,
    execute,
  };
}
