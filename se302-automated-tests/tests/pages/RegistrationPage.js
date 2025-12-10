const BasePage = require('./BasePage');

/**
 * Registration Page Object Model
 * 
 * Represents the registration page of the application.
 * Contains all locators and methods for user registration.
 */
class RegistrationPage extends BasePage {
  constructor(page) {
    super(page);
    
    // Locators
    this.firstNameInput = 'input[name="firstname"]';
    this.lastNameInput = 'input[name="lastname"]';
    this.emailInput = 'input[name="email"]';
    this.telephoneInput = 'input[name="telephone"]';
    this.passwordInput = 'input[name="password"]';
    this.confirmPasswordInput = 'input[name="confirm"]';
    this.agreeCheckbox = 'input[name="agree"]';
    this.registerButton = 'button[type="submit"]:has-text("Continue")';
    this.loginLink = 'text=Login';
    this.errorMessage = '.alert-danger';
    this.successMessage = '.alert-success';
    this.fieldErrors = '.text-danger';
    this.emailExistsError = 'text=Warning: E-Mail Address is already registered!';
  }

  /**
   * Navigate to registration page
   */
  async goToRegistration() {
    await this.navigate('/index.php?route=account/register');
    await this.waitForLoadState();
  }

  /**
   * Fill first name
   * @param {string} firstName - First name
   */
  async fillFirstName(firstName) {
    await this.fill(this.firstNameInput, firstName);
  }

  /**
   * Fill last name
   * @param {string} lastName - Last name
   */
  async fillLastName(lastName) {
    await this.fill(this.lastNameInput, lastName);
  }

  /**
   * Fill email
   * @param {string} email - Email address
   */
  async fillEmail(email) {
    await this.fill(this.emailInput, email);
  }

  /**
   * Fill telephone
   * @param {string} telephone - Phone number
   */
  async fillTelephone(telephone) {
    await this.fill(this.telephoneInput, telephone);
  }

  /**
   * Fill password
   * @param {string} password - Password
   */
  async fillPassword(password) {
    await this.fill(this.passwordInput, password);
  }

  /**
   * Fill confirm password
   * @param {string} password - Confirm password
   */
  async fillConfirmPassword(password) {
    await this.fill(this.confirmPasswordInput, password);
  }

  /**
   * Check agree checkbox
   */
  async checkAgree() {
    await this.click(this.agreeCheckbox);
  }

  /**
   * Fill all registration fields
   * @param {Object} userData - User data object
   */
  async fillRegistrationForm(userData) {
    await this.fillFirstName(userData.firstName || '');
    await this.fillLastName(userData.lastName || '');
    await this.fillEmail(userData.email || '');
    await this.fillTelephone(userData.phone || '');
    await this.fillPassword(userData.password || '');
    await this.fillConfirmPassword(userData.password || '');
  }

  /**
   * Complete registration process
   * @param {Object} userData - User data object
   */
  async register(userData) {
    await this.fillRegistrationForm(userData);
    await this.checkAgree();
    await this.clickRegisterButton();
  }

  /**
   * Click register button
   */
  async clickRegisterButton() {
    await this.click(this.registerButton);
    await this.waitForLoadState();
  }

  /**
   * Get error message text
   * @returns {Promise<string>} Error message
   */
  async getErrorMessage() {
    if (await this.isVisible(this.errorMessage)) {
      return await this.getText(this.errorMessage);
    }
    return '';
  }

  /**
   * Check if error message is displayed
   * @returns {Promise<boolean>} True if error is visible
   */
  async isErrorMessageVisible() {
    return await this.isVisible(this.errorMessage);
  }

  /**
   * Check if email exists error is displayed
   * @returns {Promise<boolean>} True if email exists error is visible
   */
  async isEmailExistsErrorVisible() {
    return await this.isVisible(this.emailExistsError);
  }

  /**
   * Check if field error is displayed
   * @param {string} fieldName - Field name
   * @returns {Promise<boolean>} True if field error is visible
   */
  async isFieldErrorVisible(fieldName) {
    const fieldErrors = await this.page.locator(this.fieldErrors).all();
    for (const error of fieldErrors) {
      const text = await error.textContent();
      if (text && text.toLowerCase().includes(fieldName.toLowerCase())) {
        return true;
      }
    }
    return false;
  }

  /**
   * Check if registration was successful
   * @returns {Promise<boolean>} True if success message is visible
   */
  async isRegistrationSuccessful() {
    return await this.isVisible(this.successMessage);
  }
}

module.exports = RegistrationPage;

