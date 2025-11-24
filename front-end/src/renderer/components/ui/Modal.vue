<template>
  <!-- Modal Backdrop -->
  <Teleport to="body">
    <Transition name="modal-fade">
      <div
        v-if="isOpen"
        class="modal-backdrop"
        :class="{ 'modal-backdrop--blur': blurBackground }"
        @click="handleBackdropClick"
        role="dialog"
        aria-modal="true"
        :aria-labelledby="headerId"
      >
        <!-- Modal Container -->
        <Transition name="modal-scale">
          <div
            v-if="isOpen"
            class="modal-container"
            :class="[
              `modal-container--${size}`,
              { 'modal-container--no-padding': noPadding }
            ]"
            @click.stop
            role="document"
          >
            <!-- Close Button (if enabled) -->
            <button
              v-if="showClose"
              class="modal-close"
              @click="handleClose"
              aria-label="Close modal"
              type="button"
            >
              <svg class="modal-close-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <!-- Modal Header -->
            <header v-if="$slots.header || title" class="modal-header">
              <h2 :id="headerId" class="modal-title">
                <slot name="header">{{ title }}</slot>
              </h2>
              <p v-if="$slots.subtitle || subtitle" class="modal-subtitle">
                <slot name="subtitle">{{ subtitle }}</slot>
              </p>
            </header>

            <!-- Modal Content (Scrollable) -->
            <div class="modal-content" ref="contentRef">
              <slot />
            </div>

            <!-- Modal Footer -->
            <footer v-if="$slots.footer || showDefaultFooter" class="modal-footer">
              <slot name="footer">
                <!-- Default Footer Actions -->
                <div class="modal-footer-actions">
                  <Button
                    v-if="showSecondaryAction"
                    variant="ghost"
                    :disabled="isLoading"
                    @click="handleSecondaryAction"
                  >
                    {{ secondaryActionLabel }}
                  </Button>
                  <Button
                    variant="primary"
                    :isLoading="isLoading"
                    :disabled="primaryActionDisabled"
                    @click="handlePrimaryAction"
                  >
                    {{ primaryActionLabel }}
                  </Button>
                </div>
              </slot>
            </footer>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onBeforeUnmount, computed } from 'vue'
import Button from './Button.vue'

interface Props {
  isOpen: boolean
  title?: string
  subtitle?: string
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  showClose?: boolean
  closeOnBackdrop?: boolean
  closeOnEscape?: boolean
  blurBackground?: boolean
  noPadding?: boolean
  showDefaultFooter?: boolean
  showSecondaryAction?: boolean
  primaryActionLabel?: string
  secondaryActionLabel?: string
  primaryActionDisabled?: boolean
  isLoading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isOpen: false,
  title: '',
  subtitle: '',
  size: 'md',
  showClose: true,
  closeOnBackdrop: true,
  closeOnEscape: true,
  blurBackground: true,
  noPadding: false,
  showDefaultFooter: false,
  showSecondaryAction: true,
  primaryActionLabel: 'Confirm',
  secondaryActionLabel: 'Cancel',
  primaryActionDisabled: false,
  isLoading: false,
})

interface Emits {
  (e: 'close'): void
  (e: 'primary-action'): void
  (e: 'secondary-action'): void
  (e: 'update:isOpen', value: boolean): void
}

const emit = defineEmits<Emits>()

const contentRef = ref<HTMLElement | null>(null)
const headerId = computed(() => `modal-title-${Math.random().toString(36).substr(2, 9)}`)

watch(() => props.isOpen, (newValue) => {
  if (newValue) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
})

const handleEscapeKey = (e: KeyboardEvent) => {
  if (props.closeOnEscape && e.key === 'Escape' && props.isOpen) {
    handleClose()
  }
}

const handleClose = () => {
  emit('close')
  emit('update:isOpen', false)
}

const handleBackdropClick = () => {
  if (props.closeOnBackdrop) {
    handleClose()
  }
}

const handlePrimaryAction = () => {
  emit('primary-action')
}

const handleSecondaryAction = () => {
  emit('secondary-action')
}

onMounted(() => {
  document.addEventListener('keydown', handleEscapeKey)
})

onBeforeUnmount(() => {
  document.removeEventListener('keydown', handleEscapeKey)
  document.body.style.overflow = ''
})
</script>

<style scoped>

.modal-backdrop {
  position: fixed;
  inset: 0;
  z-index: var(--z-modal-backdrop);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-4);
  background-color: rgba(26, 26, 26, 0.6);
  overflow-y: auto;
}

.modal-backdrop--blur {
  backdrop-filter: blur(4px);
}

.modal-container {
  position: relative;
  width: 100%;
  background-color: var(--color-white);
  border-radius: var(--radius-2xl);
  box-shadow: var(--shadow-2xl);
  display: flex;
  flex-direction: column;
  max-height: 90vh;
  margin: auto;
}

