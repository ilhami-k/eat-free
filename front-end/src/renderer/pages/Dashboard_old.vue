<template>
  <div class="dashboard">
    <section class="hero">
      <div class="hero-content">
        <h1 class="hero-title animate-bounce-in">
          Welcome back, {{ currentUser?.name || 'Chef' }}! 窓
        </h1>
        <p class="hero-subtitle">
          Let's create something delicious today
        </p>
      </div>
      <div class="hero-decoration">
        <div class="bubble bubble--lg bubble--green animate-float"></div>
        <div class="bubble bubble--md bubble--yellow animate-float" style="animation-delay: 0.2s;"></div>
        <div class="bubble bubble--sm bubble--blue animate-float" style="animation-delay: 0.4s;"></div>
      </div>
    </section>

    <section class="stats-grid">
      <div class="stat-card stat-card--green animate-pop" style="animation-delay: 0.1s;">
        <div class="stat-icon-wrapper stat-icon--green">
          <svg class="stat-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
        </div>
        <div class="stat-content">
          <p class="stat-value">{{ inventoryCount }}</p>
          <p class="stat-label">Inventory Items</p>
        </div>
      </div>

      <div class="stat-card stat-card--blue animate-pop" style="animation-delay: 0.2s;">
        <div class="stat-icon-wrapper stat-icon--blue">
          <svg class="stat-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        </div>
        <div class="stat-content">
          <p class="stat-value">{{ recipesCount }}</p>
          <p class="stat-label">Saved Recipes</p>
        </div>
      </div>

      <div class="stat-card stat-card--yellow animate-pop" style="animation-delay: 0.3s;">
        <div class="stat-icon-wrapper stat-icon--yellow">
          <svg class="stat-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <div class="stat-content">
          <p class="stat-value">{{ weekMealsCount }}</p>
          <p class="stat-label">Meals This Week</p>
        </div>
      </div>

      <div class="stat-card stat-card--red animate-pop" style="animation-delay: 0.4s;">
        <div class="stat-icon-wrapper stat-icon--red">
          <svg class="stat-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <div class="stat-content">
          <p class="stat-value">{{ todayCalories }}</p>
          <p class="stat-label">Calories Today</p>
        </div>
      </div>
    </section>

    <section class="nav-cards">
      <button
        @click="$emit('navigate', 'inventory')"
        class="nav-card nav-card--green"
      >
        <div class="nav-card-bg"></div>
        <div class="nav-card-content">
          <div class="nav-card-header">
            <div class="nav-card-icon-wrapper nav-card-icon--green">
              <svg class="nav-card-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <div class="nav-card-arrow">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
          <h2 class="nav-card-title">･Inventory</h2>
          <p class="nav-card-desc">Manage your ingredients and track what's in stock</p>
          <div class="nav-card-meta">
            <span class="nav-card-badge">{{ inventoryCount }} items</span>
            <span class="nav-card-feature">Track expiry dates</span>
          </div>
        </div>
      </button>

      <button
        @click="$emit('navigate', 'recipes')"
        class="nav-card nav-card--blue"
      >
        <div class="nav-card-bg"></div>
        <div class="nav-card-content">
          <div class="nav-card-header">
            <div class="nav-card-icon-wrapper nav-card-icon--blue">
              <svg class="nav-card-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <div class="nav-card-arrow">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
          <h2 class="nav-card-title">･Recipes</h2>
          <p class="nav-card-desc">Browse and create your favorite recipes with nutrition info</p>
          <div class="nav-card-meta">
            <span class="nav-card-badge">{{ recipesCount }} recipes</span>
            <span class="nav-card-feature">Full nutrition data</span>
          </div>
        </div>
      </button>

      <button
        @click="$emit('navigate', 'mealplans')"
        class="nav-card nav-card--yellow"
      >
        <div class="nav-card-bg"></div>
        <div class="nav-card-content">
          <div class="nav-card-header">
            <div class="nav-card-icon-wrapper nav-card-icon--yellow">
              <svg class="nav-card-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div class="nav-card-arrow">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
          <h2 class="nav-card-title">套 Meal Plans</h2>
          <p class="nav-card-desc">Plan your weekly meals and stay organized</p>
          <div class="nav-card-meta">
            <span class="nav-card-badge">{{ weekMealsCount }} this week</span>
            <span class="nav-card-feature">Weekly planning</span>
          </div>
        </div>
      </button>

      <button
        @click="$emit('navigate', 'journal')"
        class="nav-card nav-card--red"
      >
        <div class="nav-card-bg"></div>
        <div class="nav-card-content">
          <div class="nav-card-header">
            <div class="nav-card-icon-wrapper nav-card-icon--red">
              <svg class="nav-card-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div class="nav-card-arrow">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
          <h2 class="nav-card-title">涛 Journal</h2>
          <p class="nav-card-desc">Track your daily nutrition and calorie intake</p>
          <div class="nav-card-meta">
            <span class="nav-card-badge">{{ todayCalories }} kcal today</span>
            <span class="nav-card-feature">Daily tracking</span>
          </div>
        </div>
      </button>
    </section>

    <section class="quick-actions">
      <div class="quick-actions-header">
        <h3 class="quick-actions-title">笞｡ Quick Actions</h3>
        <p class="quick-actions-subtitle">Jump right into what you need</p>
      </div>
      <div class="quick-actions-grid">
        <button
          @click="$emit('navigate', 'recipes')"
          class="quick-action-btn quick-action--green"
        >
          <div class="quick-action-icon">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
          <div class="quick-action-content">
            <span class="quick-action-label">Create Recipe</span>
            <span class="quick-action-desc">Add a new recipe</span>
          </div>
        </button>

        <button
          @click="$emit('navigate', 'journal')"
          class="quick-action-btn quick-action--blue"
        >
          <div class="quick-action-icon">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </div>
          <div class="quick-action-content">
            <span class="quick-action-label">Log Meal</span>
            <span class="quick-action-desc">Track what you ate</span>
          </div>
        </button>

        <button
          @click="$emit('navigate', 'journal')"
          class="quick-action-btn quick-action--red"
        >
          <div class="quick-action-icon">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <div class="quick-action-content">
            <span class="quick-action-label">Journal Entry</span>
            <span class="quick-action-desc">Record your day</span>
          </div>
        </button>

        <button
          @click="$emit('navigate', 'mealplans')"
          class="quick-action-btn quick-action--yellow"
        >
          <div class="quick-action-icon">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <div class="quick-action-content">
            <span class="quick-action-label">Plan Week</span>
            <span class="quick-action-desc">Organize meals</span>
          </div>
        </button>

        <button
          @click="$emit('navigate', 'inventory')"
          class="quick-action-btn quick-action--purple"
        >
          <div class="quick-action-icon">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
          <div class="quick-action-content">
            <span class="quick-action-label">Add Ingredient</span>
            <span class="quick-action-desc">Stock inventory</span>
          </div>
        </button>

        <button
          @click="$emit('navigate', 'recipes')"
          class="quick-action-btn quick-action--orange"
        >
          <div class="quick-action-icon">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <div class="quick-action-content">
            <span class="quick-action-label">Browse Recipes</span>
            <span class="quick-action-desc">Find inspiration</span>
          </div>
        </button>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import type User from '@/shared/user'

