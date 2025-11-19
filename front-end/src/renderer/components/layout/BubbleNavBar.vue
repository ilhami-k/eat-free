<template>
  <nav class="bubble-navbar" :class="{ 'bubble-navbar--hidden': isHidden }">
    <!-- Left: Navigation Arrows -->
    <div class="nav-controls">
      <button
        @click="goBack"
        :disabled="!canGoBack"
        class="nav-bubble-btn"
        :class="{ 'nav-bubble-btn--disabled': !canGoBack }"
        aria-label="Go Back"
      >
        <span class="bubble-shadow"></span>
        <span class="bubble-content bubble-content--green">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="nav-icon">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </span>
      </button>

      <button
        @click="goForward"
        :disabled="!canGoForward"
        class="nav-bubble-btn"
        :class="{ 'nav-bubble-btn--disabled': !canGoForward }"
        aria-label="Go Forward"
      >
        <span class="bubble-shadow"></span>
        <span class="bubble-content bubble-content--green">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="nav-icon">
            <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
        </span>
      </button>
    </div>

    <!-- Center: Logo -->
    <div class="logo-container">
       <span class="logo-text">Eat-Free</span>
    </div>

    <!-- Right: Hamburger Menu -->
    <button
      @click="isDrawerOpen = true"
      class="nav-bubble-btn"
      aria-label="Open Menu"
    >
      <span class="bubble-shadow"></span>
      <span class="bubble-content bubble-content--yellow">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="nav-icon nav-icon--lg">
          <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
        </svg>
      </span>
    </button>

    <!-- Drawer Overlay -->
    <Transition name="drawer-fade">
      <div 
        v-if="isDrawerOpen" 
        class="drawer-backdrop"
        @click="isDrawerOpen = false"
        aria-hidden="true"
      ></div>
    </Transition>

    <!-- Drawer Panel -->
    <Transition name="drawer-slide">
      <div 
        v-if="isDrawerOpen"
        class="drawer-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="drawer-title"
      >
        <!-- Drawer Header -->
        <div class="drawer-header">
          <h2 id="drawer-title" class="drawer-title">Menu</h2>
          <button 
            @click="isDrawerOpen = false"
            class="drawer-close-btn"
            aria-label="Close menu"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="close-icon">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Drawer Content -->
        <div class="drawer-content">
          <button 
            v-for="item in menuItems" 
            :key="item.id"
            @click="handleNavigation(item.id)"
            class="menu-item"
            :class="{ 'menu-item--active': activeView === item.id }"
          >
            <div class="menu-item-icon" :class="item.bgColor">
              {{ item.icon }}
            </div>
            <div class="menu-item-text">
              <span class="menu-item-label">{{ item.label }}</span>
              <span class="menu-item-desc">{{ item.desc }}</span>
            </div>
            <div class="menu-item-arrow">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="arrow-icon">
                <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </div>
          </button>

          <!-- Settings / Logout Section -->
          <div class="action-buttons">
             <button class="action-btn action-btn--info">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="action-icon">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.212 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span class="action-label">Settings</span>
             </button>
             <button 
                @click="$emit('logout')"
                class="action-btn action-btn--error"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="action-icon">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
                </svg>
                <span class="action-label">Logout</span>
             </button>
          </div>
        </div>
      </div>
    </Transition>
  </nav>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useNavigation, type View } from '@/renderer/composables/useNavigation'

const { activeView, navigate, goBack, goForward, canGoBack, canGoForward } = useNavigation()
const isDrawerOpen = ref(false)
const isHidden = ref(false)
const lastScrollY = ref(0)
const scrollThreshold = 10 // Minimum scroll distance to trigger hide/show

defineEmits<{
  (e: 'logout'): void
}>()

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', desc: 'Overview & Stats', icon: '🍽️', bgColor: 'menu-icon--orange' },
  { id: 'recipes', label: 'Recipes', desc: 'Explore & Cook', icon: '🥗', bgColor: 'menu-icon--green' },
  { id: 'inventory', label: 'Inventory', desc: 'Manage Ingredients', icon: '🥕', bgColor: 'menu-icon--blue' },
  { id: 'mealplans', label: 'Meal Plans', desc: 'Weekly Planning', icon: '📅', bgColor: 'menu-icon--purple' },
  { id: 'journal', label: 'Journal', desc: 'Track Progress', icon: '📓', bgColor: 'menu-icon--yellow' },
] as const

const handleNavigation = (view: string) => {
  navigate(view as View)
  isDrawerOpen.value = false
}

// Scroll detection logic
const handleScroll = () => {
  const currentScrollY = window.scrollY

  // If at the top of the page, always show navbar
  if (currentScrollY <= 0) {
    isHidden.value = false
    lastScrollY.value = currentScrollY
    return
  }

  // Check scroll direction
  const scrollDifference = currentScrollY - lastScrollY.value

  // Only trigger if scroll difference exceeds threshold
  if (Math.abs(scrollDifference) > scrollThreshold) {
    if (scrollDifference > 0) {
      // Scrolling down - hide navbar
      isHidden.value = true
    } else {
      // Scrolling up - show navbar
      isHidden.value = false
    }
    
    lastScrollY.value = currentScrollY
  }
}

