<template>
  <div class="onboarding">
    <!-- Splash Screen - Initial Load -->
    <transition name="fade">
      <div v-if="screen === 'splash'" class="onboarding__screen onboarding__splash">
        <div class="onboarding__splash-content animate-bounce-in">
          <div class="onboarding__logo">🍽️</div>
          <h1 class="onboarding__title">Eat Free</h1>
          <p class="onboarding__subtitle">Your personal nutrition companion</p>
          <div class="onboarding__spinner">
            <div class="spinner"></div>
          </div>
        </div>
      </div>
    </transition>

    <!-- User Creation Screen -->
    <transition name="fade">
      <div v-if="screen === 'create-user'" class="onboarding__screen onboarding__create-user">
        <Card elevation="lg" class="onboarding__card">
          <div class="onboarding__header">
            <h2>Welcome to Eat Free!</h2>
            <p>Let's get you started by creating your profile.</p>
          </div>

          <form @submit.prevent="handleCreateUser" class="onboarding__form">
            <Input
              v-model="formData.name"
              type="text"
              label="Your Name"
              placeholder="Enter your name"
              :error="formErrors.name"
              required
            />

            <Input
              v-model="formData.email"
              type="email"
              label="Email Address"
              placeholder="Enter your email"
              :error="formErrors.email"
              hint="We'll use this to identify your profile"
              required
            />

            <Button
              type="submit"
              variant="primary"
              size="md"
              fullWidth
              :isLoading="isLoading"
              :disabled="isLoading || !isFormValid"
            >
              {{ isLoading ? 'Creating Profile...' : 'Create Profile' }}
            </Button>

            <div v-if="globalError" class="onboarding__error-message">
              <p>{{ globalError }}</p>
            </div>
          </form>

          <div class="onboarding__footer">
            <p class="onboarding__footer-text">
              Don't worry, you can create multiple profiles for different family members!
            </p>
          </div>
        </Card>
      </div>
    </transition>

    <!-- User Selection Screen (if multiple users exist) -->
    <transition name="fade">
      <div v-if="screen === 'select-user'" class="onboarding__screen onboarding__select-user">
        <Card elevation="lg" class="onboarding__card">
          <div class="onboarding__header">
            <h2>Welcome Back!</h2>
            <p>Select your profile to continue.</p>
          </div>

          <div class="onboarding__user-list">
            <button
              v-for="user in users"
              :key="`user-${user.id}`"
              @click="selectUser(user)"
              class="onboarding__user-item"
            >
              <div class="onboarding__user-avatar">👤</div>
              <div class="onboarding__user-info">
                <p class="onboarding__user-name">{{ user.name }}</p>
                <p class="onboarding__user-email">{{ user.email }}</p>
              </div>
            </button>
          </div>

          <Button
            variant="secondary"
            size="md"
            fullWidth
            @click="screen = 'create-user'"
          >
            + Create New Profile
          </Button>
        </Card>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { Button, Input, Card } from '@/renderer/components/ui'
import type User from '@/shared/user'

type Screen = 'splash' | 'create-user' | 'select-user'

const emit = defineEmits<{
  'user-created': [user: User]
}>()

const props = defineProps<{
  users: User[]
  isLoading: boolean
  error?: string
}>()

const screen = ref<Screen>('splash')
const formData = ref({
  name: '',
  email: '',
})

const formErrors = ref({
  name: '',
  email: '',
})

const globalError = ref('')

const isFormValid = computed(() => {
  return formData.value.name.trim().length > 0 && formData.value.email.trim().length > 0
})

const validateForm = (): boolean => {
  formErrors.value = {
    name: '',
    email: '',
  }

  if (!formData.value.name.trim()) {
    formErrors.value.name = 'Please enter your name'
  }

  if (!formData.value.email.trim()) {
    formErrors.value.email = 'Please enter your email'
  } else if (!isValidEmail(formData.value.email)) {
    formErrors.value.email = 'Please enter a valid email address'
  }

  return Object.values(formErrors.value).every((err) => !err)
}

const isValidEmail = (email: string): boolean => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email)
}

const handleCreateUser = async (): Promise<void> => {
  if (!validateForm()) {
    return
  }

  globalError.value = ''

  try {
    emit('user-created', {
      name: formData.value.name,
      email: formData.value.email,
    } as User)

    formData.value = { name: '', email: '' }
  } catch (err) {
    globalError.value = err instanceof Error ? err.message : 'An error occurred'
  }
}

const selectUser = (user: User): void => {
  emit('user-created', user)
}

onMounted(async () => {
  await new Promise((resolve) => setTimeout(resolve, 1500))

  if (props.users.length > 0) {
    screen.value = 'select-user'
  } else {
    screen.value = 'create-user'
  }
})
</script>

<style scoped>
.onboarding {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, rgba(120, 224, 143, 0.1) 0%, rgba(52, 172, 224, 0.1) 100%);
  padding: var(--spacing-4);
}

