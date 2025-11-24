<template>
  <Modal
    :isOpen="true"
    title="Create Ingredient"
    subtitle="Add a custom ingredient to the database"
    size="md"
    :showDefaultFooter="false"
    @close="closeModal"
  >

      <!-- Form -->
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <!-- Name Input -->
        <Input
          v-model="form.name"
          label="Ingredient Name"
          placeholder="e.g., Chicken Breast"
          :error="errors.name"
          required
        />

        <!-- Nutrition Grid -->
        <div class="grid grid-cols-2 gap-3">
          <!-- Calories -->
          <Input
            :modelValue="form.kcal_per_100g.toString()"
            @update:modelValue="form.kcal_per_100g = Number($event)"
            label="Calories"
            type="number"
            placeholder="kcal/100g"
            :error="errors.kcal_per_100g"
            hint="per 100g"
            required
          />

          <!-- Protein -->
          <Input
            :modelValue="form.protein_g_per_100g.toString()"
            @update:modelValue="form.protein_g_per_100g = Number($event)"
            label="Protein"
            type="number"
            placeholder="g/100g"
            :error="errors.protein_g_per_100g"
            hint="g/100g"
            required
          />

          <!-- Carbs -->
          <Input
            :modelValue="form.carbs_g_per_100g.toString()"
            @update:modelValue="form.carbs_g_per_100g = Number($event)"
            label="Carbs"
            type="number"
            placeholder="g/100g"
            :error="errors.carbs_g_per_100g"
            hint="g/100g"
            required
          />

          <!-- Fat -->
          <Input
            :modelValue="form.fat_g_per_100g.toString()"
            @update:modelValue="form.fat_g_per_100g = Number($event)"
            label="Fat"
            type="number"
            placeholder="g/100g"
            :error="errors.fat_g_per_100g"
            hint="g/100g"
            required
          />
        </div>

        <!-- Validation Summary -->
        <div v-if="generalError" class="rounded-lg bg-strawberry-red/10 p-3">
          <p class="text-sm text-strawberry-red">{{ generalError }}</p>
        </div>

        <!-- Nutrition Info Display -->
        <div class="rounded-lg bg-sky-blue/10 p-3">
          <p class="text-xs font-medium text-sky-blue/80">Nutritional Values (per 100g)</p>
          <div class="mt-2 grid grid-cols-2 gap-2 text-xs">
            <div>
              <p class="text-neutral-600">Calories: {{ form.kcal_per_100g || 0 }} kcal</p>
              <p class="text-neutral-600">Protein: {{ form.protein_g_per_100g || 0 }}g</p>
            </div>
            <div>
              <p class="text-neutral-600">Carbs: {{ form.carbs_g_per_100g || 0 }}g</p>
              <p class="text-neutral-600">Fat: {{ form.fat_g_per_100g || 0 }}g</p>
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex gap-2 pt-4">
          <Button variant="ghost" fullWidth @click="closeModal"> Cancel </Button>
          <Button
            :isLoading="isLoading"
            fullWidth
            @click="handleSubmit"
          >
            Create Ingredient
          </Button>
        </div>
      </form>
  </Modal>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import type Ingredient from '@/shared/ingredient'
import { useIngredientsService } from '../../composables/useIngredientsService'
import Input from '../ui/Input.vue'
import Button from '../ui/Button.vue'
import Modal from '../ui/Modal.vue'

interface Emits {
  (e: 'close'): void
  (e: 'created', ingredient: Ingredient): void
}

const emit = defineEmits<Emits>()
const ingredientService = useIngredientsService(window.electronService?.ingredients)
const isLoading = ref(false)
const generalError = ref('')

const form = reactive({
  name: '',
  kcal_per_100g: 0,
  protein_g_per_100g: 0,
  carbs_g_per_100g: 0,
  fat_g_per_100g: 0,
})

const errors = reactive({
  name: '',
  kcal_per_100g: '',
  protein_g_per_100g: '',
  carbs_g_per_100g: '',
  fat_g_per_100g: '',
})

const validateForm = () => {
  let isValid = true
  generalError.value = ''

  Object.keys(errors).forEach(key => {
    errors[key as keyof typeof errors] = ''
  })

  if (!form.name.trim()) {
    errors.name = 'Ingredient name is required'
    isValid = false
  }

  if (form.kcal_per_100g < 0) {
    errors.kcal_per_100g = 'Must be a positive number'
    isValid = false
  }
  if (form.protein_g_per_100g < 0) {
    errors.protein_g_per_100g = 'Must be a positive number'
    isValid = false
  }
  if (form.carbs_g_per_100g < 0) {
    errors.carbs_g_per_100g = 'Must be a positive number'
    isValid = false
  }
  if (form.fat_g_per_100g < 0) {
    errors.fat_g_per_100g = 'Must be a positive number'
    isValid = false
  }

  return isValid
}

const handleSubmit = async () => {
  if (!validateForm()) {
    return
  }

  isLoading.value = true
  try {
    const newIngredient = await ingredientService.createIngredient(
      form.name.trim(),
      form.kcal_per_100g,
      form.protein_g_per_100g,
      form.carbs_g_per_100g,
      form.fat_g_per_100g
    )

    emit('created', newIngredient)
  } catch (err) {
    generalError.value =
      err instanceof Error ? err.message : 'Failed to create ingredient. Please try again.'
  } finally {
    isLoading.value = false
  }
}

const closeModal = () => {
  emit('close')
}
</script>
