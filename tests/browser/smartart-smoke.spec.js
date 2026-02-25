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

test('smartart count selector updates exported contract', async ({ page }) => {
  await openSmartartPage(page)

  await expect(page.locator('#smartart-operation-bar')).toHaveClass(/visible/)
  await expect(page.locator('#smartart-render-target svg')).toBeVisible()

  await page.getByRole('button', { name: '3' }).click()
  const count3 = await page.evaluate(() => {
    window.updateJsonOutput()
    const config = JSON.parse(document.getElementById('json-output').textContent)
    const smartart = (config.schemaVersion === 2 ? config.pages?.[0]?.data?.smartart : config.smartart) || {}
    return Array.isArray(smartart.items) ? smartart.items.length : 0
  })
  expect(count3).toBe(3)

  await page.getByRole('button', { name: '6' }).click()
  const count6 = await page.evaluate(() => {
    window.updateJsonOutput()
    const config = JSON.parse(document.getElementById('json-output').textContent)
    const smartart = (config.schemaVersion === 2 ? config.pages?.[0]?.data?.smartart : config.smartart) || {}
    return Array.isArray(smartart.items) ? smartart.items.length : 0
  })
  expect(count6).toBe(6)

  const smartart = await page.evaluate(() => {
    window.updateJsonOutput()
    const config = JSON.parse(document.getElementById('json-output').textContent)
    return (config.schemaVersion === 2 ? config.pages?.[0]?.data?.smartart : config.smartart) || {}
  })

  expect(Array.isArray(smartart.items)).toBeTruthy()
  expect(smartart.type).toBeTruthy()
  expect(smartart.colorScheme).toBeTruthy()
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

  await page.getByRole('button', { name: 'Generate PPTX' }).click()

  await expect.poll(() => postedConfig !== null).toBeTruthy()
  expect(postedConfig.schemaVersion).toBe(2)
  expect(Array.isArray(postedConfig.pages)).toBeTruthy()
  expect(postedConfig.pages[0].type).toBe('content-smartart')
  const smartartPayload = postedConfig.pages[0].data.smartart
  expect('engine' in smartartPayload).toBeFalsy()
  expect(Array.isArray(smartartPayload.items)).toBeTruthy()
  expect(smartartPayload.type).toBeTruthy()
  expect(smartartPayload.colorScheme).toBeTruthy()

  await page.waitForFunction(() => window.__clickedLinks.length > 0)
  const clicked = await page.evaluate(() => window.__clickedLinks[0])
  expect(clicked.download).toBe('generated.pptx')
  expect(clicked.href).toBe('/generated.pptx')
})

test('multi-page operations are reflected in exported v2 payload order', async ({ page }) => {
  await openSmartartPage(page)

  const exported = await page.evaluate(() => {
    const firstId = window.getCurrentPageId()
    window.patchCurrentPage({
      smartartType: 'pyramid',
      smartartCategory: 'pyramid',
      smartartItems: [{ text: 'Page1' }],
      smartartItemsByType: { pyramid: [{ text: 'Page1' }] },
    })

    const second = window.addPage('content-grid')
    window.patchCurrentPage({
      gridLayout: 'single',
      zoneContents: { A: 'text' },
    })

    window.setCurrentPage(firstId)
    window.updateJsonOutput()
    return {
      firstId,
      secondId: second.id,
      config: JSON.parse(document.getElementById('json-output').textContent),
    }
  })

  expect(exported.config.schemaVersion).toBe(2)
  expect(Array.isArray(exported.config.pages)).toBeTruthy()
  expect(exported.config.pages.length).toBe(2)
  expect(exported.config.pages[0].id).toBe(exported.firstId)
  expect(exported.config.pages[1].id).toBe(exported.secondId)
  expect(exported.config.pages[0].type).toBe('content-smartart')
  expect(exported.config.pages[1].type).toBe('content-grid')
})

test('undo and redo restore page list after page operations', async ({ page }) => {
  await openSmartartPage(page)

  await page.evaluate(() => {
    state.ui.history.undoStack = []
    state.ui.history.redoStack = []
    updateHistoryButtons()
  })

  await expect(page.locator('#btn-undo')).toBeDisabled()
  await expect(page.locator('#btn-redo')).toBeDisabled()

  await page.evaluate(() => {
    window.addPage('content-grid')
  })

  await expect.poll(async () => {
    return page.evaluate(() => window.listPages().length)
  }).toBe(2)

  await expect(page.locator('#btn-undo')).toBeEnabled()
  await page.getByRole('button', { name: 'Undo' }).click()

  await expect.poll(async () => {
    return page.evaluate(() => window.listPages().length)
  }).toBe(1)

  await expect(page.locator('#btn-redo')).toBeEnabled()
  await page.getByRole('button', { name: 'Redo' }).click()

  await expect.poll(async () => {
    return page.evaluate(() => window.listPages().length)
  }).toBe(2)
})

test('undo and redo restore grid layout edits', async ({ page }) => {
  await page.goto('/index.html')
  await page.waitForFunction(() => typeof window.updatePageType === 'function')

  await page.evaluate(() => {
    updatePageType('content-grid')
    state.ui.history.undoStack = []
    state.ui.history.redoStack = []
    updateHistoryButtons()
  })

  await expect(page.locator('#btn-undo')).toBeDisabled()
  await expect(page.locator('#btn-redo')).toBeDisabled()

  const before = await page.evaluate(() => state.gridLayout)
  await page.evaluate(() => selectGridLayout('single'))
  await expect.poll(async () => page.evaluate(() => state.gridLayout)).toBe('single')

  await page.getByRole('button', { name: 'Undo' }).click()
  await expect.poll(async () => page.evaluate(() => state.gridLayout)).toBe(before)

  await page.getByRole('button', { name: 'Redo' }).click()
  await expect.poll(async () => page.evaluate(() => state.gridLayout)).toBe('single')
})

test('imported config updates state and export payload', async ({ page }) => {
  await page.goto('/index.html')
  await page.waitForFunction(() => typeof window.applyImportedConfig === 'function' && typeof window.updateJsonOutput === 'function')

  const imported = await page.evaluate(() => {
    const payload = {
      schemaVersion: 2,
      master: {
        theme: 'azure',
        masterShapes: [],
        masterPlaceholders: {},
        masterContentAreas: {},
      },
      pages: [
        {
          id: 'import-p1',
          type: 'cover',
          data: {
            coverLayout: 'cross_rectangles',
            coverContent: { title: 'Imported Cover' },
          },
        },
        {
          id: 'import-p2',
          type: 'content-grid',
          data: {
            gridLayout: 'single',
            zoneContents: { A: 'text' },
          },
        },
      ],
    }

    window.applyImportedConfig(payload)
    window.updateJsonOutput()
    const config = JSON.parse(document.getElementById('json-output').textContent)
    return {
      currentPageId: window.getCurrentPageId(),
      pageCount: Array.isArray(config.pages) ? config.pages.length : 0,
      firstType: config.pages?.[0]?.type,
      secondType: config.pages?.[1]?.type,
      firstTitle: config.pages?.[0]?.data?.coverContent?.title || '',
    }
  })

  expect(imported.currentPageId).toBe('import-p1')
  expect(imported.pageCount).toBe(2)
  expect(imported.firstType).toBe('cover')
  expect(imported.secondType).toBe('content-grid')
  expect(imported.firstTitle).toBe('Imported Cover')
})
