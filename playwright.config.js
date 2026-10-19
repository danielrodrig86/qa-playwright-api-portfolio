
import { defineConfig, devices } from '@playwright/test'

module.exports = defineConfig({
  testDir: './tests',
  timeout: 30000,
  expect: {
    timeout: 5000
  },
  use: {
    baseURL: 'http://localhost:3001',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure'
  },
  reporter: [['html', { open: 'never' }]],
  projects: [
    {
      name: 'api',
      testMatch: [
        '**/api/**/*.spec.js',
        '**/integration/**/*.spec.js'
      ],
      use: {
        browserName: 'chromium'
      }
    },
    {
      name: 'chromium',
      testMatch: '**/ui/**/*.spec.js',
      use: {
        ...devices['Desktop Chrome']
      }
    },
    {
      name: 'firefox',
      testMatch: '**/ui/**/*.spec.js',
      use: {
        ...devices['Desktop Firefox']
      }
    },
    {
      name: 'webkit',
      testMatch: '**/ui/**/*.spec.js',
      use: {
        ...devices['Desktop Safari']
      }
    }
  ]
})