// Debounced scroll handler for better performance
let scrollTimeout: number | null = null
const debouncedScroll = () => {
  if (scrollTimeout) {
    clearTimeout(scrollTimeout)
  }
  scrollTimeout = window.setTimeout(handleScroll, 10)
}

onMounted(() => {
  window.addEventListener('scroll', debouncedScroll, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('scroll', debouncedScroll)
  if (scrollTimeout) {
    clearTimeout(scrollTimeout)
  }
})
</script>

<style scoped>
/* ============================================================================
   🎨 NAVBAR - BubbleBite Design System
   ============================================================================ */

.bubble-navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  width: 100%;
  z-index: var(--z-fixed);
  padding: var(--spacing-3) var(--spacing-4);
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(120, 224, 143, 0.1);
  transition: transform var(--duration-normal) var(--ease-out), 
              opacity var(--duration-normal) var(--ease-out);
  transform: translateY(0);
}

.bubble-navbar--hidden {
  transform: translateY(-100%);
  opacity: 0;
}

/* -------- Navigation Controls -------- */
.nav-controls {
  display: flex;
  align-items: center;
  gap: var(--spacing-3);
}

/* -------- Bubble Buttons -------- */
.nav-bubble-btn {
  position: relative;
  width: 3rem;
  height: 3rem;
  border-radius: var(--radius-full);
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: transparent;
  cursor: pointer;
  transition: transform var(--duration-normal) var(--ease-bounce);
}

.nav-bubble-btn:hover:not(.nav-bubble-btn--disabled) {
  transform: scale(1.05);
}

.nav-bubble-btn:active:not(.nav-bubble-btn--disabled) {
  transform: scale(0.95);
}

.nav-bubble-btn--disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

/* Bubble Shadow Layer */
.bubble-shadow {
  position: absolute;
  top: 4px;
  left: 0;
  right: 0;
  bottom: -4px;
  background-color: rgba(26, 26, 26, 0.05);
  border-radius: var(--radius-full);
  z-index: 1;
  transition: all var(--duration-fast) var(--ease-out);
}

.nav-bubble-btn:hover:not(.nav-bubble-btn--disabled) .bubble-shadow {
  top: 6px;
  bottom: -6px;
  background-color: rgba(26, 26, 26, 0.08);
}

/* Bubble Content Layer */
.bubble-content {
  position: relative;
  z-index: 2;
  width: 100%;
  height: 100%;
  border-radius: var(--radius-full);
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(255, 255, 255, 0.5);
  transition: all var(--duration-normal) var(--ease-out);
}

/* Bubble Content Variants */
.bubble-content--green {
  background-color: rgba(120, 224, 143, 0.15);
  color: #2d5a3d;
}

.bubble-content--green:hover {
  background-color: rgba(120, 224, 143, 0.25);
}

.bubble-content--yellow {
  background-color: rgba(255, 211, 42, 0.15);
  color: #8B6914;
}

.bubble-content--yellow:hover {
  background-color: rgba(255, 211, 42, 0.25);
}

/* Icons */
.nav-icon {
  width: 1.25rem;
  height: 1.25rem;
}

.nav-icon--lg {
  width: 1.5rem;
  height: 1.5rem;
}

/* -------- Logo -------- */
.logo-container {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}

.logo-text {
  font-family: var(--font-display);
  font-size: var(--text-xl);
  font-weight: 700;
  color: var(--color-black);
  letter-spacing: -0.02em;
}

/* ============================================================================
   🎨 DRAWER - Slide-down from Top
   ============================================================================ */

/* Drawer Backdrop */
.drawer-backdrop {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(4px);
  z-index: var(--z-modal-backdrop);
}

/* Drawer Panel */
.drawer-panel {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background-color: var(--color-light-gray);
  z-index: var(--z-modal);
  border-radius: 0 0 var(--radius-3xl) var(--radius-3xl);
  box-shadow: var(--shadow-2xl);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  max-height: 85vh;
}

/* Drawer Header */
.drawer-header {
  padding: var(--spacing-4) var(--spacing-6);
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: rgba(255, 255, 255, 0.5);
}

.drawer-title {
  font-family: var(--font-display);
  font-size: var(--text-lg);
  font-weight: 700;
  color: var(--color-dark-gray);
}

.drawer-close-btn {
  padding: var(--spacing-2);
  border-radius: var(--radius-full);
  border: none;
  background: transparent;
  color: var(--color-dark-gray);
  cursor: pointer;
  transition: all var(--duration-fast) var(--ease-out);
}

.drawer-close-btn:hover {
  background-color: var(--color-medium-gray);
}

.close-icon {
  width: 1.5rem;
  height: 1.5rem;
}

/* Drawer Content */
.drawer-content {
  padding: var(--spacing-6);
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-3);
}

