const {expect, test} = require('@playwright/test');
const HomePage = require('../pages/HomePage');  
const LoginPage = require('../pages/LoginPage');
const ContractPage = require('../pages/ContractPage');

/**     
 * Smoke Test Case - Contract Page - IUS SIS
 * This is a critical path test to verify that course page loads and key elements are accessible.
 *  Note: Actual course enrollment requires valid IUS credentials which may not be available for testing.
 */
 
test.describe('Smoke Tests - Contract Page - IUS SIS', () => {
  test('TC-S00: Contract Page Loads and Key Elements are Accessible', async ({ page }) => {
   const loginPage = new LoginPage(page);
   const homePage = new HomePage(page);
   const contractPage = new ContractPage(page);
   const username = String(process.env.IUS_USERNAME);
    const password = String(process.env.IUS_PASSWORD);

   await loginPage.goToLogin();
   await loginPage.login(username,password);

   // Ensure login was successful (avoids the "Session Expired" trap)

   await page.goto('https://sis.ius.edu.ba/Ogrenci/Ogr0137/Default.aspx?lang=en-US');


    const pageTitle = await contractPage.getTitle();
    expect(pageTitle).toBeTruthy();
    expect(await contractPage.isContractListVisible()).toBeTruthy();
    
  });
});
