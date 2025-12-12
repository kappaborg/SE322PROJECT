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

  async waitForLoadState() {
    await this.page.waitForLoadState('networkidle');
  }

  /**
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
   * @param {string} name 
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

  /**
   * @param {Array<string>} selectors 
   * @param {string} fallbackUrl 
   * @returns {Promise<void>}
   */
  async clickTreeMenuItem(selectors, fallbackUrl = null) {
    const contexts = [this.page, ...this.page.frames()];
    
    for (const ctx of contexts) {
      for (const sel of selectors) {
        const loc = ctx.locator(sel);
        if (await loc.count()) {
          await loc.first().click({ timeout: 15000 });
          await this.waitForLoadState();
          return;
        }
      }
    }
    
    if (fallbackUrl) {
      await this.navigate(fallbackUrl);
    }
  }

  /**
   * @param {Array<string>} selectors 
   * @param {Array<string>} selectors - Array of selectors to try
   * @returns {Promise<boolean>} True if clicked successfully
   */
  async clickWithFallbacks(selectors) {
    for (const sel of selectors) {
      if (await this.isVisible(sel)) {
        await this.click(sel);
        await this.waitForLoadState();
        return true;
      }
    }
    return false;
  }

  /**
   * @param {Array<string>} rowSelectors 
   * @param {Array<string>} tableSelectors 
   * @param {Array<string>} headingSelectors 
   * @returns {Promise<boolean>}
   */
  async isContentVisible(rowSelectors = [], tableSelectors = [], headingSelectors = []) {
    // Check rows
    for (const sel of rowSelectors) {
      if ((await this.page.locator(sel).count()) > 0) return true;
    }
    // Check tables
    for (const sel of tableSelectors) {
      if (await this.isVisible(sel)) return true;
    }
    // Check headings
    for (const sel of headingSelectors) {
      if (await this.isVisible(sel)) return true;
    }
    return false;
  }

  /**
   * Generic method to get sample rows from table
   * @param {string} rowSelector - Selector for table rows
   * @param {number} limit - Maximum number of rows to return
   * @returns {Promise<Array<string>>}
   */
  async getSampleRows(rowSelector, limit = 3) {
    const rows = await this.page.locator(rowSelector).all();
    const items = [];
    for (const row of rows.slice(0, limit)) {
      const text = (await row.innerText()).trim();
      if (text) items.push(text);
    }
    return items;
  }
}

module.exports = BasePage;

