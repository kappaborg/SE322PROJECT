const BasePage = require('./BasePage');

/**
 * Home Page Object Model - IUS Student Information System
 * 
 * Represents the home/dashboard page after login.
 * Contains all locators and methods for interacting with the home page.
 */
class HomePage extends BasePage {
  constructor(page) {
    super(page);
    
    // Locators - Updated for IUS SIS
    this.loginLink = 'a:has-text("Login"), a[href*="login"]';
    this.userMenu = '.user-menu, [id*="User"], [class*="user" i]';
    this.logoutLink = 'a:has-text("Logout"), a[href*="logout"]';
    this.dashboardMenu = '.dashboard, [id*="Dashboard"], nav, .menu';
    this.welcomeMessage = '[class*="welcome" i], [id*="Welcome"]';
    this.studentInfo = '[class*="student" i], [id*="Student"]';
    this.coursesLink = 'a:has-text("Courses"), a[href*="course"]';
    this.gradesLink = 'a:has-text("Grades"), a[href*="grade"]';
    this.elsLink = 'a:has-text("ELS Reports"), a[href*="els"]';
    this.scheduleLink = 'a:has-text("Schedule"), a[href*="schedule"]';
    this.contractLink = 'a:has-text("Contract and Payment Record"), a[href*="Ogr0137"]';
  }

  /**
   * Navigate to home page
   */
  async goToHome() {
    await this.navigate('/');
    await this.waitForLoadState();
  }
  

  /**
   * Navigate to login page
   */
  async goToLogin() {
    await this.navigate('/login.aspx?lang=en-US');
    await this.waitForLoadState();
  }

  /**
   * Click on login link
   */
  async clickLoginLink() {
    if (await this.isVisible(this.loginLink)) {
      await this.click(this.loginLink);
      await this.waitForLoadState();
    } else {
      await this.goToLogin();
    }
  }

  /**
   * Check if user is logged in
   * @returns {Promise<boolean>} True if logged in
   */
  async isLoggedIn() {
    // Check if user menu or welcome message is visible
    return await this.isVisible(this.userMenu) || 
           await this.isVisible(this.welcomeMessage) ||
           !this.getCurrentUrl().includes('login.aspx');
  }

  /**
   * Click logout link
   */
  async clickLogoutLink() {
    if (await this.isVisible(this.logoutLink)) {
      await this.click(this.logoutLink);
      await this.waitForLoadState();
    }
  }

  /**
   * Get welcome message
   * @returns {Promise<string>} Welcome message text
   */
  async getWelcomeMessage() {
    if (await this.isVisible(this.welcomeMessage)) {
      return await this.getText(this.welcomeMessage);
    }
    return '';
  }

  /**
   * Navigate to courses
   */
  async goToCourses() {
    if (await this.isVisible(this.coursesLink)) {
      await this.click(this.coursesLink);
      await this.waitForLoadState();
    }
  }

  /**
   * Navigate to grades
   */
  async goToGrades() {
    if (await this.isVisible(this.gradesLink)) {
      await this.click(this.gradesLink);
      await this.waitForLoadState();
    }
  }

  /**
   * Navigate to schedule
   */
  async goToSchedule() {
    if (await this.isVisible(this.scheduleLink)) {
      await this.click(this.scheduleLink);
      await this.waitForLoadState();
    }
  }
  /**
   * Navigate to ELS Reports
   */
  async goToEls() {
    if (await this.isVisible(this.elsLink)) {
      await this.click(this.elsLink);
      await this.waitForLoadState();
    }
  }
  async goToContract() {
    if (await this.isVisible(this.contractLink)) {
      await this.click(this.contractLink);
      await this.waitForLoadState();
    }
  }
  
}

module.exports = HomePage;