/* -------- Menu Items -------- */
.menu-item {
  width: 100%;
  display: flex;
  align-items: center;
  gap: var(--spacing-4);
  padding: var(--spacing-4);
  border-radius: var(--radius-2xl);
  border: none;
  background-color: rgba(255, 255, 255, 0.6);
  cursor: pointer;
  transition: all var(--duration-normal) var(--ease-out);
  text-align: left;
}

.menu-item:hover {
  background-color: var(--color-white);
  box-shadow: var(--shadow-sm);
  transform: translateY(-2px) scale(1.01);
}

.menu-item--active {
  background-color: var(--color-white);
  box-shadow: var(--shadow-md);
  transform: scale(1.02);
  border: 2px solid rgba(120, 224, 143, 0.3);
}

/* Menu Item Icon */
.menu-item-icon {
  width: 3rem;
  height: 3rem;
  border-radius: var(--radius-full);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  transition: transform var(--duration-normal) var(--ease-bounce);
}

.menu-item:hover .menu-item-icon {
  transform: scale(1.1);
}

/* Icon Background Colors */
.menu-icon--orange {
  background-color: rgba(255, 165, 0, 0.15);
}

.menu-icon--green {
  background-color: rgba(120, 224, 143, 0.15);
}

.menu-icon--blue {
  background-color: rgba(52, 172, 224, 0.15);
}

.menu-icon--purple {
  background-color: rgba(155, 89, 182, 0.15);
}

.menu-icon--yellow {
  background-color: rgba(255, 211, 42, 0.15);
}

/* Menu Item Text */
.menu-item-text {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.menu-item-label {
  font-family: var(--font-body);
  font-size: var(--text-lg);
  font-weight: 700;
  color: var(--color-black);
}

.menu-item-desc {
  font-family: var(--font-body);
  font-size: var(--text-caption);
  font-weight: 500;
  color: var(--color-dark-gray);
}

/* Menu Item Arrow */
.menu-item-arrow {
  opacity: 0;
  transition: opacity var(--duration-normal) var(--ease-out);
  color: var(--color-medium-gray);
}

.menu-item:hover .menu-item-arrow {
  opacity: 1;
}

.arrow-icon {
  width: 1.25rem;
  height: 1.25rem;
}

/* -------- Action Buttons -------- */
.action-buttons {
  margin-top: var(--spacing-6);
  padding-top: var(--spacing-6);
  border-top: 1px solid var(--color-medium-gray);
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--spacing-3);
}

.action-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-4);
  border-radius: var(--radius-2xl);
  border: none;
  cursor: pointer;
  gap: var(--spacing-2);
  transition: all var(--duration-normal) var(--ease-out);
}

.action-btn--info {
  background-color: rgba(52, 172, 224, 0.1);
  color: #1e5f7a;
}

.action-btn--info:hover {
  background-color: rgba(52, 172, 224, 0.2);
  transform: translateY(-2px);
}

.action-btn--error {
  background-color: rgba(255, 107, 129, 0.1);
  color: #a83241;
}

.action-btn--error:hover {
  background-color: rgba(255, 107, 129, 0.2);
  transform: translateY(-2px);
}

.action-icon {
  width: 1.5rem;
  height: 1.5rem;
}

.action-label {
  font-family: var(--font-body);
  font-size: var(--text-body-sm);
  font-weight: 700;
}

/* ============================================================================
   ✨ ANIMATIONS - Drawer Transitions
   ============================================================================ */

/* Fade Animation for Backdrop */
.drawer-fade-enter-active,
.drawer-fade-leave-active {
  transition: opacity var(--duration-normal) var(--ease-out);
}

.drawer-fade-enter-from,
.drawer-fade-leave-to {
  opacity: 0;
}

/* Slide Animation for Drawer Panel */
.drawer-slide-enter-active {
  transition: transform var(--duration-slower) var(--ease-elastic),
              opacity var(--duration-slow) var(--ease-out);
}

.drawer-slide-leave-active {
  transition: transform var(--duration-slow) var(--ease-in),
              opacity var(--duration-normal) var(--ease-out);
}

.drawer-slide-enter-from {
  transform: translateY(-100%);
  opacity: 0;
}

.drawer-slide-leave-to {
  transform: translateY(-100%);
  opacity: 0;
}

/* ============================================================================
   ♿ ACCESSIBILITY - Reduced Motion Support
   ============================================================================ */

@media (prefers-reduced-motion: reduce) {
  .nav-bubble-btn,
  .menu-item,
  .menu-item-icon,
  .action-btn {
    transition-duration: var(--duration-instant) !important;
  }

  .drawer-slide-enter-active,
  .drawer-slide-leave-active {
    transition-duration: var(--duration-instant) !important;
  }
}

/* ============================================================================
   📱 RESPONSIVE - Mobile Optimization
   ============================================================================ */

@media (max-width: 640px) {
  .logo-text {
    font-size: var(--text-body);
  }

  .nav-bubble-btn {
    width: 2.5rem;
    height: 2.5rem;
  }

  .nav-icon {
    width: 1rem;
    height: 1rem;
  }

  .nav-icon--lg {
    width: 1.25rem;
    height: 1.25rem;
  }
}
</style>
