<template>
  <div class="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4">
    <div class="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
      <!-- Header -->
      <div class="mb-6 flex items-center justify-between">
        <h2 class="text-xl font-semibold text-neutral-900">Add Ingredient</h2>
        <button
          @click="closeDialog"
          class="text-neutral-400 hover:text-neutral-600 transition-colors"
          aria-label="Close"
        >
          <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Step 1: Search and Select Ingredient -->
      <div v-if="!selectedIngredient">
        <!-- Search Input -->
        <div class="mb-4">
          <Input
            v-model="searchQuery"
            placeholder="Type to search ingredients..."
            label="Ingredient Name"
            autofocus
          />
        </div>

        <!-- Empty State (before search) -->
        <div v-if="!searchQuery.trim() && !hasSearched" class="py-12 text-center">
          <p class="text-sm text-neutral-500">Start typing to search for ingredients</p>
        </div>

        <!-- Loading State -->
        <div v-else-if="isLoading" class="flex justify-center py-12">
          <div class="h-8 w-8 animate-spin rounded-full border-4 border-fresh-green/20 border-t-fresh-green"></div>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="rounded-lg bg-strawberry-red/10 p-4">
          <p class="text-sm text-strawberry-red">{{ error.message }}</p>
        </div>

        <!-- Results List -->
        <div v-else-if="searchQuery.trim()" class="max-h-64 overflow-y-auto space-y-2">
          <div v-if="filteredIngredients.length === 0" class="py-12 text-center">
            <p class="text-sm text-neutral-500">No ingredients found</p>
          </div>

          <button
            v-for="ingredient in filteredIngredients"
            :key="`ingredient-${ingredient.id}`"
            @click="selectIngredientForDetails(ingredient)"
            class="w-full rounded-lg border border-neutral-200 p-3 text-left transition-all hover:bg-fresh-green/5 hover:border-fresh-green"
          >
            <p class="font-medium text-neutral-900">{{ ingredient.name }}</p>
            <p class="text-xs text-neutral-500">
              {{ ingredient.kcal_per_100g }} kcal per 100g
            </p>
          </button>
        </div>

        <!-- Footer -->
        <div class="mt-6">
          <Button variant="secondary" fullWidth @click="closeDialog">
            Cancel
          </Button>
        </div>
      </div>

      <!-- Step 2: Enter Details -->
      <form v-else @submit.prevent="handleSubmit" class="space-y-4">
        <!-- Selected Ingredient Display -->
        <div class="rounded-lg bg-neutral-50 p-3 mb-4">
          <p class="font-medium text-neutral-900">{{ selectedIngredient.name }}</p>
          <p class="text-xs text-neutral-500">{{ selectedIngredient.kcal_per_100g }} kcal per 100g</p>
        </div>

        <!-- Quantity Input -->
        <Input
          v-model="form.quantity"
          label="Quantity (grams)"
          type="number"
          placeholder="100"
          min="1"
          step="1"
          required
        />

        <!-- Actions -->
        <div class="flex gap-3 justify-end pt-2">
          <Button variant="ghost" @click="resetSelection">
            Back
          </Button>
          <Button type="submit">
            Add Ingredient
          </Button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type Ingredient from '@/shared/ingredient'
import { useIngredientsService } from '@/renderer/composables/useIngredientsService'
import Input from '@/renderer/components/ui/Input.vue'
import Button from '@/renderer/components/ui/Button.vue'

interface Emits {
  (e: 'close'): void
  (e: 'selected', ingredient: Ingredient): void
}

defineProps<{}>()
const emit = defineEmits<Emits>()

const ingredientService = useIngredientsService(window.electronService?.ingredients)
const searchQuery = ref('')
const hasSearched = ref(false)
const selectedIngredient = ref<Ingredient | null>(null)
const form = ref({
  quantity: '100'
})

const isLoading = computed(() => ingredientService.isLoading.value)
const error = computed(() => ingredientService.error.value)
const filteredIngredients = computed(() => ingredientService.ingredients.value)

watch(searchQuery, async (query) => {
  if (query.trim()) {
    hasSearched.value = true
    await ingredientService.searchIngredients(query)
  } else {
    hasSearched.value = false
  }
})

const selectIngredientForDetails = (ingredient: Ingredient) => {
  selectedIngredient.value = ingredient
}

const resetSelection = () => {
  selectedIngredient.value = null
  form.value.quantity = '100'
}

const handleSubmit = () => {
  if (selectedIngredient.value) {
    emit('selected', selectedIngredient.value)
    closeDialog()
  }
}

const closeDialog = () => {
  searchQuery.value = ''
  hasSearched.value = false
  selectedIngredient.value = null
  form.value.quantity = '100'
  ingredientService.clearError()
  emit('close')
}
</script>
