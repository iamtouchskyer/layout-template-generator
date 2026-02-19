const { defineConfig } = require('@playwright/test')

module.exports = defineConfig({
  testDir: './tests/browser',
  timeout: 90_000,
  expect: {
    timeout: 10_000,
  },
  fullyParallel: false,
  workers: 1,
  reporter: [['line']],
  use: {
    baseURL: 'http://127.0.0.1:8765',
    headless: true,
    viewport: { width: 1440, height: 900 },
  },
  webServer: {
    command: 'python3 -m http.server 8765',
    url: 'http://127.0.0.1:8765/index.html',
    reuseExistingServer: true,
    timeout: 120_000,
  },
})
