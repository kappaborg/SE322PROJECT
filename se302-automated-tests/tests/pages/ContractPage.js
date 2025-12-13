const BasePage = require('./BasePage');
class ContractPage extends BasePage {
    constructor(page) {
        super(page);
        // Navigation links
        // Left tree menu (per inspected DOM)
        this.treeRoot = '#leftPanel';
        this.treeList = '#ctl00_treeMenu12';
        this.contractsLink = '#ctl00_treeMenu12 > li:nth-child(10) span.file';
        
        // Fallbacks by text if structure shifts
        this.contractsNavLink = [
            '#ctl00_treeMenu12 span.file:has-text("Contract and Payment Records")',
            'span.file:has-text("Contract and Payment Records")',     
        ];
        this.table = '#grdBorcBilgileri_ctl00';
        this.tableResults='#Panel1 > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(2) > td:nth-child(1) > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(1) > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(3)'
        this.reportButton = '#RadButton1';
        this.pageHeading = 'h1:has-text("Debt Information Status  "), h2:has-text("List of criteria"), h3:has-text("Courses"), [class*="Debt Information Status" i] h1';
        }
    async goTodocumnets() {
        const contexts = [this.page, ...this.page.frames()];
        const selectors = [
            this.contractsLink,
            '#ctl00_treeMenu12 span.file[menuurl*="Ogr0137"]',
            ...this.contractsNavLink
        ];
        for (const ctx of contexts) {
            for (const sel of selectors) {
                const loc = ctx.locator(sel);
                if (await loc.count()) {
                    await loc.first().click({ timeout: 15000 });
                    await this.page.waitForLoadState();
                    return;
                }
            }
        }

        await this.navigate('/Ogrenci/Ogr0137/Default.aspx?lang=en-US');
}

async selectTableRow(rowIndex) {
    if (rowIndex < 1 || rowIndex > 7) {
      throw new Error(' index must be between 1 and 7');
    }

    if (await this.isVisible(this.table)) {
      await this.page.waitForTimeout(500);
    } else if (await this.isVisible(this.reportButton)) {
      await this.page.waitForTimeout(500);
    }

    // Select the semester option by index
    const semesterOption = this.page.locator(`#grdBorcBilgileri_ctl00 > tbody > tr:nth-child(${rowIndex})`);
    if (await semesterOption.count()) {
      await semesterOption.first().click({ timeout: 5000 });
      await this.waitForLoadState();
    }
}
    async selectFirstSemester() { return this.selectSemester(1); }
    async selectSecondSemester() { return this.selectSemester(2); }
    async selectThirdSemester() { return this.selectSemester(3); }
    async selectFourthSemester() { return this.selectSemester(4); }
    async selectFifthSemester() { return this.selectSemester(5); }
    async selectSixthSemester() { return this.selectSemester(6); }
 
//Click button Report
   async clickButtonReport() {
    if (await this.isVisible(this.ButtonReport)) {
      await this.click(this.buttonReport);
      await this.waitForLoadState();
    }
   }

  async isdocumentsListVisible() {
    return (await this.isVisible(this.tableResults)) || (await this.isVisible(this.pageHeading));
  }
 
}
module.exports = ContractPage;