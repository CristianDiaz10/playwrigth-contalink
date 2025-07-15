import { defineConfig } from '@playwright/test';

export default defineConfig({
  reporter: [['html', { outputFolder: 'reports', open: 'never' }]],
  testDir: './tests', // Ajusta esta ruta si tus tests están en otra carpeta
  use: {
    headless: false,
  },
});