import { ref, computed } from 'vue'

export type View = 'dashboard' | 'inventory' | 'recipes' | 'mealplans' | 'journal'

// Global state
const activeView = ref<View>('dashboard')
const navigationHistory = ref<View[]>(['dashboard'])
const currentHistoryIndex = ref(0)

export function useNavigation() {
  const canGoBack = computed(() => currentHistoryIndex.value > 0)
  const canGoForward = computed(() => currentHistoryIndex.value < navigationHistory.value.length - 1)

  const navigate = (page: View) => {
    // If we are not at the end of history, remove future entries
    if (currentHistoryIndex.value < navigationHistory.value.length - 1) {
      navigationHistory.value = navigationHistory.value.slice(0, currentHistoryIndex.value + 1)
    }
    
    navigationHistory.value.push(page)
    currentHistoryIndex.value++
    activeView.value = page
  }

  const goBack = () => {
    if (canGoBack.value) {
      currentHistoryIndex.value--
      activeView.value = navigationHistory.value[currentHistoryIndex.value]
    }
  }

  const goForward = () => {
    if (canGoForward.value) {
      currentHistoryIndex.value++
      activeView.value = navigationHistory.value[currentHistoryIndex.value]
    }
  }

  const resetNavigation = () => {
    activeView.value = 'dashboard'
    navigationHistory.value = ['dashboard']
    currentHistoryIndex.value = 0
  }

  return {
    activeView,
    canGoBack,
    canGoForward,
    navigate,
    goBack,
    goForward,
    resetNavigation
  }
}