/**
 * Helper Functions Utility
 * 
 * Provides reusable helper functions for test automation.
 */

/**
 * Waits for element to be visible and stable
 * @param {Page} page - Playwright page object
 * @param {string} selector - Element selector
 * @param {number} timeout - Timeout in milliseconds
 */
async function waitForElementStable(page, selector, timeout = 5000) {
  await page.waitForSelector(selector, { state: 'visible', timeout });
  await page.waitForLoadState('networkidle');
}

/**
 * Takes a screenshot with timestamp
 * @param {Page} page - Playwright page object
 * @param {string} name - Screenshot name
 */
async function takeScreenshot(page, name) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  await page.screenshot({ 
    path: `test-results/screenshots/${name}_${timestamp}.png`,
    fullPage: true
  });
}

/**
 * Generates a unique test identifier
 * @returns {string} Unique identifier
 */
function generateTestId() {
  return `test_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Formats date to readable string
 * @param {Date} date - Date object
 * @returns {string} Formatted date string
 */
function formatDate(date) {
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
}

/**
 * Validates email format
 * @param {string} email - Email address to validate
 * @returns {boolean} True if valid email format
 */
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Sleep/delay function
 * @param {number} ms - Milliseconds to sleep
 * @returns {Promise} Promise that resolves after delay
 */
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

module.exports = {
  waitForElementStable,
  takeScreenshot,
  generateTestId,
  formatDate,
  isValidEmail,
  sleep
};

