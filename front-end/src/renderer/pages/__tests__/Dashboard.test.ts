import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { ref } from 'vue'
import Dashboard from '../Dashboard.vue'
import DashboardHero from '@/renderer/components/dashboard/DashboardHero.vue'
import DashboardStats from '@/renderer/components/dashboard/DashboardStats.vue'
import DashboardNavCard from '@/renderer/components/dashboard/DashboardNavCard.vue'
import DashboardQuickActions from '@/renderer/components/dashboard/DashboardQuickActions.vue'
import type User from '@/shared/user'

vi.mock('@/renderer/composables/useDashboard', () => ({
  useDashboard: vi.fn(() => ({
    userName: ref('Test User'),
    inventoryCount: ref(15),
    recipesCount: ref(8),
    weekMealsCount: ref(12),
    todayCalories: ref(1850),
    isLoading: ref(false),
  })),
}))

describe('Dashboard.vue', () => {
  const mockUser: User = {
    id: 1,
    email: 'test@example.com',
    name: 'Test User',
    created_at: '2025-01-01T00:00:00.000Z',
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Component Rendering', () => {
    it('should render without errors', () => {
      const wrapper = mount(Dashboard, {
        props: { currentUser: mockUser },
        global: {
          stubs: {
            DashboardHero: true,
            DashboardStats: true,
            DashboardNavCard: true,
            DashboardQuickActions: true,
          },
        },
      })

      expect(wrapper.exists()).toBe(true)
    })

    it('should render DashboardHero component', () => {
      const wrapper = mount(Dashboard, {
        props: { currentUser: mockUser },
        global: {
          stubs: {
            DashboardHero: true,
            DashboardStats: true,
            DashboardNavCard: true,
            DashboardQuickActions: true,
          },
        },
      })

      expect(wrapper.findComponent({ name: 'DashboardHero' }).exists()).toBe(true)
    })

    it('should render DashboardStats component', () => {
      const wrapper = mount(Dashboard, {
        props: { currentUser: mockUser },
        global: {
          stubs: {
            DashboardHero: true,
            DashboardStats: true,
            DashboardNavCard: true,
            DashboardQuickActions: true,
          },
        },
      })

      expect(wrapper.findComponent({ name: 'DashboardStats' }).exists()).toBe(true)
    })

    it('should render all 4 DashboardNavCard components', () => {
      const wrapper = mount(Dashboard, {
        props: { currentUser: mockUser },
        global: {
          stubs: {
            DashboardHero: true,
            DashboardStats: true,
            DashboardNavCard: true,
            DashboardQuickActions: true,
          },
        },
      })

      const navCards = wrapper.findAllComponents({ name: 'DashboardNavCard' })
      expect(navCards).toHaveLength(4)
    })

    it('should render DashboardQuickActions component', () => {
      const wrapper = mount(Dashboard, {
        props: { currentUser: mockUser },
        global: {
          stubs: {
            DashboardHero: true,
            DashboardStats: true,
            DashboardNavCard: true,
            DashboardQuickActions: true,
          },
        },
      })

      expect(wrapper.findComponent({ name: 'DashboardQuickActions' }).exists()).toBe(true)
    })

    it('should have dashboard wrapper with proper class', () => {
      const wrapper = mount(Dashboard, {
        props: { currentUser: mockUser },
        global: {
          stubs: {
            DashboardHero: true,
            DashboardStats: true,
            DashboardNavCard: true,
            DashboardQuickActions: true,
          },
        },
      })

      expect(wrapper.find('.dashboard-wrapper').exists()).toBe(true)
    })

    it('should have nav-cards section', () => {
      const wrapper = mount(Dashboard, {
        props: { currentUser: mockUser },
        global: {
          stubs: {
            DashboardHero: true,
            DashboardStats: true,
            DashboardNavCard: true,
            DashboardQuickActions: true,
          },
        },
      })

      expect(wrapper.find('.nav-cards').exists()).toBe(true)
    })
  })

  describe('Prop Handling - Current User', () => {
    it('should accept currentUser prop', () => {
      const wrapper = mount(Dashboard, {
        props: { currentUser: mockUser },
        global: {
          stubs: {
            DashboardHero: true,
            DashboardStats: true,
            DashboardNavCard: true,
            DashboardQuickActions: true,
          },
        },
      })

      expect(wrapper.props('currentUser')).toEqual(mockUser)
    })

    it('should pass user ID to useDashboard composable', async () => {
      const { useDashboard } = vi.mocked(await import('@/renderer/composables/useDashboard'))

      mount(Dashboard, {
        props: { currentUser: mockUser },
        global: {
          stubs: {
            DashboardHero: true,
            DashboardStats: true,
            DashboardNavCard: true,
            DashboardQuickActions: true,
          },
        },
      })

      expect(useDashboard).toHaveBeenCalledWith(1)
    })

    it('should work with different user IDs', () => {
      const differentUser: User = {
        ...mockUser,
        id: 99,
        name: 'Different User',
      }

      const wrapper = mount(Dashboard, {
        props: { currentUser: differentUser },
        global: {
          stubs: {
            DashboardHero: true,
            DashboardStats: true,
            DashboardNavCard: true,
            DashboardQuickActions: true,
          },
        },
      })

      expect(wrapper.props('currentUser').id).toBe(99)
    })
  })

  describe('Navigation - Event Emissions', () => {
    it('should emit "navigate" event when Inventory card is clicked', async () => {
      const wrapper = mount(Dashboard, {
        props: { currentUser: mockUser },
        global: {
          stubs: {
            DashboardHero: true,
            DashboardStats: true,
            DashboardQuickActions: true,
          },
        },
      })

      const navCards = wrapper.findAllComponents(DashboardNavCard)
      const inventoryCard = navCards.find((card) => card.props('title') === 'Inventory')

      await inventoryCard?.vm.$emit('click')

      expect(wrapper.emitted('navigate')).toBeTruthy()
      expect(wrapper.emitted('navigate')?.[0]).toEqual(['inventory'])
    })

    it('should emit "navigate" event with "recipes" when Recipes card is clicked', async () => {
      const wrapper = mount(Dashboard, {
        props: { currentUser: mockUser },
        global: {
          stubs: {
            DashboardHero: true,
            DashboardStats: true,
            DashboardQuickActions: true,
          },
        },
      })

      const navCards = wrapper.findAllComponents(DashboardNavCard)
      const recipesCard = navCards.find((card) => card.props('title') === 'Recipes')

      await recipesCard?.vm.$emit('click')

      expect(wrapper.emitted('navigate')?.[0]).toEqual(['recipes'])
    })

    it('should emit "navigate" event with "mealplans" when Meal Plans card is clicked', async () => {
      const wrapper = mount(Dashboard, {
        props: { currentUser: mockUser },
        global: {
          stubs: {
            DashboardHero: true,
            DashboardStats: true,
            DashboardQuickActions: true,
          },
        },
      })

      const navCards = wrapper.findAllComponents(DashboardNavCard)
      const mealPlansCard = navCards.find((card) => card.props('title') === 'Meal Plans')

      await mealPlansCard?.vm.$emit('click')

      expect(wrapper.emitted('navigate')?.[0]).toEqual(['mealplans'])
    })

    it('should emit "navigate" event with "journal" when Journal card is clicked', async () => {
      const wrapper = mount(Dashboard, {
        props: { currentUser: mockUser },
        global: {
          stubs: {
            DashboardHero: true,
            DashboardStats: true,
            DashboardQuickActions: true,
          },
        },
      })

      const navCards = wrapper.findAllComponents(DashboardNavCard)
      const journalCard = navCards.find((card) => card.props('title') === 'Journal')

      await journalCard?.vm.$emit('click')

      expect(wrapper.emitted('navigate')?.[0]).toEqual(['journal'])
    })

    it('should emit navigate when QuickActions emits action-click', async () => {
      const wrapper = mount(Dashboard, {
        props: { currentUser: mockUser },
        global: {
          stubs: {
            DashboardHero: true,
            DashboardStats: true,
            DashboardNavCard: true,
          },
        },
      })

      const quickActions = wrapper.findComponent(DashboardQuickActions)
      await quickActions.vm.$emit('action-click', 'inventory')

      expect(wrapper.emitted('navigate')?.[0]).toEqual(['inventory'])
    })

    it('should handle multiple navigation events', async () => {
      const wrapper = mount(Dashboard, {
        props: { currentUser: mockUser },
        global: {
          stubs: {
            DashboardHero: true,
            DashboardStats: true,
            DashboardQuickActions: true,
          },
        },
      })

      const navCards = wrapper.findAllComponents(DashboardNavCard)

      await navCards[0].vm.$emit('click')
      await navCards[1].vm.$emit('click')
      await navCards[2].vm.$emit('click')

      expect(wrapper.emitted('navigate')).toHaveLength(3)
    })
  })

  describe('DashboardNavCard Props', () => {
    it('should pass correct props to Inventory card', () => {
      const wrapper = mount(Dashboard, {
        props: { currentUser: mockUser },
        global: {
          stubs: {
            DashboardHero: true,
            DashboardStats: true,
            DashboardQuickActions: true,
          },
        },
      })

      const navCards = wrapper.findAllComponents(DashboardNavCard)
      const inventoryCard = navCards.find((card) => card.props('title') === 'Inventory')

      expect(inventoryCard?.props()).toMatchObject({
        variant: 'green',
        title: 'Inventory',
        description: 'Manage your ingredients and track what\'s in stock',
        badge: '15 items',
        feature: 'Track expiry dates',
        icon: 'inventory',
      })
    })

    it('should pass correct props to Recipes card', () => {
      const wrapper = mount(Dashboard, {
        props: { currentUser: mockUser },
        global: {
          stubs: {
            DashboardHero: true,
            DashboardStats: true,
            DashboardQuickActions: true,
          },
        },
      })

      const navCards = wrapper.findAllComponents(DashboardNavCard)
      const recipesCard = navCards.find((card) => card.props('title') === 'Recipes')

      expect(recipesCard?.props()).toMatchObject({
        variant: 'blue',
        title: 'Recipes',
        description: 'Browse and create your favorite recipes with nutrition info',
        badge: '8 recipes',
        feature: 'Full nutrition data',
        icon: 'recipes',
      })
    })

    it('should pass correct props to Meal Plans card', () => {
      const wrapper = mount(Dashboard, {
        props: { currentUser: mockUser },
        global: {
          stubs: {
            DashboardHero: true,
            DashboardStats: true,
            DashboardQuickActions: true,
          },
        },
      })

      const navCards = wrapper.findAllComponents(DashboardNavCard)
      const mealPlansCard = navCards.find((card) => card.props('title') === 'Meal Plans')

      expect(mealPlansCard?.props()).toMatchObject({
        variant: 'yellow',
        title: 'Meal Plans',
        description: 'Plan your weekly meals and stay organized',
        badge: '12 this week',
        feature: 'Weekly planning',
        icon: 'mealplans',
      })
    })

    it('should pass correct props to Journal card', () => {
      const wrapper = mount(Dashboard, {
        props: { currentUser: mockUser },
        global: {
          stubs: {
            DashboardHero: true,
            DashboardStats: true,
            DashboardQuickActions: true,
          },
        },
      })

      const navCards = wrapper.findAllComponents(DashboardNavCard)
      const journalCard = navCards.find((card) => card.props('title') === 'Journal')

      expect(journalCard?.props()).toMatchObject({
        variant: 'red',
        title: 'Journal',
        description: 'Track your daily nutrition and calorie intake',
        badge: '1850 kcal today',
        feature: 'Daily tracking',
        icon: 'journal',
      })
    })
  })

  describe('DashboardStats Props', () => {
    it('should pass correct stats to DashboardStats component', () => {
      const wrapper = mount(Dashboard, {
        props: { currentUser: mockUser },
        global: {
          stubs: {
            DashboardHero: true,
            DashboardNavCard: true,
            DashboardQuickActions: true,
          },
        },
      })

      const statsComponent = wrapper.findComponent(DashboardStats)

      expect(statsComponent.props()).toMatchObject({
        inventoryCount: 15,
        recipesCount: 8,
        weekMealsCount: 12,
        todayCalories: 1850,
      })
    })
  })

  describe('DashboardHero Props', () => {
    it('should pass userName to DashboardHero component', () => {
      const wrapper = mount(Dashboard, {
        props: { currentUser: mockUser },
        global: {
          stubs: {
            DashboardStats: true,
            DashboardNavCard: true,
            DashboardQuickActions: true,
          },
        },
      })

      const heroComponent = wrapper.findComponent(DashboardHero)

      expect(heroComponent.props('userName')).toBe('Test User')
    })
  })

  describe('Edge Cases', () => {
    it('should handle zero counts gracefully', async () => {
      vi.mocked(await import('@/renderer/composables/useDashboard')).useDashboard = vi.fn(
        () => ({
          userName: ref('Test User'),
          inventoryCount: ref(0),
          recipesCount: ref(0),
          weekMealsCount: ref(0),
          todayCalories: ref(0),
          isLoading: ref(false),
        })
      )

      const wrapper = mount(Dashboard, {
        props: { currentUser: mockUser },
        global: {
          stubs: {
            DashboardHero: true,
            DashboardNavCard: true,
            DashboardQuickActions: true,
          },
        },
      })

      const statsComponent = wrapper.findComponent(DashboardStats)

      expect(statsComponent.props()).toMatchObject({
        inventoryCount: 0,
        recipesCount: 0,
        weekMealsCount: 0,
        todayCalories: 0,
      })
    })

    it('should handle loading state', async () => {
      vi.mocked(await import('@/renderer/composables/useDashboard')).useDashboard = vi.fn(
        () => ({
          userName: ref('Test User'),
          inventoryCount: ref(0),
          recipesCount: ref(0),
          weekMealsCount: ref(0),
          todayCalories: ref(0),
          isLoading: ref(true),
        })
      )

      const wrapper = mount(Dashboard, {
        props: { currentUser: mockUser },
        global: {
          stubs: {
            DashboardHero: true,
            DashboardStats: true,
            DashboardNavCard: true,
            DashboardQuickActions: true,
          },
        },
      })

      expect(wrapper.exists()).toBe(true)
    })

    it('should handle very large calorie counts', async () => {
      vi.mocked(await import('@/renderer/composables/useDashboard')).useDashboard = vi.fn(
        () => ({
          userName: ref('Test User'),
          inventoryCount: ref(15),
          recipesCount: ref(8),
          weekMealsCount: ref(12),
          todayCalories: ref(9999),
          isLoading: ref(false),
        })
      )

      const wrapper = mount(Dashboard, {
        props: { currentUser: mockUser },
        global: {
          stubs: {
            DashboardHero: true,
            DashboardNavCard: true,
            DashboardQuickActions: true,
          },
        },
      })

      const statsComponent = wrapper.findComponent(DashboardStats)
      expect(statsComponent.props('todayCalories')).toBe(9999)
    })
  })

  describe('Component Structure', () => {
    it('should maintain proper component hierarchy', () => {
      const wrapper = mount(Dashboard, {
        props: { currentUser: mockUser },
        global: {
          stubs: {
            DashboardHero: true,
            DashboardStats: true,
            DashboardNavCard: true,
            DashboardQuickActions: true,
          },
        },
      })

      const dashboardWrapper = wrapper.find('.dashboard-wrapper')
      const dashboard = dashboardWrapper.find('.dashboard')
      const navCards = dashboard.find('.nav-cards')

      expect(dashboardWrapper.exists()).toBe(true)
      expect(dashboard.exists()).toBe(true)
      expect(navCards.exists()).toBe(true)
    })
  })
})
