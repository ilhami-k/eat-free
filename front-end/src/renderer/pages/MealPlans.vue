<template>
  <div class="meal-plans-page">
    <!-- Header -->
    <div class="page-header">
      <div class="header-content">
        <h1 class="page-title">Meal Plan</h1>
        <p class="page-subtitle">Week of {{ formatDate(currentWeekStart) }}</p>
        <div class="header-actions">
          <Button variant="ghost" size="md" @click="previousWeek">
            <template #iconLeft>
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" />
              </svg>
            </template>
            Previous
          </Button>
          <Button variant="ghost" size="md" @click="nextWeek">
            Next
            <template #iconRight>
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" />
              </svg>
            </template>
          </Button>
        </div>
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
          <h3 class="error-title">Error Loading Meal Plan</h3>
          <p class="error-message">{{ error.message }}</p>
          <Button variant="secondary" size="sm" @click="retryLoad">
            Try Again
          </Button>
        </Card>
      </div>

      <!-- No Meal Plan State -->
      <div v-else-if="!mealPlan" class="state-container">
        <Card elevation="lg" class="empty-state-card">
          <svg class="empty-state-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p class="empty-state-text">No meal plan for this week</p>
          <Button @click="createMealPlan">Create Meal Plan</Button>
        </Card>
      </div>

      <!-- Week Grid Layout -->
      <div v-else class="week-grid-container">
        <div class="week-grid">
          <!-- Day Card for each day of the week -->
          <Card
            v-for="(day, dayIdx) in daysOfWeek"
            :key="`day-${dayIdx}`"
            elevation="md"
            class="day-card"
          >
            <!-- Day Header -->
            <div class="day-header">
              <h3 class="day-name">{{ formatDayOfWeek(day) }}</h3>
              <p class="day-date">{{ formatDateShort(day) }}</p>
              <p class="day-calories">{{ calculateDayCalories(day) }} kcal</p>
            </div>

            <!-- Meal Sections -->
            <div class="meals-container">
              <!-- Breakfast -->
              <div class="meal-section">
                <h4 class="meal-type-label">Breakfast</h4>
                <div v-if="getMealsForDayAndType(day, 'breakfast').length === 0" class="empty-meal-slot">
                  <Button variant="ghost" size="sm" @click="openAddRecipeDialog(day, 'breakfast')">
                    <template #iconLeft>
                      <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" />
                      </svg>
                    </template>
                    Add
                  </Button>
                </div>
                <div v-else class="meal-items">
                  <div
                    v-for="mealRecipe in getMealsForDayAndType(day, 'breakfast')"
                    :key="`meal-${mealRecipe.id}`"
                    class="meal-item-card"
                  >
                    <div class="meal-info">
                      <p class="meal-name">{{ mealRecipe.recipe?.name }}</p>
                      <p class="meal-details">
                        {{ mealRecipe.planned_servings }} serving{{ mealRecipe.planned_servings !== 1 ? 's' : '' }} · 
                        <span class="meal-kcal">{{ calculateMealCalories(mealRecipe) }} kcal</span>
                      </p>
                    </div>
                    <button class="remove-btn" @click="removeRecipe(BigInt(mealRecipe.id))">
                      <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              <!-- Lunch -->
              <div class="meal-section">
                <h4 class="meal-type-label">Lunch</h4>
                <div v-if="getMealsForDayAndType(day, 'lunch').length === 0" class="empty-meal-slot">
                  <Button variant="ghost" size="sm" @click="openAddRecipeDialog(day, 'lunch')">
                    <template #iconLeft>
                      <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" />
                      </svg>
                    </template>
                    Add
                  </Button>
                </div>
                <div v-else class="meal-items">
                  <div
                    v-for="mealRecipe in getMealsForDayAndType(day, 'lunch')"
                    :key="`meal-${mealRecipe.id}`"
                    class="meal-item-card"
                  >
                    <div class="meal-info">
                      <p class="meal-name">{{ mealRecipe.recipe?.name }}</p>
                      <p class="meal-details">
                        {{ mealRecipe.planned_servings }} serving{{ mealRecipe.planned_servings !== 1 ? 's' : '' }} · 
                        <span class="meal-kcal">{{ calculateMealCalories(mealRecipe) }} kcal</span>
                      </p>
                    </div>
                    <button class="remove-btn" @click="removeRecipe(BigInt(mealRecipe.id))">
                      <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              <!-- Dinner -->
              <div class="meal-section">
                <h4 class="meal-type-label">Dinner</h4>
                <div v-if="getMealsForDayAndType(day, 'dinner').length === 0" class="empty-meal-slot">
                  <Button variant="ghost" size="sm" @click="openAddRecipeDialog(day, 'dinner')">
                    <template #iconLeft>
                      <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" />
                      </svg>
                    </template>
                    Add
                  </Button>
                </div>
                <div v-else class="meal-items">
                  <div
                    v-for="mealRecipe in getMealsForDayAndType(day, 'dinner')"
                    :key="`meal-${mealRecipe.id}`"
                    class="meal-item-card"
                  >
                    <div class="meal-info">
                      <p class="meal-name">{{ mealRecipe.recipe?.name }}</p>
                      <p class="meal-details">
                        {{ mealRecipe.planned_servings }} serving{{ mealRecipe.planned_servings !== 1 ? 's' : '' }} · 
                        <span class="meal-kcal">{{ calculateMealCalories(mealRecipe) }} kcal</span>
                      </p>
                    </div>
                    <button class="remove-btn" @click="removeRecipe(BigInt(mealRecipe.id))">
                      <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </main>

    <!-- Add Recipe Dialog -->
    <AddRecipeToMealPlanModal
      v-if="showAddRecipeDialog && mealPlan"
      :date="selectedDate"
      :mealType="selectedMealType"
      :planId="BigInt(mealPlan.id)"
      @close="showAddRecipeDialog = false"
      @added="handleRecipeAdded"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useMealPlanService, type MealPlanWithRecipes } from '@/renderer/composables/useMealPlanService'
