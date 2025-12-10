const BasePage = require('./BasePage');

/**
 * documents Page Object Model - IUS Student Information System
 *
 * This class uses resilient selectors based on common labels and table layouts.
 * Adjust selectors if your portal uses different labels.
 */
class StudentSertificateApplicationPage extends BasePage {
  constructor(page) {
    super(page);

    // Navigation links
    // Left tree menu (per inspected DOM)
    this.treeRoot = '#leftPanel';
    this.treeList = '#ctl00_treeMenu12';
    this.certificateDetails = '#ctl00_treeMenu12 > li:nth-child(8) span.file';

    // Fallbacks by text if structure shifts
    this.documentsNavLink = [
      '#ctl00_treeMenu12 span.file:has-text("Student Certificate Application")',
      'span.file:has-text("Student Certificate Application")',
    ];

    // Common grade list structures
    this.documentsTable = 'table, .grid, .data-table';
    this.gradeRows = 'table tr, .grid tr, .data-table tr';
    this.gradeCells = 'td, th';

    // Possible headings
    this.pageHeading = 'h1:has-text("Document"), h2:has-text("Document"), h3:has-text("Document"), [class*="document" i] h1, [class*="document" i] h2';
  }

  /**
   * Navigate to documents page via nav link.
   */
  async goTodocuments() {
    const contexts = [this.page, ...this.page.frames()];
    const selectors = [
      this.certificateDetails,
      this.academicRecord,
      '#ctl00_treeMenu12 span.file[menuurl*="Ogr0170"]',
      ...this.documentsNavLink
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
    await this.navigate('/Ogrenci/Ogr0170/Default.aspx?lang=en-US');
  }

  /**
   * Returns true if a documents table/list is visible.
   */
  async isdocumentsListVisible() {
    return (await this.page.locator(this.gradeRows).count()) > 0
      || (await this.isVisible(this.documentsTable))
      || (await this.isVisible(this.pageHeading));
  }

  /**
   * Get the first few grade row texts as evidence.
   */
  async getSampledocuments(limit = 3) {
    const rows = await this.page.locator(this.gradeRows).all();
    const items = [];
    for (const row of rows.slice(0, limit)) {
      const text = (await row.innerText()).trim();
      if (text) items.push(text);
    }
    return items;
  }
}

module.exports = StudentSertificateApplicationPage;

