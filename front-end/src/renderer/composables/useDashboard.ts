import { ref, computed, onMounted } from 'vue'
import type User from '@/shared/user'
import type MealPlan from '@/shared/mealPlan'
import type Journal from '@/shared/journal'
import type Inventory from '@/shared/inventory'

export interface DashboardData {
  currentUser: User | null
  inventoryCount: number
  recipesCount: number
  weekMealsCount: number
  todayCalories: number
  isLoading: boolean
}

export function useDashboard() {
  // Access electron services directly
  const electronService = window.electronService

  const currentUser = ref<User | null>(null)
  const inventoryCount = ref(0)
  const recipesCount = ref(0)
  const weekMealsCount = ref(0)
  const todayCalories = ref(0)
  const isLoading = ref(true)

  const userName = computed(() => currentUser.value?.name || 'Chef')

  /**
   * Fetch all dashboard data
   */
  const fetchDashboardData = async () => {
    isLoading.value = true
    try {
      await Promise.all([
        fetchCurrentUser(),
        fetchInventoryCount(),
        fetchRecipesCount(),
        fetchWeekMealsCount(),
        fetchTodayCalories()
      ])
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Fetch current user data
   */
  const fetchCurrentUser = async () => {
    try {
      const users = await electronService?.users?.getUsers()
      if (users && users.length > 0) {
        currentUser.value = users[0]
      }
    } catch (error) {
      console.error('Error fetching current user:', error)
    }
  }

  /**
   * Fetch inventory count
   */
  const fetchInventoryCount = async () => {
    try {
      // Get all inventories
      const inventories = await electronService?.inventory?.getInventories()
      // Count total ingredients across all inventories
      inventoryCount.value = inventories?.reduce((total: number, inv: Inventory) => {
        return total + (inv.inventory_ingredient?.length || 0)
      }, 0) || 0
    } catch (error) {
      console.error('Error fetching inventory count:', error)
      inventoryCount.value = 0
    }
  }

  /**
   * Fetch saved recipes count
   */
  const fetchRecipesCount = async () => {
    try {
      const recipes = await electronService?.recipes?.getRecipes()
      recipesCount.value = recipes?.length || 0
    } catch (error) {
      console.error('Error fetching recipes count:', error)
      recipesCount.value = 0
    }
  }

  /**
   * Fetch this week's meal count
   */
  const fetchWeekMealsCount = async () => {
    try {
      // Get all meal plans for current user (assuming user id 1 for now)
      // TODO: Get actual current user ID
      const mealPlans = await electronService?.mealPlans?.getMealPlans(BigInt(currentUser.value?.id || 1))
      if (!mealPlans) {
        weekMealsCount.value = 0
        return
      }

      // Get the start and end of the current week
      const now = new Date()
      const startOfWeek = new Date(now)
      startOfWeek.setDate(now.getDate() - now.getDay()) // Sunday
      startOfWeek.setHours(0, 0, 0, 0)

      const endOfWeek = new Date(startOfWeek)
      endOfWeek.setDate(startOfWeek.getDate() + 7)

      // Count meals in the current week
      const thisWeekMeals = mealPlans.filter((meal: MealPlan) => {
        const mealDate = new Date(meal.week_start_date)
        return mealDate >= startOfWeek && mealDate < endOfWeek
      })

      weekMealsCount.value = thisWeekMeals.length
    } catch (error) {
      console.error('Error fetching week meals count:', error)
      weekMealsCount.value = 0
    }
  }

  /**
   * Fetch today's total calories from journal entries
   */
  const fetchTodayCalories = async () => {
    try {
      // Get today's date range
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      const tomorrow = new Date(today)
      tomorrow.setDate(today.getDate() + 1)

      // Get all journal entries for current user (assuming user id 1 for now)
      // TODO: Get actual current user ID
      const journalEntries = await electronService?.journal?.getJournalEntries(BigInt(currentUser.value?.id || 1))
      if (!journalEntries) {
        todayCalories.value = 0
        return
      }

      // Sum calories from today's entries
      const todayEntries = journalEntries.filter((entry: Journal) => {
        const entryDate = new Date(entry.logged_at)
        return entryDate >= today && entryDate < tomorrow
      })

      todayCalories.value = todayEntries.reduce((sum: number, entry: Journal) => {
        return sum + (entry.kcal || 0)
      }, 0)
    } catch (error) {
      console.error('Error fetching today calories:', error)
      todayCalories.value = 0
    }
  }

  /**
   * Refresh dashboard data
   */
  const refresh = async () => {
    await fetchDashboardData()
  }

  // Initialize dashboard data on mount
  onMounted(() => {
    fetchDashboardData()
  })

  return {
    // State
    currentUser,
    userName,
    inventoryCount,
    recipesCount,
    weekMealsCount,
    todayCalories,
    isLoading,

    // Methods
    refresh,
    fetchDashboardData
  }
}
