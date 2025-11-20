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
      
      <!-- Meal Plan Summary -->
      <button 
        v-if="summary.totalIngredientsNeeded > 0" 
        @click="selectedCategory = missingIngredients.length > 0 ? 'missing' : 'low-stock'"
        class="flex items-center gap-2 px-4 py-2 bg-neutral-100 rounded-lg text-sm hover:bg-neutral-200 transition-colors cursor-pointer"
      >
        <svg class="w-4 h-4 text-fresh-green" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
          <path fill-rule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clip-rule="evenodd" />
        </svg>
        <span class="font-medium text-neutral-700">This Week:</span>
        <span v-if="missingIngredients.length > 0" class="px-2 py-0.5 bg-red-100 text-red-800 rounded-full font-semibold">
          {{ missingIngredients.length }} missing
        </span>
        <span v-if="insufficientIngredients.length > 0" class="px-2 py-0.5 bg-orange-100 text-orange-800 rounded-full font-semibold">
          {{ insufficientIngredients.length }} low
        </span>
        <span v-if="summary.hasAllIngredients" class="px-2 py-0.5 bg-fresh-green/20 text-fresh-green rounded-full font-semibold">
          ✓ All set
        </span>
      </button>
    </template>

    <!-- Sidebar - Categories -->
    <template #sidebar>
      <nav class="space-y-1">
        <button
          @click="selectedCategory = 'all'"
          :class="[
            'w-full text-left px-3 py-2 rounded-md font-medium transition-colors',
            selectedCategory === 'all'
              ? 'bg-fresh-green/10 text-fresh-green'
              : 'text-neutral-600 hover:bg-neutral-100'
          ]"
        >
          All Items
        </button>
        <button
          @click="selectedCategory = 'low-stock'"
          :class="[
            'w-full text-left px-3 py-2 rounded-md font-medium transition-colors',
            selectedCategory === 'low-stock'
              ? 'bg-fresh-green/10 text-fresh-green'
              : 'text-neutral-600 hover:bg-neutral-100'
          ]"
        >
          <div class="flex items-center justify-between">
            <span>Low Stock</span>
            <span v-if="insufficientIngredients.length > 0" 
                  class="px-2 py-0.5 bg-orange-500 text-white text-xs rounded-full font-semibold">
              {{ insufficientIngredients.length }}
            </span>
          </div>
        </button>
        <button
          @click="selectedCategory = 'missing'"
          :class="[
            'w-full text-left px-3 py-2 rounded-md font-medium transition-colors',
            selectedCategory === 'missing'
              ? 'bg-fresh-green/10 text-fresh-green'
              : 'text-neutral-600 hover:bg-neutral-100'
          ]"
        >
          <div class="flex items-center justify-between">
            <span>Missing</span>
            <span v-if="missingIngredients.length > 0" 
                  class="px-2 py-0.5 bg-red-500 text-white text-xs rounded-full font-semibold">
              {{ missingIngredients.length }}
            </span>
          </div>
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
    <div v-else-if="filteredIngredients.length === 0 && selectedCategory !== 'missing'" class="flex flex-col items-center justify-center py-16">
      <div class="text-center">
        <svg class="w-16 h-16 text-neutral-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
        </svg>
        <p class="text-neutral-600 mb-4">
          {{ searchQuery ? 'No ingredients match your search' : 
             selectedCategory === 'low-stock' ? 'No low stock items' : 'Your inventory is empty' }}
        </p>
        <Button @click="openSearchDialog">
          Add Your First Ingredient
        </Button>
      </div>
    </div>

    <!-- Missing Ingredients Section (only shown in 'missing' category) -->
    <div v-if="selectedCategory === 'missing'">
      <div v-if="missingIngredients.length === 0" class="flex flex-col items-center justify-center py-16">
        <div class="text-center">
          <svg class="w-16 h-16 text-fresh-green mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p class="text-lg font-semibold text-neutral-900 mb-2">All Set!</p>
          <p class="text-neutral-600">You have all ingredients needed for your meal plan.</p>
        </div>
      </div>

      <div v-else class="space-y-4">
        <div class="rounded-xl border-2 border-red-400 bg-red-50 p-6 shadow-lg">
          <div class="flex items-start gap-4">
            <div class="flex-shrink-0">
              <svg class="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
              </svg>
            </div>
            <div class="flex-1">
              <h3 class="font-bold text-red-900 text-lg mb-2">
                {{ missingIngredients.length }} Missing Ingredient{{ missingIngredients.length !== 1 ? 's' : '' }} for Meal Plan
              </h3>
              <p class="text-sm text-red-800 mb-4">
                These ingredients are needed for your weekly meal plan but are not in your inventory yet.
              </p>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div 
            v-for="missing in missingIngredients" 
            :key="missing.ingredient_id"
            class="flex flex-col bg-white rounded-xl border-2 border-red-300 p-4 shadow-md"
          >
            <div class="flex-1 mb-4">
              <h4 class="font-bold text-neutral-900 text-lg mb-1">{{ missing.ingredient_name }}</h4>
              <p class="text-sm text-neutral-600">Need {{ Math.round(missing.required_grams) }}g total</p>
            </div>
            <Button 
              variant="primary" 
              size="sm"
              :fullWidth="true"
              @click="addMissingIngredient(missing)"
            >
              Add to Inventory
            </Button>
          </div>
        </div>
      </div>
    </div>

    <!-- Responsive Grid (for 'all' and 'low-stock' categories) -->
    <div v-else-if="!isLoading && filteredIngredients.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <button
        v-for="ingredient in filteredIngredients"
        :key="`${ingredient.inventory_id}-${ingredient.ingredient_id}`"
        @click="selectIngredient(ingredient)"
        :class="[
          'rounded-2xl border bg-white p-4',
          'text-left transition-all duration-200',
          'hover:shadow-md hover:-translate-y-0.5',
          'focus:outline-none focus:ring-2 focus:ring-fresh-green/50',
          'group relative',
          ingredient.mealPlanStatus?.isNeededForMealPlan && !ingredient.mealPlanStatus.isSufficient
            ? 'border-2 border-orange-500 shadow-orange-100 shadow-lg'
            : ingredient.mealPlanStatus?.isNeededForMealPlan
            ? 'border-2 border-fresh-green shadow-fresh-green/20 shadow-lg'
            : 'border-neutral-200'
        ]"
      >
        <!-- Card Content -->
        <div class="flex flex-col">
          <!-- Header with Badge -->
          <div class="flex items-start justify-between gap-2 mb-3">
            <h3 class="font-semibold text-neutral-900 group-hover:text-fresh-green transition-colors flex-1">
              {{ ingredient.ingredient_name }}
            </h3>
            
            <!-- Meal Plan Badge -->
            <div v-if="ingredient.mealPlanStatus?.isNeededForMealPlan" class="flex-shrink-0">
              <div v-if="!ingredient.mealPlanStatus.isSufficient" 
                   class="flex items-center gap-1.5 bg-orange-500 text-white text-xs font-bold px-2.5 py-1.5 rounded-lg shadow-md"
                   title="Insufficient stock for meal plan">
                <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                </svg>
                <span>Need {{ Math.round(ingredient.mealPlanStatus.shortfall_grams) }}g</span>
              </div>
              <div v-else 
                   class="flex items-center gap-1.5 bg-fresh-green text-white text-xs font-bold px-2.5 py-1.5 rounded-lg shadow-md"
                   title="Sufficient stock for meal plan">
                <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                </svg>
                <span>Ready</span>
              </div>
            </div>
          </div>

          <!-- Quantity with progress indicator -->
          <div class="mb-3">
            <div class="flex items-baseline gap-1.5 mb-2">
              <span class="text-3xl font-bold text-fresh-green">{{ ingredient.qty_grams }}</span>
              <span class="text-sm text-neutral-600">g in stock</span>
            </div>
            
            <!-- Progress bar for meal plan items -->
            <div v-if="ingredient.mealPlanStatus?.isNeededForMealPlan" class="space-y-1">
              <div class="flex justify-between text-xs text-neutral-600">
                <span>Need: {{ Math.round(ingredient.mealPlanStatus.required_grams) }}g</span>
                <span v-if="ingredient.mealPlanStatus.isSufficient" class="text-fresh-green font-semibold">
                  +{{ Math.round(ingredient.qty_grams - ingredient.mealPlanStatus.required_grams) }}g extra
                </span>
              </div>
              <div class="w-full bg-neutral-200 rounded-full h-2 overflow-hidden">
                <div 
                  :class="[
                    'h-full rounded-full transition-all duration-300',
                    ingredient.mealPlanStatus.isSufficient ? 'bg-fresh-green' : 'bg-orange-500'
                  ]"
                  :style="{ 
                    width: `${Math.min(100, (ingredient.qty_grams / ingredient.mealPlanStatus.required_grams) * 100)}%` 
                  }"
                ></div>
              </div>
            </div>
          </div>

          <!-- Footer -->
          <div class="pt-3 border-t border-neutral-200 flex justify-between items-center">
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
        :inventoryId="inventory?.id ? BigInt(inventory.id) : BigInt(0)"
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
import type { MealPlanRecipe } from '@/shared/mealPlan'
import { useInventoryService, type InventoryIngredientWithDetails } from '../composables/useInventoryService'
import { useMealPlanService } from '../composables/useMealPlanService'
import { useRecipeService, type RecipeWithIngredients } from '../composables/useRecipeService'
import { useMealPlanInventoryCheck } from '../composables/useMealPlanInventoryCheck'
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
const mealPlanService = useMealPlanService(window.electronService?.mealPlans)
const recipeService = useRecipeService(window.electronService?.recipes)

