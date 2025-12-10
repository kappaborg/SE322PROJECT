const { test, expect } = require('@playwright/test');
const HomePage = require('../pages/HomePage');
const LoginPage = require('../pages/LoginPage');

/**
 * Smoke Test Case - Login - IUS SIS
 * 
 * This is a critical path test to verify that login page loads and form is accessible.
 * Note: Actual login requires valid IUS credentials which may not be available for testing.
 */

test.describe('Smoke Tests - Login - IUS SIS', () => {
  test('Smoke Test - Login Page Loads and Form is Accessible', async ({ page }) => {
    const homePage = new HomePage(page);
    const loginPage = new LoginPage(page);
    
    // Preconditions: User navigates to website
    // Steps to reproduce:
    // 1. Navigate to login page
    await loginPage.goToLogin();
    
    // 2. Verify page loaded
    const pageTitle = await loginPage.getTitle();
    expect(pageTitle).toBeTruthy();
    
    // 3. Verify username field is present and accessible
    const usernameSelectors = [
      'input[name="txtUserName"]',
      'input[id*="UserName"]',
      'input[type="text"]'
    ];
    
    let usernameFound = false;
    for (const selector of usernameSelectors) {
      if (await page.locator(selector).count() > 0) {
        usernameFound = true;
        expect(await page.isVisible(selector)).toBeTruthy();
        break;
      }
    }
    expect(usernameFound).toBeTruthy();
    
    // 4. Verify password field is present and accessible
    const passwordSelectors = [
      'input[name="txtPassword"]',
      'input[id*="Password"]',
      'input[type="password"]'
    ];
    
    let passwordFound = false;
    for (const selector of passwordSelectors) {
      if (await page.locator(selector).count() > 0) {
        passwordFound = true;
        expect(await page.isVisible(selector)).toBeTruthy();
        break;
      }
    }
    expect(passwordFound).toBeTruthy();
    
    // 5. Verify login button is present
    const buttonSelectors = [
      'input[type="submit"]',
      'button[type="submit"]'
    ];
    
    let buttonFound = false;
    for (const selector of buttonSelectors) {
      if (await page.locator(selector).count() > 0) {
        buttonFound = true;
        expect(await page.isVisible(selector)).toBeTruthy();
        break;
      }
    }
    expect(buttonFound).toBeTruthy();
    
    // Expected result: Login page loads successfully with all required elements
    // All form elements are accessible and visible
  });
});
