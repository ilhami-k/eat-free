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

export function useDashboard(userId: number) {
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
      // Fetch user first, then the rest
      await fetchCurrentUser()
      await Promise.all([
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
      const user = await electronService?.users?.getUserById(userId)
      if (user) {
        currentUser.value = user
        console.log('Dashboard - Current user:', currentUser.value?.id, currentUser.value?.name)
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
      const inventory = await electronService?.inventory?.getInventoryByUserId(userId)
      
      console.log('Dashboard - Inventory data:', inventory)
      console.log('Dashboard - Inventory items:', inventory?.inventory_ingredient?.length)
      
      // Count ingredients with quantity > 0
      inventoryCount.value = inventory?.inventory_ingredient?.filter(
        (item: any) => item.qty_grams > 0
      ).length || 0
      
      console.log('Dashboard - Inventory count (filtered):', inventoryCount.value)
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
      console.log('Dashboard - Recipes count:', recipesCount.value)
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
      // Get the start of the current week (Monday)
      const now = new Date()
      const dayOfWeek = now.getUTCDay()
      const diffToMonday = (dayOfWeek === 0 ? -6 : 1 - dayOfWeek)
      const monday = new Date(now)
      monday.setUTCDate(now.getUTCDate() + diffToMonday)
      monday.setUTCHours(0, 0, 0, 0)

      console.log('Dashboard - Fetching meal plan for week starting:', monday)
      
      // Get meal plan for this week
      const mealPlan = await electronService?.mealPlans?.getMealPlanForWeek(userId, monday)
      
      console.log('Dashboard - Meal plan:', mealPlan)
      console.log('Dashboard - Meal plan recipes:', mealPlan?.meal_plan_recipe)
      
      // Count the number of recipes in the meal plan
      weekMealsCount.value = mealPlan?.meal_plan_recipe?.length || 0
      
      console.log('Dashboard - Week meals count:', weekMealsCount.value)
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

      console.log('Dashboard - Fetching journal for user:', userId)
      console.log('Dashboard - Today range:', today, 'to', tomorrow)
      
      // Get all journal entries for current user
      const journalEntries = await electronService?.journal?.getJournalEntries(userId)
      
      console.log('Dashboard - Journal entries:', journalEntries?.length)
      
      if (!journalEntries) {
        todayCalories.value = 0
        return
      }

      // Sum calories from today's entries
      const todayEntries = journalEntries.filter((entry: Journal) => {
        const entryDate = new Date(entry.logged_at)
        return entryDate >= today && entryDate < tomorrow
      })

      console.log('Dashboard - Today entries:', todayEntries.length)

      todayCalories.value = todayEntries.reduce((sum: number, entry: Journal) => {
        return sum + (entry.kcal || 0)
      }, 0)
      
      console.log('Dashboard - Today calories:', todayCalories.value)
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
