const BasePage = require('./BasePage');

/**
 * Courses Page Object Model - IUS Student Information System
 *
 * This class uses resilient selectors that rely on link text and common table structures.
 * Adjust selectors if your portal uses different labels.
 */
class CoursesPage extends BasePage {
  constructor(page) {
    super(page);

    // Navigation links
    // Left tree menu (per inspected DOM)
    this.leftPanel = '#leftPanel';
    this.treeRoot = '#ctl00_pnlMenu';
    this.treeList = '#ctl00_treeMenu12';
    this.courseSchedule = '#ctl00_treeMenu12 > li:nth-child(1) span.file';
    this.courseRegistration = '#ctl00_treeMenu12 > li:nth-child(4) span.file'; // Course Registration per DOM

    // Fallbacks by text if structure shifts
    this.coursesNavLink = [
      '#ctl00_treeMenu12 span.file:has-text("Course Schedule")',
      '#ctl00_treeMenu12 span.file:has-text("Course Registration")',
      'span.file:has-text("Course Schedule")',
      'span.file:has-text("Course Registration")'
    ];

    // Common course list structures
    this.courseTable = 'table, .grid, .data-table';
    this.courseRows = 'table tr, .grid tr, .data-table tr';
    this.courseCells = 'td, th';

    // Possible headings
    this.pageHeading = 'h1:has-text("Course"), h2:has-text("Course"), h3:has-text("Course"), [class*="course" i] h1, [class*="course" i] h2';
  }

  /**
   * Navigate to courses page via direct URL (if known) or by clicking nav link.
   * Fallback: clicks nav link.
   */
  async goToCourses() {
    const contexts = [this.page, ...this.page.frames()];
    const selectors = [
      this.courseSchedule,
      this.courseRegistration,
      '#ctl00_treeMenu12 span.file[menuurl*="Ogr0205"]',
      '#ctl00_treeMenu12 span.file[menuurl*="Ogr0273"]',
      ...this.coursesNavLink
    ];

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

    // Fallback direct navigation
    await this.navigate('/Ogrenci/Ogr0205/Default.aspx?lang=en-US');
  }

  /**
   * Returns true if a course table/list is visible.
   */
  async isCourseListVisible() {
    return (await this.page.locator(this.courseRows).count()) > 0
      || (await this.isVisible(this.courseTable))
      || (await this.isVisible(this.pageHeading));
  }

  /**
   * Get the first few course row texts as evidence.
   */
  async getSampleCourses(limit = 3) {
    const rows = await this.page.locator(this.courseRows).all();
    const items = [];
    for (const row of rows.slice(0, limit)) {
      const text = (await row.innerText()).trim();
      if (text) items.push(text);
    }
    return items;
  }
}

module.exports = CoursesPage;

