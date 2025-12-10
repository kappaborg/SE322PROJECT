const BasePage = require('./BasePage');

/**
 * Contact Page Object Model
 * 
 * Represents the contact page.
 * Contains all locators and methods for contact form.
 */
class ContactPage extends BasePage {
  constructor(page) {
    super(page);
    
    // Locators
    this.firstNameInput = 'input[name="name"]';
    this.emailInput = 'input[name="email"]';
    this.subjectSelect = 'select[name="enquiry"]';
    this.messageTextarea = 'textarea[name="enquiry"]';
    this.fileInput = 'input[type="file"]';
    this.submitButton = 'button[type="submit"]:has-text("Submit")';
    this.sendButton = 'button:has-text("Send")';
    this.successMessage = '.alert-success';
    this.errorMessage = '.alert-danger';
    this.fieldErrors = '.text-danger';
    this.nameRequired = 'text=Name is required';
    this.emailRequired = 'text=Email is required';
    this.messageRequired = 'text=Message is required';
  }

  /**
   * Navigate to contact page
   */
  async goToContact() {
    await this.navigate('/index.php?route=information/contact');
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
   * Fill email
   * @param {string} email - Email address
   */
  async fillEmail(email) {
    await this.fill(this.emailInput, email);
  }

  /**
   * Select subject
   * @param {string} subject - Subject option
   */
  async selectSubject(subject) {
    await this.page.selectOption(this.subjectSelect, { label: subject });
  }

  /**
   * Fill message
   * @param {string} message - Message text
   */
  async fillMessage(message) {
    await this.fill(this.messageTextarea, message);
  }

  /**
   * Upload file
   * @param {string} filePath - Path to file
   */
  async uploadFile(filePath) {
    await this.page.setInputFiles(this.fileInput, filePath);
  }

  /**
   * Fill contact form
   * @param {Object} contactData - Contact data object
   */
  async fillContactForm(contactData) {
    if (contactData.firstName) await this.fillFirstName(contactData.firstName);
    if (contactData.email) await this.fillEmail(contactData.email);
    if (contactData.subject) await this.selectSubject(contactData.subject);
    if (contactData.message) await this.fillMessage(contactData.message);
    if (contactData.filePath) await this.uploadFile(contactData.filePath);
  }

  /**
   * Submit contact form
   */
  async submitForm() {
    await this.click(this.submitButton);
    await this.waitForLoadState();
  }

  /**
   * Send contact message
   * @param {string} firstName - First name
   * @param {string} email - Email address
   * @param {string} subject - Subject
   * @param {string} message - Message
   * @param {string} filePath - Optional file path
   */
  async send(firstName, email, subject, message, filePath = null) {
    await this.fillContactForm({ firstName, email, subject, message, filePath });
    await this.submitForm();
  }

  /**
   * Check if success message is displayed
   * @returns {Promise<boolean>} True if success message is visible
   */
  async isSuccessMessageVisible() {
    return await this.isVisible(this.successMessage);
  }

  /**
   * Get success message text
   * @returns {Promise<string>} Success message
   */
  async getSuccessMessage() {
    if (await this.isVisible(this.successMessage)) {
      return await this.getText(this.successMessage);
    }
    return '';
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
}

module.exports = ContactPage;