const searchQuery = ref('')
const showSearchDialog = ref(false)
const selectedItem = ref<InventoryIngredientWithDetails | null>(null)
const selectedCategory = ref<'all' | 'low-stock' | 'missing'>('all')

const isLoading = computed(() => inventoryService.isLoading.value)
const error = computed(() => inventoryService.error.value)
const inventory = computed(() => inventoryService.inventory.value)
const ingredients = computed(() => inventoryService.inventoryIngredients.value)

// Meal plan data for current week
const currentWeekStart = computed(() => {
  const today = new Date()
  const dayOfWeek = today.getDay()
  const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1
  const monday = new Date(today)
  monday.setDate(monday.getDate() - daysToMonday)
  monday.setHours(0, 0, 0, 0)
  return monday
})

const mealPlanRecipes = ref<MealPlanRecipe[]>(
  (mealPlanService.currentMealPlan.value?.meal_plan_recipe as MealPlanRecipe[]) || []
)

const recipes = computed(() => recipeService.recipes.value as RecipeWithIngredients[])

// Watch for changes in meal plan and update the ref
watch(
  () => mealPlanService.currentMealPlan.value?.meal_plan_recipe,
  (newRecipes) => {
    if (newRecipes) {
      mealPlanRecipes.value = [...newRecipes] as MealPlanRecipe[]
    }
  },
  { deep: true }
)

