<script setup lang="ts">
defineProps<{ caption: string }>()
</script>

<template>
  <div class="ptable">
    <table class="ptable__table">
      <caption class="visually-hidden">
        {{
          caption
        }}
      </caption>
      <slot />
    </table>
  </div>
</template>

<style scoped lang="scss">
// Una sola tabla semántica: en móvil cada fila se apila como tarjeta
// (la etiqueta sale de data-label); desde md es una tabla normal.
.ptable {
  &__table {
    width: 100%;
    border-collapse: collapse;
    display: block;

    @include from('md') {
      display: table;
      background: $surface;
      border: 1px solid $line;
      border-radius: 10px;
      border-collapse: separate;
      border-spacing: 0;
      overflow: hidden;
    }
  }

  :deep(thead) {
    display: none;

    @include from('md') {
      display: table-header-group;
    }
  }

  :deep(tbody) {
    @include flex(column, stretch, flex-start, 0.6rem);

    @include from('md') {
      display: table-row-group;
    }
  }

  :deep(th) {
    padding: 0.6rem 0.85rem;
    background: $sand;
    font-size: 0.74rem;
    font-weight: 700;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    text-align: left;
    color: $ink-soft;
    white-space: nowrap;
  }

  :deep(tbody tr) {
    @include flex(column, stretch, flex-start, 0.3rem);
    padding: 0.8rem 0.9rem;
    background: $surface;
    border: 1px solid $line;
    border-radius: 10px;

    @include from('md') {
      display: table-row;
      border: none;
      border-radius: 0;
    }
  }

  :deep(tbody tr.is-clickable) {
    cursor: pointer;

    &:hover,
    &:focus-within {
      background: lighten($sand, 3);
    }
  }

  :deep(td) {
    @include flex(row, baseline, space-between, 1rem);
    font-size: 0.92rem;
    text-align: right;

    &::before {
      content: attr(data-label);
      flex: none;
      font-size: 0.78rem;
      font-weight: 600;
      color: $ink-muted;
      text-align: left;
    }

    @include from('md') {
      display: table-cell;
      padding: 0.6rem 0.85rem;
      border-top: 1px solid $line;
      text-align: left;
      vertical-align: middle;

      &::before {
        content: none;
      }
    }
  }

  // La celda principal (nombre) encabeza la tarjeta en móvil, sin etiqueta.
  :deep(td.is-main) {
    justify-content: flex-start;
    font-weight: 700;
    text-align: left;

    &::before {
      content: none;
    }
  }

  :deep(td.is-actions) {
    justify-content: flex-start;
    flex-wrap: wrap;
    gap: 0.4rem;
    margin-top: 0.3rem;

    &::before {
      content: none;
    }

    @include from('md') {
      margin-top: 0;
      text-align: right;
      white-space: nowrap;
    }
  }
}
</style>
