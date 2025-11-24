import { describe, it, expect, beforeEach } from 'vitest'
import { useNavigation, type View } from '../useNavigation'

describe('useNavigation', () => {
  let navigation: ReturnType<typeof useNavigation>

  beforeEach(() => {
    navigation = useNavigation()
    navigation.resetNavigation()
  })

  describe('Initial State', () => {
    it('should start on dashboard view', () => {
      expect(navigation.activeView.value).toBe('dashboard')
    })

    it('should have dashboard in navigation history', () => {
      expect(navigation.canGoBack.value).toBe(false)
      expect(navigation.canGoForward.value).toBe(false)
    })
  })

  describe('navigate', () => {
    it('should navigate to inventory page', () => {
      navigation.navigate('inventory')
      expect(navigation.activeView.value).toBe('inventory')
    })

    it('should navigate to recipes page', () => {
      navigation.navigate('recipes')
      expect(navigation.activeView.value).toBe('recipes')
    })

    it('should navigate to meal plans page', () => {
      navigation.navigate('mealplans')
      expect(navigation.activeView.value).toBe('mealplans')
    })

    it('should navigate to journal page', () => {
      navigation.navigate('journal')
      expect(navigation.activeView.value).toBe('journal')
    })

    it('should navigate to settings page', () => {
      navigation.navigate('settings')
      expect(navigation.activeView.value).toBe('settings')
    })

    it('should maintain navigation history', () => {
      navigation.navigate('inventory')
      navigation.navigate('recipes')
      navigation.navigate('journal')

      expect(navigation.canGoBack.value).toBe(true)
      expect(navigation.canGoForward.value).toBe(false)
    })

    it('should clear forward history when navigating from middle of history', () => {
      navigation.navigate('inventory')
      navigation.navigate('recipes')
      navigation.navigate('journal')

      navigation.goBack()
      navigation.goBack()

      expect(navigation.activeView.value).toBe('inventory')

      navigation.navigate('settings')

      expect(navigation.activeView.value).toBe('settings')
      expect(navigation.canGoForward.value).toBe(false)
    })
  })

  describe('goBack', () => {
    it('should not go back when at the beginning', () => {
      const initialView = navigation.activeView.value
      navigation.goBack()
      expect(navigation.activeView.value).toBe(initialView)
    })

    it('should go back to previous page', () => {
      navigation.navigate('inventory')
      navigation.navigate('recipes')

      navigation.goBack()
      expect(navigation.activeView.value).toBe('inventory')

      navigation.goBack()
      expect(navigation.activeView.value).toBe('dashboard')
    })

    it('should update canGoBack and canGoForward correctly', () => {
      navigation.navigate('inventory')
      navigation.navigate('recipes')

      expect(navigation.canGoBack.value).toBe(true)
      expect(navigation.canGoForward.value).toBe(false)

      navigation.goBack()
      expect(navigation.canGoBack.value).toBe(true)
      expect(navigation.canGoForward.value).toBe(true)

      navigation.goBack()
      expect(navigation.canGoBack.value).toBe(false)
      expect(navigation.canGoForward.value).toBe(true)
    })
  })

  describe('goForward', () => {
    it('should not go forward when at the end', () => {
      navigation.navigate('inventory')
      const currentView = navigation.activeView.value

      navigation.goForward()
      expect(navigation.activeView.value).toBe(currentView)
    })

    it('should go forward to next page', () => {
      navigation.navigate('inventory')
      navigation.navigate('recipes')
      navigation.goBack()
      navigation.goBack()

      expect(navigation.activeView.value).toBe('dashboard')

      navigation.goForward()
      expect(navigation.activeView.value).toBe('inventory')

      navigation.goForward()
      expect(navigation.activeView.value).toBe('recipes')
    })

    it('should update canGoBack and canGoForward correctly', () => {
      navigation.navigate('inventory')
      navigation.navigate('recipes')
      navigation.goBack()
      navigation.goBack()

      expect(navigation.canGoBack.value).toBe(false)
      expect(navigation.canGoForward.value).toBe(true)

      navigation.goForward()
      expect(navigation.canGoBack.value).toBe(true)
      expect(navigation.canGoForward.value).toBe(true)

      navigation.goForward()
      expect(navigation.canGoBack.value).toBe(true)
      expect(navigation.canGoForward.value).toBe(false)
    })
  })

  describe('resetNavigation', () => {
    it('should reset to initial state', () => {
      navigation.navigate('inventory')
      navigation.navigate('recipes')
      navigation.navigate('journal')

      navigation.resetNavigation()

      expect(navigation.activeView.value).toBe('dashboard')
      expect(navigation.canGoBack.value).toBe(false)
      expect(navigation.canGoForward.value).toBe(false)
    })

    it('should clear all history', () => {
      navigation.navigate('inventory')
      navigation.navigate('recipes')
      navigation.goBack()

      navigation.resetNavigation()

      expect(navigation.canGoBack.value).toBe(false)
      expect(navigation.canGoForward.value).toBe(false)
    })
  })

  describe('Complex Navigation Scenarios', () => {
    it('should handle multiple back and forward navigations', () => {
      const views: View[] = ['inventory', 'recipes', 'mealplans', 'journal']

      views.forEach(view => navigation.navigate(view))
      expect(navigation.activeView.value).toBe('journal')

      navigation.goBack()
      navigation.goBack()
      navigation.goBack()
      expect(navigation.activeView.value).toBe('inventory')

      navigation.goForward()
      navigation.goForward()
      expect(navigation.activeView.value).toBe('mealplans')
    })

    it('should maintain correct state after branching navigation', () => {
      navigation.navigate('inventory')
      navigation.navigate('recipes')
      navigation.navigate('journal')

      navigation.goBack()
      navigation.goBack()
      expect(navigation.activeView.value).toBe('inventory')

      navigation.navigate('settings')
      expect(navigation.activeView.value).toBe('settings')
      expect(navigation.canGoForward.value).toBe(false)

      navigation.goBack()
      expect(navigation.activeView.value).toBe('inventory')

      navigation.goBack()
      expect(navigation.activeView.value).toBe('dashboard')
    })
  })
})
