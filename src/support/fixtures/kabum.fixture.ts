import { test as base } from '@playwright/test';
import { join } from 'path';
import { TheConfig } from 'sicolo';
import KabumPage from '../pages/KabumPage';

const CONFIG = join(__dirname, 'config.yml');
const BASE_URL: string = TheConfig.fromFile(CONFIG)
  .andPath('application.kabum')
  .retrieveData();

type KabumFixtures = {
  kabumPage: KabumPage;
};

/**
 * Fixture customizada (https://playwright.dev/docs/test-fixtures):
 * cada teste recebe uma instância nova do Page Object, em um contexto
 * de navegador isolado (carrinho limpo).
 */
export const test = base.extend<KabumFixtures>({
  kabumPage: async ({ page }, use) => {
    await use(new KabumPage(page, BASE_URL));
  }
});

export { expect } from '@playwright/test';
