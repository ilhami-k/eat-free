<template>
  <div v-if="isOpen" class="fixed inset-0 z-40 flex items-center justify-center bg-black/50">
    <div class="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
      <!-- Header -->
      <div class="mb-4 flex items-center justify-between">
        <h2 class="text-h2 font-display text-neutral-900">Search Ingredients</h2>
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

        <button
          v-for="ingredient in filteredIngredients"
          :key="`ingredient-${ingredient.id}`"
          @click="selectIngredient(ingredient)"
          class="w-full rounded-lg px-4 py-3 text-left transition-colors hover:bg-fresh-green/10 focus:bg-fresh-green/20 focus:outline-none"
        >
          <p class="font-medium text-neutral-900">{{ ingredient.name }}</p>
          <p class="text-xs text-neutral-500">
            {{ ingredient.kcal_per_100g }} kcal per 100g
          </p>
        </button>
      </div>

      <!-- Divider -->
      <div class="my-4 border-t border-neutral-200"></div>

      <!-- Create New Ingredient -->
      <div class="mb-4">
        <p class="mb-2 text-sm font-medium text-neutral-700">Or create a new ingredient</p>
        <Button variant="secondary" fullWidth @click="showCreateForm">
          + Add Custom Ingredient
        </Button>
      </div>

      <!-- Footer Actions -->
      <div class="flex gap-2">
        <Button variant="ghost" fullWidth @click="closeDialog"> Cancel </Button>
      </div>
    </div>

    <!-- Create Ingredient Modal (nested) -->
    <CreateIngredientModal
      v-if="showCreate"
      @close="showCreate = false"
      @created="handleIngredientCreated"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import type Ingredient from '@/shared/ingredient'
import { useIngredientsService } from '@/renderer/composables/useIngredientsService'
import Input from './ui/Input.vue'
import Button from './ui/Button.vue'
import CreateIngredientModal from '@/renderer/components/modals/CreateIngredientModal.vue'

interface Props {
  isOpen: boolean
}

interface Emits {
  (e: 'close'): void
  (e: 'selected', ingredient: Ingredient): void
}

defineProps<Props>()
const emit = defineEmits<Emits>()

const ingredientService = useIngredientsService(window.electronService?.ingredients)
const searchQuery = ref('')
const showCreate = ref(false)

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
  emit('selected', ingredient)
  closeDialog()
}

const showCreateForm = () => {
  showCreate.value = true
}

const handleIngredientCreated = async (ingredient: Ingredient) => {
  showCreate.value = false
  selectIngredient(ingredient)
}

const closeDialog = () => {
  searchQuery.value = ''
  ingredientService.clearError()
  emit('close')
}
</script>
