const BasePage = require('./BasePage');

/**
 * Favorites Page Object Model
 * 
 * Represents the favorites/wishlist page.
 * Contains all locators and methods for favorites functionality.
 */
class FavoritesPage extends BasePage {
  constructor(page) {
    super(page);
    
    // Locators
    this.favoritesItems = '.wishlist-item';
    this.productName = '.product-name';
    this.removeButton = 'button:has-text("Remove")';
    this.addToCartButton = 'button:has-text("Add to Cart")';
    this.emptyFavoritesMessage = 'text=Your favorites list is empty';
    this.favoritesCount = '.favorites-count';
    this.favoritesIcon = '[data-testid="favorites-icon"]';
  }

  /**
   * Navigate to favorites page
   */
  async goToFavorites() {
    await this.navigate('/index.php?route=account/wishlist');
    await this.waitForLoadState();
  }

  /**
   * Get number of items in favorites
   * @returns {Promise<number>} Number of items
   */
  async getFavoritesCount() {
    return await this.page.locator(this.favoritesItems).count();
  }

  /**
   * Get product names in favorites
   * @returns {Promise<Array<string>>} Array of product names
   */
  async getProductNames() {
    const names = [];
    const items = await this.page.locator(this.productName).all();
    for (const item of items) {
      names.push(await item.textContent());
    }
    return names;
  }

  /**
   * Remove item from favorites
   * @param {number} index - Item index (0-based)
   */
  async removeItem(index) {
    const removeButtons = await this.page.locator(this.removeButton).all();
    if (removeButtons[index]) {
      await removeButtons[index].click();
      await this.waitForLoadState();
    }
  }

  /**
   * Add item to cart from favorites
   * @param {number} index - Item index (0-based)
   */
  async addToCart(index) {
    const addToCartButtons = await this.page.locator(this.addToCartButton).all();
    if (addToCartButtons[index]) {
      await addToCartButtons[index].click();
      await this.waitForLoadState();
    }
  }

  /**
   * Check if favorites is empty
   * @returns {Promise<boolean>} True if favorites is empty
   */
  async isFavoritesEmpty() {
    return await this.isVisible(this.emptyFavoritesMessage) || 
           (await this.getFavoritesCount() === 0);
  }

  /**
   * Check if product is in favorites
   * @param {string} productName - Product name to check
   * @returns {Promise<boolean>} True if product is in favorites
   */
  async isProductInFavorites(productName) {
    const names = await this.getProductNames();
    return names.some(name => name.includes(productName));
  }
}

module.exports = FavoritesPage;

