<template>
  <div class="flex flex-col h-screen overflow-hidden bg-neutral-50">
    <!-- Header -->
    <div class="bg-white border-b border-neutral-200 shadow-sm p-4 flex-shrink-0">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-display font-bold text-neutral-900">
            Food Journal
          </h1>
          <p class="text-sm text-neutral-600">
            Track your daily nutrition
          </p>
        </div>
        <div class="flex gap-2">
          <Button variant="secondary" size="sm" @click="previousDay">
            ← Previous
          </Button>
          <Button variant="secondary" size="sm" @click="goToToday">
            Today
          </Button>
          <Button variant="secondary" size="sm" @click="nextDay">
            Next →
          </Button>
        </div>
      </div>
    </div>

    <!-- Main Content Area -->
    <main class="flex-1 overflow-y-auto">
      <div class="p-4 md:p-6 lg:p-8 max-w-4xl mx-auto">
        <!-- Date Display -->
        <div class="mb-6 text-center">
          <h2 class="text-xl font-semibold text-neutral-900">
            {{ formatDate(selectedDate) }}
          </h2>
          <p class="text-sm text-neutral-600">
            {{ formatDayOfWeek(selectedDate) }}
          </p>
        </div>

        <!-- Loading State -->
        <div v-if="isLoading" class="flex justify-center py-16">
          <div class="h-10 w-10 animate-spin rounded-full border-4 border-fresh-green/20 border-t-fresh-green"></div>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="rounded-lg bg-red-50 p-6 border border-red-200 mb-6">
          <h3 class="font-semibold text-red-900 mb-2">Error Loading Journal</h3>
          <p class="text-sm text-red-700 mb-4">{{ error.message }}</p>
          <Button variant="secondary" size="sm" @click="retryLoad">
            Try Again
          </Button>
        </div>

        <!-- Daily Summary Card -->
        <div class="mb-6 bg-gradient-to-br from-fresh-green to-fresh-green/80 rounded-xl p-6 text-white shadow-lg">
          <p class="text-sm font-medium mb-2 opacity-90">Total Calories</p>
          <p class="text-5xl font-bold mb-4">{{ dailyTotals.calories }}</p>
          <div class="grid grid-cols-3 gap-4">
            <div>
              <p class="text-xs opacity-80 mb-1">Protein</p>
              <p class="text-2xl font-semibold">{{ dailyTotals.protein }}g</p>
            </div>
            <div>
              <p class="text-xs opacity-80 mb-1">Carbs</p>
              <p class="text-2xl font-semibold">{{ dailyTotals.carbs }}g</p>
            </div>
            <div>
              <p class="text-xs opacity-80 mb-1">Fat</p>
              <p class="text-2xl font-semibold">{{ dailyTotals.fat }}g</p>
            </div>
          </div>
        </div>

        <!-- Journal Entries -->
        <div class="mb-6">
          <h3 class="text-lg font-semibold text-neutral-900 mb-4">Meals Logged</h3>
          
          <!-- Empty State -->
          <div v-if="!isLoading && todayEntries.length === 0" class="text-center py-12 bg-white rounded-lg border border-neutral-200">
            <svg class="w-16 h-16 text-neutral-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <p class="text-neutral-600 mb-4">No meals logged yet</p>
            <Button size="sm" @click="showAddEntryDialog = true">
              Log Your First Meal
            </Button>
          </div>

          <!-- Entries List -->
          <div v-else class="space-y-3">
            <div
              v-for="entry in todayEntries"
              :key="`entry-${entry.id}`"
              class="bg-white rounded-lg border border-neutral-200 p-4 hover:shadow-md transition-shadow group"
            >
              <div class="flex items-start justify-between">
                <div class="flex-1">
                  <div class="flex items-center gap-2 mb-2">
                    <h4 class="font-semibold text-neutral-900">
                      {{ entry.recipe?.name || 'Unknown Recipe' }}
                    </h4>
                    <span class="text-xs px-2 py-1 rounded-full bg-neutral-100 text-neutral-600">
                      {{ entry.servings_eaten }} serving<span v-if="entry.servings_eaten !== 1">s</span>
                    </span>
                  </div>
                  
                  <div class="grid grid-cols-4 gap-3 text-sm">
                    <div>
                      <p class="text-xs text-neutral-600">Calories</p>
                      <p class="font-semibold text-fresh-green">{{ entry.kcal }}</p>
                    </div>
                    <div>
                      <p class="text-xs text-neutral-600">Protein</p>
                      <p class="font-medium text-neutral-900">{{ entry.protein_g }}g</p>
                    </div>
                    <div>
                      <p class="text-xs text-neutral-600">Carbs</p>
                      <p class="font-medium text-neutral-900">{{ entry.carbs_g }}g</p>
                    </div>
                    <div>
                      <p class="text-xs text-neutral-600">Fat</p>
                      <p class="font-medium text-neutral-900">{{ entry.fat_g }}g</p>
                    </div>
                  </div>
                  
                  <p class="text-xs text-neutral-500 mt-2">
                    Logged at {{ formatTime(entry.logged_at) }}
                  </p>
                </div>

                <button
                  @click="deleteEntry(BigInt(entry.id))"
                  class="ml-4 text-neutral-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                  title="Delete entry"
                >
                  <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Weekly Summary (Optional) -->
        <div class="bg-white rounded-lg border border-neutral-200 p-6">
          <h3 class="text-lg font-semibold text-neutral-900 mb-4">Week at a Glance</h3>
          <div class="grid grid-cols-7 gap-2">
            <div
              v-for="(day, idx) in weekDays"
              :key="`week-${idx}`"
              class="text-center"
            >
              <p class="text-xs font-medium text-neutral-600 mb-1">
                {{ formatDayShort(day) }}
              </p>
              <div
                :class="[
                  'rounded-lg py-2 px-1',
                  isSameDay(day, selectedDate) ? 'bg-fresh-green text-white' : 'bg-neutral-50',
                ]"
              >
                <button
                  @click="selectDate(day)"
                  class="w-full"
                >
                  <p class="text-xs font-semibold">
                    {{ getDateNumber(day) }}
                  </p>
                  <p :class="['text-xs', isSameDay(day, selectedDate) ? 'text-white' : 'text-neutral-600']">
                    {{ getCaloriesForDay(day) }}
                  </p>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- FAB for Adding Entry -->
    <div class="fixed bottom-6 right-6 z-40">
      <Button
        @click="showAddEntryDialog = true"
        class="rounded-full w-14 h-14 md:w-16 md:h-16 flex items-center justify-center font-bold text-lg md:text-xl shadow-lg hover:shadow-xl transition-all"
      >
        +
      </Button>
    </div>

    <!-- Add Entry Modal -->
    <AddJournalEntryModal
      v-if="showAddEntryDialog"
      :userId="currentUserId"
      :date="selectedDate"
      @close="showAddEntryDialog = false"
      @added="handleEntryAdded"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useJournalService } from '@/renderer/composables/useJournalService'
