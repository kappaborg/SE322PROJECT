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
  test('TC-S001: Login Page Loads and Form is Accessible', async ({ page }) => {
    const homePage = new HomePage(page);
    const loginPage = new LoginPage(page);
    
    await loginPage.goToLogin();
    
    const pageTitle = await loginPage.getTitle();
    expect(pageTitle).toBeTruthy();
    
    expect(await loginPage.isUsernameFieldVisible()).toBeTruthy();
    
    expect(await loginPage.isPasswordFieldVisible()).toBeTruthy();
    
    expect(await loginPage.isLoginButtonVisible()).toBeTruthy();
  });
});
