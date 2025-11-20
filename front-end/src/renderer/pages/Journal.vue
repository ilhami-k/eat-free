<template>
  <div class="journal-page">
    <!-- Header with Date Selector -->
    <div class="page-header">
      <div class="header-content">
        <h1 class="page-title">Daily Food Diary</h1>
        <DateNavigator 
          :selectedDate="selectedDate"
          @previous="previousDay"
          @next="nextDay"
          @today="goToToday"
        />
      </div>
    </div>

    <!-- Main Content Area -->
    <main class="main-content">
      <!-- Loading State -->
      <div v-if="isLoading" class="state-container">
        <div class="spinner-large"></div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="state-container">
        <Card elevation="md" class="error-card">
          <h3 class="error-title">Error Loading Journal</h3>
          <p class="error-message">{{ error.message }}</p>
          <Button variant="secondary" size="sm" @click="retryLoad">
            Try Again
          </Button>
        </Card>
      </div>

      <div v-else class="journal-content">
        <!-- Daily Summary Card -->
        <DailySummaryCard
          :totalCalories="dailyTotals.calories"
          :totalProtein="dailyTotals.protein"
          :totalCarbs="dailyTotals.carbs"
          :totalFat="dailyTotals.fat"
          :calorieGoal="calorieGoal"
          :proteinGoal="proteinGoal"
          :carbsGoal="carbsGoal"
          :fatGoal="fatGoal"
        />

        <!-- Meal Sections -->
        <div class="meals-grid">
          <MealCard
            mealTitle="Breakfast"
            emoji="☀️"
            :entries="getMealEntries('breakfast')"
            @add-food="openAddMeal('breakfast')"
            @delete="deleteEntry"
          />

          <MealCard
            mealTitle="Lunch"
            emoji="🌤️"
            :entries="getMealEntries('lunch')"
            @add-food="openAddMeal('lunch')"
            @delete="deleteEntry"
          />

          <MealCard
            mealTitle="Dinner"
            emoji="🌙"
            :entries="getMealEntries('dinner')"
            @add-food="openAddMeal('dinner')"
            @delete="deleteEntry"
          />

          <MealCard
            mealTitle="Snacks"
            emoji="🍎"
            :entries="getMealEntries('snack')"
            @add-food="openAddMeal('snack')"
            @delete="deleteEntry"
          />
        </div>
      </div>
    </main>

    <!-- Floating Action Button -->
    <FloatingActionButton @click="showAddEntryDialog = true" label="Quick Add Food">
      <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
        <path fill-rule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" />
      </svg>
    </FloatingActionButton>

    <!-- Add Entry Modal -->
    <AddJournalEntryModal
      v-if="showAddEntryDialog"
      :userId="currentUserId"
      :date="selectedDate"
      :mealType="selectedMealType"
      @close="showAddEntryDialog = false"
      @added="handleEntryAdded"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useJournalService } from '@/renderer/composables/useJournalService'
import { Button, Card, FloatingActionButton } from '@/renderer/components/ui'
import AddJournalEntryModal from '@/renderer/components/modals/AddJournalEntryModal.vue'
import DailySummaryCard from '@/renderer/components/journal/DailySummaryCard.vue'
import MealCard from '@/renderer/components/journal/MealCard.vue'
import DateNavigator from '@/renderer/components/journal/DateNavigator.vue'
import type Journal from '@/shared/journal'

interface Props {
  currentUserId: bigint
}

const props = defineProps<Props>()

// Daily nutrition goals (these could come from user settings in the future)
const calorieGoal = ref(2000)
const proteinGoal = ref(150)
const carbsGoal = ref(200)
const fatGoal = ref(65)

const journalService = useJournalService(window.electronService?.journal)
const selectedDate = ref(new Date())
const showAddEntryDialog = ref(false)
const selectedMealType = ref<'breakfast' | 'lunch' | 'dinner' | 'snack'>('breakfast')

const isLoading = computed(() => journalService.isLoading.value)
const error = computed(() => journalService.error.value)
const journalEntries = computed(() => journalService.journalEntries.value)

const todayEntries = computed(() => {
  const dayStart = new Date(selectedDate.value)
  dayStart.setHours(0, 0, 0, 0)
  const dayEnd = new Date(selectedDate.value)
  dayEnd.setHours(23, 59, 59, 999)

  return journalEntries.value.filter(entry => {
    const entryDate = new Date(entry.logged_at)
    return entryDate >= dayStart && entryDate <= dayEnd
  })
})

