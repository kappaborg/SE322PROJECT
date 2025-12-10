const { test, expect } = require('@playwright/test');
const HomePage = require('../pages/HomePage');
const RegistrationPage = require('../pages/RegistrationPage');
const { testUserData, generateRandomEmail, invalidTestData } = require('../../utils/testData');

/**
 * Functional Test Cases for Registration Functionality
 * 
 * Test Case 7: Registration with Existing Email (Negative)
 * Test Case 8: Required Input Field Empty (Negative)
 */

test.describe('Registration Functional Tests', () => {
  let homePage;
  let registrationPage;
  let userData;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    registrationPage = new RegistrationPage(page);
    
    userData = {
      ...testUserData,
      email: generateRandomEmail()
    };
  });

  test('TC-007: Registration with Existing Email (Negative)', async ({ page }) => {
    // Preconditions: User is already registered
    // Steps to reproduce:
    // 1. Register a user first time
    await homePage.goToHome();
    await homePage.clickRegisterLink();
    await registrationPage.register(userData);
    expect(await registrationPage.isRegistrationSuccessful()).toBeTruthy();
    
    // 2. Try to register again with same email
    await homePage.goToHome();
    await homePage.clickRegisterLink();
    const duplicateUserData = { ...userData };
    await registrationPage.fillRegistrationForm(duplicateUserData);
    await registrationPage.checkAgree();
    await registrationPage.clickRegisterButton();
    
    // Expected result: User will not be able to register
    expect(await registrationPage.isEmailExistsErrorVisible()).toBeTruthy();
  });

  test('TC-008: Required Input Field Empty (Negative)', async ({ page }) => {
    // Preconditions: User navigates to registration page
    // Steps to reproduce:
    // 1. Navigate to registration page
    await homePage.goToHome();
    await homePage.clickRegisterLink();
    
    // 2. Fill all fields except last name (required field)
    const incompleteUserData = { ...userData };
    incompleteUserData.lastName = ''; // Leave last name empty
    await registrationPage.fillRegistrationForm(incompleteUserData);
    await registrationPage.checkAgree();
    await registrationPage.clickRegisterButton();
    
    // Expected result: User will not be able to register
    // Should show error that last name is required
    expect(await registrationPage.isFieldErrorVisible('last name')).toBeTruthy();
    expect(await registrationPage.isErrorMessageVisible()).toBeTruthy();
  });
});

