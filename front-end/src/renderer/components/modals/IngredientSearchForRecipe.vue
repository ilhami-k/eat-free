<template>
  <div class="fixed inset-0 z-[60] flex items-center justify-center bg-black/50">
    <div class="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
      <!-- Header -->
      <div class="mb-4 flex items-center justify-between">
        <h2 class="text-h2 font-display text-neutral-900">Add Ingredient</h2>
        <button
          @click="closeDialog"
          class="text-neutral-500 hover:text-neutral-700"
          aria-label="Close search"
        >
          <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Search Input -->
      <div class="mb-4">
        <Input
          v-model="searchQuery"
          placeholder="Search ingredients..."
          label="Ingredient Name"
          @keyup.enter="handleSearch"
          @focus="handleSearch"
        />
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="flex justify-center py-8">
        <div class="h-8 w-8 animate-spin rounded-full border-4 border-fresh-green/20 border-t-fresh-green"></div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="rounded-lg bg-strawberry-red/10 p-4">
        <p class="text-sm text-strawberry-red">{{ error.message }}</p>
      </div>

      <!-- Results List -->
      <div v-else class="max-h-80 overflow-y-auto space-y-2">
        <div v-if="filteredIngredients.length === 0" class="py-8 text-center">
          <p class="text-neutral-500">No ingredients found</p>
        </div>

        <div
          v-for="ingredient in filteredIngredients"
          :key="`ingredient-${ingredient.id}`"
          class="rounded-lg border border-neutral-200 p-3"
        >
          <button
            @click="selectIngredient(ingredient)"
            class="w-full text-left transition-all hover:bg-fresh-green/5"
          >
            <p class="font-medium text-neutral-900">{{ ingredient.name }}</p>
            <p class="text-xs text-neutral-500">
              {{ ingredient.kcal_per_100g }} kcal per 100g
            </p>
          </button>
          <!-- Quantity Input -->
          <div class="mt-2 flex gap-2">
            <Input
              :modelValue="quantities[String(ingredient.id)] || '100'"
              @update:modelValue="quantities[String(ingredient.id)] = $event"
              label="Grams"
              type="number"
              size="sm"
              placeholder="100"
              min="0"
            />
            <Button
              size="sm"
              @click="addWithQuantity(ingredient, quantities[String(ingredient.id)] || '100')"
            >
              Add
            </Button>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="mt-4 flex gap-2">
        <Button variant="ghost" fullWidth @click="closeDialog">
          Cancel
        </Button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import type Ingredient from '@/shared/ingredient'
import { useIngredientsService } from '@/renderer/composables/useIngredientsService'
import Input from '@/renderer/components/ui/Input.vue'
import Button from '@/renderer/components/ui/Button.vue'

interface Emits {
  (e: 'close'): void
  (e: 'selected', ingredient: Ingredient & { qty_grams?: number }): void
}

defineProps<{}>()
const emit = defineEmits<Emits>()

const ingredientService = useIngredientsService(window.electronService?.ingredients)
const searchQuery = ref('')
const quantities = ref<Record<string, string>>({})

const isLoading = computed(() => ingredientService.isLoading.value)
const error = computed(() => ingredientService.error.value)
const filteredIngredients = computed(() => ingredientService.ingredients.value)

onMounted(async () => {
  await ingredientService.fetchIngredients()
})

watch(searchQuery, async (query) => {
  await ingredientService.searchIngredients(query)
})

const handleSearch = async () => {
  await ingredientService.searchIngredients(searchQuery.value)
}

const selectIngredient = (ingredient: Ingredient) => {
  const qty = parseFloat(quantities.value[String(ingredient.id)] || '100')
  emit('selected', { ...ingredient, qty_grams: qty })
  closeDialog()
}

const addWithQuantity = (ingredient: Ingredient, qtyStr: string) => {
  const qty = parseFloat(qtyStr) || 100
  emit('selected', { ...ingredient, qty_grams: qty })
  closeDialog()
}

const closeDialog = () => {
  searchQuery.value = ''
  ingredientService.clearError()
  emit('close')
}
</script>