import { Button, Card } from '@/renderer/components/ui'
import AddRecipeToMealPlanModal from '@/renderer/components/modals/AddRecipeToMealPlanModal.vue'
import type { MealType, MealPlanRecipe } from '@/shared/mealPlan'

interface Props {
  currentUserId: bigint
}

const props = defineProps<Props>()

const mealPlanService = useMealPlanService(window.electronService?.mealPlans)
const currentWeekStart = ref(getWeekStart(new Date()))
const mealPlan = ref<MealPlanWithRecipes | null>(null)
const showAddRecipeDialog = ref(false)
const selectedDate = ref<Date>(new Date())
const selectedMealType = ref<MealType>('breakfast')

const isLoading = computed(() => mealPlanService.isLoading.value)
const error = computed(() => mealPlanService.error.value)

const mealTypes: MealType[] = ['breakfast', 'lunch', 'dinner', 'snack']

const daysOfWeek = computed(() => {
  const days: Date[] = []
  for (let i = 0; i < 7; i++) {
    const day = new Date(currentWeekStart.value)
    day.setDate(day.getDate() + i)
    days.push(day)
  }
  return days
})

function getWeekStart(date: Date): Date {
  const d = new Date(date)
  const dayOfWeek = d.getDay()
  const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1
  d.setDate(d.getDate() - daysToMonday)
  d.setUTCHours(0, 0, 0, 0)
  return d
}

function formatDate(date: Date): string {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

function formatDateShort(date: Date): string {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  })
}

function formatDayOfWeek(date: Date): string {
  return new Date(date).toLocaleDateString('en-US', {
    weekday: 'long',
  })
}

function getMealsForDayAndType(day: Date, mealType: MealType): (MealPlanRecipe & { recipe?: any })[] {
  if (!mealPlan.value?.meal_plan_recipe) return []

  const dayStart = new Date(day)
  dayStart.setHours(0, 0, 0, 0)
  const dayEnd = new Date(day)
  dayEnd.setHours(23, 59, 59, 999)

  return mealPlan.value.meal_plan_recipe.filter(
    meal =>
      new Date(meal.date).getTime() >= dayStart.getTime() &&
      new Date(meal.date).getTime() <= dayEnd.getTime() &&
      meal.meal_type === mealType
  )
}

