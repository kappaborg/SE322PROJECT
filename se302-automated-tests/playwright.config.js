const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  
  testDir: './tests',
  
  
  timeout: 30 * 1000,
  
  
  expect: {
    timeout: 5000
  },
  
  
  fullyParallel: true,
  
  
  forbidOnly: !!process.env.CI,
  
  
  retries: process.env.CI ? 2 : 0,
  
  
  
  
  workers: process.env.CI ? 1 : (process.env.WORKERS ? parseInt(process.env.WORKERS) : 5),
  
  
  reporter: [
    ['html', { outputFolder: 'reports/html-report' }],
    ['json', { outputFile: 'reports/test-results.json' }],
    ['list'],
    ['junit', { outputFile: 'reports/junit.xml' }]
  ],
  
  
  use: {
    
    baseURL: process.env.BASE_URL || 'https://sis.ius.edu.ba',
    
    
    trace: 'on-first-retry',
    
    
    screenshot: 'only-on-failure',
    
    
    video: 'retain-on-failure',
    
    
    actionTimeout: 10000,
    
    
    navigationTimeout: 30000,
  },

  
  projects: [
    {
      name: 'chromium',
      use: { 
        ...devices['Desktop Chrome'],
        viewport: { width: 1920, height: 1080 }
      },
    },
    {
      name: 'firefox',
      use: { 
        ...devices['Desktop Firefox'],
        viewport: { width: 1920, height: 1080 }
      },
    },
  ],

  
  
  
  
  
  
});
