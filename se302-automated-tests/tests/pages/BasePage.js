/**
 * Base Page Object Model Class
 * 
 * This is the base class that all page classes extend.
 * It contains common methods and properties shared across all pages.
 */
class BasePage {
  constructor(page) {
    this.page = page;
  }

  /**
   * Navigate to a specific URL
   * @param {string} url - URL to navigate to
   */
  async navigate(url) {
    await this.page.goto(url, { waitUntil: 'networkidle' });
  }

  /**
   * Wait for page to load completely
   */
  async waitForLoadState() {
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Wait for element to be visible
   * @param {string} selector - Element selector
   * @param {number} timeout - Timeout in milliseconds
   */
  async waitForElement(selector, timeout = 10000) {
    await this.page.waitForSelector(selector, { state: 'visible', timeout });
  }

  /**
   * Click on an element
   * @param {string} selector - Element selector
   */
  async click(selector) {
    await this.waitForElement(selector);
    await this.page.click(selector);
  }

  /**
   * Fill an input field
   * @param {string} selector - Input selector
   * @param {string} value - Value to fill
   */
  async fill(selector, value) {
    await this.waitForElement(selector);
    await this.page.fill(selector, value);
  }

  /**
   * Get text content of an element
   * @param {string} selector - Element selector
   * @returns {Promise<string>} Text content
   */
  async getText(selector) {
    await this.waitForElement(selector);
    return await this.page.textContent(selector);
  }

  /**
   * Check if element is visible
   * @param {string} selector - Element selector
   * @returns {Promise<boolean>} True if visible
   */
  async isVisible(selector) {
    try {
      await this.waitForElement(selector, 5000);
      return await this.page.isVisible(selector);
    } catch {
      return false;
    }
  }

  /**
   * Take screenshot
   * @param {string} name - Screenshot name
   */
  async takeScreenshot(name) {
    await this.page.screenshot({ 
      path: `test-results/screenshots/${name}_${Date.now()}.png`,
      fullPage: true 
    });
  }

  /**
   * Get page title
   * @returns {Promise<string>} Page title
   */
  async getTitle() {
    return await this.page.title();
  }

  /**
   * Get current URL
   * @returns {string} Current URL
   */
  getCurrentUrl() {
    return this.page.url();
  }
}

module.exports = BasePage;

