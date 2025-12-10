const { test, expect } = require('@playwright/test');
const HomePage = require('../pages/HomePage');
const ProductPage = require('../pages/ProductPage');
const CartPage = require('../pages/CartPage');

/**
 * Smoke Test Case - Add to Cart
 * 
 * This is a critical path test to verify that add to cart functionality works.
 */

test.describe('Smoke Tests - Cart', () => {
  test('Smoke Test - Add to Cart', async ({ page }) => {
    const homePage = new HomePage(page);
    const productPage = new ProductPage(page);
    const cartPage = new CartPage(page);
    
    // Preconditions: User navigates to webpage
    // Steps to reproduce:
    // 1. Navigate to home page
    await homePage.goToHome();
    
    // 2. Select item 6 (or any product)
    await productPage.goToProduct(6);
    const productTitle = await productPage.getProductTitle();
    expect(productTitle).toBeTruthy();
    
    // 3. Click Add to Cart button
    await productPage.addToCart();
    
    // Expected result: User successfully adds item to cart
    expect(await productPage.isAddToCartSuccessVisible()).toBeTruthy();
    
    // Verify item is in cart
    await cartPage.goToCart();
    expect(await cartPage.isCartEmpty()).toBeFalsy();
    expect(await cartPage.isProductInCart(productTitle)).toBeTruthy();
  });
});

