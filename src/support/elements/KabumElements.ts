import { Locator, Page } from '@playwright/test';
import BaseElements from './BaseElements';

export default class KabumElements extends BaseElements {
  constructor(readonly page: Page) {
    super(page);
    this.page = page;
  }

  // ---------- Página do produto ----------

  getProductTitle(): Locator {
    return this.page.getByRole('heading', { level: 1 });
  }

  /**
   * Parágrafo com o preço à vista no PIX na página do produto.
   * Os dígitos são renderizados separadamente (animação), ex.: "R$ 6 9 , 9 9".
   */
  getProductPixPrice(): Locator {
    return this.page
      .getByRole('paragraph')
      .filter({ hasText: 'à vista no PIX' })
      .first();
  }

  getBuyButton(): Locator {
    return this.page.getByRole('button', { name: 'Comprar agora' });
  }

  // ---------- Pré-carrinho (oferta de garantia estendida) ----------

  getSkipWarrantyButton(): Locator {
    return this.page.getByRole('button', { name: 'Agora não' });
  }

  // ---------- Carrinho ----------

  getCartItem(productId: string): Locator {
    return this.page
      .locator('#ProductContainer')
      .filter({ has: this.getQuantityInput(productId) });
  }

  getCartProductLink(productId: string): Locator {
    return this.page.locator(`a.productLink[href^="/produto/${productId}/"]`);
  }

  getQuantityInput(productId: string): Locator {
    return this.page.locator(`#quantity-${productId}`);
  }

  getIncreaseButton(productId: string): Locator {
    return this.getCartItem(productId).getByRole('button', {
      name: 'Aumentar quantidade em um'
    });
  }

  getDecreaseButton(productId: string): Locator {
    return this.getCartItem(productId).getByRole('button', {
      name: 'Diminuir quantidade em um'
    });
  }

  getRemoveButton(productId: string): Locator {
    return this.page.locator(`#remove-button-${productId}`);
  }

  /** Preço à vista no PIX do item no carrinho (unitário x quantidade). */
  getCartItemPixPrice(productId: string): Locator {
    return this.page.locator(`#precoBoletoOuPix-${productId}`);
  }

  /** Linha "Valor dos produtos (n): R$ X" do resumo do pedido. */
  getProductsTotal(): Locator {
    return this.page.locator('#valorDosProdutos');
  }

  getRemoveDialog(): Locator {
    return this.page.getByRole('alertdialog', { name: 'Remover Produto' });
  }

  getConfirmRemoveButton(): Locator {
    return this.getRemoveDialog().getByRole('button', { name: 'Sim' });
  }

  getEmptyCartMessage(): Locator {
    return this.page.getByText('Seu carrinho está vazio.');
  }
}
