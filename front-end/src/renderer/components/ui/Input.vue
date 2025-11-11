<template>
  <div class="input-group">
    <label v-if="label" :for="inputId" class="input-group__label">
      {{ label }}
      <span v-if="required" class="input-group__required">*</span>
    </label>

    <div class="input-group__wrapper">
      <span v-if="$slots.iconLeft" class="input-group__icon input-group__icon--left">
        <slot name="iconLeft" />
      </span>

      <input
        :id="inputId"
        :type="type"
        :class="[
          'input-group__input',
          {
            'input-group__input--error': error,
            'input-group__input--icon-left': $slots.iconLeft,
            'input-group__input--icon-right': $slots.iconRight,
          }
        ]"
        :placeholder="placeholder"
        :value="modelValue"
        :disabled="disabled"
        :required="required"
        :aria-invalid="!!error"
        :aria-describedby="error ? `${inputId}-error` : undefined"
        @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
        v-bind="$attrs"
      />

      <span v-if="$slots.iconRight" class="input-group__icon input-group__icon--right">
        <slot name="iconRight" />
      </span>
    </div>

    <span v-if="error" :id="`${inputId}-error`" class="input-group__error">
      {{ error }}
    </span>

    <span v-if="hint" class="input-group__hint">
      {{ hint }}
    </span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  modelValue?: string
  type?: string
  label?: string
  placeholder?: string
  error?: string
  hint?: string
  disabled?: boolean
  required?: boolean
  id?: string
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  type: 'text',
  disabled: false,
  required: false,
})

defineEmits<{
  'update:modelValue': [value: string]
}>()

const inputId = computed(() => props.id || `input-${Math.random().toString(36).substr(2, 9)}`)
</script>

<style scoped>
.input-group {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-1);
  width: 100%;
}

.input-group__label {
  font-family: var(--font-body);
  font-size: var(--text-body-sm);
  font-weight: 600;
  color: var(--color-black);
  display: flex;
  align-items: center;
  gap: var(--spacing-1);
}

.input-group__required {
  color: var(--color-error);
}

.input-group__wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.input-group__input {
  width: 100%;
  padding: var(--spacing-2);
  font-family: var(--font-body);
  font-size: var(--text-body);
  border: 2px solid var(--color-medium-gray);
  border-radius: var(--radius-lg);
  background-color: var(--color-white);
  color: var(--color-black);
  transition: all var(--duration-normal) var(--ease-in-out);

  &::placeholder {
    color: var(--color-dark-gray);
  }

  &:hover:not(:disabled) {
    border-color: var(--color-fresh-green);
  }

  &:focus {
    outline: none;
    border-color: var(--color-fresh-green);
    box-shadow: 0 0 0 3px rgba(120, 224, 143, 0.1);
  }

  &:disabled {
    background-color: var(--color-light-gray);
    color: var(--color-dark-gray);
    cursor: not-allowed;
  }

  &--error {
    border-color: var(--color-error);

    &:focus {
      box-shadow: 0 0 0 3px rgba(255, 107, 129, 0.1);
    }
  }

  &--icon-left {
    padding-left: calc(var(--spacing-4) + var(--spacing-2));
  }

  &--icon-right {
    padding-right: calc(var(--spacing-4) + var(--spacing-2));
  }
}

.input-group__icon {
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-dark-gray);
  pointer-events: none;

  &--left {
    left: var(--spacing-2);
  }

  &--right {
    right: var(--spacing-2);
  }
}

.input-group__error {
  font-size: var(--text-body-sm);
  color: var(--color-error);
  font-weight: 500;
}

.input-group__hint {
  font-size: var(--text-body-sm);
  color: var(--color-dark-gray);
  font-style: italic;
}

/* ========== ACCESSIBILITY ========== */

@media (prefers-reduced-motion: reduce) {
  .input-group__input {
    transition: none;
  }
}
</style>
