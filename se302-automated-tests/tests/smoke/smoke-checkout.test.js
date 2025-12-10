const { test, expect } = require('@playwright/test');
const HomePage = require('../pages/HomePage');
const LoginPage = require('../pages/LoginPage');
const RegistrationPage = require('../pages/RegistrationPage');
const ProductPage = require('../pages/ProductPage');
const CartPage = require('../pages/CartPage');
const CheckoutPage = require('../pages/CheckoutPage');
const { testUserData, generateRandomEmail } = require('../../utils/testData');

/**
 * Smoke Test Case - Checkout
 * 
 * This is a critical path test to verify that checkout functionality works.
 */

test.describe('Smoke Tests - Checkout', () => {
  test('Smoke Test - Checkout', async ({ page }) => {
    const homePage = new HomePage(page);
    const loginPage = new LoginPage(page);
    const registrationPage = new RegistrationPage(page);
    const productPage = new ProductPage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);
    
    // Generate unique user data
    const userData = {
      ...testUserData,
      email: generateRandomEmail()
    };
    
    // Preconditions: User must be registered
    // Steps to reproduce:
    // 1. Register and login
    await homePage.goToHome();
    await homePage.clickRegisterLink();
    await registrationPage.register(userData);
    await homePage.clickLoginLink();
    await loginPage.login(userData.email, userData.password);
    
    // 2. Select item and add to cart
    await productPage.goToProduct(6);
    await productPage.addToCart();
    expect(await productPage.isAddToCartSuccessVisible()).toBeTruthy();
    
    // 3. Go to cart
    await cartPage.goToCart();
    expect(await cartPage.isCartEmpty()).toBeFalsy();
    
    // 4. Proceed to checkout
    await cartPage.clickProceedToCheckout();
    
    // 5. Fill billing address
    const billingAddress = {
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      telephone: userData.phone,
      address: userData.address,
      city: userData.city,
      postcode: userData.postalCode.toString(),
      country: userData.country,
      region: userData.state
    };
    
    // 6. Enter payment information and confirm
    await checkoutPage.completeCheckout(billingAddress);
    
    // Expected result: User successfully purchases the item
    expect(await checkoutPage.isOrderSuccessful()).toBeTruthy();
    
    // Verify payment success message
    const successMessage = await checkoutPage.getOrderId();
    expect(successMessage || await checkoutPage.isOrderSuccessful()).toBeTruthy();
  });
});

