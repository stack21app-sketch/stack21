import { test, expect } from '@playwright/test'

test.describe('Legal Compliance', () => {
  test('should display cookie banner on first visit', async ({ page }) => {
    await page.goto('/')
    
    // Check if cookie banner is visible
    await expect(page.locator('[data-testid="cookie-banner"]')).toBeVisible()
    await expect(page.locator('text=We use cookies')).toBeVisible()
    
    // Check for accept and reject buttons
    await expect(page.locator('button:has-text("Accept All")')).toBeVisible()
    await expect(page.locator('button:has-text("Reject All")')).toBeVisible()
    await expect(page.locator('button:has-text("Customize")')).toBeVisible()
  })

  test('should accept all cookies', async ({ page }) => {
    await page.goto('/')
    
    await page.click('button:has-text("Accept All")')
    
    // Banner should disappear
    await expect(page.locator('[data-testid="cookie-banner"]')).not.toBeVisible()
    
    // Check if cookies are set
    const cookies = await page.context().cookies()
    const analyticsCookie = cookies.find(cookie => cookie.name === 'analytics_consent')
    expect(analyticsCookie?.value).toBe('true')
  })

  test('should reject all cookies', async ({ page }) => {
    await page.goto('/')
    
    await page.click('button:has-text("Reject All")')
    
    // Banner should disappear
    await expect(page.locator('[data-testid="cookie-banner"]')).not.toBeVisible()
    
    // Check if only essential cookies are set
    const cookies = await page.context().cookies()
    const analyticsCookie = cookies.find(cookie => cookie.name === 'analytics_consent')
    expect(analyticsCookie?.value).toBe('false')
  })

  test('should open cookie preferences modal', async ({ page }) => {
    await page.goto('/')
    
    await page.click('button:has-text("Customize")')
    
    // Check if preferences modal is visible
    await expect(page.locator('[data-testid="cookie-preferences-modal"]')).toBeVisible()
    
    // Check for different cookie categories
    await expect(page.locator('text=Essential Cookies')).toBeVisible()
    await expect(page.locator('text=Analytics Cookies')).toBeVisible()
    await expect(page.locator('text=Marketing Cookies')).toBeVisible()
    await expect(page.locator('text=Functional Cookies')).toBeVisible()
  })

  test('should navigate to privacy policy', async ({ page }) => {
    await page.goto('/')
    
    // Click on privacy policy link in footer
    await page.click('a[href="/privacy-policy"]')
    
    await expect(page).toHaveURL('/privacy-policy')
    await expect(page.locator('h1')).toContainText('Privacy Policy')
    
    // Check for key sections
    await expect(page.locator('text=Information We Collect')).toBeVisible()
    await expect(page.locator('text=How We Use Your Information')).toBeVisible()
    await expect(page.locator('text=Your Rights')).toBeVisible()
  })

  test('should navigate to terms of service', async ({ page }) => {
    await page.goto('/')
    
    // Click on terms of service link in footer
    await page.click('a[href="/terms-of-service"]')
    
    await expect(page).toHaveURL('/terms-of-service')
    await expect(page.locator('h1')).toContainText('Terms of Service')
    
    // Check for key sections
    await expect(page.locator('text=Acceptance of Terms')).toBeVisible()
    await expect(page.locator('text=Use License')).toBeVisible()
    await expect(page.locator('text=Disclaimer')).toBeVisible()
  })

  test('should navigate to cookie policy', async ({ page }) => {
    await page.goto('/')
    
    // Click on cookie policy link in footer
    await page.click('a[href="/cookie-policy"]')
    
    await expect(page).toHaveURL('/cookie-policy')
    await expect(page.locator('h1')).toContainText('Cookie Policy')
    
    // Check for key sections
    await expect(page.locator('text=What Are Cookies')).toBeVisible()
    await expect(page.locator('text=Types of Cookies')).toBeVisible()
    await expect(page.locator('text=Managing Cookies')).toBeVisible()
  })

  test('should display legal compliance center', async ({ page }) => {
    await page.goto('/legal-compliance')
    
    await expect(page.locator('h1')).toContainText('Legal Compliance Center')
    
    // Check for compliance status
    await expect(page.locator('[data-testid="compliance-status"]')).toBeVisible()
    
    // Check for different compliance sections
    await expect(page.locator('text=GDPR Compliance')).toBeVisible()
    await expect(page.locator('text=CCPA Compliance')).toBeVisible()
    await expect(page.locator('text=Data Export')).toBeVisible()
    await expect(page.locator('text=Data Deletion')).toBeVisible()
  })

  test('should handle data export request', async ({ page }) => {
    // This would require authentication
    await page.goto('/legal-compliance')
    
    // Click on data export button
    await page.click('button:has-text("Export My Data")')
    
    // Check if export modal opens
    await expect(page.locator('[data-testid="data-export-modal"]')).toBeVisible()
    
    // Select export format
    await page.selectOption('select[name="format"]', 'json')
    await page.check('input[name="includeTechnical"]')
    
    // Submit export request
    await page.click('button:has-text("Request Export")')
    
    // Check for success message
    await expect(page.locator('text=Export request submitted')).toBeVisible()
  })

  test('should handle data deletion request', async ({ page }) => {
    // This would require authentication
    await page.goto('/legal-compliance')
    
    // Click on data deletion button
    await page.click('button:has-text("Delete My Data")')
    
    // Check if deletion modal opens
    await expect(page.locator('[data-testid="data-deletion-modal"]')).toBeVisible()
    
    // Fill in reason
    await page.fill('textarea[name="reason"]', 'No longer need the service')
    
    // Check confirmation checkbox
    await page.check('input[name="confirmDeletion"]')
    
    // Submit deletion request
    await page.click('button:has-text("Request Deletion")')
    
    // Check for confirmation message
    await expect(page.locator('text=Deletion request submitted')).toBeVisible()
  })
})
