const BasePage = require('./BasePage');
class ContractPage extends BasePage {
    constructor(page) {
        super(page);
        this.treeRoot = '#leftPanel';
        this.treeList = '#ctl00_treeMenu12';
        this.contractsLink = '#ctl00_treeMenu12 > li:nth-child(10) span.file';
        
        this.contractsNavLink = [
            '#ctl00_treeMenu12 span.file:has-text("Contract and Payment Records")',
            'span.file:has-text("Contract and Payment Records")',     
        ];
        this.table = '#grdBorcBilgileri_ctl00';
        this.tableRows = '#grdBorcBilgileri_ctl00 > tbody > tr';
        this.tableResults='#Panel1 > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(2) > td:nth-child(1) > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(1) > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(3)'
        this.reportButton = '#RadButton1';
        this.reportButtonInput = '#RadButton1_input';
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

    async getAllTableRows() {
        await this.waitForElement(this.table);
        const rows = await this.page.locator(this.tableRows).all();
        return rows;
    }

    async selectTableRow(rowIndex) {
        const rows = await this.getAllTableRows();
        if (rowIndex < 1 || rowIndex > rows.length) {
            throw new Error(`Row index must be between 1 and ${rows.length}`);
        }

        const rowOption = this.page.locator(`${this.tableRows}:nth-child(${rowIndex})`);
        if (await rowOption.count()) {
            await rowOption.first().click({ timeout: 5000 });
            await this.waitForLoadState();
        }
    }

    async clickButtonReport() {
        await this.clickWithFallbacks([this.reportButton, this.reportButtonInput]);
    }

    async isdocumentsListVisible() {
        return (await this.isVisible(this.tableResults)) || (await this.isVisible(this.pageHeading));
 
    }
    async isContractListVisible() {
        return this.isContentVisible(
            [this.tableRows],
            [this.table],
            [this.pageHeading]
        );
  }
}

module.exports = ContractPage;
