const { test, expect } = require('@playwright/test');
const HomePage = require('../pages/HomePage');
const ContactPage = require('../pages/ContactPage');
const { testUserData, generateRandomEmail } = require('../../utils/testData');

/**
 * Functional Test Cases for Contact Functionality
 * 
 * Test Case 11: Contact Form (Positive)
 */

test.describe('Contact Functional Tests', () => {
  let homePage;
  let contactPage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    contactPage = new ContactPage(page);
  });

  test('TC-011: Contact Form (Positive)', async ({ page }) => {
    // Preconditions: User navigates to webpage
    // Steps to reproduce:
    // 1. Navigate to home page
    await homePage.goToHome();
    
    // 2. Navigate to contact page
    await homePage.clickContactLink();
    
    // 3. Fill contact form
    const contactData = {
      firstName: testUserData.firstName,
      email: generateRandomEmail(),
      subject: 'Support',
      message: 'This is a test message for contact form functionality.'
    };
    
    await contactPage.fillContactForm(contactData);
    
    // 4. Submit contact form
    await contactPage.submitForm();
    
    // Expected result: Message should be sent successfully
    expect(await contactPage.isSuccessMessageVisible()).toBeTruthy();
    
    const successMessage = await contactPage.getSuccessMessage();
    expect(successMessage.toLowerCase()).toContain('success');
  });
});

