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
  const electronService = window.electronService

  const currentUser = ref<User | null>(null)
  const inventoryCount = ref(0)
  const recipesCount = ref(0)
  const weekMealsCount = ref(0)
  const todayCalories = ref(0)
  const isLoading = ref(true)

  const userName = computed(() => currentUser.value?.name || 'Chef')

  const fetchDashboardData = async () => {
    isLoading.value = true
    try {
      await fetchCurrentUser()
      await Promise.all([
        fetchInventoryCount(),
        fetchRecipesCount(),
        fetchWeekMealsCount(),
        fetchTodayCalories()
      ])
    } catch (error) {
    } finally {
      isLoading.value = false
    }
  }

  const fetchCurrentUser = async () => {
    try {
      const user = await electronService?.users?.getUserById(userId)
      if (user) {
        currentUser.value = user
      }
    } catch (error) {
    }
  }

  const fetchInventoryCount = async () => {
    try {
      const inventory = await electronService?.inventory?.getInventoryByUserId(userId)

      inventoryCount.value = inventory?.inventory_ingredient?.filter(
        (item: any) => item.qty_grams > 0
      ).length || 0

    } catch (error) {
      inventoryCount.value = 0
    }
  }

  const fetchRecipesCount = async () => {
    try {
      const recipes = await electronService?.recipes?.getRecipes()
      recipesCount.value = recipes?.length || 0
    } catch (error) {
      recipesCount.value = 0
    }
  }

  const fetchWeekMealsCount = async () => {
    try {
      const now = new Date()
      const dayOfWeek = now.getUTCDay()
      const diffToMonday = (dayOfWeek === 0 ? -6 : 1 - dayOfWeek)
      const monday = new Date(now)
      monday.setUTCDate(now.getUTCDate() + diffToMonday)
      monday.setUTCHours(0, 0, 0, 0)

      const mealPlan = await electronService?.mealPlans?.getMealPlanForWeek(userId, monday)

      weekMealsCount.value = mealPlan?.meal_plan_recipe?.length || 0

    } catch (error) {
      weekMealsCount.value = 0
    }
  }

  const fetchTodayCalories = async () => {
    try {
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      const tomorrow = new Date(today)
      tomorrow.setDate(today.getDate() + 1)

      const journalEntries = await electronService?.journal?.getJournalEntries(userId)

      if (!journalEntries) {
        todayCalories.value = 0
        return
      }

      const todayEntries = journalEntries.filter((entry: Journal) => {
        const entryDate = new Date(entry.logged_at)
        return entryDate >= today && entryDate < tomorrow
      })

      todayCalories.value = todayEntries.reduce((sum: number, entry: Journal) => {
        return sum + (entry.kcal || 0)
      }, 0)

    } catch (error) {
      todayCalories.value = 0
    }
  }

  const refresh = async () => {
    await fetchDashboardData()
  }

  onMounted(() => {
    fetchDashboardData()
  })

  return {
    currentUser,
    userName,
    inventoryCount,
    recipesCount,
    weekMealsCount,
    todayCalories,
    isLoading,

    refresh,
    fetchDashboardData
  }
}