.modal-container--sm {
  max-width: 400px;
}

.modal-container--md {
  max-width: 600px;
}

.modal-container--lg {
  max-width: 800px;
}

.modal-container--xl {
  max-width: 1200px;
}

.modal-container--full {
  max-width: 95vw;
  max-height: 95vh;
}

.modal-close {
  position: absolute;
  top: var(--spacing-3);
  right: var(--spacing-3);
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  border: none;
  border-radius: var(--radius-full);
  background-color: var(--color-light-gray);
  color: var(--color-dark-gray);
  cursor: pointer;
  transition: all var(--duration-normal) var(--ease-out);
}

.modal-close:hover {
  background-color: var(--color-medium-gray);
  color: var(--color-black);
  transform: scale(1.05);
}

.modal-close:active {
  transform: scale(0.95);
}

.modal-close:focus-visible {
  outline: 2px solid var(--color-sky-blue);
  outline-offset: 2px;
}

.modal-close-icon {
  width: 1.25rem;
  height: 1.25rem;
}

.modal-header {
  padding: var(--spacing-6) var(--spacing-6) var(--spacing-4) var(--spacing-6);
  border-bottom: 1px solid var(--color-medium-gray);
}

.modal-container--no-padding .modal-header {
  padding: var(--spacing-4);
}

.modal-title {
  font-family: var(--font-display);
  font-size: var(--text-h2);
  font-weight: 700;
  color: var(--color-black);
  line-height: 1.3;
  margin: 0;
  padding-right: var(--spacing-8);
}

.modal-subtitle {
  margin-top: var(--spacing-2);
  font-size: var(--text-body-sm);
  color: var(--color-dark-gray);
  line-height: 1.5;
}

.modal-content {
  flex: 1;
  overflow-y: auto;
  padding: var(--spacing-6);

  scrollbar-width: thin;
  scrollbar-color: var(--color-medium-gray) transparent;
}

.modal-container--no-padding .modal-content {
  padding: 0;
}

.modal-content::-webkit-scrollbar {
  width: 8px;
}

.modal-content::-webkit-scrollbar-track {
  background: transparent;
}

.modal-content::-webkit-scrollbar-thumb {
  background-color: var(--color-medium-gray);
  border-radius: var(--radius-full);
  border: 2px solid transparent;
  background-clip: padding-box;
}

.modal-content::-webkit-scrollbar-thumb:hover {
  background-color: var(--color-dark-gray);
}

.modal-footer {
  padding: var(--spacing-4) var(--spacing-6) var(--spacing-6) var(--spacing-6);
  border-top: 1px solid var(--color-medium-gray);
}

.modal-container--no-padding .modal-footer {
  padding: var(--spacing-4);
}

.modal-footer-actions {
  display: flex;
  gap: var(--spacing-3);
  justify-content: flex-end;
}

.modal-footer-actions > * {
  min-width: 120px;
}

.modal-fade-enter-active {
  animation: modal-fade-in var(--duration-slow) var(--ease-out);
}

.modal-fade-leave-active {
  animation: modal-fade-out var(--duration-normal) var(--ease-in);
}

@keyframes modal-fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes modal-fade-out {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}

.modal-scale-enter-active {
  animation: modal-scale-in var(--duration-slow) var(--ease-bounce);
}

.modal-scale-leave-active {
  animation: modal-scale-out var(--duration-normal) var(--ease-in);
}

@keyframes modal-scale-in {
  from {
    opacity: 0;
    transform: scale(0.9) translateY(20px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

@keyframes modal-scale-out {
  from {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
  to {
    opacity: 0;
    transform: scale(0.95) translateY(10px);
  }
}

@media (max-width: 640px) {
  .modal-backdrop {
    padding: var(--spacing-2);
  }

  .modal-container {
    max-height: 95vh;
    border-radius: var(--radius-xl);
  }

  .modal-header {
    padding: var(--spacing-4);
  }

  .modal-content {
    padding: var(--spacing-4);
  }

  .modal-footer {
    padding: var(--spacing-4);
  }

  .modal-title {
    font-size: var(--text-h3);
  }

  .modal-footer-actions {
    flex-direction: column-reverse;
  }

  .modal-footer-actions > * {
    width: 100%;
    min-width: auto;
  }
}

@media (prefers-reduced-motion: reduce) {
  .modal-fade-enter-active,
  .modal-fade-leave-active,
  .modal-scale-enter-active,
  .modal-scale-leave-active {
    animation-duration: var(--duration-instant) !important;
  }

  .modal-backdrop--blur {
    backdrop-filter: none;
  }
}

.modal-container:focus {
  outline: none;
}
</style>
