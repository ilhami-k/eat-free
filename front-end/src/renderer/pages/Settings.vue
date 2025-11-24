<template>
  <div class="settings-page">
    <!-- Header -->
    <div class="settings-header">
      <div class="header-content">
        <h1 class="header-title">Settings</h1>
        <p class="header-subtitle">Manage your account preferences</p>
      </div>
    </div>

    <!-- Main Content -->
    <div class="content-wrapper">
      <!-- Loading State -->
      <div v-if="isLoading" class="loading-state">
        <div class="spinner"></div>
        <p>Loading settings...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="error-state">
        <svg class="error-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3>Error Loading Settings</h3>
        <p>{{ error.message }}</p>
        <button @click="loadUser" class="retry-button">Try Again</button>
      </div>

      <!-- Settings Content -->
      <div v-else-if="user" class="settings-content">
        <!-- Account Information Card -->
        <div class="settings-card">
          <div class="card-header">
            <div class="card-header-icon">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div>
              <h2 class="card-title">Account Information</h2>
              <p class="card-subtitle">Update your personal details</p>
            </div>
          </div>

          <div class="card-content">
            <form @submit.prevent="handleUpdateProfile">
              <!-- Name Field -->
              <div class="form-group">
                <label for="name" class="form-label">Name</label>
                <input
                  id="name"
                  v-model="formData.name"
                  type="text"
                  class="form-input"
                  placeholder="Enter your name"
                  required
                />
              </div>

              <!-- Email Field -->
              <div class="form-group">
                <label for="email" class="form-label">Email</label>
                <input
                  id="email"
                  v-model="formData.email"
                  type="email"
                  class="form-input"
                  placeholder="Enter your email"
                  required
                />
              </div>

              <!-- Account Created Date -->
              <div class="form-group">
                <label class="form-label">Member Since</label>
                <div class="info-text">
                  {{ formatDate(user.created_at) }}
                </div>
              </div>

              <!-- Save Button -->
              <div class="form-actions">
                <button
                  type="submit"
                  :disabled="!hasChanges || isUpdating"
                  class="button-primary"
                >
                  <svg v-if="isUpdating" class="button-icon spinning" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  <svg v-else class="button-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  {{ isUpdating ? 'Saving...' : 'Save Changes' }}
                </button>
                <button
                  v-if="hasChanges"
                  type="button"
                  @click="resetForm"
                  class="button-secondary"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>

        <!-- Danger Zone Card -->
        <div class="settings-card danger-card">
          <div class="card-header">
            <div class="card-header-icon danger-icon">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div>
              <h2 class="card-title">Danger Zone</h2>
              <p class="card-subtitle">Irreversible actions</p>
            </div>
          </div>

          <div class="card-content">
            <div class="danger-warning">
              <svg class="warning-icon" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
              </svg>
              <div>
                <h3 class="warning-title">Delete Account</h3>
                <p class="warning-text">
                  Once you delete your account, there is no going back. This will permanently delete your account, all your recipes, meal plans, inventory, and journal entries.
                </p>
              </div>
            </div>

            <button
              @click="showDeleteConfirmation = true"
              class="button-danger"
            >
              <svg class="button-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteConfirmation" class="modal-overlay" @click.self="showDeleteConfirmation = false">
      <div class="modal-content">
        <div class="modal-header">
          <h2>Confirm Account Deletion</h2>
          <button class="close-button" @click="showDeleteConfirmation = false">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div class="modal-body">
          <div class="modal-warning">
            <svg class="warning-icon-large" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
            </svg>
            <h3>Are you absolutely sure?</h3>
            <p>
              This action <strong>cannot be undone</strong>. This will permanently delete the account for
              <strong>{{ user?.email }}</strong> and remove all associated data.
            </p>
          </div>

          <div class="confirmation-input">
            <label for="confirm-email">
              To confirm, please type your email address:
            </label>
            <input
              id="confirm-email"
              v-model="deleteConfirmEmail"
              type="email"
              class="form-input"
              placeholder="Enter your email"
            />
          </div>
        </div>

        <div class="modal-footer">
          <button class="button-secondary" @click="showDeleteConfirmation = false">
            Cancel
          </button>
          <button
            :disabled="deleteConfirmEmail !== user?.email || isDeleting"
            @click="handleDeleteAccount"
            class="button-danger"
          >
            <svg v-if="isDeleting" class="button-icon spinning" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            {{ isDeleting ? 'Deleting...' : 'Delete My Account' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Success Toast -->
    <Transition name="toast">
      <div v-if="showSuccessToast" class="toast toast-success">
        <svg class="toast-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>{{ successMessage }}</span>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useUserService } from '@/renderer/composables/useUserService'
import type User from '@/shared/user'

const props = defineProps<{
  currentUserId: number
}>()

const emit = defineEmits<{
  logout: []
}>()

const userService = useUserService(window.electronService?.users)

const user = ref<User | null>(null)
const formData = ref({
  name: '',
  email: ''
})
const showDeleteConfirmation = ref(false)
const deleteConfirmEmail = ref('')
const isUpdating = ref(false)
const isDeleting = ref(false)
const showSuccessToast = ref(false)
const successMessage = ref('')

const isLoading = computed(() => userService.isLoading.value)
const error = computed(() => userService.error.value)

const hasChanges = computed(() => {
  if (!user.value) return false
  return formData.value.name !== user.value.name || formData.value.email !== user.value.email
})

const loadUser = async () => {
  const loadedUser = await userService.getUserById(props.currentUserId)
  if (loadedUser) {
    user.value = loadedUser
    formData.value = {
      name: loadedUser.name,
      email: loadedUser.email
    }
  }
}

const resetForm = () => {
  if (user.value) {
    formData.value = {
      name: user.value.name,
      email: user.value.email
    }
  }
}

const handleUpdateProfile = async () => {
  if (!hasChanges.value) return

  isUpdating.value = true
  try {
    const updated = await userService.updateUser(props.currentUserId, {
      name: formData.value.name,
      email: formData.value.email
    })

    if (updated) {
      user.value = updated
      showToast('Profile updated successfully!')
    }
  } catch (err) {
  } finally {
    isUpdating.value = false
  }
}

const handleDeleteAccount = async () => {
  if (deleteConfirmEmail.value !== user.value?.email) return

  isDeleting.value = true
  try {
    const success = await userService.deleteUser(props.currentUserId)
    if (success) {
      showToast('Account deleted successfully')
      setTimeout(() => {
        emit('logout')
      }, 1500)
    }
  } catch (err) {
  } finally {
    isDeleting.value = false
    showDeleteConfirmation.value = false
    deleteConfirmEmail.value = ''
  }
}

const showToast = (message: string) => {
  successMessage.value = message
  showSuccessToast.value = true
  setTimeout(() => {
    showSuccessToast.value = false
  }, 3000)
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

onMounted(() => {
  loadUser()
})
</script>

<style scoped>
.settings-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f8faf9 0%, #f1f5f3 100%);
  padding-top: 5rem;
  padding-bottom: 5rem;
}

.settings-header {
  background: white;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  padding: 2rem 1rem;
  margin-bottom: 2rem;
}

.header-content {
  max-width: 800px;
  margin: 0 auto;
}

.header-title {
  font-size: 2rem;
  font-weight: 700;
  color: #333;
  margin: 0 0 0.5rem 0;
}

.header-subtitle {
  font-size: 1rem;
  color: #666;
  margin: 0;
}

.content-wrapper {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 1rem;
}

.loading-state,
.error-state {
  text-align: center;
  padding: 3rem 1.5rem;
  background: white;
  border-radius: 1rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.spinner {
  width: 3rem;
  height: 3rem;
  border: 3px solid #f3f3f3;
  border-top: 3px solid var(--color-fresh-green, #7ed957);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-icon {
  width: 3rem;
  height: 3rem;
  color: #ef4444;
  margin: 0 auto 1rem;
}

.error-state h3 {
  font-size: 1.25rem;
  color: #333;
  margin: 0 0 0.5rem 0;
}

.error-state p {
  color: #666;
  margin: 0 0 1rem 0;
}

.retry-button {
  padding: 0.75rem 1.5rem;
  background: var(--color-fresh-green, #7ed957);
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.retry-button:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(126, 217, 87, 0.3);
}

.settings-content {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.settings-card {
  background: white;
  border-radius: 1rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.danger-card {
  border: 2px solid #fee2e2;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  border-bottom: 1px solid #f3f4f6;
}

.card-header-icon {
  width: 3rem;
  height: 3rem;
  background: linear-gradient(135deg, var(--color-fresh-green, #7ed957) 0%, #6bc785 100%);
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.card-header-icon svg {
  width: 1.5rem;
  height: 1.5rem;
  color: white;
}

.danger-icon {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
}

.card-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #333;
  margin: 0 0 0.25rem 0;
}

.card-subtitle {
  font-size: 0.875rem;
  color: #666;
  margin: 0;
}

.card-content {
  padding: 1.5rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group:last-of-type {
  margin-bottom: 0;
}

.form-label {
  display: block;
  font-weight: 500;
  color: #333;
  margin-bottom: 0.5rem;
  font-size: 0.95rem;
}

.form-input {
  width: 100%;
  padding: 0.875rem;
  border: 2px solid #e5e7eb;
  border-radius: 0.5rem;
  font-size: 1rem;
  transition: all 0.2s;
  font-family: inherit;
}

.form-input:focus {
  outline: none;
  border-color: var(--color-fresh-green, #7ed957);
  box-shadow: 0 0 0 3px rgba(126, 217, 87, 0.1);
}

.info-text {
  padding: 0.875rem;
  background: #f9fafb;
  border-radius: 0.5rem;
  color: #666;
  font-size: 0.95rem;
}

.form-actions {
  display: flex;
  gap: 0.75rem;
  margin-top: 1.5rem;
}

.button-primary,
.button-secondary,
.button-danger {
  padding: 0.875rem 1.5rem;
  border-radius: 0.5rem;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  justify-content: center;
}

.button-icon {
  width: 1.25rem;
  height: 1.25rem;
}

.button-primary {
  background: linear-gradient(135deg, var(--color-fresh-green, #7ed957) 0%, #6bc785 100%);
  color: white;
  flex: 1;
}

.button-primary:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(126, 217, 87, 0.3);
}

.button-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.button-secondary {
  background: #f3f4f6;
  color: #333;
}

.button-secondary:hover {
  background: #e5e7eb;
}

.button-danger {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  color: white;
}

.button-danger:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
}

.button-danger:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.danger-warning {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  background: #fef2f2;
  border-radius: 0.75rem;
  margin-bottom: 1.5rem;
}

.warning-icon {
  width: 1.5rem;
  height: 1.5rem;
  color: #ef4444;
  flex-shrink: 0;
}

.warning-title {
  font-size: 1rem;
  font-weight: 600;
  color: #991b1b;
  margin: 0 0 0.5rem 0;
}

.warning-text {
  font-size: 0.875rem;
  color: #7f1d1d;
  margin: 0;
  line-height: 1.5;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  backdrop-filter: blur(4px);
}

.modal-content {
  background: white;
  border-radius: 1rem;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  animation: slideUp 0.2s ease-out;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
}

.modal-header h2 {
  margin: 0;
  font-size: 1.5rem;
  color: #333;
  font-weight: 600;
}

.close-button {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;
  transition: all 0.2s;
  border-radius: 0.5rem;
}

.close-button:hover {
  background: #f3f4f6;
  color: #333;
}

.close-button svg {
  width: 1.5rem;
  height: 1.5rem;
}

.modal-body {
  padding: 1.5rem;
}

.modal-warning {
  text-align: center;
  margin-bottom: 1.5rem;
}

.warning-icon-large {
  width: 3rem;
  height: 3rem;
  color: #ef4444;
  margin: 0 auto 1rem;
}

.modal-warning h3 {
  font-size: 1.25rem;
  color: #333;
  margin: 0 0 0.75rem 0;
}

.modal-warning p {
  color: #666;
  line-height: 1.6;
  margin: 0;
}

.modal-warning strong {
  color: #333;
}

.confirmation-input {
  margin-top: 1.5rem;
}

.confirmation-input label {
  display: block;
  font-weight: 500;
  color: #333;
  margin-bottom: 0.5rem;
  font-size: 0.95rem;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  padding: 1.5rem;
  border-top: 1px solid #e5e7eb;
}

.toast {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  background: white;
  padding: 1rem 1.5rem;
  border-radius: 0.75rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  display: flex;
  align-items: center;
  gap: 0.75rem;
  z-index: 10000;
}

.toast-success {
  border-left: 4px solid #10b981;
}

.toast-icon {
  width: 1.5rem;
  height: 1.5rem;
  color: #10b981;
}

.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateY(1rem);
}

.spinning {
  animation: spin 1s linear infinite;
}

@media (max-width: 640px) {
  .form-actions {
    flex-direction: column;
  }

  .button-primary {
    width: 100%;
  }
}
</style>
