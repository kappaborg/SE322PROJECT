const { test, expect } = require('@playwright/test');
const HomePage = require('../pages/HomePage');
const LoginPage = require('../pages/LoginPage');
const LostPasswordPage = require('../pages/LostPasswordPage');
const LogOutPage = require('../pages/LogOut');
const { invalidTestData } = require('../../utils/testData');

/**
 * Functional Test Cases for Login Functionality - IUS SIS
 * 
 * Test Case 1: Valid Login (Positive) - uses env credentials if provided
 * Test Case 4: Invalid Username or Password on Login (Negative)
 * Test Case 5: Empty Username Input Field (Negative)
 * Test Case 6: Empty Password Input Field (Negative)
 */

test.describe('Login Functional Tests - IUS SIS', () => {
  let homePage;
  let loginPage;
  let lostPasswordPage;
  const validUsername = process.env.IUS_USERNAME;
  const validPassword = process.env.IUS_PASSWORD;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    loginPage = new LoginPage(page);
    lostPasswordPage = new LostPasswordPage(page);
    
    // Navigate to login page
    await loginPage.goToLogin();
  });

  test('TC-001: Valid Login (Positive)', async ({ page }) => {
    test.skip(!validUsername || !validPassword, 'IUS credentials not provided in env (IUS_USERNAME / IUS_PASSWORD)');

    await loginPage.fillCredentials(validUsername, validPassword);
    await loginPage.clickLoginButton();

    // Expect to leave login page
    await page.waitForTimeout(2000);
    expect(await homePage.isLoggedIn()).toBeTruthy();
  });

  test('TC-004: Invalid Username or Password on Login (Negative)', async ({ page }) => {
    test.setTimeout(5000);
    
    await loginPage.fillCredentials('invalid_username', 'wrongpassword');
    
    await page.locator(loginPage.loginButton).click({ timeout: 2000, noWaitAfter: true }).catch(() => {});
    
    await page.waitForTimeout(1000);
    
    const currentUrl = page.url();
    const isStillOnLogin = currentUrl.includes('login.aspx');
    
    expect(isStillOnLogin).toBeTruthy();
  });

  test('TC-005: Empty Username Input Field (Negative)', async ({ page }) => {
    test.setTimeout(5000);
    
    await loginPage.fillPassword('somepassword');
    
    await page.locator(loginPage.loginButton).click({ timeout: 2000, noWaitAfter: true }).catch(() => {});
    
    await page.waitForTimeout(1000);
    
    const isUsernameEmpty = await loginPage.isUsernameEmpty();
    const isStillOnLogin = loginPage.getCurrentUrl().includes('login.aspx');
    
    expect(isUsernameEmpty || isStillOnLogin).toBeTruthy();
  });

  test('TC-006: Empty Password Input Field (Negative)', async ({ page }) => {
    test.setTimeout(5000);
    
    await loginPage.fillUsername('testuser');
    
    await page.locator(loginPage.loginButton).click({ timeout: 2000, noWaitAfter: true }).catch(() => {});
    
    await page.waitForTimeout(1000);
    
    const isPasswordEmpty = await loginPage.isPasswordEmpty();
    const isStillOnLogin = loginPage.getCurrentUrl().includes('login.aspx');
    
    expect(isPasswordEmpty || isStillOnLogin).toBeTruthy();
  });

  test('TC-012: Lost Password Link (Positive)', async ({ page }) => {
    // Preconditions: User is on login page
    // Steps to reproduce:
    // 1. Navigate to login page
    // (Already done in beforeEach)
    
    // 2. Click on "Lost my password" link
    await loginPage.clickLostPasswordLink();
    
    // Expected result: User should be redirected to password recovery page
    const currentUrl = page.url();
    expect(currentUrl).toContain('lostpassword');
  });

  test('TC-013: Generate First Time Password Link (Positive)', async ({ page }) => {
    await loginPage.clickGeneratePasswordLink();
    
    await Promise.race([
      page.waitForURL(/lostpassword|generate/i, { timeout: 10000 }),
      page.waitForTimeout(3000)
    ]);
    
    const currentUrl = page.url();
    expect(currentUrl.includes('lostpassword') || currentUrl.includes('generate')).toBeTruthy();
  });

  test('TC-007: Logout after Login (Positive)', async ({ page }) => {
    test.skip(!validUsername || !validPassword, 'IUS credentials not provided in env (IUS_USERNAME / IUS_PASSWORD)');

    // Preconditions: User must be logged in
    // Steps to reproduce:
    // 1. Login first
    await loginPage.fillCredentials(validUsername, validPassword);
    await loginPage.clickLoginButton();
    await page.waitForURL(/dashboard\.aspx|\/Dashboard/i, { timeout: 20000 }).catch(() => {});
    await page.waitForTimeout(2000);
    expect(await homePage.isLoggedIn()).toBeTruthy();

    // 2. Click logout button
    const logoutPage = new LogOutPage(page);
    await logoutPage.clickLogout();

    // Expected result: User should be redirected to login page
    await page.waitForURL(/login\.aspx\?lang=en-US/i, { timeout: 10000 }).catch(() => {});
    const isLoggedOut = await logoutPage.isLoggedOut();
    expect(isLoggedOut).toBeTruthy();

    // Verify we're on the login page
    const currentUrl = page.url();
    expect(currentUrl).toContain('login.aspx?lang=en-US');
  });
});
