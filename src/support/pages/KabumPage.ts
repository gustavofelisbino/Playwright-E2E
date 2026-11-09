import { Page, expect } from '@playwright/test';
import KabumElements from '../elements/KabumElements';
import BasePage from './BasePage';

/** Converte "R$ 1.234,56" (ou "R$ 1 . 2 3 4 , 5 6") em 1234.56 */
export function parsePrice(text: string): number {
  const match = /R\$([\d.]+,\d{2})/.exec(text.replace(/\s/g, ''));
  if (!match) {
    throw new Error(`Preço não encontrado em: "${text}"`);
  }
  return Number(match[1].replace(/\./g, '').replace(',', '.'));
}

/** Gera uma regex que casa "R$ 1.234,56" (com espaço normal ou &nbsp;). */
export function priceRegex(value: number): RegExp {
  const formatted = value.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
  return new RegExp(`R\\$\\s?${formatted.replace(/\./g, '\\.')}`);
}

export default class KabumPage extends BasePage {
  readonly elements: KabumElements;

  constructor(
    readonly page: Page,
    private readonly baseUrl: string
  ) {
    super(page);
    this.page = page;
    this.elements = new KabumElements(page);
  }

  async openProduct(productId: string): Promise<void> {
    await this.page.goto(`${this.baseUrl}/produto/${productId}`, {
      waitUntil: 'domcontentloaded'
    });
    await expect(this.elements.getBuyButton()).toBeVisible();
  }

  async getProductName(): Promise<string> {
    return (await this.elements.getProductTitle().innerText()).trim();
  }

  async getProductPixPrice(): Promise<number> {
    const priceEl = this.elements.getProductPixPrice();
    await expect(priceEl).toContainText(/R\$\s*\d/);
    // O valor fica no shadow DOM de <number-flow-react>, invisível ao innerText();
    // o snapshot de acessibilidade expõe o texto, ex.: "paragraph: R$ 6 9 , 9 9".
    return parsePrice(await priceEl.ariaSnapshot());
  }

  /**
   * Clica em "Comprar agora". Alguns produtos passam pelo pré-carrinho
   * (oferta de garantia estendida), que é recusada para chegar ao carrinho.
   */
  async clickBuy(): Promise<void> {
    await this.elements.getBuyButton().click();
    await expect(this.page).toHaveURL(/\/(precarrinho|carrinho)/);

    if (this.page.url().includes('/precarrinho')) {
      // O botão pode ser renderizado antes de a página hidratar: tenta até navegar.
      await expect(async () => {
        if (!/\/carrinho$/.test(this.page.url())) {
          await this.elements.getSkipWarrantyButton().click({ timeout: 5000 });
        }
        await expect(this.page).toHaveURL(/\/carrinho$/, { timeout: 5000 });
      }).toPass();
    }

    await expect(this.page).toHaveURL(/\/carrinho$/);
  }

  /** Abre o produto, guarda nome e preço e o adiciona ao carrinho. */
  async addProductToCart(
    productId: string
  ): Promise<{ name: string; price: number }> {
    await this.openProduct(productId);
    const name = await this.getProductName();
    const price = await this.getProductPixPrice();
    await this.clickBuy();
    await expect(this.elements.getQuantityInput(productId)).toBeVisible();
    return { name, price };
  }

  async getProductsTotal(): Promise<number> {
    return parsePrice(await this.elements.getProductsTotal().innerText());
  }

  async increaseQuantity(productId: string): Promise<void> {
    await this.elements.getIncreaseButton(productId).click();
  }

  async decreaseQuantity(productId: string): Promise<void> {
    await this.elements.getDecreaseButton(productId).click();
  }

  async removeProduct(productId: string): Promise<void> {
    await this.elements.getRemoveButton(productId).click();
    await expect(this.elements.getRemoveDialog()).toBeVisible();
    await this.elements.getConfirmRemoveButton().click();
    await expect(this.elements.getCartItem(productId)).toHaveCount(0);
  }
}