function calculateMealCalories(mealRecipe: MealPlanRecipe & { recipe?: any }): number {
  if (!mealRecipe.recipe) return 0
  return Math.round(mealRecipe.recipe.kcal_per_serving * mealRecipe.planned_servings)
}

function calculateDayCalories(day: Date): number {
  let total = 0
  for (const mealType of mealTypes) {
    const meals = getMealsForDayAndType(day, mealType)
    for (const meal of meals) {
      total += calculateMealCalories(meal)
    }
  }
  return total
}

function previousWeek(): void {
  const newStart = new Date(currentWeekStart.value)
  newStart.setDate(newStart.getDate() - 7)
  currentWeekStart.value = newStart
}

function nextWeek(): void {
  const newStart = new Date(currentWeekStart.value)
  newStart.setDate(newStart.getDate() + 7)
  currentWeekStart.value = newStart
}

async function loadMealPlan(): Promise<void> {
  const plan = await mealPlanService.getMealPlanForWeek(props.currentUserId, currentWeekStart.value)
  mealPlan.value = plan
}

async function createMealPlan(): Promise<void> {
  try {
    const newPlan = await mealPlanService.createMealPlan(props.currentUserId, currentWeekStart.value)
    mealPlan.value = newPlan
  } catch (err) {
    console.error('Error creating meal plan:', err)
  }
}

async function openAddRecipeDialog(date: Date, mealType: MealType): Promise<void> {
  // Ensure we have a meal plan first
  if (!mealPlan.value) {
    await createMealPlan()
  }
  selectedDate.value = date
  selectedMealType.value = mealType
  showAddRecipeDialog.value = true
}

async function openAddRecipeQuick(): Promise<void> {
  // Ensure we have a meal plan first
  if (!mealPlan.value) {
    await createMealPlan()
  }
  // Open dialog for today's first meal
  selectedDate.value = new Date()
  selectedMealType.value = 'breakfast'
  showAddRecipeDialog.value = true
}

async function handleRecipeAdded(): Promise<void> {
  showAddRecipeDialog.value = false
  await loadMealPlan()
}

async function removeRecipe(mealPlanRecipeId: bigint): Promise<void> {
  if (!confirm('Remove this recipe from the meal plan?')) {
    return
  }
  try {
    await mealPlanService.removeRecipeFromMealPlan(mealPlanRecipeId)
    await loadMealPlan()
  } catch (err) {
    console.error('Error removing recipe:', err)
  }
}

function retryLoad(): void {
  mealPlanService.clearError()
  loadMealPlan()
}

watch(currentWeekStart, () => {
  loadMealPlan()
}, { deep: true })

onMounted(async () => {
  await loadMealPlan()
})
</script>

<style scoped>
/* ========== PAGE LAYOUT ========== */

.meal-plans-page {
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
  display: flex;
  flex-direction: column;
  gap: var(--spacing-3);
  max-width: 1600px;
  margin: 0 auto;
}

.page-title {
  font-family: var(--font-display);
  font-size: var(--text-2xl);
  font-weight: 700;
  color: var(--color-black);
  margin: 0;
}

.page-subtitle {
  font-size: var(--text-sm);
  color: var(--color-dark-gray);
  margin: 0;
}

.header-actions {
  display: flex;
  gap: var(--spacing-2);
  align-items: center;
}

/* ========== MAIN CONTENT ========== */

.main-content {
  flex: 1;
  overflow-y: auto;
  padding: var(--spacing-4);
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

/* Error Card */
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

/* Empty State Card */
.empty-state-card {
  max-width: 400px;
  text-align: center;
  padding: var(--spacing-6);
}

.empty-state-icon {
  width: 64px;
  height: 64px;
  color: var(--color-medium-gray);
  margin: 0 auto var(--spacing-4) auto;
}

.empty-state-text {
  color: var(--color-dark-gray);
  margin: 0 0 var(--spacing-4) 0;
}

/* ========== WEEK GRID ========== */

.week-grid-container {
  max-width: 1600px;
  margin: 0 auto;
}

.week-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: var(--spacing-3);
}

/* Responsive grid breakpoints */
@media (min-width: 1400px) {
  .week-grid {
    grid-template-columns: repeat(7, 1fr);
  }
}

