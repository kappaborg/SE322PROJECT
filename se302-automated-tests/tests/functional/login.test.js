const { test, expect } = require('@playwright/test');
const HomePage = require('../pages/HomePage');
const LoginPage = require('../pages/LoginPage');
const LostPasswordPage = require('../pages/LostPasswordPage');
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
    // Preconditions: User navigates to login page
    // Steps to reproduce:
    // 1. Navigate to login page
    // (Already done in beforeEach)
    
    // 2. Enter wrong username or password
    await loginPage.fillCredentials('invalid_username', 'wrongpassword');
    await loginPage.clickLoginButton();
    
    // Expected result: User cannot login due to invalid credentials
    // Wait a bit for error message to appear
    await page.waitForTimeout(2000);
    
    // Check if error message is displayed or if still on login page
    const isErrorVisible = await loginPage.isErrorMessageVisible();
    const isStillOnLogin = loginPage.getCurrentUrl().includes('login.aspx');
    
    expect(isErrorVisible || isStillOnLogin).toBeTruthy();
  });

  test('TC-005: Empty Username Input Field (Negative)', async ({ page }) => {
    // Preconditions: User is on login page
    // Steps to reproduce:
    // 1. Navigate to login page
    // (Already done in beforeEach)
    
    // 2. Enter only password, leave username empty
    await loginPage.fillPassword('somepassword');
    await loginPage.clickLoginButton();
    
    // Expected result: User will not login due to empty username
    // Check if username is still empty or validation error appears
    const isUsernameEmpty = await loginPage.isUsernameEmpty();
    const isStillOnLogin = loginPage.getCurrentUrl().includes('login.aspx');
    
    expect(isUsernameEmpty || isStillOnLogin).toBeTruthy();
  });

  test('TC-006: Empty Password Input Field (Negative)', async ({ page }) => {
    // Preconditions: User is on login page
    // Steps to reproduce:
    // 1. Navigate to login page
    // (Already done in beforeEach)
    
    // 2. Enter only username, leave password empty
    await loginPage.fillUsername('testuser');
    await loginPage.clickLoginButton();
    
    // Expected result: User will not login due to empty password
    // Check if password is still empty or validation error appears
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
    // Preconditions: User is on login page
    // Steps to reproduce:
    // 1. Navigate to login page
    // (Already done in beforeEach)
    
    // 2. Click on "Click to generate your first time password" link
    await loginPage.clickGeneratePasswordLink();
    
    // Expected result: User should be redirected to password generation page
    const currentUrl = page.url();
    expect(currentUrl).toContain('lostpassword') || expect(currentUrl).toContain('generate');
  });
});
