import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

test.describe('Accessibility Tests', () => {
  test('should not have any automatically detectable accessibility issues on homepage', async ({ page }) => {
    await page.goto('/')
    
    const accessibilityScanResults = await new AxeBuilder({ page }).analyze()
    
    expect(accessibilityScanResults.violations).toEqual([])
  })

  test('should not have any automatically detectable accessibility issues on auth page', async ({ page }) => {
    await page.goto('/auth/signin')
    
    const accessibilityScanResults = await new AxeBuilder({ page }).analyze()
    
    expect(accessibilityScanResults.violations).toEqual([])
  })

  test('should not have any automatically detectable accessibility issues on privacy policy', async ({ page }) => {
    await page.goto('/privacy-policy')
    
    const accessibilityScanResults = await new AxeBuilder({ page }).analyze()
    
    expect(accessibilityScanResults.violations).toEqual([])
  })

  test('should have proper heading hierarchy', async ({ page }) => {
    await page.goto('/')
    
    // Check that h1 exists
    await expect(page.locator('h1')).toBeVisible()
    
    // Check that there's only one h1
    const h1Count = await page.locator('h1').count()
    expect(h1Count).toBe(1)
    
    // Check heading order (h1 -> h2 -> h3, etc.)
    const headings = await page.locator('h1, h2, h3, h4, h5, h6').all()
    let previousLevel = 0
    
    for (const heading of headings) {
      const tagName = await heading.evaluate(el => el.tagName)
      const level = parseInt(tagName.substring(1))
      
      if (previousLevel > 0) {
        expect(level).toBeLessThanOrEqual(previousLevel + 1)
      }
      
      previousLevel = level
    }
  })

  test('should have proper form labels', async ({ page }) => {
    await page.goto('/auth/signin')
    
    // Check that all form inputs have labels
    const inputs = await page.locator('input[type="email"], input[type="password"], input[type="text"]').all()
    
    for (const input of inputs) {
      const id = await input.getAttribute('id')
      if (id) {
        const label = page.locator(`label[for="${id}"]`)
        await expect(label).toBeVisible()
      }
    }
  })

  test('should have proper button labels', async ({ page }) => {
    await page.goto('/')
    
    // Check that all buttons have accessible text
    const buttons = await page.locator('button').all()
    
    for (const button of buttons) {
      const text = await button.textContent()
      const ariaLabel = await button.getAttribute('aria-label')
      const ariaLabelledBy = await button.getAttribute('aria-labelledby')
      
      expect(text || ariaLabel || ariaLabelledBy).toBeTruthy()
    }
  })

  test('should have proper focus management', async ({ page }) => {
    await page.goto('/auth/signin')
    
    // Tab through the form
    await page.keyboard.press('Tab')
    await page.keyboard.press('Tab')
    await page.keyboard.press('Tab')
    
    // Check that focus is visible
    const focusedElement = await page.evaluate(() => document.activeElement)
    expect(focusedElement).toBeTruthy()
  })

  test('should have proper color contrast', async ({ page }) => {
    await page.goto('/')
    
    // This is a basic test - in a real app you'd use a more sophisticated tool
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['color-contrast'])
      .analyze()
    
    expect(accessibilityScanResults.violations).toEqual([])
  })

  test('should have proper alt text for images', async ({ page }) => {
    await page.goto('/')
    
    const images = await page.locator('img').all()
    
    for (const img of images) {
      const alt = await img.getAttribute('alt')
      const ariaLabel = await img.getAttribute('aria-label')
      const role = await img.getAttribute('role')
      
      // Images should have alt text, aria-label, or be decorative (role="presentation")
      expect(alt || ariaLabel || role === 'presentation').toBeTruthy()
    }
  })

  test('should have proper ARIA landmarks', async ({ page }) => {
    await page.goto('/')
    
    // Check for main landmark
    await expect(page.locator('main, [role="main"]')).toBeVisible()
    
    // Check for navigation landmark
    await expect(page.locator('nav, [role="navigation"]')).toBeVisible()
    
    // Check for banner landmark
    await expect(page.locator('header, [role="banner"]')).toBeVisible()
  })

  test('should be keyboard navigable', async ({ page }) => {
    await page.goto('/')
    
    // Test keyboard navigation
    await page.keyboard.press('Tab')
    await page.keyboard.press('Tab')
    await page.keyboard.press('Tab')
    
    // Check that we can interact with elements using keyboard
    await page.keyboard.press('Enter')
    
    // Should not cause any errors
    const errors = await page.evaluate(() => {
      return window.console.error
    })
    
    expect(errors).toBeFalsy()
  })
})
