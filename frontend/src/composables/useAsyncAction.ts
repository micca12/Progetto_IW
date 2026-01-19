/**
 * Composable per gestire azioni asincrone con loading/error state
 *
 * Elimina il boilerplate try-catch-finally ripetuto negli stores e componenti.
 *
 * @example
 * // Uso semplice
 * const { loading, error, execute } = useAsyncAction(
 *   () => apiClient.post('/api/data', payload),
 *   { errorMessage: 'Errore nel salvataggio' }
 * );
 * await execute();
 *
 * @example
 * // Con callback di successo
 * const { execute } = useAsyncAction(
 *   () => apiClient.delete(`/api/item/${id}`),
 *   {
 *     errorMessage: 'Errore eliminazione',
 *     onSuccess: () => toast.success('Eliminato!'),
 *     onError: (err) => console.error(err),
 *   }
 * );
 */

import { ref } from "vue";
import { extractApiError } from "@/utils/apiError";

export interface AsyncActionOptions<T> {
  /** Messaggio di errore di default se l'API non fornisce dettagli */
  errorMessage?: string;
  /** Callback chiamato in caso di successo */
  onSuccess?: (result: T) => void;
  /** Callback chiamato in caso di errore */
  onError?: (error: string) => void;
  /** Se true, resetta l'errore all'inizio di ogni execute */
  resetErrorOnExecute?: boolean;
}

export function useAsyncAction<T>(
  action: () => Promise<T>,
  options: AsyncActionOptions<T> = {}
) {
  const {
    errorMessage = "Si è verificato un errore",
    onSuccess,
    onError,
    resetErrorOnExecute = true,
  } = options;

  const loading = ref(false);
  const error = ref<string | null>(null);

  async function execute(): Promise<T | null> {
    loading.value = true;
    if (resetErrorOnExecute) {
      error.value = null;
    }

    try {
      const result = await action();
      onSuccess?.(result);
      return result;
    } catch (e) {
      error.value = extractApiError(e, errorMessage);
      onError?.(error.value);
      return null;
    } finally {
      loading.value = false;
    }
  }

  function clearError() {
    error.value = null;
  }

  return {
    loading,
    error,
    execute,
    clearError,
  };
}

/**
 * Versione con parametri dinamici
 *
 * @example
 * const { execute } = useAsyncActionWithParams<{ id: number }, Response>(
 *   (params) => apiClient.delete(`/api/item/${params.id}`),
 *   { errorMessage: 'Errore eliminazione' }
 * );
 * await execute({ id: 123 });
 */
export function useAsyncActionWithParams<P, T>(
  action: (params: P) => Promise<T>,
  options: AsyncActionOptions<T> = {}
) {
  const {
    errorMessage = "Si è verificato un errore",
    onSuccess,
    onError,
    resetErrorOnExecute = true,
  } = options;

  const loading = ref(false);
  const error = ref<string | null>(null);

  async function execute(params: P): Promise<T | null> {
    loading.value = true;
    if (resetErrorOnExecute) {
      error.value = null;
    }

    try {
      const result = await action(params);
      onSuccess?.(result);
      return result;
    } catch (e) {
      error.value = extractApiError(e, errorMessage);
      onError?.(error.value);
      return null;
    } finally {
      loading.value = false;
    }
  }

  function clearError() {
    error.value = null;
  }

  return {
    loading,
    error,
    execute,
    clearError,
  };
}
