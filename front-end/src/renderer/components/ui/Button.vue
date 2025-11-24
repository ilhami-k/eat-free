<template>
  <button
    :class="[
      'button',
      `button--${variant}`,
      `button--${size}`,
      {
        'button--loading': isLoading,
        'button--disabled': disabled || isLoading,
        'button--full-width': fullWidth,
      }
    ]"
    :disabled="disabled || isLoading"
    v-bind="$attrs"
  >
    <span class="button__content">
      <span v-if="$slots.iconLeft" class="button__icon button__icon--left">
        <slot name="iconLeft" />
      </span>

      <span class="button__text">
        <slot />
      </span>

      <span v-if="$slots.iconRight" class="button__icon button__icon--right">
        <slot name="iconRight" />
      </span>
    </span>

    <span v-if="isLoading" class="button__spinner">
      <span class="spinner" />
    </span>
  </button>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    variant?: 'primary' | 'secondary' | 'tertiary' | 'ghost'
    size?: 'sm' | 'md' | 'lg'
    disabled?: boolean
    isLoading?: boolean
    fullWidth?: boolean
  }>(),
  {
    variant: 'primary',
    size: 'md',
    disabled: false,
    isLoading: false,
    fullWidth: false,
  }
)
</script>

<style scoped>
.button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-1);
  font-family: var(--font-body);
  font-weight: 600;
  border: none;
  border-radius: var(--radius-lg);
  cursor: pointer;
  transition: all var(--duration-normal) var(--ease-in-out);
  position: relative;
  overflow: hidden;
  white-space: nowrap;

  &:focus-visible {
    outline: 2px solid var(--color-sky-blue);
    outline-offset: 2px;
  }

  &:hover:not(.button--disabled) {
    animation: bubble-bounce var(--duration-fast) var(--ease-bounce);
  }
}

.button--primary {
  background-color: var(--color-fresh-green);
  color: var(--color-white);
  box-shadow: var(--shadow-bubble-sm);

  &:hover:not(.button--disabled) {
    background-color: darken(#78E08F, 10%);
    box-shadow: var(--shadow-bubble-md);
  }

  &:active:not(.button--disabled) {
    transform: scale(0.98);
  }
}

.button--secondary {
  background-color: var(--color-sky-blue);
  color: var(--color-white);
  box-shadow: var(--shadow-bubble-md);

  &:hover:not(.button--disabled) {
    background-color: darken(#34ACE0, 10%);
    box-shadow: var(--shadow-bubble-lg);
  }

  &:active:not(.button--disabled) {
    transform: scale(0.98);
  }
}

.button--tertiary {
  background-color: var(--color-banana-yellow);
  color: var(--color-black);
  box-shadow: var(--shadow-bubble-sm);

  &:hover:not(.button--disabled) {
    background-color: darken(#FFD32A, 10%);
    box-shadow: var(--shadow-bubble-md);
  }

  &:active:not(.button--disabled) {
    transform: scale(0.98);
  }
}

.button--ghost {
  background-color: transparent;
  color: var(--color-fresh-green);
  border: 2px solid var(--color-fresh-green);

  &:hover:not(.button--disabled) {
    background-color: rgba(120, 224, 143, 0.1);
  }

  &:active:not(.button--disabled) {
    transform: scale(0.98);
  }
}

.button--sm {
  padding: calc(var(--spacing-1) * 0.5) var(--spacing-2);
  font-size: 0.875rem;
}

.button--md {
  padding: var(--spacing-1) var(--spacing-3);
  font-size: var(--text-body);
}

.button--lg {
  padding: var(--spacing-2) var(--spacing-4);
  font-size: 1.125rem;
}

.button--disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.button--loading {
  color: transparent;

  .button__spinner {
    display: inline-flex;
  }
}

.button--full-width {
  width: 100%;
}

.button__content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-1);
}

.button__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.button__text {
  flex: 1;
}

.button__spinner {
  display: none;
  position: absolute;
  inset: 0;
  align-items: center;
  justify-content: center;
}

.spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: var(--color-white);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@media (prefers-reduced-motion: reduce) {
  .button {
    &:hover:not(.button--disabled) {
      animation: none;
    }
  }

  .spinner {
    animation: none;
  }
}
</style>
