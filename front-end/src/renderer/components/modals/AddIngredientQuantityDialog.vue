<template>
  <div v-if="isOpen" class="modal-overlay" @click.self="close">
    <div class="modal-content">
      <div class="modal-header">
        <h2>Add {{ ingredientName }}</h2>
        <button class="close-button" @click="close">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div class="modal-body">
        <div class="form-group">
          <label for="quantity">Quantity (grams)</label>
          <input
            id="quantity"
            v-model.number="quantity"
            type="number"
            min="1"
            step="1"
            class="quantity-input"
            placeholder="Enter quantity in grams"
            @keyup.enter="confirm"
            autofocus
          />
          <p class="help-text">Enter the amount you have available</p>
        </div>

        <div class="quick-actions">
          <p class="quick-actions-label">Quick add:</p>
          <div class="quick-buttons">
            <button
              v-for="amount in [50, 100, 200, 500]"
              :key="amount"
              class="quick-button"
              @click="quantity = amount"
            >
              {{ amount }}g
            </button>
          </div>
        </div>
      </div>

      <div class="modal-footer">
        <button class="button-secondary" @click="close">Cancel</button>
        <button
          class="button-primary"
          :disabled="!isValid"
          @click="confirm"
        >
          Add Ingredient
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const props = defineProps<{
  isOpen: boolean
  ingredientName: string
}>()

const emit = defineEmits<{
  close: []
  confirm: [quantity: number]
}>()

const quantity = ref(100)

const isValid = computed(() => quantity.value > 0)

const close = () => {
  emit('close')
}

const confirm = () => {
  if (isValid.value) {
    emit('confirm', quantity.value)
    close()
  }
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  backdrop-filter: blur(4px);
}

.modal-content {
  background: white;
  border-radius: 1rem;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  animation: slideUp 0.2s ease-out;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #e0e0e0;
}

.modal-header h2 {
  margin: 0;
  font-size: 1.5rem;
  color: #333;
  font-weight: 600;
}

.close-button {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;
  transition: all 0.2s;
  border-radius: 0.5rem;
}

.close-button:hover {
  background: #f5f5f5;
  color: #333;
}

.close-button svg {
  width: 1.5rem;
  height: 1.5rem;
}

.modal-body {
  padding: 2rem 1.5rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #333;
  font-size: 0.95rem;
}

.quantity-input {
  width: 100%;
  padding: 0.875rem;
  border: 2px solid #e0e0e0;
  border-radius: 0.5rem;
  font-size: 1.125rem;
  transition: all 0.2s;
  font-family: inherit;
}

.quantity-input:focus {
  outline: none;
  border-color: var(--color-fresh-green, #7ed957);
  box-shadow: 0 0 0 3px rgba(126, 217, 87, 0.1);
}

.help-text {
  margin-top: 0.5rem;
  font-size: 0.875rem;
  color: #666;
}

.quick-actions {
  margin-top: 1.5rem;
}

.quick-actions-label {
  font-size: 0.875rem;
  color: #666;
  margin-bottom: 0.75rem;
}

.quick-buttons {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.quick-button {
  padding: 0.5rem 1rem;
  background: #f5f5f5;
  border: 1px solid #e0e0e0;
  border-radius: 0.5rem;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 500;
  color: #333;
  transition: all 0.2s;
}

.quick-button:hover {
  background: var(--color-fresh-green, #7ed957);
  border-color: var(--color-fresh-green, #7ed957);
  color: white;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  padding: 1.5rem;
  border-top: 1px solid #e0e0e0;
}

.button-secondary,
.button-primary {
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
}

.button-secondary {
  background: #f5f5f5;
  color: #333;
}

.button-secondary:hover {
  background: #e0e0e0;
}

.button-primary {
  background: linear-gradient(135deg, var(--color-fresh-green, #7ed957) 0%, #6bc785 100%);
  color: white;
}

.button-primary:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(126, 217, 87, 0.3);
}

.button-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