.onboarding__screen {
  width: 100%;
  max-width: 500px;
  animation: bounce-in var(--duration-slow) var(--ease-bounce);
}

.onboarding__splash {
  text-align: center;
}

.onboarding__splash-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-3);
}

.onboarding__logo {
  font-size: 4rem;
  animation: float var(--duration-slower) var(--ease-in-out) infinite;
}

.onboarding__title {
  font-family: var(--font-display);
  font-size: 3rem;
  color: var(--color-fresh-green);
  margin: 0;
}

.onboarding__subtitle {
  font-size: var(--text-body-lg);
  color: var(--color-dark-gray);
  margin: 0;
}

.onboarding__spinner {
  display: flex;
  justify-content: center;
  margin-top: var(--spacing-2);
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(120, 224, 143, 0.3);
  border-top-color: var(--color-fresh-green);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.onboarding__card {
  width: 100%;
}

.onboarding__header {
  text-align: center;
  margin-bottom: var(--spacing-3);

  h2 {
    font-family: var(--font-display);
    font-size: var(--text-h2);
    color: var(--color-black);
    margin: 0 0 var(--spacing-1) 0;
  }

  p {
    font-size: var(--text-body);
    color: var(--color-dark-gray);
    margin: 0;
  }
}

.onboarding__form {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-2);
  margin-bottom: var(--spacing-3);
}

.onboarding__error-message {
  background-color: rgba(255, 107, 129, 0.1);
  border: 1px solid var(--color-error);
  border-radius: var(--radius-lg);
  padding: var(--spacing-2);
  margin-top: var(--spacing-2);

  p {
    font-size: var(--text-body-sm);
    color: var(--color-error);
    margin: 0;
  }
}

.onboarding__footer {
  text-align: center;
  border-top: 1px solid var(--color-medium-gray);
  padding-top: var(--spacing-2);
}

.onboarding__footer-text {
  font-size: var(--text-body-sm);
  color: var(--color-dark-gray);
  margin: 0;
  font-style: italic;
}

.onboarding__user-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-2);
  margin-bottom: var(--spacing-3);
}

.onboarding__user-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
  padding: var(--spacing-2);
  border: 2px solid var(--color-medium-gray);
  border-radius: var(--radius-lg);
  background-color: var(--color-white);
  cursor: pointer;
  transition: all var(--duration-normal) var(--ease-in-out);

  &:hover {
    border-color: var(--color-fresh-green);
    box-shadow: var(--shadow-bubble-sm);
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }
}

.onboarding__user-avatar {
  font-size: 2rem;
  flex-shrink: 0;
}

.onboarding__user-info {
  text-align: left;
}

.onboarding__user-name {
  font-weight: 600;
  color: var(--color-black);
  margin: 0;
}

.onboarding__user-email {
  font-size: var(--text-body-sm);
  color: var(--color-dark-gray);
  margin: 0;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity var(--duration-normal) var(--ease-in-out);
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@keyframes bounce-in {
  0% {
    opacity: 0;
    transform: scale(0.9) translateY(20px);
  }
  60% {
    opacity: 1;
    transform: scale(1.05);
  }
  100% {
    transform: scale(1) translateY(0);
  }
}

@media (prefers-reduced-motion: reduce) {
  .onboarding__screen {
    animation: none;
  }

  .onboarding__logo {
    animation: none;
  }

  .onboarding__user-item:hover {
    transform: none;
  }

  .spinner {
    animation: none;
  }

  .fade-enter-active,
  .fade-leave-active {
    transition: none;
  }
}

@media (max-width: 640px) {
  .onboarding {
    padding: var(--spacing-2);
  }

  .onboarding__logo {
    font-size: 3rem;
  }

  .onboarding__title {
    font-size: 2rem;
  }

  .onboarding__subtitle {
    font-size: var(--text-body);
  }

  .onboarding__header h2 {
    font-size: var(--text-xl);
  }

  .onboarding__header p {
    font-size: var(--text-sm);
  }

  .onboarding__user-avatar {
    font-size: 1.5rem;
  }

  .onboarding__user-name {
    font-size: var(--text-body);
  }

  .onboarding__user-email {
    font-size: var(--text-caption);
  }

  .onboarding__user-item {
    padding: var(--spacing-3);
  }
}

@media (max-width: 400px) {
  .onboarding {
    padding: var(--spacing-1);
  }

  .onboarding__logo {
    font-size: 2.5rem;
  }

  .onboarding__title {
    font-size: 1.75rem;
  }

  .onboarding__subtitle {
    font-size: var(--text-sm);
  }

  .onboarding__header h2 {
    font-size: var(--text-lg);
  }

  .onboarding__form {
    gap: var(--spacing-3);
  }

  .onboarding__user-item {
    padding: var(--spacing-2);
    gap: var(--spacing-2);
  }
}
</style>
