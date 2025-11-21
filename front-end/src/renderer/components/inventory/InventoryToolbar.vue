<template>
  <div class="toolbar">
    <div class="toolbar-content">
      <!-- Search Bar -->
      <div class="search-wrapper">
        <svg class="search-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          :value="searchQuery"
          @input="$emit('update:searchQuery', ($event.target as HTMLInputElement).value)"
          type="text"
          placeholder="Search ingredients..."
          class="search-input"
        />
        <button v-if="searchQuery" @click="$emit('update:searchQuery', '')" class="search-clear">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Category Pills -->
      <div class="category-pills">
        <button
          @click="$emit('update:selectedCategory', 'all')"
          :class="['pill', selectedCategory === 'all' && 'pill-active']"
        >
          All Items
        </button>
        <button
          @click="$emit('update:selectedCategory', 'low-stock')"
          :class="['pill', 'pill-warning', selectedCategory === 'low-stock' && 'pill-active']"
        >
          Low Stock
          <span v-if="lowStockCount > 0" class="pill-badge pill-badge-warning">
            {{ lowStockCount }}
          </span>
        </button>
        <button
          @click="$emit('update:selectedCategory', 'missing')"
          :class="['pill', 'pill-danger', selectedCategory === 'missing' && 'pill-active']"
        >
          Missing
          <span v-if="missingCount > 0" class="pill-badge pill-badge-danger">
            {{ missingCount }}
          </span>
        </button>
      </div>

      <!-- Status Pill -->
      <button
        v-if="totalNeeded > 0"
        @click="$emit('update:selectedCategory', missingCount > 0 ? 'missing' : 'low-stock')"
        class="status-pill"
      >
        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
          <path fill-rule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clip-rule="evenodd" />
        </svg>
        <span class="font-medium">This Week:</span>
        <span v-if="missingCount > 0" class="status-badge status-badge-danger">
          {{ missingCount }} missing
        </span>
        <span v-else-if="lowStockCount > 0" class="status-badge status-badge-warning">
          {{ lowStockCount }} low
        </span>
        <span v-else class="status-badge status-badge-success">
          ✓ All set
        </span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  searchQuery: string
  selectedCategory: 'all' | 'low-stock' | 'missing'
  lowStockCount: number
  missingCount: number
  totalNeeded: number
}>()

defineEmits<{
  'update:searchQuery': [value: string]
  'update:selectedCategory': [value: 'all' | 'low-stock' | 'missing']
}>()
</script>

<style scoped>
.toolbar {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(8px);
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  padding: 1rem;
  position: sticky;
  top: 4.5rem;
  z-index: 10;
}

.toolbar-content {
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  align-items: center;
}

.search-wrapper {
  position: relative;
  flex: 1;
  min-width: 250px;
}

.search-icon {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  width: 1.25rem;
  height: 1.25rem;
  color: var(--color-dark-gray);
  pointer-events: none;
}

.search-input {
  width: 100%;
  padding: 0.75rem 3rem 0.75rem 3rem;
  border: 2px solid transparent;
  border-radius: 1rem;
  background: rgba(255, 255, 255, 0.95);
  font-size: 0.9375rem;
  color: var(--color-black);
  transition: all 0.2s ease;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.search-input:focus {
  outline: none;
  border-color: var(--color-fresh-green);
  background: white;
  box-shadow: 0 2px 8px rgba(120, 224, 143, 0.15);
}

.search-input::placeholder {
  color: var(--color-dark-gray);
}

.search-clear {
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  padding: 0.25rem;
  background: none;
  border: none;
  color: var(--color-dark-gray);
  cursor: pointer;
  border-radius: 0.375rem;
  transition: all 0.2s ease;
}

.search-clear:hover {
  background: rgba(0, 0, 0, 0.05);
  color: var(--color-black);
}

.category-pills {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.pill {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1rem;
  border-radius: 1.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  border: 2px solid transparent;
  background: white;
  color: var(--color-dark-gray);
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  white-space: nowrap;
}

.pill:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.12);
}

.pill-active {
  background: linear-gradient(135deg, var(--color-fresh-green) 0%, #6bc785 100%);
  color: white;
  border-color: var(--color-fresh-green);
  box-shadow: 0 2px 8px rgba(120, 224, 143, 0.3);
}

.pill-warning.pill-active {
  background: linear-gradient(135deg, #ff9800 0%, #f57c00 100%);
  border-color: #ff9800;
  box-shadow: 0 2px 8px rgba(255, 152, 0, 0.3);
}

.pill-danger.pill-active {
  background: linear-gradient(135deg, var(--color-strawberry-red) 0%, #e63946 100%);
  border-color: var(--color-strawberry-red);
  box-shadow: 0 2px 8px rgba(255, 107, 129, 0.3);
}

.pill-badge {
  padding: 0.125rem 0.5rem;
  border-radius: 1rem;
  font-size: 0.75rem;
  font-weight: 700;
}

.pill-badge-warning {
  background: rgba(255, 152, 0, 0.2);
  color: #e65100;
}

.pill-badge-danger {
  background: rgba(255, 107, 129, 0.2);
  color: #c62828;
}

.pill-active .pill-badge {
  background: rgba(255, 255, 255, 0.3);
  color: white;
}

.status-pill {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1rem;
  background: linear-gradient(135deg, rgba(120, 224, 143, 0.1) 0%, rgba(120, 224, 143, 0.05) 100%);
  border: 2px solid rgba(120, 224, 143, 0.2);
  border-radius: 1.5rem;
  font-size: 0.875rem;
  color: var(--color-black);
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.status-pill:hover {
  background: rgba(120, 224, 143, 0.15);
  border-color: var(--color-fresh-green);
  transform: translateY(-1px);
  box-shadow: 0 2px 6px rgba(120, 224, 143, 0.2);
}

.status-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.75rem;
  font-weight: 700;
}

.status-badge-success {
  background: rgba(120, 224, 143, 0.15);
  color: var(--color-fresh-green);
}

.status-badge-warning {
  background: rgba(255, 152, 0, 0.15);
  color: #e65100;
}

.status-badge-danger {
  background: rgba(255, 107, 129, 0.15);
  color: #c62828;
}

@media (max-width: 639px) {
  .toolbar-content {
    flex-direction: column;
    align-items: stretch;
  }

  .search-wrapper {
    min-width: 100%;
  }

  .category-pills {
    justify-content: flex-start;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;
  }

  .category-pills::-webkit-scrollbar {
    display: none;
  }

  .status-pill {
    width: 100%;
    justify-content: center;
  }
}
</style>
