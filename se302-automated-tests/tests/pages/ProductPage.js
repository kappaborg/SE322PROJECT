const BasePage = require('./BasePage');

/**
 * Product Page Object Model
 * 
 * Represents a product detail page.
 * Contains all locators and methods for interacting with products.
 */
class ProductPage extends BasePage {
  constructor(page) {
    super(page);
    
    // Locators
    this.productTitle = 'h1';
    this.productPrice = '.price';
    this.addToCartButton = 'button:has-text("Add to Cart")';
    this.addToFavoritesButton = 'button:has-text("Add to Favorites")';
    this.favoritesButton = '[data-testid="favorites-button"]';
    this.quantityInput = 'input[name="quantity"]';
    this.successMessage = '.alert-success';
    this.cartSuccessMessage = 'text=Success: You have added';
    this.favoritesSuccessMessage = 'text=Success: You have added to favorites';
    this.alreadyInFavoritesMessage = 'text=Product is already in favorites';
    this.loginRequiredMessage = 'text=Please login to add to favorites';
  }

  /**
   * Navigate to product page by ID
   * @param {number} productId - Product ID
   */
  async goToProduct(productId) {
    await this.navigate(`/index.php?route=product/product&product_id=${productId}`);
    await this.waitForLoadState();
  }

  /**
   * Get product title
   * @returns {Promise<string>} Product title
   */
  async getProductTitle() {
    return await this.getText(this.productTitle);
  }

  /**
   * Get product price
   * @returns {Promise<string>} Product price
   */
  async getProductPrice() {
    return await this.getText(this.productPrice);
  }

  /**
   * Set quantity
   * @param {number} quantity - Quantity to set
   */
  async setQuantity(quantity) {
    await this.fill(this.quantityInput, quantity.toString());
  }

  /**
   * Click add to cart button
   */
  async clickAddToCart() {
    await this.click(this.addToCartButton);
    await this.waitForLoadState();
  }

  /**
   * Add product to cart
   * @param {number} quantity - Quantity (optional, default 1)
   */
  async addToCart(quantity = 1) {
    if (quantity > 1) {
      await this.setQuantity(quantity);
    }
    await this.clickAddToCart();
  }

  /**
   * Click add to favorites button
   */
  async clickAddToFavorites() {
    await this.click(this.addToFavoritesButton);
    await this.waitForLoadState();
  }

  /**
   * Add product to favorites
   */
  async addToFavorites() {
    await this.clickAddToFavorites();
  }

  /**
   * Check if add to cart success message is displayed
   * @returns {Promise<boolean>} True if success message is visible
   */
  async isAddToCartSuccessVisible() {
    return await this.isVisible(this.cartSuccessMessage);
  }

  /**
   * Check if add to favorites success message is displayed
   * @returns {Promise<boolean>} True if success message is visible
   */
  async isAddToFavoritesSuccessVisible() {
    return await this.isVisible(this.favoritesSuccessMessage);
  }

  /**
   * Check if already in favorites message is displayed
   * @returns {Promise<boolean>} True if message is visible
   */
  async isAlreadyInFavoritesMessageVisible() {
    return await this.isVisible(this.alreadyInFavoritesMessage);
  }

  /**
   * Check if login required message is displayed
   * @returns {Promise<boolean>} True if message is visible
   */
  async isLoginRequiredMessageVisible() {
    return await this.isVisible(this.loginRequiredMessage);
  }

  /**
   * Check if add to favorites button is visible
   * @returns {Promise<boolean>} True if button is visible
   */
  async isAddToFavoritesButtonVisible() {
    return await this.isVisible(this.addToFavoritesButton);
  }
}

module.exports = ProductPage;

