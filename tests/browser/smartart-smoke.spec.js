const { test, expect } = require('@playwright/test')

async function openSmartartPage(page) {
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
}

test('smartart engine toggle updates URL and exported contract', async ({ page }) => {
  await openSmartartPage(page)

  await expect(page.locator('#smartart-operation-bar')).toHaveClass(/visible/)
  await expect(page.locator('#smartart-engine-selector')).toBeVisible()
  await expect(page.locator('#smartart-render-target svg')).toBeVisible()

  await page.getByRole('button', { name: '3' }).click()
  const count3 = await page.evaluate(() => {
    window.updateJsonOutput()
    return JSON.parse(document.getElementById('json-output').textContent).smartart.items.length
  })
  expect(count3).toBe(3)

  await page.getByRole('button', { name: '6' }).click()
  const count6 = await page.evaluate(() => {
    window.updateJsonOutput()
    return JSON.parse(document.getElementById('json-output').textContent).smartart.items.length
  })
  expect(count6).toBe(6)

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

test('generate pptx posts smartart payload and triggers download link', async ({ page }) => {
  let postedConfig = null

  await page.addInitScript(() => {
    window.__clickedLinks = []
    const nativeClick = HTMLAnchorElement.prototype.click
    HTMLAnchorElement.prototype.click = function patchedClick() {
      window.__clickedLinks.push({
        href: this.getAttribute('href'),
        download: this.getAttribute('download'),
      })
      // Do not trigger actual navigation/download in CI smoke tests.
    }
    window.__restoreAnchorClick = () => {
      HTMLAnchorElement.prototype.click = nativeClick
    }
  })

  await page.route('**/generate', async (route) => {
    postedConfig = route.request().postDataJSON()
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ success: true, file: 'generated.pptx' }),
    })
  })

  await openSmartartPage(page)
  await page.getByRole('button', { name: 'Legacy' }).click()
  await page.waitForURL(/smartartEngine=legacy/)

  await page.getByRole('button', { name: 'Generate PPTX' }).click()

  await expect.poll(() => postedConfig !== null).toBeTruthy()
  expect(postedConfig.pageType).toBe('content-smartart')
  expect(postedConfig.smartart.engine).toBe('legacy')
  expect(Array.isArray(postedConfig.smartart.items)).toBeTruthy()
  expect(postedConfig.smartart.type).toBeTruthy()
  expect(postedConfig.smartart.colorScheme).toBeTruthy()

  await page.waitForFunction(() => window.__clickedLinks.length > 0)
  const clicked = await page.evaluate(() => window.__clickedLinks[0])
  expect(clicked.download).toBe('generated.pptx')
  expect(clicked.href).toBe('/generated.pptx')
})