interface Props {
  currentUser: User
  inventoryCount: number
  recipesCount: number
  weekMealsCount: number
  todayCalories: number
}

interface Emits {
  (e: 'navigate', page: 'inventory' | 'recipes' | 'mealplans' | 'journal'): void
  (e: 'logout'): void
}

defineProps<Props>()
defineEmits<Emits>()
</script>

<style scoped>

.dashboard {

  width: 100%;

  background: transparent;
}

.hero {
  position: relative;

  padding: var(--spacing-2) 0 var(--spacing-4);
  margin-bottom: var(--spacing-6);
  text-align: center;
  overflow: hidden;
}

.hero-content {
  position: relative;
  z-index: 2;
}

.hero-title {
  font-family: var(--font-display);
  font-size: clamp(2rem, 5vw, 3rem);
  font-weight: 700;
  color: var(--color-black);
  margin-bottom: var(--spacing-2);
  line-height: 1.2;
}

.hero-subtitle {
  font-family: var(--font-body);
  font-size: var(--text-lg);
  color: var(--color-dark-gray);
  font-weight: 400;
}

.hero-decoration {
  position: absolute;
  top: 0;
  right: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  overflow: hidden;
  z-index: 1;
}

.bubble {
  position: absolute;
  border-radius: var(--radius-full);
  opacity: 0.1;
}

.bubble--lg {
  width: 200px;
  height: 200px;
  top: -50px;
  right: 10%;
}

.bubble--md {
  width: 120px;
  height: 120px;
  top: 50%;
  right: 30%;
}

.bubble--sm {
  width: 80px;
  height: 80px;
  top: 20%;
  right: 50%;
}

