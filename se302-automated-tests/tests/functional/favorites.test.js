const { test, expect } = require('@playwright/test');
const HomePage = require('../pages/HomePage');
const LoginPage = require('../pages/LoginPage');
const RegistrationPage = require('../pages/RegistrationPage');
const ProductPage = require('../pages/ProductPage');
const FavoritesPage = require('../pages/FavoritesPage');
const { testUserData, generateRandomEmail } = require('../../utils/testData');

/**
 * Functional Test Cases for Favorites Functionality
 * 
 * Test Case 1: Add to Favorites (Positive)
 * Test Case 2: Add to Favorites (Negative - Not Logged In)
 * Test Case 3: Add to Favorites Again (Negative - Already Added)
 */

test.describe('Favorites Functional Tests', () => {
  let homePage;
  let loginPage;
  let registrationPage;
  let productPage;
  let favoritesPage;
  let userData;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    loginPage = new LoginPage(page);
    registrationPage = new RegistrationPage(page);
    productPage = new ProductPage(page);
    favoritesPage = new FavoritesPage(page);
    
    // Generate unique user data for each test
    userData = {
      ...testUserData,
      email: generateRandomEmail()
    };
  });

  test('TC-001: Add to Favorites (Positive)', async ({ page }) => {
    // Preconditions: User must register and login
    // Steps to reproduce:
    // 1. Navigate to home page
    await homePage.goToHome();
    
    // 2. Register new user
    await homePage.clickRegisterLink();
    await registrationPage.register(userData);
    expect(await registrationPage.isRegistrationSuccessful()).toBeTruthy();
    
    // 3. Login with registered credentials
    await homePage.clickLoginLink();
    await loginPage.login(userData.email, userData.password);
    expect(await homePage.isLoggedIn()).toBeTruthy();
    
    // 4. Navigate to product page (product ID 6)
    await productPage.goToProduct(6);
    const productTitle = await productPage.getProductTitle();
    expect(productTitle).toBeTruthy();
    
    // 5. Add product to favorites
    await productPage.addToFavorites();
    
    // Expected result: Product successfully added to favorites
    expect(await productPage.isAddToFavoritesSuccessVisible()).toBeTruthy();
    
    // Verify product is in favorites
    await favoritesPage.goToFavorites();
    expect(await favoritesPage.isProductInFavorites(productTitle)).toBeTruthy();
  });

  test('TC-002: Add to Favorites (Negative - Not Logged In)', async ({ page }) => {
    // Preconditions: User is not logged in
    // Steps to reproduce:
    // 1. Navigate to home page
    await homePage.goToHome();
    
    // 2. Navigate to product page without logging in
    await productPage.goToProduct(6);
    
    // 3. Try to add product to favorites
    if (await productPage.isAddToFavoritesButtonVisible()) {
      await productPage.clickAddToFavorites();
    }
    
    // Expected result: User should not be able to add item to favorites
    // User should be prompted to login
    expect(await productPage.isLoginRequiredMessageVisible()).toBeTruthy();
  });

  test('TC-003: Add to Favorites Again (Negative - Already Added)', async ({ page }) => {
    // Preconditions: User is logged in and product is already in favorites
    // Steps to reproduce:
    // 1. Register and login
    await homePage.goToHome();
    await homePage.clickRegisterLink();
    await registrationPage.register(userData);
    await homePage.clickLoginLink();
    await loginPage.login(userData.email, userData.password);
    
    // 2. Add product to favorites first time
    await productPage.goToProduct(6);
    await productPage.addToFavorites();
    expect(await productPage.isAddToFavoritesSuccessVisible()).toBeTruthy();
    
    // 3. Try to add same product to favorites again
    await productPage.goToProduct(6);
    await productPage.clickAddToFavorites();
    
    // Expected result: User should not be able to add item again
    // Should show message that product is already in favorites
    expect(await productPage.isAlreadyInFavoritesMessageVisible()).toBeTruthy();
  });
});

