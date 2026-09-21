<script setup lang="ts">
import { nextTick, ref, toRef, watch } from 'vue'
import { useBodyScroll } from '@/composables/useBodyScroll'
import { useEscapeKey } from '@/composables/useEscapeKey'

const props = defineProps<{
  open: boolean
  title: string
  subtitle?: string
  /** Mientras hay una operación en curso no se deja cerrar (evita perder una subida). */
  busy?: boolean
  wide?: boolean
}>()

const emit = defineEmits<{ close: [] }>()

const box = ref<HTMLElement | null>(null)
let previousFocus: HTMLElement | null = null

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled])'

function close() {
  if (!props.busy) emit('close')
}

// Tab no se escapa del diálogo hacia la página de atrás.
function trapFocus(event: KeyboardEvent) {
  if (event.key !== 'Tab' || !box.value) return
  const items = Array.from(box.value.querySelectorAll<HTMLElement>(FOCUSABLE))
  if (!items.length) return
  const first = items[0]
  const last = items[items.length - 1]
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault()
    last?.focus()
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault()
    first?.focus()
  }
}

useBodyScroll(toRef(props, 'open'))
useEscapeKey(toRef(props, 'open'), close)

watch(
  () => props.open,
  async (value) => {
    if (value) {
      previousFocus = document.activeElement as HTMLElement | null
      await nextTick()
      const target = box.value?.querySelector<HTMLElement>('[data-autofocus]') || box.value
      target?.focus()
    } else {
      previousFocus?.focus()
      previousFocus = null
    }
  },
  // Puede nacer ya abierto (la ficha con ?subir=1).
  { immediate: true },
)
</script>

<template>
  <!-- El destino vive dentro de PanelLayout para heredar los estilos del panel. -->
  <Teleport to="#panel-overlays" defer>
    <Transition name="pmodal">
      <div v-if="open" class="pmodal" @mousedown.self="close">
        <div
          ref="box"
          class="pmodal__box"
          :class="{ 'pmodal__box--wide': wide }"
          role="dialog"
          aria-modal="true"
          :aria-label="title"
          tabindex="-1"
          @keydown="trapFocus"
        >
          <header class="pmodal__head">
            <div class="pmodal__titles">
              <h2 class="pmodal__title">{{ title }}</h2>
              <p v-if="subtitle" class="pmodal__subtitle">{{ subtitle }}</p>
            </div>
            <button
              class="pmodal__close"
              type="button"
              aria-label="Cerrar"
              :disabled="busy"
              @click="close"
            >
              <i class="fa-solid fa-xmark" aria-hidden="true"></i>
            </button>
          </header>
          <div class="pmodal__body">
            <slot />
          </div>
          <footer v-if="$slots.footer" class="pmodal__foot">
            <slot name="footer" />
          </footer>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped lang="scss">
.pmodal {
  position: fixed;
  inset: 0;
  z-index: 200;
  background: $overlay;
  // En móvil ocupa casi toda la pantalla y se pega abajo, como una hoja.
  @include flex(row, flex-end, center);

  @include from('md') {
    align-items: center;
    padding: 1.5rem;
  }

  &__box {
    @include flex(column, stretch, flex-start);
    width: 100%;
    max-height: 94vh;
    max-height: 94dvh;
    background: $surface;
    border-radius: 14px 14px 0 0;
    outline: none;

    @include from('md') {
      max-width: 560px;
      max-height: 90vh;
      border: 1px solid $line;
      border-radius: 12px;

      &--wide {
        max-width: 760px;
      }
    }
  }

  &__head {
    @include flex(row, flex-start, space-between, 1rem);
    padding: 1rem 1.1rem;
    border-bottom: 1px solid $line;
  }

  &__titles {
    min-width: 0;
  }

  &__title {
    font-size: 1.05rem;
    font-weight: 800;
  }

  &__subtitle {
    font-size: 0.84rem;
    color: $ink-soft;
    overflow-wrap: anywhere;
  }

  &__close {
    flex: none;
    width: 36px;
    height: 36px;
    border-radius: 8px;
    color: $ink-soft;

    &:hover {
      background: $sand;
      color: $ink;
    }

    &:disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }
  }

  &__body {
    flex: 1;
    overflow-y: auto;
    padding: 1.1rem;
  }

  &__foot {
    @include flex(row, center, flex-end, 0.6rem);
    flex-wrap: wrap;
    padding: 0.85rem 1.1rem;
    border-top: 1px solid $line;
    background: $paper;
    border-radius: 0 0 12px 12px;
  }
}

.pmodal-enter-active,
.pmodal-leave-active {
  transition: opacity 0.18s ease;

  .pmodal__box {
    transition: transform 0.22s $ease;
  }
}

.pmodal-enter-from,
.pmodal-leave-to {
  opacity: 0;

  .pmodal__box {
    transform: translateY(10px);
  }
}
</style>