.bubble--green {
  background-color: var(--color-fresh-green);
}

.bubble--yellow {
  background-color: var(--color-banana-yellow);
}

.bubble--blue {
  background-color: var(--color-sky-blue);
}

.stats-grid {
  display: grid;

  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: var(--spacing-4);
  margin-bottom: var(--spacing-8);
}

.stat-card {
  background-color: var(--color-white);
  border-radius: var(--radius-xl);
  padding: var(--spacing-4);
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--spacing-3);
  box-shadow: var(--shadow-sm);
  border: 2px solid transparent;
  transition: all var(--duration-normal) var(--ease-out);
}

@media (min-width: 640px) {
  .stat-card {
    flex-direction: row;
    align-items: center;
  }
}

.stat-card:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-4px);
}

.stat-card--green:hover {
  border-color: rgba(120, 224, 143, 0.3);
}

.stat-card--blue:hover {
  border-color: rgba(52, 172, 224, 0.3);
}

.stat-card--yellow:hover {
  border-color: rgba(255, 211, 42, 0.3);
}

.stat-card--red:hover {
  border-color: rgba(255, 107, 129, 0.3);
}

.stat-icon-wrapper {
  padding: var(--spacing-3);
  border-radius: var(--radius-lg);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform var(--duration-normal) var(--ease-bounce);
}

.stat-card:hover .stat-icon-wrapper {
  transform: scale(1.1);
}

.stat-icon--green {
  background-color: rgba(120, 224, 143, 0.15);
  color: #2d5a3d;
}

.stat-icon--blue {
  background-color: rgba(52, 172, 224, 0.15);
  color: #1e5f7a;
}

.stat-icon--yellow {
  background-color: rgba(255, 211, 42, 0.15);
  color: #8B6914;
}

.stat-icon--red {
  background-color: rgba(255, 107, 129, 0.15);
  color: #a83241;
}

.stat-icon {
  width: 1.5rem;
  height: 1.5rem;
}

.stat-content {
  flex: 1;
}

.stat-value {
  font-family: var(--font-display);
  font-size: var(--text-2xl);
  font-weight: 700;
  color: var(--color-black);
  line-height: 1;
  margin-bottom: var(--spacing-1);
}

.stat-label {
  font-family: var(--font-body);
  font-size: var(--text-caption);
  font-weight: 600;
  color: var(--color-dark-gray);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.nav-cards {
  display: grid;

  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: var(--spacing-6);
  margin-bottom: calc(var(--spacing-8) + var(--spacing-4));
}

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

.quick-actions {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 249, 250, 0.95) 100%);
  border-radius: var(--radius-2xl);
  padding: var(--spacing-8);
  box-shadow: var(--shadow-lg);
  border: 2px solid rgba(120, 224, 143, 0.2);
  margin-bottom: 2rem;
  padding-bottom: var(--spacing-8);
  backdrop-filter: blur(10px);
}

.quick-actions-header {
  text-align: center;
  margin-bottom: var(--spacing-6);
}

.quick-actions-title {
  font-family: var(--font-display);
  font-size: var(--text-2xl);
  font-weight: 700;
  color: var(--color-black);
  margin-bottom: var(--spacing-1);
}

.quick-actions-subtitle {
  font-family: var(--font-body);
  font-size: var(--text-body);
  color: var(--color-dark-gray);
  font-weight: 400;
}

.quick-actions-grid {
  display: grid;

  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: var(--spacing-4);
}

.quick-action-btn {
  display: flex;
  align-items: center;
  gap: var(--spacing-3);
  padding: var(--spacing-4);
  border-radius: var(--radius-xl);
  border: 2px solid var(--color-medium-gray);
  background-color: var(--color-white);
  cursor: pointer;
  transition: all var(--duration-normal) var(--ease-bounce);
  text-align: left;
  position: relative;
  overflow: hidden;
}

.quick-action-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, transparent 0%, rgba(255, 255, 255, 0.1) 100%);
  opacity: 0;
  transition: opacity var(--duration-normal) var(--ease-out);
}

.quick-action-btn:hover::before {
  opacity: 1;
}

.quick-action-btn:hover {
  transform: translateY(-4px) scale(1.02);
  box-shadow: var(--shadow-md);
}

.quick-action-btn:active {
  transform: translateY(-2px) scale(1.01);
}

.quick-action--green:hover {
  border-color: var(--color-fresh-green);
  background: linear-gradient(135deg, rgba(120, 224, 143, 0.05) 0%, rgba(120, 224, 143, 0.1) 100%);
}

