<template>
  <div class="inventory-page">
    <!-- Header -->
    <InventoryHeader :count="filteredIngredients.length" />

    <!-- Toolbar -->
    <InventoryToolbar
      v-model:search-query="searchQuery"
      v-model:selected-category="selectedCategory"
      :low-stock-count="insufficientIngredients.length"
      :missing-count="missingIngredients.length"
      :total-needed="summary.totalIngredientsNeeded"
    />

    <!-- Main Content -->
    <div class="content-wrapper">
      <!-- Loading State -->
      <InventoryEmptyState
        v-if="isLoading"
        state="loading"
      />

      <!-- Error State -->
      <InventoryEmptyState
        v-else-if="error"
        state="error"
        :error-message="error.message"
        @retry="retryLoad"
      />

      <!-- Missing Ingredients View -->
      <InventoryMissingView
        v-else-if="selectedCategory === 'missing' && missingIngredients.length > 0"
        :missing-ingredients="missingIngredients"
        @add="addMissingIngredient"
      />

      <!-- Missing Category - No Missing Items -->
      <InventoryEmptyState
        v-else-if="selectedCategory === 'missing' && missingIngredients.length === 0"
        state="success"
      />

      <!-- Empty State -->
      <InventoryEmptyState
        v-else-if="filteredIngredients.length === 0"
        state="empty"
        :empty-message="getEmptyMessage"
        :empty-action-text="'Add Your First Ingredient'"
        @add="toggleSearchDialog"
      />

      <!-- Ingredients Grid -->
      <InventoryGrid v-else>
        <InventoryCard
          v-for="ingredient in filteredIngredients"
          :key="`${ingredient.inventory_id}-${ingredient.ingredient_id}`"
          :ingredient="ingredient"
          @click="selectIngredient(ingredient)"
        />
      </InventoryGrid>
    </div>

    <!-- Floating Action Button -->
    <button @click="toggleSearchDialog" class="fab">
      <svg class="fab-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4" />
      </svg>
    </button>

    <!-- Search Dialog Modal -->
    <SearchDialog
      v-if="showSearchDialog"
      :isOpen="showSearchDialog"
      @close="showSearchDialog = false"
      @selected="handleIngredientSelected"
    />

    <!-- Ingredient Detail Modal -->
    <InventoryItemDetail
      v-if="selectedItem && inventory"
      :item="selectedItem"
      :inventory-id="inventory.id"
      @close="selectedItem = null"
      @updated="handleItemUpdated"
      @removed="handleItemRemoved"
    />

    <!-- Add Ingredient Quantity Dialog -->
    <AddIngredientQuantityDialog
      v-if="showQuantityDialog && pendingIngredient"
      :is-open="showQuantityDialog"
      :ingredient-name="pendingIngredient.name"
      @close="showQuantityDialog = false; pendingIngredient = null"
      @confirm="handleQuantityConfirmed"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useInventoryService } from '@/renderer/composables/useInventoryService'
import { useMealPlanService } from '@/renderer/composables/useMealPlanService'
import { useRecipeService } from '@/renderer/composables/useRecipeService'
import { useMealPlanInventoryCheck } from '@/renderer/composables/useMealPlanInventoryCheck'
import type Ingredient from '@/shared/ingredient'
import type { InventoryIngredientWithDetails } from '@/renderer/composables/useInventoryService'
import type { MealPlanRecipe } from '@/shared/mealPlan'
import type { RecipeWithIngredients } from '@/renderer/composables/useRecipeService'
import SearchDialog from '../components/SearchDialog.vue'
import InventoryItemDetail from '../components/modals/InventoryItemDetail.vue'
import InventoryHeader from '../components/inventory/InventoryHeader.vue'
import InventoryToolbar from '../components/inventory/InventoryToolbar.vue'
import InventoryCard from '../components/inventory/InventoryCard.vue'
import InventoryGrid from '../components/inventory/InventoryGrid.vue'
import InventoryEmptyState from '../components/inventory/InventoryEmptyState.vue'
import InventoryMissingView from '../components/inventory/InventoryMissingView.vue'
import AddIngredientQuantityDialog from '../components/modals/AddIngredientQuantityDialog.vue'

const props = defineProps<{
  currentUserId: number
}>()

const inventoryService = useInventoryService(window.electronService?.inventory)
const mealPlanService = useMealPlanService(window.electronService?.mealPlans)
const recipeService = useRecipeService(window.electronService?.recipes)

const searchQuery = ref('')
const selectedCategory = ref<'all' | 'low-stock' | 'missing'>('all')
const showSearchDialog = ref(false)
const selectedItem = ref<InventoryIngredientWithDetails | null>(null)
const showQuantityDialog = ref(false)
const pendingIngredient = ref<Ingredient | null>(null)

