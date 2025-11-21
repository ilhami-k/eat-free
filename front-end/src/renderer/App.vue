<template>
  <div class="app flex flex-col h-screen overflow-hidden">
    <Onboarding
      v-if="!currentUser"
      :users="users"
      :isLoading="isLoadingUser"
      :error="userError"
      @user-created="handleUserCreated"
    />

    <div v-else class="flex flex-col h-full">
      <BubbleNavBar @logout="logout" />

      <div class="flex-1 overflow-hidden relative bg-neutral-50">
        <Dashboard
          v-if="activeView === 'dashboard'"
          :currentUser="currentUser"
          :inventoryCount="inventoryCount"
          :recipesCount="recipesCount"
          :weekMealsCount="weekMealsCount"
          :todayCalories="todayCalories"
          @navigate="navigate"
          @logout="logout"
        />

        <Inventory
          v-else-if="activeView === 'inventory'"
          :currentUserId="currentUserIdBigInt"
        />
        <Recipes
          v-else-if="activeView === 'recipes'"
          :currentUserId="currentUserIdBigInt"
        />
        <MealPlans
          v-else-if="activeView === 'mealplans'"
          :currentUserId="currentUserIdBigInt"
        />
        <Journal
          v-else-if="activeView === 'journal'"
          :currentUserId="currentUserIdBigInt"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue'
import Onboarding from '@/renderer/pages/Onboarding.vue'
import BubbleNavBar from '@/renderer/components/layout/BubbleNavBar.vue'
import Dashboard from '@/renderer/pages/Dashboard.vue'
import Inventory from '@/renderer/pages/Inventory.vue'
import Recipes from '@/renderer/pages/Recipes.vue'
import MealPlans from '@/renderer/pages/MealPlans.vue'
import Journal from '@/renderer/pages/Journal.vue'
import type User from '@/shared/user'
import { useInventoryService } from '@/renderer/composables/useInventoryService'
import { useRecipeService } from '@/renderer/composables/useRecipeService'
import { useMealPlanService } from '@/renderer/composables/useMealPlanService'
import { useJournalService } from '@/renderer/composables/useJournalService'
import { useNavigation } from '@/renderer/composables/useNavigation'

const currentUser = ref<User | null>(null)
const users = ref<User[]>([])
const isLoadingUser = ref(false)
const userError = ref<string>()

// Navigation State
const { 
  activeView, 
  navigate, 
  goBack, 
  goForward, 
  canGoBack, 
  canGoForward,
  resetNavigation 
} = useNavigation()

const currentUserIdBigInt = computed(() => currentUser.value ? currentUser.value.id : 0)

// Services for dashboard stats
const inventoryService = window.electronService?.inventory ? useInventoryService(window.electronService.inventory) : null
const recipeService = window.electronService?.recipes ? useRecipeService(window.electronService.recipes) : null
const mealPlanService = window.electronService?.mealPlans ? useMealPlanService(window.electronService.mealPlans) : null
const journalService = window.electronService?.journal ? useJournalService(window.electronService.journal) : null

// Dashboard stats
const inventoryCount = ref(0)
const recipesCount = ref(0)
const weekMealsCount = ref(0)
const todayCalories = ref(0)

const updateDashboardStats = () => {
  if (inventoryService) {
    inventoryCount.value = inventoryService.inventoryIngredients.value.length
  }
  if (recipeService) {
    recipesCount.value = recipeService.recipes.value.length
  }
  
  if (journalService) {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)
    
    todayCalories.value = journalService.journalEntries.value
      .filter(entry => {
        const entryDate = new Date(entry.logged_at)
        return entryDate >= today && entryDate < tomorrow
      })
      .reduce((sum, entry) => sum + entry.kcal, 0)
  }
}

// Watch for view changes to update stats
watch(activeView, (newView) => {
  if (newView === 'dashboard') {
    updateDashboardStats()
  }
})

// Get the real backend service from electron preload
const userService = window.electronService?.users

const handleUserCreated = async (user: User): Promise<void> => {
  if (!userService) {
    userError.value = 'Backend service not available'
    return
  }

  isLoadingUser.value = true
  userError.value = undefined
  try {
    if (!user.id || user.id === 0) {
      // Create new user in database
      const newUser = await userService.createUser(user.email, user.name)
      currentUser.value = newUser
      // Refresh users list
      users.value = await userService.getUsers()
    } else {
      // User was selected from existing list
      currentUser.value = user
    }
    // Load initial dashboard data
    await loadDashboardData()
  } catch (err) {
    userError.value = err instanceof Error ? err.message : 'Failed to process user'
    console.error('User creation error:', err)
  } finally {
    isLoadingUser.value = false
  }
}

const logout = (): void => {
  currentUser.value = null
  resetNavigation()
}

const loadDashboardData = async (): Promise<void> => {
  if (!currentUser.value) return
  
  try {
    // Load data for dashboard stats
    const promises: Promise<any>[] = []
    
    if (inventoryService) {
      promises.push(inventoryService.getOrCreateInventory(currentUser.value.id))
    }
    if (recipeService) {
      promises.push(recipeService.fetchRecipes())
    }
    if (journalService) {
      promises.push(journalService.fetchJournalEntries(
        currentUser.value.id,
        new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Last 7 days
        new Date()
      ))
    }
    
    await Promise.all(promises)
    updateDashboardStats()
  } catch (err) {
    console.error('Failed to load dashboard data:', err)
  }
}

onMounted(async () => {
  if (!userService) {
    userError.value = 'Backend service not available'
    return
  }

  isLoadingUser.value = true
  try {
    // Load all existing users from database
    users.value = await userService.getUsers()
  } catch (err) {
    console.error('Failed to fetch users:', err)
    userError.value = 'Failed to load users from database'
  } finally {
    isLoadingUser.value = false
  }
})
</script>

<style scoped>
.app {
  min-height: 100vh;
  background-color: var(--color-white);
}
</style>