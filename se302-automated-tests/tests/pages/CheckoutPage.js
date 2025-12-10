const BasePage = require('./BasePage');

/**
 * Checkout Page Object Model
 * 
 * Represents the checkout page.
 * Contains all locators and methods for checkout process.
 */
class CheckoutPage extends BasePage {
  constructor(page) {
    super(page);
    
    // Billing Address Locators
    this.firstNameInput = 'input[name="firstname"]';
    this.lastNameInput = 'input[name="lastname"]';
    this.emailInput = 'input[name="email"]';
    this.telephoneInput = 'input[name="telephone"]';
    this.addressInput = 'input[name="address_1"]';
    this.cityInput = 'input[name="city"]';
    this.postcodeInput = 'input[name="postcode"]';
    this.countrySelect = 'select[name="country_id"]';
    this.regionSelect = 'select[name="zone_id"]';
    
    // Payment Method Locators
    this.paymentMethod = 'input[name="payment_method"]';
    this.agreeTermsCheckbox = 'input[name="agree"]';
    this.confirmOrderButton = 'button:has-text("Confirm Order")';
    this.continueButton = 'button:has-text("Continue")';
    
    // Success Locators
    this.successMessage = 'text=Your order has been placed!';
    this.paymentSuccessMessage = 'text=Payment was successful';
    this.orderId = '.order-id';
    
    // Error Locators
    this.errorMessage = '.alert-danger';
    this.fieldErrors = '.text-danger';
  }

  /**
   * Navigate to checkout page
   */
  async goToCheckout() {
    await this.navigate('/index.php?route=checkout/checkout');
    await this.waitForLoadState();
  }

  /**
   * Fill billing address
   * @param {Object} addressData - Address data object
   */
  async fillBillingAddress(addressData) {
    if (addressData.firstName) await this.fill(this.firstNameInput, addressData.firstName);
    if (addressData.lastName) await this.fill(this.lastNameInput, addressData.lastName);
    if (addressData.email) await this.fill(this.emailInput, addressData.email);
    if (addressData.telephone) await this.fill(this.telephoneInput, addressData.telephone);
    if (addressData.address) await this.fill(this.addressInput, addressData.address);
    if (addressData.city) await this.fill(this.cityInput, addressData.city);
    if (addressData.postcode) await this.fill(this.postcodeInput, addressData.postcode);
    if (addressData.country) {
      await this.page.selectOption(this.countrySelect, { label: addressData.country });
    }
    if (addressData.region) {
      await this.page.selectOption(this.regionSelect, { label: addressData.region });
    }
  }

  /**
   * Select payment method
   * @param {string} method - Payment method
   */
  async selectPaymentMethod(method = 'cod') {
    await this.page.check(`input[value="${method}"]`);
  }

  /**
   * Check agree terms checkbox
   */
  async checkAgreeTerms() {
    await this.click(this.agreeTermsCheckbox);
  }

  /**
   * Click confirm order button
   */
  async clickConfirmOrder() {
    await this.click(this.confirmOrderButton);
    await this.waitForLoadState();
  }

  /**
   * Click continue button
   */
  async clickContinue() {
    await this.click(this.continueButton);
    await this.waitForLoadState();
  }

  /**
   * Complete checkout process
   * @param {Object} addressData - Billing address data
   * @param {string} paymentMethod - Payment method
   */
  async completeCheckout(addressData, paymentMethod = 'cod') {
    await this.fillBillingAddress(addressData);
    await this.selectPaymentMethod(paymentMethod);
    await this.checkAgreeTerms();
    await this.clickConfirmOrder();
  }

  /**
   * Check if order was successful
   * @returns {Promise<boolean>} True if order was successful
   */
  async isOrderSuccessful() {
    return await this.isVisible(this.successMessage) || 
           await this.isVisible(this.paymentSuccessMessage);
  }

  /**
   * Get order ID
   * @returns {Promise<string>} Order ID
   */
  async getOrderId() {
    if (await this.isVisible(this.orderId)) {
      return await this.getText(this.orderId);
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
   * Check if error message is displayed
   * @returns {Promise<boolean>} True if error is visible
   */
  async isErrorMessageVisible() {
    return await this.isVisible(this.errorMessage);
  }
}

module.exports = CheckoutPage;

