const { test, expect } = require('@playwright/test');
const HomePage = require('../pages/HomePage');

/**
 * Smoke Test Case - Search
 * 
 * This is a critical path test to verify that search functionality works.
 */

test.describe('Smoke Tests - Search', () => {
  test('Smoke Test - Search', async ({ page }) => {
    const homePage = new HomePage(page);
    
    // Preconditions: User enters webpage
    // Steps to reproduce:
    // 1. Navigate to home page
    await homePage.goToHome();
    
    // 2. Locate search bar
    // 3. Type "pliers" in search bar
    await homePage.searchProduct('pliers');
    
    // 4. Click search button
    // (Search is triggered in searchProduct method)
    
    // Expected result: Webpage displays products relevant to pliers
    const productCount = await homePage.getProductCount();
    expect(productCount).toBeGreaterThan(0);
    
    // Verify search results are displayed
    expect(await homePage.isNoProductsMessageVisible()).toBeFalsy();
  });
});

