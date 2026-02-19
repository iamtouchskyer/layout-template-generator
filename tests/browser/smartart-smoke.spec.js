const { test, expect } = require('@playwright/test')

test('smartart engine toggle updates URL and exported contract', async ({ page }) => {
  await page.goto('/index.html')

  await page.waitForFunction(() => {
    return (
      typeof window.updatePageType === 'function' &&
      typeof window.updateJsonOutput === 'function' &&
      typeof window.SmartArt !== 'undefined'
    )
  })

  await page.evaluate(() => {
    window.updatePageType('content-smartart')
  })

  await expect(page.locator('#smartart-operation-bar')).toHaveClass(/visible/)
  await expect(page.locator('#smartart-engine-selector')).toBeVisible()
  await expect(page.locator('#smartart-render-target svg')).toBeVisible()

  await page.getByRole('button', { name: 'Legacy' }).click()
  await page.waitForURL(/smartartEngine=legacy/)

  const legacySmartart = await page.evaluate(() => {
    window.updateJsonOutput()
    const config = JSON.parse(document.getElementById('json-output').textContent)
    return config.smartart
  })

  expect(legacySmartart.engine).toBe('legacy')
  expect(Array.isArray(legacySmartart.items)).toBeTruthy()
  expect(legacySmartart.type).toBeTruthy()
  expect(legacySmartart.colorScheme).toBeTruthy()

  await page.getByRole('button', { name: 'Next' }).click()
  await page.waitForFunction(() => !window.location.search.includes('smartartEngine=legacy'))

  const nextSmartart = await page.evaluate(() => {
    window.updateJsonOutput()
    const config = JSON.parse(document.getElementById('json-output').textContent)
    return config.smartart
  })

  expect(nextSmartart.engine).toBe('next')
})
