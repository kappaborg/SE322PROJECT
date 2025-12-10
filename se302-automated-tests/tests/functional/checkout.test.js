const { test, expect } = require('@playwright/test');
const HomePage = require('../pages/HomePage');
const LoginPage = require('../pages/LoginPage');
const RegistrationPage = require('../pages/RegistrationPage');
const ProductPage = require('../pages/ProductPage');
const CartPage = require('../pages/CartPage');
const CheckoutPage = require('../pages/CheckoutPage');

const { testUserData, generateRandomEmail } = require('../../utils/testData');

/**
 * Functional Test Cases for Checkout Functionality
 * 
 * Test Case 10: Checkout with Pre-Login Success
 */

test.describe('Checkout Functional Tests', () => {
  let homePage;
  let loginPage;
  let registrationPage;
  let productPage;
  let cartPage;
  let checkoutPage;
  let userData;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    loginPage = new LoginPage(page);
    registrationPage = new RegistrationPage(page);
    productPage = new ProductPage(page);
    cartPage = new CartPage(page);
    checkoutPage = new CheckoutPage(page);
    
    userData = {
      ...testUserData,
      email: generateRandomEmail()
    };
  });

  test('TC-010: Checkout with Pre-Login Success', async ({ page }) => {
    // Preconditions: User must be registered and logged in
    // Steps to reproduce:
    // 1. Register and login
    await homePage.goToHome();
    await homePage.clickRegisterLink();
    await registrationPage.register(userData);
    await homePage.clickLoginLink();
    await loginPage.login(userData.email, userData.password);
    expect(await homePage.isLoggedIn()).toBeTruthy();
    
    // 2. Add product to cart
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
    
    // 6. Complete checkout
    await checkoutPage.completeCheckout(billingAddress);
    
    // Expected result: Order should be placed successfully
    expect(await checkoutPage.isOrderSuccessful()).toBeTruthy();
  });
});

