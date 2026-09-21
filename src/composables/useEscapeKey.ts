import { onUnmounted, watch, type Ref } from 'vue'

/**
 * Escape cierra lo que esté abierto. BaseModal no lo trae, así que quien lo usa
 * en el panel engancha esto con su propio `open`.
 */
export function useEscapeKey(open: Ref<boolean>, onEscape: () => void) {
  function handler(event: KeyboardEvent) {
    if (event.key === 'Escape') onEscape()
  }

  watch(
    open,
    (value) => {
      if (value) window.addEventListener('keydown', handler)
      else window.removeEventListener('keydown', handler)
    },
    { immediate: true },
  )

  onUnmounted(() => window.removeEventListener('keydown', handler))
}
