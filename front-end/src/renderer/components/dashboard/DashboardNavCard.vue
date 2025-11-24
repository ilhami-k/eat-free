<template>
  <button
    @click="$emit('click')"
    :class="['nav-card', `nav-card--${variant}`]"
  >
    <div class="nav-card-bg"></div>
    <div class="nav-card-content">
      <div class="nav-card-header">
        <div :class="['nav-card-icon-wrapper', `nav-card-icon--${variant}`]">
          <component :is="iconSvg" class="nav-card-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" />
        </div>
        <div class="nav-card-arrow">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
      <h2 class="nav-card-title">{{ title }}</h2>
      <p class="nav-card-desc">{{ description }}</p>
      <div class="nav-card-meta">
        <span class="nav-card-badge">{{ badge }}</span>
        <span class="nav-card-feature">{{ feature }}</span>
      </div>
    </div>
  </button>
</template>

<script setup lang="ts">
import { h, computed } from 'vue'

type NavCardVariant = 'green' | 'blue' | 'yellow' | 'red'

interface Props {
  variant: NavCardVariant
  title: string
  description: string
  badge: string
  feature: string
  icon: 'inventory' | 'recipes' | 'mealplans' | 'journal'
}

interface Emits {
  (e: 'click'): void
}

const props = defineProps<Props>()
defineEmits<Emits>()

const iconSvg = computed(() => {
  const icons = {
    inventory: () => h('path', {
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round',
      'stroke-width': '2',
      d: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4'
    }),
    recipes: () => h('path', {
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round',
      'stroke-width': '2',
      d: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253'
    }),
    mealplans: () => h('path', {
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round',
      'stroke-width': '2',
      d: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z'
    }),
    journal: () => h('path', {
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round',
      'stroke-width': '2',
      d: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
    })
  }
  return icons[props.icon]
})
</script>

<style scoped>

.nav-card {
  position: relative;
  background-color: var(--color-white);
  border-radius: var(--radius-2xl);
  padding: var(--spacing-6);
  border: 2px solid transparent;
  box-shadow: var(--shadow-md);
  cursor: pointer;
  overflow: hidden;
  transition: all var(--duration-normal) var(--ease-out);
  text-align: left;
}

.nav-card:hover {
  box-shadow: var(--shadow-xl);
  transform: translateY(-8px) scale(1.02);
}

.nav-card--green:hover {
  border-color: var(--color-fresh-green);
}

.nav-card--blue:hover {
  border-color: var(--color-sky-blue);
}

.nav-card--yellow:hover {
  border-color: var(--color-banana-yellow);
}

.nav-card--red:hover {
  border-color: var(--color-strawberry-red);
}

.nav-card-bg {
  position: absolute;
  top: -50px;
  right: -50px;
  width: 200px;
  height: 200px;
  border-radius: var(--radius-full);
  opacity: 0.05;
  transition: all var(--duration-slower) var(--ease-out);
}

.nav-card--green .nav-card-bg {
  background-color: var(--color-fresh-green);
}

.nav-card--blue .nav-card-bg {
  background-color: var(--color-sky-blue);
}

.nav-card--yellow .nav-card-bg {
  background-color: var(--color-banana-yellow);
}

.nav-card--red .nav-card-bg {
  background-color: var(--color-strawberry-red);
}

.nav-card:hover .nav-card-bg {
  transform: scale(1.5);
  opacity: 0.1;
}

.nav-card-content {
  position: relative;
  z-index: 2;
}

.nav-card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--spacing-4);
}

.nav-card-icon-wrapper {
  padding: var(--spacing-3);
  border-radius: var(--radius-xl);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--duration-normal) var(--ease-bounce);
}

.nav-card:hover .nav-card-icon-wrapper {
  transform: rotate(-10deg) scale(1.1);
}

.nav-card-icon--green {
  background-color: rgba(120, 224, 143, 0.15);
  color: #2d5a3d;
}

.nav-card-icon--blue {
  background-color: rgba(52, 172, 224, 0.15);
  color: #1e5f7a;
}

.nav-card-icon--yellow {
  background-color: rgba(255, 211, 42, 0.15);
  color: #8B6914;
}

.nav-card-icon--red {
  background-color: rgba(255, 107, 129, 0.15);
  color: #a83241;
}

.nav-card-icon {
  width: 2rem;
  height: 2rem;
}

.nav-card-arrow {
  width: 1.5rem;
  height: 1.5rem;
  color: var(--color-medium-gray);
  transition: all var(--duration-normal) var(--ease-out);
  opacity: 0;
}

.nav-card:hover .nav-card-arrow {
  opacity: 1;
  transform: translateX(4px);
}

.nav-card--green:hover .nav-card-arrow {
  color: var(--color-fresh-green);
}

.nav-card--blue:hover .nav-card-arrow {
  color: var(--color-sky-blue);
}

.nav-card--yellow:hover .nav-card-arrow {
  color: var(--color-banana-yellow);
}

.nav-card--red:hover .nav-card-arrow {
  color: var(--color-strawberry-red);
}

.nav-card-title {
  font-family: var(--font-display);
  font-size: var(--text-2xl);
  font-weight: 700;
  color: var(--color-black);
  margin-bottom: var(--spacing-2);
  transition: color var(--duration-normal) var(--ease-out);
}

.nav-card--green:hover .nav-card-title {
  color: var(--color-fresh-green);
}

.nav-card--blue:hover .nav-card-title {
  color: var(--color-sky-blue);
}

.nav-card--yellow:hover .nav-card-title {
  color: var(--color-banana-yellow);
}

.nav-card--red:hover .nav-card-title {
  color: var(--color-strawberry-red);
}

.nav-card-desc {
  font-family: var(--font-body);
  font-size: var(--text-body);
  color: var(--color-dark-gray);
  margin-bottom: var(--spacing-4);
  line-height: 1.6;
}

.nav-card-meta {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
  flex-wrap: wrap;
}

.nav-card-badge {
  font-family: var(--font-body);
  font-size: var(--text-body-sm);
  font-weight: 700;
  padding: var(--spacing-1) var(--spacing-2);
  border-radius: var(--radius-full);
  transition: all var(--duration-normal) var(--ease-out);
}

.nav-card--green .nav-card-badge {
  background-color: rgba(120, 224, 143, 0.15);
  color: #2d5a3d;
}

.nav-card--blue .nav-card-badge {
  background-color: rgba(52, 172, 224, 0.15);
  color: #1e5f7a;
}

.nav-card--yellow .nav-card-badge {
  background-color: rgba(255, 211, 42, 0.15);
  color: #8B6914;
}

.nav-card--red .nav-card-badge {
  background-color: rgba(255, 107, 129, 0.15);
  color: #a83241;
}

.nav-card-feature {
  font-family: var(--font-body);
  font-size: var(--text-body-sm);
  color: var(--color-dark-gray);
}

@media (max-width: 639px) {
  .nav-card {
    padding: var(--spacing-4);
  }

  .nav-card-title {
    font-size: var(--text-lg);
  }

  .nav-card-desc {
    font-size: var(--text-sm);
  }
}

@media (prefers-reduced-motion: reduce) {
  .nav-card {
    transition: box-shadow var(--duration-fast) ease-in-out;
  }

  .nav-card:hover {
    transform: none;
  }
}
</style>
