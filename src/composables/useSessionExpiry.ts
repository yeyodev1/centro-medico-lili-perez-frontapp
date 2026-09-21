import { onMounted, onUnmounted } from 'vue'

/** httpBase emite `auth:token-expired` ante un 401; el layout del panel avisa y manda a login. */
export function useSessionExpiry(onExpired: () => void) {
  onMounted(() => window.addEventListener('auth:token-expired', onExpired))
  onUnmounted(() => window.removeEventListener('auth:token-expired', onExpired))
}
