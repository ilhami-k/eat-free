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
      <!-- Global Navbar -->
      <nav class="bg-white border-b border-neutral-200 px-4 py-3 flex items-center justify-between shrink-0 z-50 shadow-sm">
        <!-- Left: Navigation & Logo -->
        <div class="flex items-center gap-4">
          <!-- Nav Buttons -->
          <div class="flex items-center gap-2">
            <button
              @click="goBack"
              :disabled="currentHistoryIndex <= 0"
              class="p-2 rounded-lg transition-all flex items-center justify-center"
              :class="currentHistoryIndex <= 0 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-neutral-100'"
              title="Go Back"
            >
            </button>
            
            <button
              @click="goForward"
              :disabled="currentHistoryIndex >= navigationHistory.length - 1"
              class="p-2 rounded-lg transition-all flex items-center justify-center"
              :class="currentHistoryIndex >= navigationHistory.length - 1 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-neutral-100'"
              title="Go Forward"
            >
            </button>
          </div>

          <!-- Divider -->
          <div class="h-6 w-px bg-neutral-200"></div>

          <!-- Logo/Title -->
          <button 
            @click="handleNavigate('dashboard')" 
            class="flex items-center gap-2 group"
          >
            <span class="text-2xl">🍽️</span>
            <span class="font-display font-bold text-xl text-neutral-900 group-hover:text-fresh-green transition-colors">Eat Free</span>
          </button>
        </div>

        <!-- Right: User Info -->
        <div class="flex items-center gap-6">
          <div class="text-right hidden sm:block">
            <p class="text-sm font-medium text-neutral-900">{{ currentUser.name }}</p>
            <p class="text-xs text-neutral-500">{{ currentUser.email }}</p>
          </div>
          <button 
            @click="logout"
            class="text-sm font-medium text-neutral-600 hover:text-red-600 transition-colors"
          >
            Logout
          </button>
        </div>
      </nav>

      <!-- Main Content Area -->
      <div class="flex-1 overflow-hidden relative bg-neutral-50">
        <!-- Dashboard View -->
        <Dashboard
          v-if="activeView === 'dashboard'"
          :currentUser="currentUser"
          :inventoryCount="inventoryCount"
          :recipesCount="recipesCount"
          :weekMealsCount="weekMealsCount"
          :todayCalories="todayCalories"
          @navigate="handleNavigate"
          @logout="logout"
        />

        <!-- Full Component Views -->
        <Inventory
          v-else-if="activeView === 'inventory'"
          :currentUserId="currentUser.id"
        />
        <Recipes
          v-else-if="activeView === 'recipes'"
          :currentUserId="currentUser.id"
        />
        <MealPlans
          v-else-if="activeView === 'mealplans'"
          :currentUserId="currentUser.id"
        />
        <Journal
          v-else-if="activeView === 'journal'"
          :currentUserId="currentUser.id"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import Onboarding from '@/renderer/pages/Onboarding.vue'
import Dashboard from '@/renderer/pages/Dashboard.vue'
import Inventory from '@/renderer/components/Inventory.vue'
import Recipes from '@/renderer/pages/Recipes.vue'
import MealPlans from '@/renderer/pages/MealPlans.vue'
import Journal from '@/renderer/pages/Journal.vue'
import type User from '@/shared/user'
import { useInventoryService } from '@/renderer/composables/useInventoryService'
import { useRecipeService } from '@/renderer/composables/useRecipeService'
import { useMealPlanService } from '@/renderer/composables/useMealPlanService'
import { useJournalService } from '@/renderer/composables/useJournalService'

const currentUser = ref<User | null>(null)
const users = ref<User[]>([])
const isLoadingUser = ref(false)
const userError = ref<string>()
const activeView = ref<'dashboard' | 'inventory' | 'recipes' | 'mealplans' | 'journal'>('dashboard')

// Navigation State
const navigationHistory = ref<string[]>(['dashboard'])
const currentHistoryIndex = ref(0)

const goBack = () => {
  if (currentHistoryIndex.value > 0) {
    currentHistoryIndex.value--
    activeView.value = navigationHistory.value[currentHistoryIndex.value] as any
    if (activeView.value === 'dashboard') updateDashboardStats()
  }
}

const goForward = () => {
  if (currentHistoryIndex.value < navigationHistory.value.length - 1) {
    currentHistoryIndex.value++
    activeView.value = navigationHistory.value[currentHistoryIndex.value] as any
    if (activeView.value === 'dashboard') updateDashboardStats()
  }
}

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
    if (!user.id || user.id === 0n || user.id === BigInt(0)) {
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
  activeView.value = 'dashboard'
  navigationHistory.value = ['dashboard']
  currentHistoryIndex.value = 0
}

const handleNavigate = (page: 'inventory' | 'recipes' | 'mealplans' | 'journal'): void => {
  // If we are not at the end of history, remove future entries
  if (currentHistoryIndex.value < navigationHistory.value.length - 1) {
    navigationHistory.value = navigationHistory.value.slice(0, currentHistoryIndex.value + 1)
  }
  
  navigationHistory.value.push(page)
  currentHistoryIndex.value++
  activeView.value = page
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
