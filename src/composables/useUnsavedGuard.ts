import { onMounted, onUnmounted, ref, type Ref } from 'vue'
import { onBeforeRouteLeave } from 'vue-router'

/**
 * Frena la salida de una vista con cambios sin guardar. La navegación queda en
 * pausa hasta que el asesor responde en el modal; cerrar o recargar la pestaña
 * dispara el aviso nativo del navegador.
 */
export function useUnsavedGuard(isDirty: Ref<boolean>) {
  const asking = ref(false)
  let answer: ((leave: boolean) => void) | null = null

  onBeforeRouteLeave(() => {
    if (!isDirty.value) return true
    asking.value = true
    return new Promise<boolean>((resolve) => {
      answer = resolve
    })
  })

  function respond(leave: boolean) {
    asking.value = false
    answer?.(leave)
    answer = null
  }

  function onBeforeUnload(event: BeforeUnloadEvent) {
    if (isDirty.value) event.preventDefault()
  }

  onMounted(() => window.addEventListener('beforeunload', onBeforeUnload))
  onUnmounted(() => {
    window.removeEventListener('beforeunload', onBeforeUnload)
    answer?.(true)
  })

  return { asking, leave: () => respond(true), stay: () => respond(false) }
}
