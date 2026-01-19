import { ref, type Ref } from "vue"

/**
 * Composable for handling confirmation dialogs (e.g., delete confirmation)
 * Reduces boilerplate for open/close/confirm pattern
 */
export function useConfirmDialog<T = unknown>() {
  const isOpen = ref(false)
  const isLoading = ref(false)
  const itemToConfirm = ref<T | null>(null) as Ref<T | null>

  function open(item: T) {
    itemToConfirm.value = item
    isOpen.value = true
  }

  function close() {
    isOpen.value = false
    itemToConfirm.value = null
  }

  async function confirm(action: () => Promise<void>) {
    isLoading.value = true
    try {
      await action()
      close()
    } finally {
      isLoading.value = false
    }
  }

  return {
    isOpen,
    isLoading,
    itemToConfirm,
    open,
    close,
    confirm,
  }
}
