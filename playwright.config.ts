import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  projects: [
    {
      name: 'ui',
      testDir: './tests/ui',
      use: { headless: false },
      outputDir: 'test-results/ui',
      reporter: [['html', { outputFolder: 'reports/ui', open: 'never' }]],
    },
    {
      name: 'api',
      testDir: './src/apis',
      use: { headless: true },
      outputDir: 'test-results/api',
      reporter: [['html', { outputFolder: 'reports/api', open: 'never' }]],
    },
  ],
});