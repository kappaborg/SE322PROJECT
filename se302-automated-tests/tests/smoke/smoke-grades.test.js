const {expect, test} = require('@playwright/test');
const HomePage = require('../pages/HomePage');  
const LoginPage = require('../pages/LoginPage');
const GradesPage = require('../pages/GradesPage');

/**     
 * Smoke Test Case - Grade Page - IUS SIS
 * This is a critical path test to verify that grade page loads and key elements are accessible.
 *  Note: Actual grade enrollment requires valid IUS credentials which may not be available for testing.
 */
 
test.describe('Smoke Tests - Grade Page - IUS SIS', () => {
  test('TC-S002: Grade Page Loads and Key Elements are Accessible', async ({ page }) => {
    const homePage = new HomePage(page);
    const loginPage = new LoginPage(page);
    const gradePage = new GradesPage(page);
    test.setTimeout(300000);
    const username = String(process.env.IUS_USERNAME);
    const password = String(process.env.IUS_PASSWORD);

    await loginPage.goToLogin();
    await loginPage.login(username, password);
    await homePage.goToGrades();

    const pageTitle = await gradePage.getTitle();
    expect(pageTitle).toBeTruthy();
    expect(await gradePage.isGradesListVisible()).toBeTruthy();
    
  });
});
