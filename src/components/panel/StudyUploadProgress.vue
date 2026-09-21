<script setup lang="ts">
import { computed } from 'vue'
import { panelCopy } from '@/config/panel'
import type { UploadPhase } from '@/composables/useStudyUpload'

const props = defineProps<{
  phase: UploadPhase
  progress: number
  failure: { phase: string; message: string } | null
}>()

const label = computed(() => {
  if (props.phase === 'idle') return ''
  const text = panelCopy.upload.steps[props.phase]
  return props.phase === 'uploading' ? `${text} ${props.progress}%` : text
})

// La barra solo avanza de verdad durante la subida a Cloudinary.
const width = computed(() => {
  if (props.phase === 'saving') return 100
  return props.phase === 'uploading' ? props.progress : 0
})
</script>

<template>
  <div v-if="phase !== 'idle'" class="uprog" role="status" aria-live="polite">
    <p class="uprog__label">
      <i class="fa-solid fa-spinner fa-spin" aria-hidden="true"></i> {{ label }}
    </p>
    <div
      class="uprog__track"
      role="progressbar"
      aria-valuemin="0"
      aria-valuemax="100"
      :aria-valuenow="width"
      aria-label="Progreso de la subida"
    >
      <div class="uprog__bar" :style="{ width: `${width}%` }"></div>
    </div>
  </div>

  <p v-else-if="failure" class="uprog__failure" role="alert">
    <i class="fa-solid fa-triangle-exclamation" aria-hidden="true"></i>
    <span>{{ failure.message }}</span>
  </p>
</template>

<style scoped lang="scss">
.uprog {
  @include flex(column, stretch, flex-start, 0.4rem);

  &__label {
    font-size: 0.86rem;
    font-weight: 600;
    color: $ink-soft;
    font-variant-numeric: tabular-nums;
  }

  &__track {
    height: 8px;
    border-radius: 4px;
    background: $sand;
    overflow: hidden;
  }

  &__bar {
    height: 100%;
    border-radius: 4px;
    background: $accent;
    transition: width 0.2s linear;
  }

  &__failure {
    @include flex(row, flex-start, flex-start, 0.5rem);
    padding: 0.65rem 0.8rem;
    border-radius: 8px;
    background: $danger-bg;
    color: darken($danger, 10);
    font-size: 0.88rem;
    line-height: 1.4;

    i {
      margin-top: 0.15rem;
    }
  }
}
</style>