const dailyTotals = computed(() => {
  return todayEntries.value.reduce(
    (acc, entry) => ({
      calories: acc.calories + entry.kcal,
      protein: acc.protein + entry.protein_g,
      carbs: acc.carbs + entry.carbs_g,
      fat: acc.fat + entry.fat_g,
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  )
})

const caloriesRemaining = computed(() => {
  return calorieGoal.value - dailyTotals.value.calories
})

const caloriesRemainingClass = computed(() => {
  if (caloriesRemaining.value < 0) return 'calories-over'
  if (caloriesRemaining.value < 200) return 'calories-low'
  return 'calories-good'
})

// Categorize entries by meal time
function getMealEntries(mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack'): Journal[] {
  return todayEntries.value.filter(entry => {
    const hour = new Date(entry.logged_at).getHours()
    
    if (mealType === 'breakfast') return hour >= 5 && hour < 11
    if (mealType === 'lunch') return hour >= 11 && hour < 15
    if (mealType === 'dinner') return hour >= 18 && hour < 22
    if (mealType === 'snack') return hour < 5 || (hour >= 15 && hour < 18) || hour >= 22
    
    return false
  })
}

function getMealCalories(mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack'): number {
  return getMealEntries(mealType).reduce((sum, entry) => sum + entry.kcal, 0)
}

function previousDay(): void {
  const newDate = new Date(selectedDate.value)
  newDate.setDate(newDate.getDate() - 1)
  selectedDate.value = newDate
}

function nextDay(): void {
  const newDate = new Date(selectedDate.value)
  newDate.setDate(newDate.getDate() + 1)
  selectedDate.value = newDate
}

function goToToday(): void {
  selectedDate.value = new Date()
}

function openAddMeal(mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack'): void {
  selectedMealType.value = mealType
  showAddEntryDialog.value = true
}

async function loadJournalEntries(): Promise<void> {
  const dayStart = new Date(selectedDate.value)
  dayStart.setHours(0, 0, 0, 0)
  const dayEnd = new Date(selectedDate.value)
  dayEnd.setHours(23, 59, 59, 999)
  
  console.log('Loading journal entries:', { userId: props.currentUserId, dayStart, dayEnd })
  await journalService.fetchJournalEntries(props.currentUserId, dayStart, dayEnd)
  console.log('Journal entries loaded:', journalEntries.value)
}

async function handleEntryAdded(): Promise<void> {
  console.log('Entry added, reloading...')
  showAddEntryDialog.value = false
  await loadJournalEntries()
}

async function deleteEntry(id: bigint): Promise<void> {
  if (!confirm('Delete this food entry?')) {
    return
  }

  const success = await journalService.deleteJournalEntry(id)
  if (success) {
    await loadJournalEntries()
  }
}

function retryLoad(): void {
  journalService.clearError()
  loadJournalEntries()
}

watch(selectedDate, () => {
  loadJournalEntries()
})

onMounted(async () => {
  await loadJournalEntries()
})
</script>

<style scoped>
/* ========== PAGE LAYOUT ========== */

.journal-page {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: var(--color-light-gray);
  overflow: hidden;
}

/* ========== HEADER ========== */

.page-header {
  background-color: var(--color-white);
  border-bottom: 1px solid var(--color-medium-gray);
  box-shadow: var(--shadow-sm);
  padding: var(--spacing-4);
  flex-shrink: 0;
}

.header-content {
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-3);
}

.page-title {
  font-family: var(--font-display);
  font-size: var(--text-2xl);
  font-weight: 700;
  color: var(--color-black);
  margin: 0;
}

/* ========== MAIN CONTENT ========== */

.main-content {
  flex: 1;
  overflow-y: auto;
  padding: var(--spacing-4);
}

.journal-content {
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-4);
}

/* ========== STATE CONTAINERS ========== */

.state-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  padding: var(--spacing-6);
}

.spinner-large {
  width: 48px;
  height: 48px;
  border: 4px solid rgba(120, 224, 143, 0.2);
  border-top-color: var(--color-fresh-green);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.error-card {
  max-width: 500px;
  text-align: center;
}

.error-title {
  font-weight: 600;
  color: #dc2626;
  margin: 0 0 var(--spacing-2) 0;
}

.error-message {
  font-size: var(--text-sm);
  color: #b91c1c;
  margin: 0 0 var(--spacing-4) 0;
}

/* ========== MEALS GRID ========== */

.meals-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--spacing-4);
}

/* ========== RESPONSIVE ========== */

@media (max-width: 1024px) {
  .meals-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .page-header {
    padding: var(--spacing-3);
  }
  
  .main-content {
    padding: var(--spacing-3);
  }
  
  .meals-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .page-title {
    font-size: var(--text-xl);
  }
}

@media (prefers-reduced-motion: reduce) {
  .spinner-large {
    animation: none;
  }
}
</style>
