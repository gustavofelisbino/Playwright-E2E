import { expect, test } from '../support/fixtures/kabum.fixture';
import { priceRegex } from '../support/pages/KabumPage';

/**
 * Página do produto e carrinho do KaBuM!
 * Produtos vendidos e entregues pelo próprio KaBuM!.
 */
const MOUSE_REDRAGON = '94555';
const MOUSE_LOGITECH = '97092';

test.describe('KaBuM! - Produto e Carrinho', () => {
  test('deve adicionar o produto ao carrinho com preço e quantidade corretos', async ({
    kabumPage
  }) => {
    const { elements } = kabumPage;

    const produto =
      await test.step('Adicionar produto via "Comprar agora"', () =>
        kabumPage.addProductToCart(MOUSE_REDRAGON));

    await test.step('Validar item no carrinho', async () => {
      await expect(elements.getCartItem(MOUSE_REDRAGON)).toContainText(
        produto.name
      );
      await expect(elements.getQuantityInput(MOUSE_REDRAGON)).toHaveValue('1');
      await expect(elements.getCartItemPixPrice(MOUSE_REDRAGON)).toHaveText(
        priceRegex(produto.price)
      );
      await expect(elements.getProductsTotal()).toContainText('(1)');
    });
  });

  test('deve recalcular o valor total ao aumentar e diminuir a quantidade', async ({
    kabumPage
  }) => {
    const { elements } = kabumPage;
    const { price } = await kabumPage.addProductToCart(MOUSE_REDRAGON);
    const totalComUmItem = await kabumPage.getProductsTotal();

    await test.step('Aumentar quantidade para 2', async () => {
      await kabumPage.increaseQuantity(MOUSE_REDRAGON);

      await expect(elements.getQuantityInput(MOUSE_REDRAGON)).toHaveValue('2');
      await expect(elements.getCartItemPixPrice(MOUSE_REDRAGON)).toHaveText(
        priceRegex(price * 2)
      );
      await expect(elements.getProductsTotal()).toHaveText(
        priceRegex(totalComUmItem * 2)
      );
    });

    await test.step('Diminuir quantidade para 1', async () => {
      await kabumPage.decreaseQuantity(MOUSE_REDRAGON);

      await expect(elements.getQuantityInput(MOUSE_REDRAGON)).toHaveValue('1');
      await expect(elements.getCartItemPixPrice(MOUSE_REDRAGON)).toHaveText(
        priceRegex(price)
      );
      await expect(elements.getProductsTotal()).toHaveText(
        priceRegex(totalComUmItem)
      );
    });
  });

  test('deve redirecionar para a página do produto ao clicar no item do carrinho', async ({
    kabumPage,
    page
  }) => {
    const { elements } = kabumPage;
    const { name } = await kabumPage.addProductToCart(MOUSE_REDRAGON);

    await elements.getCartProductLink(MOUSE_REDRAGON).first().click();

    await expect(page).toHaveURL(new RegExp(`/produto/${MOUSE_REDRAGON}/`));
    await expect(elements.getProductTitle()).toHaveText(name);
    await expect(elements.getBuyButton()).toBeVisible();
  });

  test('deve esvaziar o carrinho ao remover os produtos um por um', async ({
    kabumPage
  }) => {
    const { elements } = kabumPage;

    await test.step('Adicionar dois produtos', async () => {
      await kabumPage.addProductToCart(MOUSE_REDRAGON);
      await kabumPage.addProductToCart(MOUSE_LOGITECH);
      await expect(elements.getProductsTotal()).toContainText('(2)');
    });

    await test.step('Remover o primeiro produto', async () => {
      const totalAntes = await kabumPage.getProductsTotal();

      await kabumPage.removeProduct(MOUSE_LOGITECH);

      await expect(elements.getCartItem(MOUSE_REDRAGON)).toBeVisible();
      await expect(elements.getProductsTotal()).toContainText('(1)');
      expect(await kabumPage.getProductsTotal()).toBeLessThan(totalAntes);
    });

    await test.step('Remover o último produto', async () => {
      await kabumPage.removeProduct(MOUSE_REDRAGON);

      await expect(elements.getEmptyCartMessage()).toBeVisible();
      await expect(elements.getProductsTotal()).toHaveCount(0);
    });
  });
});
