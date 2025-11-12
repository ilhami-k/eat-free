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
      <div class="app__content">
        <!-- Show Inventory for current user -->
        <Inventory :currentUserId="currentUser.id" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import Onboarding from '@/renderer/pages/Onboarding.vue'
import Inventory from '@/renderer/components/Inventory.vue'
import { Button } from '@/renderer/components/ui'
import type User from '@/shared/user'

const currentUser = ref<User | null>(null)
const users = ref<User[]>([])
const isLoadingUser = ref(false)
const userError = ref<string>()

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
  margin-bottom: var(--spacing-4);
  text-align: center;
}

.app__header h1 {
  color: var(--color-fresh-green);
  margin-bottom: var(--spacing-1);
}

.app__header p {
  color: var(--color-dark-gray);
  margin-bottom: var(--spacing-2);
}

.app__content {
  max-width: 600px;
  margin: 0 auto;
}
</style>
