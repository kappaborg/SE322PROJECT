const BasePage = require('./BasePage');

class ELSPage extends BasePage {
  constructor(page) {
    super(page);

    this.treeRoot = '#leftPanel';
    this.treeList = '#ctl00_treeMenu12';
    this.elsLink = '#ctl00_treeMenu12 > li:nth-child(9) span.file';
    this.elsNavLink = [
      '#ctl00_treeMenu12 span.file:has-text("ELS Report")',
      '#ctl00_treeMenu12 span.file:has-text("ELS")',
      'span.file:has-text("ELS Report")',
      'span.file:has-text("ELS")'
    ];
    this.elsActionButton = '#AppHeader2_ctl08 > input[type=image]';
    this.elsActionButtonAlt = '#AppHeader2_ctl08 input[type=image]';
    this.elsTable = 'table, .grid, .data-table';
    this.elsRows = 'table tr, .grid tr, .data-table tr';
    this.elsCells = 'td, th';
    this.pageHeading = 'h1:has-text("ELS"), h2:has-text("ELS"), h3:has-text("ELS"), [class*="ELS" i] h1, [class*="ELS" i] h2, [class*="report" i] h1, [class*="report" i] h2';
  }

  async goToELS() {
    const selectors = [
      this.elsLink,
      '#ctl00_treeMenu12 span.file[menuurl*="Ogr0320"]',
      '#ctl00_treeMenu12 span.file[menuurl*="ogr0320"]',
      ...this.elsNavLink
    ];
    await this.clickTreeMenuItem(selectors, '/ogrenci/ogr0320/default.aspx?lang=en-US');
  }

  async clickELSActionButton() {
    await this.clickWithFallbacks([this.elsActionButton, this.elsActionButtonAlt]);
  }
  async isELSListVisible() {
    return this.isContentVisible(
      [this.elsRows],
      [this.elsTable],
      [this.pageHeading]
    );
  }
  async getSampleELS(limit = 3) {
    return this.getSampleRows(this.elsRows, limit);
  }
}

module.exports = ELSPage;