.quick-action--blue:hover {
  border-color: var(--color-sky-blue);
  background: linear-gradient(135deg, rgba(52, 172, 224, 0.05) 0%, rgba(52, 172, 224, 0.1) 100%);
}

.quick-action--yellow:hover {
  border-color: var(--color-banana-yellow);
  background: linear-gradient(135deg, rgba(255, 211, 42, 0.05) 0%, rgba(255, 211, 42, 0.1) 100%);
}

.quick-action--red:hover {
  border-color: var(--color-strawberry-red);
  background: linear-gradient(135deg, rgba(255, 107, 129, 0.05) 0%, rgba(255, 107, 129, 0.1) 100%);
}

.quick-action--purple:hover {
  border-color: #9B59B6;
  background: linear-gradient(135deg, rgba(155, 89, 182, 0.05) 0%, rgba(155, 89, 182, 0.1) 100%);
}

.quick-action--orange:hover {
  border-color: #FF8C42;
  background: linear-gradient(135deg, rgba(255, 140, 66, 0.05) 0%, rgba(255, 140, 66, 0.1) 100%);
}

.quick-action-icon {
  padding: var(--spacing-3);
  border-radius: var(--radius-lg);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform var(--duration-normal) var(--ease-bounce);
  width: 3rem;
  height: 3rem;
  flex-shrink: 0;
}

.quick-action--green .quick-action-icon {
  background-color: rgba(120, 224, 143, 0.15);
  color: #2d5a3d;
}

.quick-action--blue .quick-action-icon {
  background-color: rgba(52, 172, 224, 0.15);
  color: #1e5f7a;
}

.quick-action--yellow .quick-action-icon {
  background-color: rgba(255, 211, 42, 0.15);
  color: #8B6914;
}

.quick-action--red .quick-action-icon {
  background-color: rgba(255, 107, 129, 0.15);
  color: #a83241;
}

.quick-action--purple .quick-action-icon {
  background-color: rgba(155, 89, 182, 0.15);
  color: #6C3483;
}

.quick-action--orange .quick-action-icon {
  background-color: rgba(255, 140, 66, 0.15);
  color: #D35400;
}

.quick-action-btn:hover .quick-action-icon {
  transform: scale(1.15) rotate(-5deg);
}

.quick-action-icon svg {
  width: 1.5rem;
  height: 1.5rem;
}

.quick-action-content {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-1);
  flex: 1;
}

.quick-action-label {
  font-family: var(--font-body);
  font-size: var(--text-body);
  font-weight: 700;
  color: var(--color-black);
  line-height: 1.2;
}

.quick-action-desc {
  font-family: var(--font-body);
  font-size: var(--text-caption);
  font-weight: 500;
  color: var(--color-dark-gray);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

@media (max-width: 639px) {

  .hero-title {
    font-size: var(--text-xl);
    line-height: 1.3;
  }

  .hero-subtitle {
    font-size: var(--text-sm);
  }

  .stat-value {
    font-size: var(--text-xl);
  }

  .stat-label {
    font-size: 0.625rem;
  }

  .nav-card {
    padding: var(--spacing-4);
  }

  .nav-card-title {
    font-size: var(--text-lg);
  }

  .nav-card-desc {
    font-size: var(--text-sm);
  }

  .quick-actions {
    padding: var(--spacing-4);
  }

  .quick-actions-title {
    font-size: var(--text-lg);
  }

  .quick-actions-subtitle {
    font-size: var(--text-sm);
  }

  .quick-action-btn {
    padding: var(--spacing-3);
    flex-direction: column;
    align-items: flex-start;
    text-align: center;
    justify-content: center;
    align-items: center;
  }

  .quick-action-content {
    align-items: center;
  }

  .quick-action-icon {
    width: 2.5rem;
    height: 2.5rem;
    padding: var(--spacing-2);
    margin-bottom: var(--spacing-2);
  }

  .quick-action-icon svg {
    width: 1.25rem;
    height: 1.25rem;
  }

  .quick-action-label {
    font-size: var(--text-sm);
    text-align: center;
  }

  .quick-action-desc {
    display: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  .animate-bounce-in,
  .animate-pop,
  .animate-float {
    animation: none;
  }

  .nav-card,
  .stat-card,
  .quick-action-btn {
    transition: box-shadow var(--duration-fast) ease-in-out;
  }

  .nav-card:hover,
  .stat-card:hover,
  .quick-action-btn:hover {
    transform: none;
  }
}
</style>