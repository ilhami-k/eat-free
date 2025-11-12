<template>
  <div class="app">
    <Onboarding
      v-if="!currentUser"
      :users="users"
      :isLoading="isLoadingUser"
      :error="userError"
      @user-created="handleUserCreated"
    />

    <div v-else class="app__main">
      <div class="app__header">
        <h1>{{ currentUser.name }}</h1>
        <p>{{ currentUser.email }}</p>
        <Button variant="secondary" size="sm" @click="logout">
          Logout / Switch User
        </Button>
      </div>

      <!-- Tab Navigation -->
      <div class="app__tabs">
        <button
          :class="['app__tab', activeTab === 'inventory' && 'app__tab--active']"
          @click="activeTab = 'inventory'"
        >
          Inventory
        </button>
        <button
          :class="['app__tab', activeTab === 'recipes' && 'app__tab--active']"
          @click="activeTab = 'recipes'"
        >
          Recipes
        </button>
        <button
          :class="['app__tab', activeTab === 'mealplans' && 'app__tab--active']"
          @click="activeTab = 'mealplans'"
        >
          Meal Plans
        </button>
      </div>

      <div class="app__content">
        <!-- Inventory Tab -->
        <Inventory
          v-if="activeTab === 'inventory'"
          :currentUserId="currentUser.id"
        />
        <!-- Recipes Tab -->
        <Recipes
          v-if="activeTab === 'recipes'"
          :currentUserId="currentUser.id"
        />
        <!-- Meal Plans Tab -->
        <MealPlans
          v-if="activeTab === 'mealplans'"
          :currentUserId="currentUser.id"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import Onboarding from '@/renderer/pages/Onboarding.vue'
import Inventory from '@/renderer/components/Inventory.vue'
import Recipes from '@/renderer/pages/Recipes.vue'
import MealPlans from '@/renderer/pages/MealPlans.vue'
import { Button } from '@/renderer/components/ui'
import type User from '@/shared/user'

const currentUser = ref<User | null>(null)
const users = ref<User[]>([])
const isLoadingUser = ref(false)
const userError = ref<string>()
const activeTab = ref<'inventory' | 'recipes' | 'mealplans'>('inventory')

// Get the real backend service from electron preload
const userService = window.electronService?.users

const handleUserCreated = async (user: User): Promise<void> => {
  if (!userService) {
    userError.value = 'Backend service not available'
    return
  }

  isLoadingUser.value = true
  userError.value = undefined
  try {
    if (!user.id || user.id === 0n || user.id === BigInt(0)) {
      // Create new user in database
      const newUser = await userService.createUser(user.email, user.name)
      currentUser.value = newUser
      // Refresh users list
      users.value = await userService.getUsers()
    } else {
      // User was selected from existing list
      currentUser.value = user
    }
  } catch (err) {
    userError.value = err instanceof Error ? err.message : 'Failed to process user'
    console.error('User creation error:', err)
  } finally {
    isLoadingUser.value = false
  }
}

const logout = (): void => {
  currentUser.value = null
}

onMounted(async () => {
  if (!userService) {
    userError.value = 'Backend service not available'
    return
  }

  isLoadingUser.value = true
  try {
    // Load all existing users from database
    users.value = await userService.getUsers()
  } catch (err) {
    console.error('Failed to fetch users:', err)
    userError.value = 'Failed to load users from database'
  } finally {
    isLoadingUser.value = false
  }
})
</script>

<style scoped>
.app {
  min-height: 100vh;
  background-color: var(--color-white);
}

.app__main {
  min-height: 100vh;
  padding: var(--spacing-4);
}

.app__header {
  margin-bottom: var(--spacing-6);
  border-bottom: 1px solid var(--color-neutral-200);
  padding-bottom: var(--spacing-4);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.app__header h1 {
  font-size: var(--font-size-h1);
  font-weight: var(--font-weight-display);
  color: var(--color-neutral-900);
  margin: 0;
}

.app__header p {
  font-size: var(--font-size-sm);
  color: var(--color-neutral-600);
  margin: 0;
}

.app__tabs {
  display: flex;
  gap: var(--spacing-2);
  margin-bottom: var(--spacing-4);
  border-bottom: 1px solid var(--color-neutral-200);
}

.app__tab {
  padding: var(--spacing-2) var(--spacing-4);
  background: none;
  border: none;
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-medium);
  color: var(--color-neutral-600);
  cursor: pointer;
  transition: all 200ms ease;
  border-bottom: 2px solid transparent;
  margin-bottom: -1px;
}

.app__tab:hover {
  color: var(--color-neutral-900);
}

.app__tab--active {
  color: var(--color-fresh-green);
  border-bottom-color: var(--color-fresh-green);
}

.app__content {
  flex: 1;
  overflow-y: auto;
}
</style>
