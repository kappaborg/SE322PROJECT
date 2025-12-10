const { test, expect } = require('@playwright/test');
const HomePage = require('../pages/HomePage');
const RegistrationPage = require('../pages/RegistrationPage');
const { testUserData, generateRandomEmail } = require('../../utils/testData');

/**
 * Smoke Test Case - Register
 * 
 * This is a critical path test to verify that registration functionality works.
 */

test.describe('Smoke Tests - Register', () => {
  test('Smoke Test - Register', async ({ page }) => {
    const homePage = new HomePage(page);
    const registrationPage = new RegistrationPage(page);
    
    // Generate unique user data
    const userData = {
      ...testUserData,
      email: generateRandomEmail()
    };
    
    // Preconditions: User enters webpage
    // Steps to reproduce:
    // 1. Navigate to home page
    await homePage.goToHome();
    
    // 2. Click on sign in
    await homePage.clickLoginLink();
    
    // 3. Click register
    await homePage.clickRegisterLink();
    
    // 4. Fill registration form
    await registrationPage.fillRegistrationForm(userData);
    await registrationPage.checkAgree();
    
    // 5. Click register button
    await registrationPage.clickRegisterButton();
    
    // Expected result: User successfully registers
    expect(await registrationPage.isRegistrationSuccessful()).toBeTruthy();
    
    // Verify user can now login (registration was successful)
    const successMessage = await registrationPage.getSuccessMessage();
    expect(successMessage.toLowerCase()).toContain('success');
  });
});

