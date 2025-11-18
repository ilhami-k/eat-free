<template>
  <SidebarLayout
    title="My Recipes"
    sidebar-title="Filters"
    drawer-title="Recipe Details"
    :is-drawer-open="!!selectedItem"
    @update:is-drawer-open="selectedItem = null"
    @fab-click="openCreateDialog"
    fab-label="Create Recipe"
  >
    <!-- Topbar with Search -->
    <template #topbar>
      <Input
        v-model="searchQuery"
        placeholder="Search recipes..."
        class="flex-1 min-w-0"
      />
    </template>

    <!-- Sidebar - Filters -->
    <template #sidebar>
      <nav class="space-y-1">
        <button
          class="w-full text-left px-3 py-2 rounded-md font-medium text-neutral-900 
                 bg-fresh-green/10 text-fresh-green transition-colors"
        >
          All Recipes
        </button>
        <button
          class="w-full text-left px-3 py-2 rounded-md text-neutral-600 
                 hover:bg-neutral-100 transition-colors"
        >
          Recently Created
        </button>
        <button
          class="w-full text-left px-3 py-2 rounded-md text-neutral-600 
                 hover:bg-neutral-100 transition-colors"
        >
          High Protein
        </button>
        <button
          class="w-full text-left px-3 py-2 rounded-md text-neutral-600 
                 hover:bg-neutral-100 transition-colors"
        >
          Low Calorie
        </button>
      </nav>
    </template>

    <!-- Main Content - Grid of Recipes -->
    <!-- Loading State -->
    <div v-if="isLoading" class="flex justify-center py-16">
      <div class="h-10 w-10 animate-spin rounded-full border-4 border-fresh-green/20 border-t-fresh-green"></div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="rounded-lg bg-red-50 p-6 border border-red-200">
      <h3 class="font-semibold text-red-900 mb-2">Error Loading Recipes</h3>
      <p class="text-sm text-red-700 mb-4">{{ error.message }}</p>
      <Button variant="secondary" size="sm" @click="retryLoad">
        Try Again
      </Button>
    </div>

    <!-- Empty State -->
    <div v-else-if="filteredRecipes.length === 0" class="flex flex-col items-center justify-center py-16">
      <div class="text-center">
        <svg class="w-16 h-16 text-neutral-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 6v6m0 0v6m0-6h6m0 0h6m0 0v6m0 0v-6m0 6h-6m0 0h-6m0-6V6m0 0h6m0 0h-6" />
        </svg>
        <p class="text-neutral-600 mb-4">
          {{ searchQuery ? 'No recipes match your search' : 'You have no recipes yet' }}
        </p>
        <Button @click="openCreateDialog">
          Create Your First Recipe
        </Button>
      </div>
    </div>

    <!-- Responsive Grid -->
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <button
        v-for="recipe in filteredRecipes"
        :key="`recipe-${recipe.id}`"
        @click="selectRecipe(recipe as any)"
        class="rounded-lg border border-neutral-200 bg-white overflow-hidden
               text-left transition-all duration-200
               hover:shadow-md hover:border-fresh-green hover:-translate-y-0.5
               focus:outline-none focus:ring-2 focus:ring-fresh-green/50
               group"
      >
        <!-- Recipe Card Content -->
        <div class="p-4 flex flex-col h-full">
          <!-- Header -->
          <h3 class="font-semibold text-neutral-900 truncate mb-2 group-hover:text-fresh-green transition-colors">
            {{ recipe.name }}
          </h3>

          <!-- Servings -->
          <div class="mb-3">
            <span class="inline-block px-2 py-1 rounded bg-neutral-100 text-xs text-neutral-600">
              {{ recipe.servings }} serving<span v-if="recipe.servings !== 1">s</span>
            </span>
          </div>

          <!-- Nutrition Stats -->
          <div class="space-y-2 flex-1">
            <div class="flex items-center gap-2">
              <span class="text-2xl font-bold text-fresh-green">{{ recipe.kcal_per_serving }}</span>
              <span class="text-xs text-neutral-600">kcal/serving</span>
            </div>
            <div class="text-xs text-neutral-600 space-y-1">
              <div class="flex justify-between">
                <span>Protein:</span>
                <span class="font-medium">
                  {{ recipe.protein_g_per_serving }}g
                </span>
              </div>
              <div class="flex justify-between">
                <span>Carbs:</span>
                <span class="font-medium">
                  {{ recipe.carbs_g_per_serving }}g
                </span>
              </div>
              <div class="flex justify-between">
                <span>Fat:</span>
                <span class="font-medium">
                  {{ recipe.fat_g_per_serving }}g
                </span>
              </div>
            </div>
          </div>

          <!-- Footer -->
          <div class="mt-4 pt-3 border-t border-neutral-200 flex justify-between items-center">
            <span class="text-xs text-neutral-500">View recipe</span>
            <span class="text-xs font-medium text-fresh-green opacity-0 group-hover:opacity-100 transition-opacity">→</span>
          </div>
        </div>
      </button>
    </div>

    <!-- Drawer - Recipe Details -->
    <template #drawer-content>
      <RecipeDetailDrawer
        v-if="selectedItem"
        :recipe="selectedItem"
        @close="selectedItem = null"
        @updated="handleRecipeUpdated"
        @deleted="handleRecipeDeleted"
      />
    </template>
  </SidebarLayout>

  <!-- Create Recipe Modal -->
  <CreateRecipeModal
    v-if="showCreateDialog"
    @close="showCreateDialog = false"
    @created="handleRecipeCreated"
  />
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useRecipeService, type RecipeWithIngredients } from '@/renderer/composables/useRecipeService'
import SidebarLayout from '@/renderer/components/layout/SidebarLayout.vue'
import Input from '@/renderer/components/ui/Input.vue'
import Button from '@/renderer/components/ui/Button.vue'
import CreateRecipeModal from '@/renderer/components/modals/CreateRecipeModal.vue'
import RecipeDetailDrawer from '@/renderer/components/modals/RecipeDetailDrawer.vue'

interface Props {
  currentUserId: bigint
}

const props = defineProps<Props>()

const recipeService = useRecipeService(window.electronService?.recipes)
const searchQuery = ref('')
const showCreateDialog = ref(false)
const selectedItem = ref<RecipeWithIngredients | null>(null)

const isLoading = computed(() => recipeService.isLoading.value)
const error = computed(() => recipeService.error.value)
const recipes = computed(() => recipeService.recipes.value)

const filteredRecipes = computed(() => {
  if (!searchQuery.value.trim()) {
    return recipes.value
  }
  return recipes.value.filter(recipe =>
    recipe.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

onMounted(async () => {
  await recipeService.fetchRecipes()
})

const openCreateDialog = () => {
  showCreateDialog.value = true
}

const handleRecipeCreated = async (recipe: RecipeWithIngredients) => {
  showCreateDialog.value = false
  selectedItem.value = recipe
}

const selectRecipe = (recipe: RecipeWithIngredients) => {
  selectedItem.value = { ...recipe } as RecipeWithIngredients
}

const handleRecipeUpdated = async () => {
  selectedItem.value = null
  await recipeService.fetchRecipes()
}

const handleRecipeDeleted = async () => {
  selectedItem.value = null
  await recipeService.fetchRecipes()
}

const retryLoad = async () => {
  recipeService.clearError()
  await recipeService.fetchRecipes()
}

watch(
  () => props.currentUserId,
  async (newUserId) => {
    if (newUserId) {
      await recipeService.fetchRecipes()
    }
  }
)

watch(searchQuery, async (query) => {
  await recipeService.searchRecipes(query)
})
</script>
