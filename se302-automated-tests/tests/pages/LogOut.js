const BasePage = require('./BasePage');

/**
 * Logout Page Object Model - IUS Student Information System
 * 
 * Represents the logout functionality of the IUS SIS application.
 * Contains all locators and methods for logout functionality.
 */
class LogOutPage extends BasePage {
  constructor(page) {
    super(page);
    
    this.logoutButton = '#ctl00_DashAppHeader_ctl02_lnksignout2';
    
    this.logoutButtonFallbacks = [
      'a:has-text("Logout")',
      'a:has-text("Sign Out")',
      'a[href*="logout"]',
      '[id*="logout" i]',
      '[id*="signout" i]'
    ];
    
    this.loginPageUrl = 'https://sis.ius.edu.ba/login.aspx?lang=en-US';
  }

  /**
   * Click logout button
   */
  async clickLogout() {
    if (await this.page.locator(this.logoutButton).count() > 0) {
      await this.click(this.logoutButton);
      await this.waitForLoadState();
      return;
    }
    
    for (const selector of this.logoutButtonFallbacks) {
      if (await this.page.locator(selector).count() > 0) {
        await this.click(selector);
        await this.waitForLoadState();
        return;
      }
    }
    
    throw new Error('Logout button not found');
  }

  /**
   * Verify logout was successful
   * @returns {Promise<boolean>} True if redirected to login page
   */
  async isLoggedOut() {
    const currentUrl = this.getCurrentUrl();
    return currentUrl.includes('login.aspx?lang=en-US') || 
           currentUrl === this.loginPageUrl;
  }

  /**
   * Perform logout and verify success
   * @returns {Promise<boolean>} True if logout successful
   */
  async logout() {
    await this.clickLogout();
    await this.page.waitForURL(/login\.aspx\?lang=en-US/i, { timeout: 10000 }).catch(() => {});
    return await this.isLoggedOut();
  }
}

module.exports = LogOutPage;