@media (min-width: 1024px) and (max-width: 1399px) {
  .week-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

@media (min-width: 768px) and (max-width: 1023px) {
  .week-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (min-width: 640px) and (max-width: 767px) {
  .week-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 639px) {
  .week-grid {
    grid-template-columns: 1fr;
  }
}

/* ========== DAY CARD ========== */

.day-card {
  min-width: 0;
  display: flex;
  flex-direction: column;
  height: 100%;
}

/* ========== DAY HEADER ========== */

.day-header {
  padding-bottom: var(--spacing-3);
  border-bottom: 2px solid var(--color-light-gray);
  margin-bottom: var(--spacing-3);
}

.day-name {
  font-family: var(--font-display);
  font-size: var(--text-lg);
  font-weight: 700;
  color: var(--color-black);
  margin: 0 0 var(--spacing-1) 0;
}

.day-date {
  font-size: var(--text-sm);
  color: var(--color-dark-gray);
  margin: 0 0 var(--spacing-2) 0;
}

.day-calories {
  font-size: var(--text-sm);
  font-weight: 600;
  color: var(--color-fresh-green);
  margin: 0;
}

/* ========== MEALS CONTAINER ========== */

.meals-container {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-4);
}

/* ========== MEAL SECTION ========== */

.meal-section {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-2);
}

.meal-type-label {
  font-size: var(--text-sm);
  font-weight: 600;
  color: var(--color-dark-gray);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin: 0;
}

/* ========== EMPTY MEAL SLOT ========== */

.empty-meal-slot {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-2);
  border: 2px dashed var(--color-medium-gray);
  border-radius: var(--radius-lg);
  background-color: rgba(120, 224, 143, 0.02);
  transition: all var(--duration-normal) var(--ease-in-out);
  
  &:hover {
    border-color: var(--color-fresh-green);
    background-color: rgba(120, 224, 143, 0.05);
  }
}

/* ========== MEAL ITEMS ========== */

.meal-items {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-2);
}

/* ========== MEAL ITEM CARD ========== */

.meal-item-card {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
  padding: var(--spacing-2) var(--spacing-3);
  background-color: var(--color-white);
  border: 1px solid var(--color-medium-gray);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  transition: all var(--duration-normal) var(--ease-in-out);
  position: relative;
  
  &:hover {
    box-shadow: var(--shadow-md);
    transform: translateY(-1px);
    
    .remove-btn {
      opacity: 1;
    }
  }
}

.meal-info {
  flex: 1;
  min-width: 0;
}

.meal-name {
  font-size: var(--text-sm);
  font-weight: 600;
  color: var(--color-black);
  margin: 0 0 var(--spacing-1) 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.meal-details {
  font-size: 0.75rem;
  color: var(--color-dark-gray);
  margin: 0;
}

.meal-kcal {
  font-weight: 600;
  color: var(--color-fresh-green);
}

/* ========== REMOVE BUTTON ========== */

.remove-btn {
  flex-shrink: 0;
  width: 28px;
  height: 28px;
  padding: 0;
  background-color: transparent;
  border: none;
  border-radius: var(--radius-md);
  color: var(--color-dark-gray);
  cursor: pointer;
  transition: all var(--duration-fast) var(--ease-in-out);
  opacity: 0;
  
  &:hover {
    background-color: #fee2e2;
    color: #dc2626;
  }
  
  &:active {
    transform: scale(0.95);
  }
}

/* ========== RESPONSIVE ADJUSTMENTS ========== */

@media (max-width: 768px) {
  .page-header {
    padding: var(--spacing-3);
  }
  
  .main-content {
    padding: var(--spacing-3);
  }
  
  .page-title {
    font-size: var(--text-xl);
  }
  
  .header-actions {
    width: 100%;
  }
}

@media (max-width: 480px) {
  .page-header {
    padding: var(--spacing-2);
  }
  
  .main-content {
    padding: var(--spacing-2);
  }
  
  .page-title {
    font-size: var(--text-lg);
  }
}

@media (prefers-reduced-motion: reduce) {
  .meal-item-card:hover {
    transform: none;
  }
  
  .spinner-large {
    animation: none;
  }
}
</style>