import { Button } from '@/renderer/components/ui'
import AddJournalEntryModal from '@/renderer/components/modals/AddJournalEntryModal.vue'
import type Journal from '@/shared/journal'

interface Props {
  currentUserId: bigint
}

const props = defineProps<Props>()

const journalService = useJournalService(window.electronService?.journal)
const selectedDate = ref(new Date())
const showAddEntryDialog = ref(false)

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

const weekDays = computed(() => {
  const days: Date[] = []
  const start = getWeekStart(selectedDate.value)
  for (let i = 0; i < 7; i++) {
    const day = new Date(start)
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
  d.setHours(0, 0, 0, 0)
  return d
}

function formatDate(date: Date): string {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

function formatDayOfWeek(date: Date): string {
  return new Date(date).toLocaleDateString('en-US', {
    weekday: 'long',
  })
}

function formatDayShort(date: Date): string {
  return new Date(date).toLocaleDateString('en-US', {
    weekday: 'short',
  })
}

function formatTime(dateString: string): string {
  return new Date(dateString).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  })
}

function getDateNumber(date: Date): number {
  return new Date(date).getDate()
}

function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getDate() === date2.getDate() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getFullYear() === date2.getFullYear()
  )
}

function getCaloriesForDay(day: Date): string {
  const dayStart = new Date(day)
  dayStart.setHours(0, 0, 0, 0)
  const dayEnd = new Date(day)
  dayEnd.setHours(23, 59, 59, 999)

  const dayEntries = journalEntries.value.filter(entry => {
    const entryDate = new Date(entry.logged_at)
    return entryDate >= dayStart && entryDate <= dayEnd
  })

  const total = dayEntries.reduce((sum, entry) => sum + entry.kcal, 0)
  return total > 0 ? `${total}` : '-'
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

function selectDate(date: Date): void {
  selectedDate.value = new Date(date)
}

async function loadJournalEntries(): Promise<void> {
  const weekStart = getWeekStart(selectedDate.value)
  const weekEnd = new Date(weekStart)
  weekEnd.setDate(weekEnd.getDate() + 7)
  
  await journalService.fetchJournalEntries(props.currentUserId, weekStart, weekEnd)
}

async function handleEntryAdded(): Promise<void> {
  showAddEntryDialog.value = false
  await loadJournalEntries()
}

async function deleteEntry(id: bigint): Promise<void> {
  if (!confirm('Delete this journal entry?')) {
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