// Use the meal plan inventory check composable
const {
  inventoryWithStatus,
  missingIngredients,
  insufficientIngredients,
  summary
} = useMealPlanInventoryCheck(mealPlanRecipes, ingredients, recipes)

const filteredIngredients = computed(() => {
  const baseFiltered = inventoryService.searchIngredients(searchQuery.value)
  
  // Filter by category
  let categoryFiltered = baseFiltered
  if (selectedCategory.value === 'low-stock') {
    categoryFiltered = baseFiltered.filter(item => {
      const status = inventoryWithStatus.value.find(
        s => s.ingredient.ingredient_id === item.ingredient_id
      )
      return status?.isNeededForMealPlan && !status.isSufficient
    })
  }
  
  // Enhance with meal plan status for display
  return categoryFiltered.map(item => {
    const status = inventoryWithStatus.value.find(
      s => s.ingredient.ingredient_id === item.ingredient_id
    )
    return {
      ...item,
      mealPlanStatus: status || null
    }
  })
})

onMounted(async () => {
  await inventoryService.getOrCreateInventory(props.currentUserId)
  await mealPlanService.getMealPlanForWeek(props.currentUserId, currentWeekStart.value)
  await recipeService.fetchRecipes()
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
  await inventoryService.addIngredient(BigInt(inventory.value.id), ingredientIdBig, 100)
  
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

const addMissingIngredient = async (missing: typeof missingIngredients.value[0]) => {
  if (!inventory.value) return

  // Add the missing ingredient with the required amount
  await inventoryService.addIngredient(
    BigInt(inventory.value.id), 
    BigInt(missing.ingredient_id), 
    Math.ceil(missing.required_grams)
  )
  
  // Optionally select it to show the detail drawer
  const newIngredient = ingredients.value.find(i => Number(i.ingredient_id) === missing.ingredient_id)
  if (newIngredient) {
    selectedItem.value = newIngredient
  }
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
