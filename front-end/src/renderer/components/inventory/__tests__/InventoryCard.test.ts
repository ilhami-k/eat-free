import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import InventoryCard from '../InventoryCard.vue'
import type { InventoryIngredientWithDetails } from '@/renderer/composables/useInventoryService'

interface InventoryItemWithMealPlanStatus extends InventoryIngredientWithDetails {
  mealPlanStatus?: {
    isNeededForMealPlan: boolean
    isSufficient: boolean
    required_grams: number
    shortfall_grams: number
  } | null
}

describe('InventoryCard.vue', () => {
  const baseIngredient: InventoryItemWithMealPlanStatus = {
    inventory_id: 1,
    ingredient_id: 1,
    ingredient_name: 'Chicken Breast',
    qty_grams: 500,
    kcal_per_100g: 165,
    protein_g_per_100g: 31,
    carbs_g_per_100g: 0,
    fat_g_per_100g: 3.6,
  }

  describe('Rendering - Basic Display', () => {
    it('should render ingredient name correctly', () => {
      const wrapper = mount(InventoryCard, {
        props: { ingredient: baseIngredient },
      })

      expect(wrapper.find('.card-title').text()).toBe('Chicken Breast')
    })

    it('should display quantity in grams (rounded)', () => {
      const wrapper = mount(InventoryCard, {
        props: {
          ingredient: { ...baseIngredient, qty_grams: 123.7 },
        },
      })

      expect(wrapper.find('.quantity-value').text()).toBe('124')
      expect(wrapper.find('.quantity-unit').text()).toBe('g')
    })

    it('should render quantity label as "Available"', () => {
      const wrapper = mount(InventoryCard, {
        props: { ingredient: baseIngredient },
      })

      expect(wrapper.find('.quantity-label').text()).toBe('Available')
    })

    it('should display "View details" footer text', () => {
      const wrapper = mount(InventoryCard, {
        props: { ingredient: baseIngredient },
      })

      expect(wrapper.find('.view-text').text()).toBe('View details')
    })

    it('should render arrow icon in footer', () => {
      const wrapper = mount(InventoryCard, {
        props: { ingredient: baseIngredient },
      })

      expect(wrapper.find('.arrow-icon').exists()).toBe(true)
    })
  })

  describe('Conditional Logic - Meal Plan Status', () => {
    it('should not display status badge when no meal plan status', () => {
      const wrapper = mount(InventoryCard, {
        props: { ingredient: baseIngredient },
      })

      expect(wrapper.find('.status-badge').exists()).toBe(false)
    })

    it('should display "Ready" badge when ingredient is sufficient for meal plan', () => {
      const ingredient: InventoryItemWithMealPlanStatus = {
        ...baseIngredient,
        mealPlanStatus: {
          isNeededForMealPlan: true,
          isSufficient: true,
          required_grams: 300,
          shortfall_grams: 0,
        },
      }

      const wrapper = mount(InventoryCard, {
        props: { ingredient },
      })

      const badge = wrapper.find('.status-badge')
      expect(badge.exists()).toBe(true)
      expect(badge.text()).toContain('Ready')
      expect(badge.classes()).toContain('status-badge-success')
    })

    it('should display "Low" badge when ingredient is insufficient for meal plan', () => {
      const ingredient: InventoryItemWithMealPlanStatus = {
        ...baseIngredient,
        qty_grams: 200,
        mealPlanStatus: {
          isNeededForMealPlan: true,
          isSufficient: false,
          required_grams: 500,
          shortfall_grams: 300,
        },
      }

      const wrapper = mount(InventoryCard, {
        props: { ingredient },
      })

      const badge = wrapper.find('.status-badge')
      expect(badge.exists()).toBe(true)
      expect(badge.text()).toContain('Low')
      expect(badge.classes()).toContain('status-badge-warning')
    })

    it('should apply "card-success" class when quantity is sufficient', () => {
      const ingredient: InventoryItemWithMealPlanStatus = {
        ...baseIngredient,
        mealPlanStatus: {
          isNeededForMealPlan: true,
          isSufficient: true,
          required_grams: 300,
          shortfall_grams: 0,
        },
      }

      const wrapper = mount(InventoryCard, {
        props: { ingredient },
      })

      expect(wrapper.find('.ingredient-card').classes()).toContain('card-success')
    })

    it('should apply "card-warning" class when quantity is low (edge case)', () => {
      const ingredient: InventoryItemWithMealPlanStatus = {
        ...baseIngredient,
        qty_grams: 50,
        mealPlanStatus: {
          isNeededForMealPlan: true,
          isSufficient: false,
          required_grams: 300,
          shortfall_grams: 250,
        },
      }

      const wrapper = mount(InventoryCard, {
        props: { ingredient },
      })

      expect(wrapper.find('.ingredient-card').classes()).toContain('card-warning')
    })

    it('should not apply variant class when no meal plan status', () => {
      const wrapper = mount(InventoryCard, {
        props: { ingredient: baseIngredient },
      })

      const card = wrapper.find('.ingredient-card')
      expect(card.classes()).not.toContain('card-success')
      expect(card.classes()).not.toContain('card-warning')
    })
  })

  describe('Conditional Logic - Need Information Display', () => {
    it('should display required grams when needed for meal plan', () => {
      const ingredient: InventoryItemWithMealPlanStatus = {
        ...baseIngredient,
        mealPlanStatus: {
          isNeededForMealPlan: true,
          isSufficient: true,
          required_grams: 450.8,
          shortfall_grams: 0,
        },
      }

      const wrapper = mount(InventoryCard, {
        props: { ingredient },
      })

      const needInfo = wrapper.find('.need-info')
      expect(needInfo.exists()).toBe(true)
      expect(needInfo.text()).toContain('Need:')
      expect(needInfo.text()).toContain('451g')
    })

    it('should display shortfall when insufficient (edge case)', () => {
      const ingredient: InventoryItemWithMealPlanStatus = {
        ...baseIngredient,
        qty_grams: 100,
        mealPlanStatus: {
          isNeededForMealPlan: true,
          isSufficient: false,
          required_grams: 400,
          shortfall_grams: 300,
        },
      }

      const wrapper = mount(InventoryCard, {
        props: { ingredient },
      })

      const needInfo = wrapper.find('.need-info')
      expect(needInfo.text()).toContain('300g short')
    })

    it('should not display shortfall when sufficient', () => {
      const ingredient: InventoryItemWithMealPlanStatus = {
        ...baseIngredient,
        mealPlanStatus: {
          isNeededForMealPlan: true,
          isSufficient: true,
          required_grams: 300,
          shortfall_grams: 0,
        },
      }

      const wrapper = mount(InventoryCard, {
        props: { ingredient },
      })

      expect(wrapper.find('.shortage-value').exists()).toBe(false)
    })

    it('should not display need info when not in meal plan', () => {
      const wrapper = mount(InventoryCard, {
        props: { ingredient: baseIngredient },
      })

      expect(wrapper.find('.need-info').exists()).toBe(false)
    })
  })

  describe('Conditional Logic - Progress Bar', () => {
    it('should display progress bar when in meal plan', () => {
      const ingredient: InventoryItemWithMealPlanStatus = {
        ...baseIngredient,
        qty_grams: 250,
        mealPlanStatus: {
          isNeededForMealPlan: true,
          isSufficient: false,
          required_grams: 500,
          shortfall_grams: 250,
        },
      }

      const wrapper = mount(InventoryCard, {
        props: { ingredient },
      })

      expect(wrapper.find('.progress-bar').exists()).toBe(true)
    })

    it('should apply success class to progress fill when sufficient', () => {
      const ingredient: InventoryItemWithMealPlanStatus = {
        ...baseIngredient,
        mealPlanStatus: {
          isNeededForMealPlan: true,
          isSufficient: true,
          required_grams: 300,
          shortfall_grams: 0,
        },
      }

      const wrapper = mount(InventoryCard, {
        props: { ingredient },
      })

      const progressFill = wrapper.find('.progress-fill')
      expect(progressFill.classes()).toContain('progress-success')
    })

    it('should apply warning class to progress fill when insufficient', () => {
      const ingredient: InventoryItemWithMealPlanStatus = {
        ...baseIngredient,
        qty_grams: 200,
        mealPlanStatus: {
          isNeededForMealPlan: true,
          isSufficient: false,
          required_grams: 500,
          shortfall_grams: 300,
        },
      }

      const wrapper = mount(InventoryCard, {
        props: { ingredient },
      })

      const progressFill = wrapper.find('.progress-fill')
      expect(progressFill.classes()).toContain('progress-warning')
    })

    it('should calculate progress percentage correctly (50%)', () => {
      const ingredient: InventoryItemWithMealPlanStatus = {
        ...baseIngredient,
        qty_grams: 250,
        mealPlanStatus: {
          isNeededForMealPlan: true,
          isSufficient: false,
          required_grams: 500,
          shortfall_grams: 250,
        },
      }

      const wrapper = mount(InventoryCard, {
        props: { ingredient },
      })

      const progressFill = wrapper.find('.progress-fill')
      const style = progressFill.attributes('style')
      expect(style).toContain('width: 50%')
    })

    it('should cap progress at 100% when quantity exceeds requirement', () => {
      const ingredient: InventoryItemWithMealPlanStatus = {
        ...baseIngredient,
        qty_grams: 800,
        mealPlanStatus: {
          isNeededForMealPlan: true,
          isSufficient: true,
          required_grams: 400,
          shortfall_grams: 0,
        },
      }

      const wrapper = mount(InventoryCard, {
        props: { ingredient },
      })

      const progressFill = wrapper.find('.progress-fill')
      const style = progressFill.attributes('style')
      expect(style).toContain('width: 100%')
    })

    it('should not display progress bar when not in meal plan', () => {
      const wrapper = mount(InventoryCard, {
        props: { ingredient: baseIngredient },
      })

      expect(wrapper.find('.progress-bar').exists()).toBe(false)
    })
  })

  describe('User Interaction - Click Events', () => {
    it('should emit "click" event when card is clicked', async () => {
      const wrapper = mount(InventoryCard, {
        props: { ingredient: baseIngredient },
      })

      await wrapper.find('.ingredient-card').trigger('click')

      expect(wrapper.emitted('click')).toBeTruthy()
      expect(wrapper.emitted('click')?.length).toBe(1)
    })

    it('should emit click event with no payload', async () => {
      const wrapper = mount(InventoryCard, {
        props: { ingredient: baseIngredient },
      })

      await wrapper.find('.ingredient-card').trigger('click')

      const clickEvents = wrapper.emitted('click')
      expect(clickEvents).toBeTruthy()
      expect(clickEvents![0]).toEqual([])
    })

    it('should emit click on subsequent clicks', async () => {
      const wrapper = mount(InventoryCard, {
        props: { ingredient: baseIngredient },
      })

      await wrapper.find('.ingredient-card').trigger('click')
      await wrapper.find('.ingredient-card').trigger('click')
      await wrapper.find('.ingredient-card').trigger('click')

      expect(wrapper.emitted('click')?.length).toBe(3)
    })
  })

  describe('Edge Cases', () => {
    it('should handle zero quantity gracefully', () => {
      const ingredient: InventoryItemWithMealPlanStatus = {
        ...baseIngredient,
        qty_grams: 0,
      }

      const wrapper = mount(InventoryCard, {
        props: { ingredient },
      })

      expect(wrapper.find('.quantity-value').text()).toBe('0')
    })

    it('should handle very large quantities', () => {
      const ingredient: InventoryItemWithMealPlanStatus = {
        ...baseIngredient,
        qty_grams: 9999.9,
      }

      const wrapper = mount(InventoryCard, {
        props: { ingredient },
      })

      expect(wrapper.find('.quantity-value').text()).toBe('10000')
    })

    it('should handle decimal quantities by rounding', () => {
      const ingredient: InventoryItemWithMealPlanStatus = {
        ...baseIngredient,
        qty_grams: 123.4,
      }

      const wrapper = mount(InventoryCard, {
        props: { ingredient },
      })

      expect(wrapper.find('.quantity-value').text()).toBe('123')
    })

    it('should render correctly with very long ingredient names', () => {
      const ingredient: InventoryItemWithMealPlanStatus = {
        ...baseIngredient,
        ingredient_name: 'Extra Virgin Organic Cold-Pressed Coconut Oil',
      }

      const wrapper = mount(InventoryCard, {
        props: { ingredient },
      })

      expect(wrapper.find('.card-title').text()).toBe(
        'Extra Virgin Organic Cold-Pressed Coconut Oil'
      )
    })

    it('should handle null meal plan status gracefully', () => {
      const ingredient: InventoryItemWithMealPlanStatus = {
        ...baseIngredient,
        mealPlanStatus: null,
      }

      const wrapper = mount(InventoryCard, {
        props: { ingredient },
      })

      expect(wrapper.find('.status-badge').exists()).toBe(false)
      expect(wrapper.find('.need-info').exists()).toBe(false)
      expect(wrapper.find('.progress-bar').exists()).toBe(false)
    })

    it('should handle exact quantity match (100% progress)', () => {
      const ingredient: InventoryItemWithMealPlanStatus = {
        ...baseIngredient,
        qty_grams: 500,
        mealPlanStatus: {
          isNeededForMealPlan: true,
          isSufficient: true,
          required_grams: 500,
          shortfall_grams: 0,
        },
      }

      const wrapper = mount(InventoryCard, {
        props: { ingredient },
      })

      const progressFill = wrapper.find('.progress-fill')
      const style = progressFill.attributes('style')
      expect(style).toContain('width: 100%')
    })

    it('should handle very low quantity (1g) with warning state', () => {
      const ingredient: InventoryItemWithMealPlanStatus = {
        ...baseIngredient,
        qty_grams: 1,
        mealPlanStatus: {
          isNeededForMealPlan: true,
          isSufficient: false,
          required_grams: 500,
          shortfall_grams: 499,
        },
      }

      const wrapper = mount(InventoryCard, {
        props: { ingredient },
      })

      expect(wrapper.find('.ingredient-card').classes()).toContain('card-warning')
      expect(wrapper.find('.status-badge').text()).toContain('Low')
      const shortageElements = wrapper.findAll('.shortage-value')
      expect(shortageElements).toHaveLength(2)
      expect(shortageElements[1].text()).toContain('499g short')
    })
  })

  describe('Icon Rendering', () => {
    it('should render success icon when sufficient', () => {
      const ingredient: InventoryItemWithMealPlanStatus = {
        ...baseIngredient,
        mealPlanStatus: {
          isNeededForMealPlan: true,
          isSufficient: true,
          required_grams: 300,
          shortfall_grams: 0,
        },
      }

      const wrapper = mount(InventoryCard, {
        props: { ingredient },
      })

      const icons = wrapper.findAll('.status-icon')
      expect(icons.length).toBeGreaterThan(0)
    })

    it('should render warning icon when insufficient', () => {
      const ingredient: InventoryItemWithMealPlanStatus = {
        ...baseIngredient,
        qty_grams: 100,
        mealPlanStatus: {
          isNeededForMealPlan: true,
          isSufficient: false,
          required_grams: 500,
          shortfall_grams: 400,
        },
      }

      const wrapper = mount(InventoryCard, {
        props: { ingredient },
      })

      const icons = wrapper.findAll('.status-icon')
      expect(icons.length).toBeGreaterThan(0)
    })
  })

  describe('Component Structure', () => {
    it('should have all main sections: header, body, footer', () => {
      const wrapper = mount(InventoryCard, {
        props: { ingredient: baseIngredient },
      })

      expect(wrapper.find('.card-header').exists()).toBe(true)
      expect(wrapper.find('.card-body').exists()).toBe(true)
      expect(wrapper.find('.card-footer').exists()).toBe(true)
    })

    it('should be a button element for accessibility', () => {
      const wrapper = mount(InventoryCard, {
        props: { ingredient: baseIngredient },
      })

      expect(wrapper.element.tagName).toBe('BUTTON')
    })
  })
})
