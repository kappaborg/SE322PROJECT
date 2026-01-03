const {expect, test} = require('@playwright/test');
const HomePage = require('../pages/HomePage');  
const LoginPage = require('../pages/LoginPage');
const CoursePage = require('../pages/CoursesPage');

/**     
 * Smoke Test Case - Course Page - IUS SIS
 * This is a critical path test to verify that course page loads and key elements are accessible.
 *  Note: Actual course enrollment requires valid IUS credentials which may not be available for testing.
 */
 
test.describe('Smoke Tests - Course Page - IUS SIS', () => {
  test('TC-S002: Course Page Loads and Key Elements are Accessible', async ({ page }) => {
    const homePage = new HomePage(page);
    const loginPage = new LoginPage(page);
    const coursePage = new CoursePage(page);
    test.setTimeout(300000);
    const username = String(process.env.IUS_USERNAME);
    const password = String(process.env.IUS_PASSWORD);

    await loginPage.goToLogin();
    await loginPage.login(username, password);
    await homePage.goToCourses();

    const pageTitle = await coursePage.getTitle();
    expect(pageTitle).toBeTruthy();
    expect(await coursePage.isCourseListVisible()).toBeTruthy();
    
  });
});
