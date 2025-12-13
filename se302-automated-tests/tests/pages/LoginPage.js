const BasePage = require('./BasePage');

/**
 * Login Page Object Model - IUS Student Information System
 * 
 * Represents the login page of the IUS SIS application.
 * Contains all locators and methods for login functionality.
 */
class LoginPage extends BasePage {
  constructor(page) {
    super(page);
    
    // Primary selectors observed on the live SIS login page
    this.usernameInput = '#txtLogin';
    this.passwordInput = '#txtPassword';
    this.loginButton = '#btnLogin';

    // Fallback selectors (in case markup changes)
    this.usernameFallbacks = [
      'input[name="txtLogin"]',
      'input[id*="Login" i]',
      'input[type="text"]'
    ];
    this.passwordFallbacks = [
      'input[name="txtPassword"]',
      'input[id*="Password" i]',
      'input[type="password"]'
    ];
    this.loginButtonFallbacks = [
      'input[type="submit"]',
      'button[type="submit"]',
      'input[value*="Login" i]'
    ];

    // Links
    this.lostPasswordLink = 'a[href*="lostpassword"]';
    this.generatePasswordLink = 'a[href*="lostpassword/default.aspx"]';

    // Messages
    this.errorMessage = '.error, .alert-danger, .validation-summary-errors, span[id*="Error"]';
    this.successMessage = '.success, .alert-success';
    this.pageTitle = 'Log In';
  }

  /**
   * Navigate to login page
   */
  async goToLogin() {
    await this.navigate('/login.aspx?lang=en-US');
    await this.waitForLoadState();
  }

  /**
   * Fill username field
   * @param {string} username - Username
   */
  async fillUsername(username) {
    if (await this.page.locator(this.usernameInput).count() > 0) {
      await this.fill(this.usernameInput, username);
      return;
    }
    for (const selector of this.usernameFallbacks) {
      if (await this.page.locator(selector).count() > 0) {
        await this.fill(selector, username);
        return;
      }
    }
    throw new Error('Username input field not found');
  }

  /**
   * Fill password field
   * @param {string} password - Password
   */
  async fillPassword(password) {
    if (await this.page.locator(this.passwordInput).count() > 0) {
      await this.fill(this.passwordInput, password);
      return;
    }
    for (const selector of this.passwordFallbacks) {
      if (await this.page.locator(selector).count() > 0) {
        await this.fill(selector, password);
        return;
      }
    }
    throw new Error('Password input field not found');
  }

  /**
   * Fill login credentials
   * @param {string} username - Username
   * @param {string} password - Password
   */
  async fillCredentials(username, password) {
    await this.fillUsername(username);
    await this.fillPassword(password);
  }

  /**
   * Click login button
   */
  async clickLoginButton() {
    if (await this.page.locator(this.loginButton).count() > 0) {
      await this.click(this.loginButton);
      await this.waitForLoadState();
      return;
    }
    for (const selector of this.loginButtonFallbacks) {
      if (await this.page.locator(selector).count() > 0) {
        await this.click(selector);
        await this.waitForLoadState();
        return;
      }
    }
    throw new Error('Login button not found');
  }

  /**
   * Complete login process
   * @param {string} username - Username
   * @param {string} password - Password
   */
  async login(username, password) {
    await this.fillCredentials(username, password);
    await this.clickLoginButton();
  }

  /**
   * Click lost password link
   */
  async clickLostPasswordLink() {
    await this.click(this.lostPasswordLink);
    await this.waitForLoadState();
  }

  /**
   * Click generate password link
   */
  async clickGeneratePasswordLink() {
    await this.click(this.generatePasswordLink);
    await this.waitForLoadState();
  }

  /**
   * Get error message text
   * @returns {Promise<string>} Error message
   */
  async getErrorMessage() {
    const errorSelectors = [
      '.error',
      '.alert-danger',
      '.validation-summary-errors',
      'span[id*="Error"]',
      'div[id*="Error"]',
      '[class*="error" i]'
    ];
    
    for (const selector of errorSelectors) {
      if (await this.isVisible(selector)) {
        return await this.getText(selector);
      }
    }
    return '';
  }

  /**
   * Check if error message is displayed
   * @returns {Promise<boolean>} True if error is visible
   */
  async isErrorMessageVisible() {
    const errorSelectors = [
      '.error',
      '.alert-danger',
      '.validation-summary-errors',
      'span[id*="Error"]',
      'div[id*="Error"]',
      '[class*="error" i]'
    ];
    
    for (const selector of errorSelectors) {
      if (await this.isVisible(selector)) {
        return true;
      }
    }
    return false;
  }

  /**
   * Check if username field is empty
   * @returns {Promise<boolean>} True if empty
   */
  async isUsernameEmpty() {
    const selectors = [this.usernameInput, ...this.usernameFallbacks];
    for (const selector of selectors) {
      if (await this.page.locator(selector).count() > 0) {
        const value = await this.page.locator(selector).inputValue();
        return value === '';
      }
    }
    return true;
  }

  /**
   * Check if password field is empty
   * @returns {Promise<boolean>} True if empty
   */
  async isPasswordEmpty() {
    const selectors = [this.passwordInput, ...this.passwordFallbacks];
    for (const selector of selectors) {
      if (await this.page.locator(selector).count() > 0) {
        const value = await this.page.locator(selector).inputValue();
        return value === '';
      }
    }
    return true;
  }

  /**
   * Check if login button is enabled
   * @returns {Promise<boolean>} True if button is enabled
   */
  async isLoginButtonEnabled() {
    const selectors = [this.loginButton, ...this.loginButtonFallbacks];
    for (const selector of selectors) {
      if (await this.page.locator(selector).count() > 0) {
        return await this.page.isEnabled(selector);
      }
    }
    return false;
  }

  /**
   * Verify user is logged in (check for dashboard or home page)
   * @returns {Promise<boolean>} True if logged in
   */
  async isLoggedIn() {
    const currentUrl = this.getCurrentUrl();
    // If URL changed from login page, user likely logged in
    return !currentUrl.includes('login.aspx');
  }

  /**
   * Check if username field is visible and accessible
   * @returns {Promise<boolean>} True if username field is visible
   */
  async isUsernameFieldVisible() {
    if (await this.page.locator(this.usernameInput).count() > 0) {
      return await this.isVisible(this.usernameInput);
    }
    for (const selector of this.usernameFallbacks) {
      if (await this.page.locator(selector).count() > 0) {
        return await this.isVisible(selector);
      }
    }
    return false;
  }

  /**
   * Check if password field is visible and accessible
   * @returns {Promise<boolean>} True if password field is visible
   */
  async isPasswordFieldVisible() {
    if (await this.page.locator(this.passwordInput).count() > 0) {
      return await this.isVisible(this.passwordInput);
    }
    for (const selector of this.passwordFallbacks) {
      if (await this.page.locator(selector).count() > 0) {
        return await this.isVisible(selector);
      }
    }
    return false;
  }

  /**
   * Check if login button is visible and accessible
   * @returns {Promise<boolean>} True if login button is visible
   */
  async isLoginButtonVisible() {
    if (await this.page.locator(this.loginButton).count() > 0) {
      return await this.isVisible(this.loginButton);
    }
    for (const selector of this.loginButtonFallbacks) {
      if (await this.page.locator(selector).count() > 0) {
        return await this.isVisible(selector);
      }
    }
    return false;
  }
}

module.exports = LoginPage;
