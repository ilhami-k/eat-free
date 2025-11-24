<template>
  <Card elevation="md" class="meal-card">
    <div class="meal-header">
      <h3 class="meal-title">{{ emoji }} {{ mealTitle }}</h3>
      <span class="meal-calories">{{ mealCalories }} kcal</span>
    </div>

    <div class="meal-content">
      <div v-if="entries.length === 0" class="empty-meal">
        <p class="empty-text">No items logged</p>
      </div>

      <div v-else class="items-content">
        <div class="meal-items">
          <div
            v-for="entry in paginatedEntries"
            :key="`entry-${entry.id}`"
            class="meal-item"
          >
            <div class="item-info">
              <p class="item-name">{{ entry.recipe?.name || 'Unknown' }}</p>
              <p class="item-portion">{{ entry.servings_eaten }} serving{{ entry.servings_eaten !== 1 ? 's' : '' }}</p>
            </div>
            <div class="item-actions">
              <span class="item-calories">{{ Math.round(entry.kcal || 0) }} kcal</span>
              <button class="delete-btn" @click="$emit('delete', entry.id)" title="Delete">
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <!-- Pagination controls -->
        <div v-if="totalPages > 1" class="pagination">
          <button
            class="page-btn"
            @click="previousPage"
            :disabled="currentPage === 1"
          >
            ‹
          </button>
          <span class="page-info">{{ currentPage }} / {{ totalPages }}</span>
          <button
            class="page-btn"
            @click="nextPage"
            :disabled="currentPage === totalPages"
          >
            ›
          </button>
        </div>
      </div>
    </div>

    <div class="meal-footer">
      <Button variant="ghost" size="sm" :fullWidth="true" @click="$emit('add-food')">
        <template #iconLeft>
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" />
          </svg>
        </template>
        Add Food
      </Button>
    </div>
  </Card>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { Button, Card } from '@/renderer/components/ui'
import type Journal from '@/shared/journal'

interface Props {
  mealTitle: string
  emoji: string
  entries: Journal[]
}

const props = defineProps<Props>()

defineEmits<{
  'add-food': []
  'delete': [id: number]
}>()

const currentPage = ref(1)
const itemsPerPage = 2

const totalPages = computed(() => {
  return Math.ceil(props.entries.length / itemsPerPage)
})

const paginatedEntries = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return props.entries.slice(start, end)
})

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}

const previousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

watch(() => props.entries.length, () => {
  if (currentPage.value > totalPages.value) {
    currentPage.value = 1
  }
})

const mealCalories = computed(() => {
  return props.entries.reduce((sum, entry) => {
    const kcal = entry.kcal || 0
    return sum + kcal
  }, 0)
})
</script>

<style scoped>
.meal-card {
  display: flex;
  flex-direction: column;
  height: 500px;
}

.meal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: var(--spacing-3);
  border-bottom: 2px solid var(--color-light-gray);
  margin-bottom: var(--spacing-3);
  flex-shrink: 0;
}

.meal-title {
  font-size: var(--text-lg);
  font-weight: 700;
  color: var(--color-black);
  margin: 0;
}

.meal-calories {
  font-size: var(--text-sm);
  font-weight: 600;
  color: var(--color-fresh-green);
  background-color: rgba(120, 224, 143, 0.1);
  padding: var(--spacing-1) var(--spacing-2);
  border-radius: var(--radius-full);
}

.meal-content {
  height: 350px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.empty-meal {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-4);
}

.empty-text {
  font-size: var(--text-sm);
  color: var(--color-dark-gray);
  font-style: italic;
  margin: 0;
}

.items-content {
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.meal-items {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-2);
  flex-shrink: 0;
  margin-bottom: var(--spacing-3);
}

.meal-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--spacing-2) var(--spacing-3);
  background-color: var(--color-light-gray);
  border-radius: var(--radius-lg);
  transition: all var(--duration-fast) var(--ease-in-out);
}

.meal-item:hover {
  background-color: #e5e7eb;
  transform: translateX(2px);
}

.item-info {
  flex: 1;
  min-width: 0;
}

.item-name {
  font-size: var(--text-sm);
  font-weight: 600;
  color: var(--color-black);
  margin: 0 0 var(--spacing-1) 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.item-portion {
  font-size: 0.75rem;
  color: var(--color-dark-gray);
  margin: 0;
}

.item-actions {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
  flex-shrink: 0;
}

.item-calories {
  font-size: var(--text-sm);
  font-weight: 700;
  color: var(--color-black);
}

.delete-btn {
  padding: var(--spacing-1);
  background-color: transparent;
  border: none;
  color: #dc2626;
  cursor: pointer;
  border-radius: var(--radius-md);
  transition: all var(--duration-fast) var(--ease-in-out);
  opacity: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 24px;
  min-height: 24px;
}

.delete-btn svg {
  width: 16px;
  height: 16px;
}

.delete-btn:hover {
  background-color: #fee2e2;
  transform: scale(1.1);
}

.delete-btn:active {
  transform: scale(0.95);
}

.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-3);
  padding: var(--spacing-2) 0;
  margin-top: var(--spacing-2);
}

.page-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background-color: var(--color-light-gray);
  border: none;
  border-radius: var(--radius-md);
  cursor: pointer;
  font-size: var(--text-lg);
  font-weight: 600;
  color: var(--color-black);
  transition: all var(--duration-fast) var(--ease-in-out);
}

.page-btn:hover:not(:disabled) {
  background-color: var(--color-fresh-green);
  color: white;
}

.page-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.page-info {
  font-size: var(--text-sm);
  font-weight: 600;
  color: var(--color-dark-gray);
  min-width: 60px;
  text-align: center;
}

.meal-footer {
  padding-top: var(--spacing-3);
  border-top: 1px solid var(--color-light-gray);
  flex-shrink: 0;
}

@media (prefers-reduced-motion: reduce) {
  .meal-item:hover {
    transform: none;
  }
}
</style>
