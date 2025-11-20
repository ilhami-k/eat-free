<template>
  <div class="date-navigator">
    <Button variant="ghost" size="sm" @click="$emit('previous')">
      <template #iconLeft>
        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" />
        </svg>
      </template>
    </Button>
    
    <div class="current-date">
      <p class="date-main">{{ formatDate(selectedDate) }}</p>
      <p class="date-sub">{{ formatDayOfWeek(selectedDate) }}</p>
    </div>
    
    <Button variant="ghost" size="sm" @click="$emit('next')">
      <template #iconRight>
        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" />
        </svg>
      </template>
    </Button>
    
    <Button variant="ghost" size="sm" @click="$emit('today')">Today</Button>
  </div>
</template>

<script setup lang="ts">
import { Button } from '@/renderer/components/ui'

interface Props {
  selectedDate: Date
}

defineProps<Props>()

defineEmits<{
  previous: []
  next: []
  today: []
}>()

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
</script>

<style scoped>
.date-navigator {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
  flex-wrap: wrap;
}

.current-date {
  flex: 1;
  text-align: center;
  padding: 0 var(--spacing-2);
}

.date-main {
  font-size: var(--text-lg);
  font-weight: 600;
  color: var(--color-black);
  margin: 0;
}

.date-sub {
  font-size: var(--text-sm);
  color: var(--color-dark-gray);
  margin: 0;
}

@media (max-width: 768px) {
  .date-navigator {
    justify-content: center;
  }
  
  .current-date {
    flex: 0 1 auto;
  }
}
</style>
