const {expect, test} = require('@playwright/test');
const HomePage = require('../pages/HomePage');  
const LoginPage = require('../pages/LoginPage');
const ElsPage = require('../pages/Els_Reports');

/**     
 * Smoke Test Case - Course Page - IUS SIS
 * This is a critical path test to verify that els_report page loads and key elements are accessible.
 *  Note: Actual els_report enrollment requires valid IUS credentials which may not be available for testing.
 */

test.describe('Smoke Tests - ELS Reports Page - IUS SIS', () => {
  test('TC-S003: ELS Reports Page Loads and Key Elements are Accessible', async ({ page }) => {
    const homePage = new HomePage(page);
    const loginPage = new LoginPage(page);
    const els_reportPage = new ElsPage(page);
    test.setTimeout(300000);
    const username = String(process.env.IUS_USERNAME);
    const password = String(process.env.IUS_PASSWORD);

    await loginPage.goToLogin();
    await loginPage.login(username, password);
    await homePage.goToEls();

    const pageTitle = await els_reportPage.getTitle();
    expect(pageTitle).toBeTruthy();
    expect(await els_reportPage.isELSListVisible()).toBeTruthy();    
  });
});
