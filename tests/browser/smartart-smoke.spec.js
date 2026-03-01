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
  expect(postedConfig.pages[0].shell).toBe('content')
  expect(postedConfig.pages[0].renderer).toBe('smartart')
  expect(postedConfig.pages[0].pageShell).toBe('content')
  expect(postedConfig.pages[0].bodyRenderer).toBe('smartart')
  expect(postedConfig.master?.masterContentAreas?.headerBounds?.width).toBeGreaterThan(0)
  expect(postedConfig.master?.masterContentAreas?.bodyBounds?.height).toBeGreaterThan(0)
  expect(postedConfig.master?.masterContentAreas?.footerBounds?.y).toBeGreaterThan(0)
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
  expect(exported.config.pages[0].shell).toBe('content')
  expect(exported.config.pages[0].renderer).toBe('smartart')
  expect(exported.config.pages[1].shell).toBe('content')
  expect(exported.config.pages[1].renderer).toBe('grid')
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

test('divider export prefers current flat state over stale nested divider object', async ({ page }) => {
  await page.goto('/index.html')
  await page.waitForFunction(() => typeof window.applyImportedConfig === 'function' && typeof window.updateJsonOutput === 'function')

  const exported = await page.evaluate(() => {
    window.applyImportedConfig({
      schemaVersion: 2,
      master: { theme: 'forest_green', masterShapes: [], masterPlaceholders: {}, masterContentAreas: {} },
      pages: [
        {
          id: 'd1',
          type: 'divider',
          data: {
            divider: { layout: 'cards', sectionIndex: 2, bgStyle: 'light' },
            dividerLayout: 'cards-highlight',
            dividerIndex: 1,
            dividerBgStyle: 'solid',
            dividerSectionCount: 4,
            dividerNumberStyle: 'arabic',
            dividerTextLevel: 'full',
          },
        },
      ],
    })

    window.updateJsonOutput()
    return JSON.parse(document.getElementById('json-output').textContent).pages[0].data.divider
  })

  expect(exported.layout).toBe('cards-highlight')
  expect(exported.sectionIndex).toBe(1)
  expect(exported.bgStyle).toBe('solid')
})

test('imported page shell/body renderer model is normalized to legacy type', async ({ page }) => {
  await page.goto('/index.html')
  await page.waitForFunction(() => typeof window.applyImportedConfig === 'function' && typeof window.updateJsonOutput === 'function')

  const imported = await page.evaluate(() => {
    window.applyImportedConfig({
      schemaVersion: 2,
      master: { theme: 'forest_green', masterShapes: [], masterPlaceholders: {}, masterContentAreas: {} },
      pages: [
        {
          id: 's1',
          shell: 'content',
          renderer: 'smartart',
          layout: 'left-desc',
          data: {
            smartartType: 'pyramid',
            smartartItemsByType: { pyramid: [{ text: 'A' }] },
          },
        },
      ],
    })

    window.updateJsonOutput()
    const config = JSON.parse(document.getElementById('json-output').textContent)
    return {
      type: config.pages?.[0]?.type,
      shell: config.pages?.[0]?.shell,
      renderer: config.pages?.[0]?.renderer,
    }
  })

  expect(imported.type).toBe('content-smartart')
  expect(imported.shell).toBe('content')
  expect(imported.renderer).toBe('smartart')
})

test('page model controls drive shell/renderer/layout and keep type compatible', async ({ page }) => {
  await page.goto('/index.html')
  await page.waitForFunction(() => typeof window.updatePageModelFromControls === 'function' && typeof window.updateJsonOutput === 'function')

  const output = await page.evaluate(() => {
    window.updatePageType('content-grid')

    const shell = document.getElementById('page-shell-select')
    const renderer = document.getElementById('page-renderer-select')
    const layout = document.getElementById('page-layout-select')

    shell.value = 'content'
    renderer.value = 'smartart'
    window.updatePageModelFromControls()

    layout.value = 'right-desc'
    window.updatePageModelFromControls()

    window.updateJsonOutput()
    const exported = JSON.parse(document.getElementById('json-output').textContent)
    return {
      type: exported.pages?.[0]?.type,
      shell: exported.pages?.[0]?.shell,
      renderer: exported.pages?.[0]?.renderer,
      layout: exported.pages?.[0]?.layout,
      smartartPlacement: exported.pages?.[0]?.data?.smartartPlacement,
    }
  })

  expect(output.type).toBe('content-smartart')
  expect(output.shell).toBe('content')
  expect(output.renderer).toBe('smartart')
  expect(output.layout).toBe('right-desc')
  expect(output.smartartPlacement).toBe('right-desc')
})

