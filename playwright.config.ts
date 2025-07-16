import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests', // carpeta por defecto (puedes dejarla así)
  reporter: [['html', { outputFolder: 'reports', open: 'never' }]], // reporte global por defecto
  projects: [
    {
      name: 'ui',
      testDir: './tests/ui', // tests UI
      use: {
        headless: false,
      },
      outputDir: 'test-results/ui',
    },
    {
      name: 'api',
      testDir: './src/apis', // tests API
      use: {
        headless: true,
      },
      outputDir: 'test-results/api-temp',
    },
  ],
});