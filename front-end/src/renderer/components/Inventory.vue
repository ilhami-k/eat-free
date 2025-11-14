<template>
  <SidebarLayout
    title="My Inventory"
    sidebar-title="Categories"
    drawer-title="Ingredient Details"
    :is-drawer-open="!!selectedItem"
    @update:is-drawer-open="selectedItem = null"
    @fab-click="openSearchDialog"
    fab-label="Add Ingredient"
  >
    <!-- Topbar with Search -->
    <template #topbar>
      <Input
        v-model="searchQuery"
        placeholder="Search ingredients..."
        class="flex-1 min-w-0"
      />
    </template>

    <!-- Sidebar - Categories (Placeholder) -->
    <template #sidebar>
      <nav class="space-y-1">
        <button
          class="w-full text-left px-3 py-2 rounded-md font-medium text-neutral-900 
                 bg-fresh-green/10 text-fresh-green transition-colors"
        >
          All Items
        </button>
        <button
          class="w-full text-left px-3 py-2 rounded-md text-neutral-600 
                 hover:bg-neutral-100 transition-colors"
        >
          Low Stock
        </button>
        <button
          class="w-full text-left px-3 py-2 rounded-md text-neutral-600 
                 hover:bg-neutral-100 transition-colors"
        >
          Recently Added
        </button>
      </nav>
    </template>

    <!-- Main Content - Grid of Ingredients -->
    <!-- Loading State -->
    <div v-if="isLoading" class="flex justify-center py-16">
      <div class="h-10 w-10 animate-spin rounded-full border-4 border-fresh-green/20 border-t-fresh-green"></div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="rounded-lg bg-red-50 p-6 border border-red-200">
      <h3 class="font-semibold text-red-900 mb-2">Error Loading Inventory</h3>
      <p class="text-sm text-red-700 mb-4">{{ error.message }}</p>
      <Button variant="secondary" size="sm" @click="retryLoad">
        Try Again
      </Button>
    </div>

    <!-- Empty State -->
    <div v-else-if="filteredIngredients.length === 0" class="flex flex-col items-center justify-center py-16">
      <div class="text-center">
        <svg class="w-16 h-16 text-neutral-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
        </svg>
        <p class="text-neutral-600 mb-4">
          {{ searchQuery ? 'No ingredients match your search' : 'Your inventory is empty' }}
        </p>
        <Button @click="openSearchDialog">
          Add Your First Ingredient
        </Button>
      </div>
    </div>

    <!-- Responsive Grid -->
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <button
        v-for="ingredient in filteredIngredients"
        :key="`${ingredient.inventory_id}-${ingredient.ingredient_id}`"
        @click="selectIngredient(ingredient)"
        class="rounded-2xl border border-neutral-200 bg-white p-4 
               text-left transition-all duration-200
               hover:shadow-md hover:border-fresh-green hover:-translate-y-0.5
               focus:outline-none focus:ring-2 focus:ring-fresh-green/50
               group"
      >
        <!-- Card Content -->
        <div class="flex flex-col">
          <!-- Header -->
          <h3 class="font-semibold text-neutral-900 truncate group-hover:text-fresh-green transition-colors">
            {{ ingredient.ingredient_name }}
          </h3>

          <!-- Quantity -->
          <div class="mt-2 flex items-baseline gap-1">
            <span class="text-2xl font-bold text-fresh-green">{{ ingredient.qty_grams }}</span>
            <span class="text-xs text-neutral-600">g in stock</span>
          </div>

          <!-- Footer with metadata -->
          <div class="mt-4 pt-3 border-t border-neutral-200 flex justify-between items-center">
            <span class="text-xs text-neutral-500">View details</span>
            <span class="text-xs font-medium text-fresh-green opacity-0 group-hover:opacity-100 transition-opacity">→</span>
          </div>
        </div>
      </button>
    </div>

    <!-- Drawer - Ingredient Details -->
    <template #drawer-content>
      <InventoryItemDetail
        v-if="selectedItem"
        :item="selectedItem"
        :inventoryId="inventory?.id || BigInt(0)"
        @close="selectedItem = null"
        @updated="handleItemUpdated"
        @removed="handleItemRemoved"
      />
    </template>
  </SidebarLayout>

  <!-- Search Dialog -->
  <SearchDialog
    :isOpen="showSearchDialog"
    @close="showSearchDialog = false"
    @selected="handleIngredientSelected"
  />
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import type Ingredient from '@/shared/ingredient'
import { useInventoryService, type InventoryIngredientWithDetails } from '../composables/useInventoryService'
import SidebarLayout from './layout/SidebarLayout.vue'
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

  const ingredientIdBig = BigInt(ingredient.id)

  // Check if ingredient already in inventory
  const existing = ingredients.value.find(i => i.ingredient_id === ingredientIdBig)
  if (existing) {
    selectedItem.value = existing
    return
  }

  // Add new ingredient with default 100g
  await inventoryService.addIngredient(inventory.value.id, ingredientIdBig, 100 as any)
  
  // Find and select the newly added ingredient
  const newIngredient = ingredients.value.find(i => i.ingredient_id === ingredientIdBig)
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