test('addPageByModel creates page with compatible legacy type', async ({ page }) => {
  await page.goto('/index.html')
  await page.waitForFunction(() => typeof window.addPageByModel === 'function' && typeof window.updateJsonOutput === 'function')

  const created = await page.evaluate(() => {
    window.updatePageType('cover')
    const page = window.addPageByModel('content', 'smartart', 'left-desc')
    window.updateJsonOutput()
    const exported = JSON.parse(document.getElementById('json-output').textContent)
    const hit = exported.pages.find(p => p.id === page.id)
    return {
      type: hit?.type,
      shell: hit?.shell,
      renderer: hit?.renderer,
      layout: hit?.layout,
    }
  })

  expect(created.type).toBe('content-smartart')
  expect(created.shell).toBe('content')
  expect(created.renderer).toBe('smartart')
  expect(created.layout).toBe('left-desc')
})

test('content-grid and content-smartart share header/body/footer shell', async ({ page }) => {
  await page.goto('/index.html')
  await page.waitForFunction(() => typeof window.updatePageType === 'function')

  const shell = await page.evaluate(() => {
    window.updatePageType('content-grid')
    const grid = {
      header: !!document.querySelector('#content-layer .header-area .title-zone'),
      body: !!document.querySelector('#content-layer .body-area .grid-content'),
      footer: !!document.querySelector('#content-layer .footer-area .source-zone'),
    }

    window.updatePageType('content-smartart')
    const smartart = {
      header: !!document.querySelector('#content-layer .header-area .title-zone'),
      body: !!document.querySelector('#content-layer .body-area .smartart-layout'),
      footer: !!document.querySelector('#content-layer .footer-area .source-zone'),
    }

    return { grid, smartart }
  })

  expect(shell.grid.header).toBeTruthy()
  expect(shell.grid.body).toBeTruthy()
  expect(shell.grid.footer).toBeTruthy()
  expect(shell.smartart.header).toBeTruthy()
  expect(shell.smartart.body).toBeTruthy()
  expect(shell.smartart.footer).toBeTruthy()
})

test('content shell text is editable and exported', async ({ page }) => {
  await page.goto('/index.html')
  await page.waitForFunction(() =>
    typeof window.updatePageType === 'function' &&
    typeof window.updateCurrentPageShellText === 'function' &&
    typeof window.updateJsonOutput === 'function'
  )

  const result = await page.evaluate(() => {
    window.updatePageType('content-grid')
    window.updateCurrentPageShellText('contentTitle', '自定义分析标题')
    window.updateCurrentPageShellText('contentTag', '季度复盘')
    window.updateCurrentPageShellText('contentSource', '内部数据平台')
    window.updateJsonOutput()

    const exported = JSON.parse(document.getElementById('json-output').textContent)
    const header = document.querySelector('#content-layer .header-area .title-zone')
    const source = document.querySelector('#content-layer .footer-area .source-zone')
    return {
      titleInDom: header?.querySelector('h1')?.textContent?.trim(),
      tagInDom: header?.querySelector('.title-tag')?.textContent?.trim(),
      sourceInDom: source?.textContent?.trim(),
      data: exported.pages?.[0]?.data || {},
    }
  })

  expect(result.titleInDom).toBe('自定义分析标题')
  expect(result.tagInDom).toBe('季度复盘')
  expect(result.sourceInDom).toBe('数据来源：内部数据平台')
  expect(result.data.contentTitle).toBe('自定义分析标题')
  expect(result.data.contentTag).toBe('季度复盘')
  expect(result.data.contentSource).toBe('内部数据平台')
})
