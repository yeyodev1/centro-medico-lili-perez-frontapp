<script setup lang="ts">
import { ref } from 'vue'
import { formatBytes } from '@/utils/format'
import { panelCopy, uploadRules } from '@/config/panel'

defineProps<{ file: File | null; error?: string; disabled?: boolean }>()
const emit = defineEmits<{ pick: [file: File] }>()

const copy = panelCopy.upload
const input = ref<HTMLInputElement | null>(null)
const dragging = ref(false)

function onChange(event: Event) {
  const target = event.target as HTMLInputElement
  const picked = target.files?.[0]
  if (picked) emit('pick', picked)
  // Permite volver a elegir el mismo archivo después de un rechazo.
  target.value = ''
}

function onDrop(event: DragEvent) {
  dragging.value = false
  const dropped = event.dataTransfer?.files?.[0]
  if (dropped) emit('pick', dropped)
}

function browse() {
  input.value?.click()
}
</script>

<template>
  <div class="drop">
    <div
      class="drop__zone"
      :class="{
        'drop__zone--over': dragging,
        'drop__zone--filled': file,
        'drop__zone--error': error,
        'drop__zone--disabled': disabled,
      }"
      @dragover.prevent="dragging = !disabled"
      @dragleave.prevent="dragging = false"
      @drop.prevent="!disabled && onDrop($event)"
    >
      <input
        id="study-file"
        ref="input"
        class="visually-hidden"
        type="file"
        :accept="uploadRules.accept"
        :disabled="disabled"
        :aria-describedby="error ? 'study-file-error' : 'study-file-hint'"
        @change="onChange"
      />

      <template v-if="file">
        <i
          class="drop__icon"
          :class="
            file.type === 'application/pdf' ? 'fa-solid fa-file-pdf' : 'fa-solid fa-file-image'
          "
          aria-hidden="true"
        ></i>
        <div class="drop__file">
          <p class="drop__name">{{ file.name }}</p>
          <p id="study-file-hint" class="drop__hint">{{ formatBytes(file.size) }}</p>
        </div>
        <button class="btn btn--ghost btn--sm" type="button" :disabled="disabled" @click="browse">
          {{ copy.change }}
        </button>
      </template>

      <template v-else>
        <i class="drop__icon fa-solid fa-cloud-arrow-up" aria-hidden="true"></i>
        <div class="drop__file">
          <label class="drop__title" for="study-file">{{ copy.dropTitle }}</label>
          <p id="study-file-hint" class="drop__hint">{{ copy.dropHint }}</p>
        </div>
        <button
          class="btn btn--primary btn--sm"
          type="button"
          data-autofocus
          :disabled="disabled"
          @click="browse"
        >
          <i class="fa-solid fa-folder-open" aria-hidden="true"></i> {{ copy.pick }}
        </button>
      </template>
    </div>

    <p v-if="error" id="study-file-error" class="drop__error" role="alert">
      <i class="fa-solid fa-circle-exclamation" aria-hidden="true"></i> {{ error }}
    </p>
  </div>
</template>

<style scoped lang="scss">
.drop {
  @include flex(column, stretch, flex-start, 0.35rem);

  &__zone {
    @include flex(column, center, center, 0.7rem);
    padding: 1.2rem 1rem;
    text-align: center;
    background: $paper;
    border: 2px dashed darken($line, 8);
    border-radius: 10px;
    transition:
      border-color 0.15s ease,
      background 0.15s ease;

    @include from('sm') {
      flex-direction: row;
      text-align: left;
    }

    &--over {
      background: $accent-soft;
      border-color: $accent;
    }

    &--filled {
      background: $surface;
      border-style: solid;
      border-color: $accent;
    }

    &--error {
      border-color: $danger;
    }

    &--disabled {
      opacity: 0.7;
    }
  }

  &__icon {
    flex: none;
    font-size: 1.8rem;
    color: $accent;
  }

  &__file {
    flex: 1;
    min-width: 0;
  }

  &__title {
    margin: 0;
    font-size: 0.95rem;
    font-weight: 700;
    color: $ink;
  }

  &__name {
    font-weight: 700;
    font-size: 0.92rem;
    line-height: 1.35;
    overflow-wrap: anywhere;
  }

  &__hint {
    font-size: 0.8rem;
    color: $ink-muted;
  }

  &__error {
    font-size: 0.82rem;
    color: $danger;
  }
}
</style>
