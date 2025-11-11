<template>
  <div
    :class="[
      'card',
      `card--elevation-${elevation}`,
      {
        'card--interactive': interactive,
        'card--glass': glass,
      }
    ]"
    @click="interactive && $emit('click')"
  >
    <div v-if="$slots.badge" class="card__badge">
      <slot name="badge" />
    </div>

    <div class="card__content">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    elevation?: 'none' | 'sm' | 'md' | 'lg'
    interactive?: boolean
    glass?: boolean
  }>(),
  {
    elevation: 'md',
    interactive: false,
    glass: false,
  }
)

defineEmits<{
  click: []
}>()
</script>

<style scoped>
.card {
  position: relative;
  background-color: var(--color-white);
  border-radius: var(--radius-xl);
  padding: var(--spacing-3);
  transition: all var(--duration-normal) var(--ease-in-out);
}

/* ========== ELEVATION LEVELS ========== */

.card--elevation-none {
  box-shadow: none;
  border: 1px solid var(--color-medium-gray);
}

.card--elevation-sm {
  box-shadow: var(--shadow-sm);
}

.card--elevation-md {
  box-shadow: var(--shadow-md);
}

.card--elevation-lg {
  box-shadow: var(--shadow-lg);
}

/* ========== INTERACTIVE MODE ========== */

.card--interactive {
  cursor: pointer;

  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-lg);
  }

  &:active {
    transform: translateY(0);
  }
}

/* ========== GLASS MORPHISM ========== */

.card--glass {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.5);
}

/* ========== CONTENT ========== */

.card__content {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-2);
}

.card__badge {
  position: absolute;
  top: var(--spacing-2);
  right: var(--spacing-2);
}

/* ========== ACCESSIBILITY ========== */

.card--interactive {
  &:focus-visible {
    outline: 2px solid var(--color-sky-blue);
    outline-offset: 2px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .card {
    transition: none;

    &--interactive:hover {
      transform: none;
    }
  }
}
</style>
