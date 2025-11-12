<template>
  <div class="space-y-4">
    <!-- Header with Search -->
    <div class="flex items-center justify-between gap-4">
      <h2 class="text-h1 font-display text-neutral-900">My Recipes</h2>
      <Button @click="openCreateDialog" class="whitespace-nowrap">
        + Create Recipe
      </Button>
    </div>

    <!-- Search Bar -->
    <div>
      <Input
        v-model="searchQuery"
        placeholder="Search your recipes..."
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
    <div v-else-if="filteredRecipes.length === 0" class="rounded-lg bg-neutral-50 p-8 text-center">
      <p class="text-neutral-600">
        {{ searchQuery ? 'No recipes match your search' : 'You have no recipes yet' }}
      </p>
      <Button variant="secondary" size="sm" class="mt-4" @click="openCreateDialog">
        {{ searchQuery ? 'Clear search' : 'Create your first recipe' }}
      </Button>
    </div>

    <!-- Recipes List -->
    <div v-else class="space-y-2">
      <button
        v-for="recipe in filteredRecipes"
        :key="`recipe-${recipe.id}`"
        @click="selectRecipe(recipe as any)"
        class="w-full rounded-lg border border-neutral-200 bg-white p-4 text-left transition-all hover:border-fresh-green hover:bg-fresh-green/5 focus:outline-none focus:ring-2 focus:ring-fresh-green/50"
      >
        <div class="flex items-start justify-between">
          <div class="flex-1">
            <p class="font-medium text-neutral-900">{{ recipe.name }}</p>
            <p class="text-sm text-neutral-600">
              {{ recipe.servings }} serving<span v-if="recipe.servings !== 1">s</span>
              • {{ recipe.kcal_per_serving }} kcal/serving
            </p>
          </div>
        </div>
      </button>
    </div>

    <!-- Create Recipe Dialog -->
    <CreateRecipeModal
      v-if="showCreateDialog"
      @close="showCreateDialog = false"
      @created="handleRecipeCreated"
    />

    <!-- Recipe Detail Modal -->
    <RecipeDetail
      v-if="selectedItem"
      :recipe="selectedItem"
      @close="selectedItem = null"
      @updated="handleRecipeUpdated"
      @deleted="handleRecipeDeleted"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useRecipeService, type RecipeWithIngredients } from '@/renderer/composables/useRecipeService'
import Input from '@/renderer/components/ui/Input.vue'
import Button from '@/renderer/components/ui/Button.vue'
import CreateRecipeModal from '@/renderer/components/modals/CreateRecipeModal.vue'
import RecipeDetail from '@/renderer/components/modals/RecipeDetail.vue'

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