const isLoading = computed(() => inventoryService.isLoading.value)
const error = computed(() => inventoryService.error.value)
const inventory = computed(() => inventoryService.inventory.value)
const ingredients = computed(() => inventoryService.inventoryIngredients.value)

const currentWeekStart = computed(() => {
  const today = new Date()
  const dayOfWeek = today.getUTCDay()
  const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1
  const monday = new Date(today)
  monday.setUTCDate(monday.getUTCDate() - daysToMonday)
  monday.setUTCHours(0, 0, 0, 0)
  return monday
})

const mealPlanRecipes = computed(() => {
  const recipes = mealPlanService.currentMealPlan.value?.meal_plan_recipe as MealPlanRecipe[] || []
  return recipes
})

const recipes = computed(() => recipeService.recipes.value as RecipeWithIngredients[])

const {
  inventoryWithStatus,
  missingIngredients,
  insufficientIngredients,
  summary
} = useMealPlanInventoryCheck(mealPlanRecipes, ingredients, recipes)

const filteredIngredients = computed(() => {
  const baseFiltered = inventoryService.searchIngredients(searchQuery.value)

  let categoryFiltered = baseFiltered
  if (selectedCategory.value === 'low-stock') {
    categoryFiltered = baseFiltered.filter(item => {
      const status = inventoryWithStatus.value.find(
        s => s.ingredient.ingredient_id === item.ingredient_id
      )
      return status?.isNeededForMealPlan && !status.isSufficient
    })
  }

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

const getEmptyMessage = computed(() => {
  if (searchQuery.value) return 'No ingredients match your search'
  if (selectedCategory.value === 'low-stock') return 'No low stock items'
  return 'Your inventory is empty'
})

onMounted(async () => {
  await inventoryService.getOrCreateInventory(props.currentUserId)

  let mealPlan = await mealPlanService.getMealPlanForWeek(props.currentUserId, currentWeekStart.value)
  if (!mealPlan) {
    mealPlan = await mealPlanService.createMealPlan(props.currentUserId, currentWeekStart.value)
  }

  await recipeService.fetchRecipes()
})

watch(
  () => props.currentUserId,
  async (newUserId) => {
    if (newUserId) {
      await inventoryService.getOrCreateInventory(newUserId)
    }
  }
)

const toggleSearchDialog = () => {
  showSearchDialog.value = !showSearchDialog.value
}

const handleIngredientSelected = async (ingredient: Ingredient) => {
  if (!inventory.value) return

  const ingredientIdBig = ingredient.id

  const existing = ingredients.value.find(i => i.ingredient_id === ingredientIdBig)
  if (existing) {
    selectedItem.value = existing
    return
  }

  pendingIngredient.value = ingredient
  showQuantityDialog.value = true
}

const handleQuantityConfirmed = async (quantity: number) => {
  if (!inventory.value || !pendingIngredient.value) return

  const ingredientIdBig = pendingIngredient.value.id

  await inventoryService.addIngredient(inventory.value.id, ingredientIdBig, quantity)

  const newIngredient = ingredients.value.find(i => i.ingredient_id === ingredientIdBig)
  if (newIngredient) {
    selectedItem.value = newIngredient
  }

  pendingIngredient.value = null
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

  await inventoryService.addIngredient(
    inventory.value.id,
    missing.ingredient_id,
    Math.ceil(missing.required_grams)
  )

  const newIngredient = ingredients.value.find(i => (i.ingredient_id) === missing.ingredient_id)
  if (newIngredient) {
    selectedItem.value = newIngredient
  }
}
</script>

<style scoped>
.inventory-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f8faf9 0%, #f1f5f3 100%);
  padding-top: 5rem;
  padding-bottom: 5rem;
}

.content-wrapper {
  max-width: 1400px;
  margin: 0 auto;
  padding: 1.5rem 1rem;
}

.fab {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  width: 3.5rem;
  height: 3.5rem;
  background: linear-gradient(135deg, var(--color-fresh-green) 0%, #6bc785 100%);
  color: white;
  border: none;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 6px 20px rgba(120, 224, 143, 0.4);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 50;
}

.fab:hover {
  transform: scale(1.1) rotate(90deg);
  box-shadow: 0 8px 28px rgba(120, 224, 143, 0.5);
}

.fab:active {
  transform: scale(1.05) rotate(90deg);
}

.fab-icon {
  width: 1.5rem;
  height: 1.5rem;
}

@media (max-width: 639px) {
  .fab {
    bottom: 1.5rem;
    right: 1.5rem;
    width: 3rem;
    height: 3rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  .fab:hover {
    transform: scale(1.05);
  }
}
</style>
