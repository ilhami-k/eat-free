<template>
  <div class="space-y-4">
    <!-- Header with Search -->
    <div class="flex items-center justify-between gap-4">
      <h2 class="text-h1 font-display text-neutral-900">My Inventory</h2>
      <Button @click="openSearchDialog" class="whitespace-nowrap">
        + Add Ingredient
      </Button>
    </div>

    <!-- Search Bar -->
    <div>
      <Input
        v-model="searchQuery"
        placeholder="Search your inventory..."
        label="Search"
      />
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="flex justify-center py-16">
      <div class="h-10 w-10 animate-spin rounded-full border-4 border-fresh-green/20 border-t-fresh-green"></div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="rounded-lg bg-strawberry-red/10 p-4">
      <p class="text-sm text-strawberry-red">{{ error.message }}</p>
      <Button variant="secondary" size="sm" class="mt-2" @click="retryLoad">
        Try Again
      </Button>
    </div>

    <!-- Empty State -->
    <div v-else-if="filteredIngredients.length === 0" class="rounded-lg bg-neutral-50 p-8 text-center">
      <p class="text-neutral-600">
        {{ searchQuery ? 'No ingredients match your search' : 'Your inventory is empty' }}
      </p>
      <Button variant="secondary" size="sm" class="mt-4" @click="openSearchDialog">
        {{ searchQuery ? 'Clear search' : 'Add your first ingredient' }}
      </Button>
    </div>

    <!-- Ingredients List -->
    <div v-else class="space-y-2">
      <button
        v-for="ingredient in filteredIngredients"
        :key="`${ingredient.inventory_id}-${ingredient.ingredient_id}`"
        @click="selectIngredient(ingredient)"
        class="w-full rounded-lg border border-neutral-200 bg-white p-4 text-left transition-all hover:border-fresh-green hover:bg-fresh-green/5 focus:outline-none focus:ring-2 focus:ring-fresh-green/50"
      >
        <div class="flex items-start justify-between">
          <div class="flex-1">
            <p class="font-medium text-neutral-900">{{ ingredient.ingredient_name }}</p>
            <p class="text-sm text-neutral-600">{{ ingredient.qty_grams }}g in stock</p>
          </div>
        </div>
      </button>
    </div>

    <!-- Search Dialog -->
    <SearchDialog
      :isOpen="showSearchDialog"
      @close="showSearchDialog = false"
      @selected="handleIngredientSelected"
    />

    <!-- Detail Modal -->
    <InventoryItemDetail
      v-if="selectedItem"
      :item="selectedItem"
      :inventoryId="inventory?.id || BigInt(0)"
      @close="selectedItem = null"
      @updated="handleItemUpdated"
      @removed="handleItemRemoved"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import type Ingredient from '@/shared/ingredient'
import { useInventoryService, type InventoryIngredientWithDetails } from '../composables/useInventoryService'
import Input from './ui/Input.vue'
import Button from './ui/Button.vue'
import SearchDialog from './SearchDialog.vue'
import InventoryItemDetail from '@/renderer/components/modals/InventoryItemDetail.vue'

interface Props {
  currentUserId: bigint
}

const props = defineProps<Props>()

const inventoryService = useInventoryService(window.electronService?.inventory)
const searchQuery = ref('')
const showSearchDialog = ref(false)
const selectedItem = ref<InventoryIngredientWithDetails | null>(null)

const isLoading = computed(() => inventoryService.isLoading.value)
const error = computed(() => inventoryService.error.value)
const inventory = computed(() => inventoryService.inventory.value)
const ingredients = computed(() => inventoryService.inventoryIngredients.value)

const filteredIngredients = computed(() => {
  return inventoryService.searchIngredients(searchQuery.value)
})

onMounted(async () => {
  await inventoryService.getOrCreateInventory(props.currentUserId)
})

const openSearchDialog = () => {
  showSearchDialog.value = true
}

const handleIngredientSelected = async (ingredient: Ingredient) => {
  if (!inventory.value) return

  // Check if ingredient already in inventory
  const existing = ingredients.value.find(i => i.ingredient_id === ingredient.id)
  if (existing) {
    selectedItem.value = existing
    return
  }

  // Add new ingredient with default 100g
  await inventoryService.addIngredient(inventory.value.id, ingredient.id, 100)
  
  // Find and select the newly added ingredient
  const newIngredient = ingredients.value.find(i => i.ingredient_id === ingredient.id)
  if (newIngredient) {
    selectedItem.value = newIngredient
  }
}

const selectIngredient = (ingredient: InventoryIngredientWithDetails) => {
  selectedItem.value = ingredient
}

const handleItemUpdated = async () => {
  selectedItem.value = null
}

const handleItemRemoved = async () => {
  selectedItem.value = null
}

const retryLoad = async () => {
  inventoryService.clearError()
  await inventoryService.getOrCreateInventory(props.currentUserId)
}

watch(
  () => props.currentUserId,
  async (newUserId) => {
    if (newUserId) {
      await inventoryService.getOrCreateInventory(newUserId)
    }
  }
)
</script>
