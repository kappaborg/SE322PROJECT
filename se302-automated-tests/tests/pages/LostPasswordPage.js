const BasePage = require('./BasePage');

/**
 * Lost Password Page Object Model - IUS Student Information System
 * 
 * Represents the lost password page.
 * Contains all locators and methods for password recovery.
 */
class LostPasswordPage extends BasePage {
  constructor(page) {
    super(page);
    
    // Locators
    this.emailInput = 'input[name*="email" i], input[id*="Email"], input[type="email"]';
    this.usernameInput = 'input[name*="username" i], input[id*="UserName"]';
    this.submitButton = 'input[type="submit"], button[type="submit"], button:has-text("Submit")';
    this.successMessage = '.success, .alert-success, [class*="success" i]';
    this.errorMessage = '.error, .alert-danger, [class*="error" i]';
    this.backToLoginLink = 'a:has-text("Back to Login"), a[href*="login"]';
  }

  /**
   * Navigate to lost password page
   */
  async goToLostPassword() {
    await this.navigate('/UniFrame/lostpassword/default2.aspx');
    await this.waitForLoadState();
  }

  /**
   * Fill email or username
   * @param {string} value - Email or username
   */
  async fillEmailOrUsername(value) {
    // Try email field first
    if (await this.page.locator(this.emailInput).count() > 0) {
      await this.fill(this.emailInput, value);
    } else if (await this.page.locator(this.usernameInput).count() > 0) {
      await this.fill(this.usernameInput, value);
    }
  }

  /**
   * Submit password recovery request
   */
  async submit() {
    await this.click(this.submitButton);
    await this.waitForLoadState();
  }

  /**
   * Check if success message is displayed
   * @returns {Promise<boolean>} True if success message is visible
   */
  async isSuccessMessageVisible() {
    return await this.isVisible(this.successMessage);
  }

  /**
   * Get success message
   * @returns {Promise<string>} Success message
   */
  async getSuccessMessage() {
    if (await this.isVisible(this.successMessage)) {
      return await this.getText(this.successMessage);
    }
    return '';
  }

  /**
   * Get error message
   * @returns {Promise<string>} Error message
   */
  async getErrorMessage() {
    if (await this.isVisible(this.errorMessage)) {
      return await this.getText(this.errorMessage);
    }
    return '';
  }

  /**
   * Click back to login link
   */
  async clickBackToLogin() {
    await this.click(this.backToLoginLink);
    await this.waitForLoadState();
  }
}

module.exports = LostPasswordPage;

