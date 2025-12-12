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
    const selectors = [
      this.courseSchedule,
      this.courseRegistration,
      '#ctl00_treeMenu12 span.file[menuurl*="Ogr0205"]',
      '#ctl00_treeMenu12 span.file[menuurl*="Ogr0273"]',
      ...this.coursesNavLink
    ];
    await this.clickTreeMenuItem(selectors, '/Ogrenci/Ogr0205/Default.aspx?lang=en-US');
  }

  /**
   * Returns true if a course table/list is visible.
   */
  async isCourseListVisible() {
    return this.isContentVisible(
      [this.courseRows],
      [this.courseTable],
      [this.pageHeading]
    );
  }

  /**
   * Get the first few course row texts as evidence.
   */
  async getSampleCourses(limit = 3) {
    return this.getSampleRows(this.courseRows, limit);
  }
}

module.exports = CoursesPage;

