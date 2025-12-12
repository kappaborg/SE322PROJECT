const BasePage = require('./BasePage');

class StudentSertificateApplicationPage extends BasePage {
  constructor(page) {
    super(page);

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

  async goTodocuments() {
    const selectors = [
      this.certificateDetails,
      '#ctl00_treeMenu12 span.file[menuurl*="Ogr0170"]',
      ...this.documentsNavLink
    ];
    await this.clickTreeMenuItem(selectors, '/Ogrenci/Ogr0170/Default.aspx?lang=en-US');
  }

  async isdocumentsListVisible() {
    return this.isContentVisible(
      [this.gradeRows],
      [this.documentsTable],
      [this.pageHeading]
    );
  }

 
  async getSampledocuments(limit = 3) {
    return this.getSampleRows(this.gradeRows, limit);
  }
}

module.exports = StudentSertificateApplicationPage;

