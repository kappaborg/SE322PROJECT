const BasePage = require('./BasePage');

/**
 * Grades Page Object Model - IUS Student Information System
 *
 * This class uses resilient selectors based on common labels and table layouts.
 * Adjust selectors if your portal uses different labels.
 */
class GradesPage extends BasePage {
  constructor(page) {
    super(page);

    // Navigation links
    // Left tree menu (per inspected DOM)
    this.treeRoot = '#leftPanel';
    this.treeList = '#ctl00_treeMenu12';
    this.gradeDetails = '#ctl00_treeMenu12 > li:nth-child(2) span.file';
    this.academicRecord = '#ctl00_treeMenu12 > li:nth-child(3) span.file';

    // Fallbacks by text if structure shifts
    this.gradesNavLink = [
      '#ctl00_treeMenu12 span.file:has-text("Grade Details")',
      '#ctl00_treeMenu12 span.file:has-text("Academic Record (Transcript)")',
      'span.file:has-text("Grade Details")',
      'span.file:has-text("Academic Record (Transcript)")'
    ];

    // Common grade list structures
    this.gradesTable = 'table, .grid, .data-table';
    this.gradeRows = 'table tr, .grid tr, .data-table tr';
    this.gradeCells = 'td, th';

    // Possible headings
    this.pageHeading = 'h1:has-text("Grade"), h2:has-text("Grade"), h3:has-text("Grade"), [class*="grade" i] h1, [class*="grade" i] h2';
  }

  /**
   * Navigate to grades page via nav link.
   */
  async goToGrades() {
    const contexts = [this.page, ...this.page.frames()];
    const selectors = [
      this.gradeDetails,
      this.academicRecord,
      '#ctl00_treeMenu12 span.file[menuurl*="Ogr0201"]',
      '#ctl00_treeMenu12 span.file[menuurl*="Ogr0204"]',
      ...this.gradesNavLink
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
    await this.navigate('/Ogrenci/Ogr0201/Default.aspx?lang=en-US');
  }

  /**
   * Returns true if a grades table/list is visible.
   */
  async isGradesListVisible() {
    return (await this.page.locator(this.gradeRows).count()) > 0
      || (await this.isVisible(this.gradesTable))
      || (await this.isVisible(this.pageHeading));
  }

  /**
   * Get the first few grade row texts as evidence.
   */
  async getSampleGrades(limit = 3) {
    const rows = await this.page.locator(this.gradeRows).all();
    const items = [];
    for (const row of rows.slice(0, limit)) {
      const text = (await row.innerText()).trim();
      if (text) items.push(text);
    }
    return items;
  }
}

module.exports = GradesPage;

