<template>
  <Drawer :isOpen="true" :title="item.ingredient_name" @close="closeModal">
    <!-- Nutrition Info -->
    <div class="mb-6 rounded-lg bg-sky-blue/10 p-4">
      <p class="mb-3 text-xs font-medium text-sky-blue/80">Nutritional Values (per 100g)</p>
      <div class="grid grid-cols-2 gap-3">
        <div>
          <p class="text-xs text-neutral-600">Calories</p>
          <p class="font-medium text-neutral-900">{{ item.kcal_per_100g }} kcal</p>
        </div>
        <div>
          <p class="text-xs text-neutral-600">Protein</p>
          <p class="font-medium text-neutral-900">{{ item.protein_g_per_100g }}g</p>
        </div>
        <div>
          <p class="text-xs text-neutral-600">Carbs</p>
          <p class="font-medium text-neutral-900">{{ item.carbs_g_per_100g }}g</p>
        </div>
        <div>
          <p class="text-xs text-neutral-600">Fat</p>
          <p class="font-medium text-neutral-900">{{ item.fat_g_per_100g }}g</p>
        </div>
      </div>
    </div>

    <!-- Quantity Adjustment -->
    <form @submit.prevent="handleSubmit" class="mb-6 space-y-4">
      <!-- Current Quantity Display -->
      <div class="flex items-center justify-between rounded-lg bg-neutral-50 p-3">
        <span class="text-sm font-medium text-neutral-700">In Stock</span>
        <span class="text-lg font-bold text-fresh-green">{{ newQty }}g</span>
      </div>

      <!-- Quantity Input -->
      <Input
        :modelValue="newQty.toString()"
        @update:modelValue="newQty = Number($event)"
        label="Update Quantity (grams)"
        type="number"
        placeholder="Enter grams"
        :error="errors.qty"
        required
        min="0"
        max="999999"
      />

      <!-- Quick Actions -->
      <div class="grid grid-cols-4 gap-2">
        <Button
          variant="secondary"
          size="sm"
          type="button"
          @click="decreaseQty(50)"
        >
          -50g
        </Button>
        <Button
          variant="secondary"
          size="sm"
          type="button"
          @click="decreaseQty(100)"
        >
          -100g
        </Button>
        <Button
          variant="secondary"
          size="sm"
          type="button"
          @click="increaseQty(50)"
        >
          +50g
        </Button>
        <Button
          variant="secondary"
          size="sm"
          type="button"
          @click="increaseQty(100)"
        >
          +100g
        </Button>
      </div>

      <!-- Error Message -->
      <div v-if="generalError" class="rounded-lg bg-strawberry-red/10 p-3">
        <p class="text-sm text-strawberry-red">{{ generalError }}</p>
      </div>

      <!-- Submit Button -->
      <Button
        type="submit"
        fullWidth
        :isLoading="isUpdating"
        :disabled="newQty === item.qty_grams"
      >
        Update Quantity
      </Button>
    </form>

    <!-- Delete Button -->
    <Button
      variant="ghost"
      fullWidth
      @click="handleRemove"
      :isLoading="isRemoving"
      class="text-strawberry-red hover:bg-strawberry-red/10"
    >
      Remove from Inventory
    </Button>

    <!-- Footer with close button -->
    <template #footer>
      <Button variant="secondary" fullWidth @click="closeModal">
        Close
      </Button>
    </template>
  </Drawer>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { InventoryIngredientWithDetails } from '../../composables/useInventoryService'
import { useInventoryService } from '../../composables/useInventoryService'
import Drawer from '../ui/Drawer.vue'
import Input from '../ui/Input.vue'
import Button from '../ui/Button.vue'

interface Props {
  item: InventoryIngredientWithDetails
  inventoryId: bigint
}

interface Emits {
  (e: 'close'): void
  (e: 'updated'): void
  (e: 'removed'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const inventoryService = useInventoryService(window.electronService?.inventory)
const newQty = ref(props.item.qty_grams)
const isUpdating = ref(false)
const isRemoving = ref(false)
const generalError = ref('')
const errors = ref({ qty: '' })

const increaseQty = (amount: number) => {
  newQty.value = Math.max(0, newQty.value + amount)
}

const decreaseQty = (amount: number) => {
  newQty.value = Math.max(0, newQty.value - amount)
}

const validateForm = () => {
  errors.value.qty = ''
  generalError.value = ''

  if (newQty.value < 0) {
    errors.value.qty = 'Quantity cannot be negative'
    return false
  }

  return true
}

const handleSubmit = async () => {
  if (!validateForm()) {
    return
  }

  if (newQty.value === props.item.qty_grams) {
    closeModal()
    return
  }

  isUpdating.value = true
  try {
    await inventoryService.updateIngredient(
      props.inventoryId,
      props.item.ingredient_id,
      newQty.value
    )
    emit('updated')
    closeModal()
  } catch (err) {
    generalError.value =
      err instanceof Error ? err.message : 'Failed to update quantity. Please try again.'
    console.error('Error updating quantity:', err)
  } finally {
    isUpdating.value = false
  }
}

const handleRemove = async () => {
  if (!confirm(`Remove ${props.item.ingredient_name} from inventory?`)) {
    return
  }

  isRemoving.value = true
  try {
    await inventoryService.removeIngredient(props.inventoryId, props.item.ingredient_id)
    emit('removed')
    closeModal()
  } catch (err) {
    generalError.value =
      err instanceof Error ? err.message : 'Failed to remove ingredient. Please try again.'
    console.error('Error removing ingredient:', err)
  } finally {
    isRemoving.value = false
  }
}

const closeModal = () => {
  emit('close')
}
</script>

