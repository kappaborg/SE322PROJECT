const { test, expect } = require('@playwright/test');
const HomePage = require('../pages/HomePage');

/**
 * Functional Test Cases for Search Functionality
 * 
 * Test Case 9: Search for Something that does not Exist (Negative)
 */

test.describe('Search Functional Tests', () => {
  let homePage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
  });

  test('TC-009: Search for Something that does not Exist (Negative)', async ({ page }) => {
    // Preconditions: User is on the webpage
    // Steps to reproduce:
    // 1. Navigate to home page
    await homePage.goToHome();
    
    // 2. Enter non-existent product in search bar
    const nonExistentProduct = 'something super x3000';
    await homePage.searchProduct(nonExistentProduct);
    
    // Expected result: No products found message should be displayed
    expect(await homePage.isNoProductsMessageVisible()).toBeTruthy();
    
    // Verify no products are displayed
    const productCount = await homePage.getProductCount();
    expect(productCount).toBe(0);
  });
});

