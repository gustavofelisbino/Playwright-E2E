import { defineConfig } from '@playwright/test';

const isCI = !!process.env.CI;

export default defineConfig({
  testDir: 'src/scenarios',
  timeout: 120000,
  // Falha o build no CI se algum test.only for esquecido no código
  forbidOnly: isCI,
  // Sites externos podem oscilar: uma nova tentativa apenas no CI
  retries: isCI ? 1 : 0,
  use: {
    trace: 'on',
    channel: 'chrome',
    locale: 'pt-BR',
    headless: isCI,
    viewport: { width: 1280, height: 720 },
    ignoreHTTPSErrors: true,
    screenshot: 'on',
    video: 'off'
  },
  expect: {
    timeout: 30000
  },
  reporter: [
    [isCI ? 'github' : 'list'],
    [
      'html',
      {
        outputFolder: 'artifacts/report',
        open: 'never'
      }
    ]
  ]
});
