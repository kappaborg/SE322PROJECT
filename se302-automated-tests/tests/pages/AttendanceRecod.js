const BasePage = require('./BasePage');

/**
 * documents Page Object Model - IUS Student Information System
 *
 * This class uses resilient selectors based on common labels and table layouts.
 * Adjust selectors if your portal uses different labels.
 */
class AttendanceRecordPage extends BasePage {
  constructor(page) {
    super(page);

    // Navigation links
    // Left tree menu (per inspected DOM)
    this.treeRoot = '#leftPanel';
    this.treeList = '#ctl00_treeMenu12';
    this.attendanceRecord = '#ctl00_treeMenu12 > li:nth-child(6) span.file';

    // Fallbacks by text if structure shifts
    this.documentsNavLink = [
      '#ctl00_treeMenu12 span.file:has-text("Attendance Record")',
      'span.file:has-text("Attendance Record")',
    ];

    // Semester dropdown (observed in DOM)
    this.semesterDropdown = '#ccYilDonem__cmbDonem';
    this.semesterDropdownArrow = '#ccYilDonem__cmbDonem .rcbArrowCell';
    // Exact selector for Fall
    this.semesterOptionFall = '#ccYilDonem__cmbDonem_DropDown > div > ul > li:nth-child(2)';
    this.semesterOptionSpring = '#ccYilDonem__cmbDonem_DropDown > div > ul > li:nth-child(3)';
    this.semesterOptionSession1 = '#ccYilDonem__cmbDonem_DropDown > div > ul > li:nth-child(4)';
    this.semesterOptionSession2 = '#ccYilDonem__cmbDonem_DropDown > div > ul > li:nth-child(5)';
    this.semesterOptionSession3 = '#ccYilDonem__cmbDonem_DropDown > div > ul > li:nth-child(6)';
    this.semesterOptionSession4 = '#ccYilDonem__cmbDonem_DropDown > div > ul > li:nth-child(7)';
    this.buttonListele = '#btnListele';
    this.buttonApply = '#btnListele_input';
    this.buttonListeleClientState = '#btnListele_ClientState'

    // Common grade list structures
    this.documentsTable = 'table, .grid, .data-table';
    this.attendanceRows = 'table tr, .grid tr, .data-table tr';
    this.gradeCells = 'td, th';

    // Possible headings
    this.pageHeading = 'h1:has-text("Student Attendance Status"), h2:has-text("List of criteria"), h3:has-text("Courses"), [class*="Student Attendance Status" i] h1, [class*="List of criteria" i] h2';
  }

  /**
   * Navigate to documents page via nav link.
   */
  async goTodocuments() {
    const contexts = [this.page, ...this.page.frames()];
    const selectors = [
      this.attendanceRecord,
      '#ctl00_treeMenu12 span.file[menuurl*="Ogr0123"]',
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
    await this.navigate('/Ogrenci/Ogr0123/Default.aspx?lang=en-US');
  }

  /**
   * Selects Fall semester if dropdown is present.
   */
  async selectFallSemester() {
    // Try to open the dropdown
    if (await this.isVisible(this.semesterDropdownArrow)) {
      await this.click(this.semesterDropdownArrow);
      await this.page.waitForTimeout(500);
    } else if (await this.isVisible(this.semesterDropdown)) {
      await this.click(this.semesterDropdown);
      await this.page.waitForTimeout(500);
    }

    // Choose Fall option
    const fallOption = this.page.locator(this.semesterOptionFall);
    if (await fallOption.count()) {
      await fallOption.first().click({ timeout: 5000 });
      await this.waitForLoadState();
    }
  }
  async selectSpringSemester() {
    if (await this.isVisible(this.semesterDropdownArrow)) {
      await this.click(this.semesterDropdownArrow);
      await this.page.waitForTimeout(500);
    } else if (await this.isVisible(this.semesterDropdown)) {
      await this.click(this.semesterDropdown);
      await this.page.waitForTimeout(500);
    }
    const springOption = this.page.locator(this.semesterOptionSpring);
    if (await springOption.count()) {
      await springOption.first().click({ timeout: 5000 });
      await this.waitForLoadState();
    }
  }
  async selectSession1Semester() {
    if (await this.isVisible(this.semesterDropdownArrow)) {
      await this.click(this.semesterDropdownArrow);
      await this.page.waitForTimeout(500);
    } else if (await this.isVisible(this.semesterDropdown)) {
      await this.click(this.semesterDropdown);
      await this.page.waitForTimeout(500);
    }
    const session1Option = this.page.locator(this.semesterOptionSession1);
    if (await session1Option.count()) {
      await session1Option.first().click({ timeout: 5000 });
      await this.waitForLoadState();
    }
  }
  async selectSession2Semester() {
    if (await this.isVisible(this.semesterDropdownArrow)) {
      await this.click(this.semesterDropdownArrow);
      await this.page.waitForTimeout(500);
    } else if (await this.isVisible(this.semesterDropdown)) {
      await this.click(this.semesterDropdown);
      await this.page.waitForTimeout(500);
    }
    const session2Option = this.page.locator(this.semesterOptionSession2);
    if (await session2Option.count()) {
      await session2Option.first().click({ timeout: 5000 });
      await this.waitForLoadState();
    }
  }
  async selectSession3Semester() {
    if (await this.isVisible(this.semesterDropdownArrow)) {
      await this.click(this.semesterDropdownArrow);
      await this.page.waitForTimeout(500);
    } else if (await this.isVisible(this.semesterDropdown)) {
      await this.click(this.semesterDropdown);
      await this.page.waitForTimeout(500);
    }
    const session3Option = this.page.locator(this.semesterOptionSession3);
    if (await session3Option.count()) {
      await session3Option.first().click({ timeout: 5000 });
      await this.waitForLoadState();
    }
  }
  async selectSession4Semester() {
    if (await this.isVisible(this.semesterDropdownArrow)) {
      await this.click(this.semesterDropdownArrow);
      await this.page.waitForTimeout(500);
    } else if (await this.isVisible(this.semesterDropdown)) {
      await this.click(this.semesterDropdown);
      await this.page.waitForTimeout(500);
    }
    const session4Option = this.page.locator(this.semesterOptionSession4);
    if (await session4Option.count()) {
      await session4Option.first().click({ timeout: 5000 });
      await this.waitForLoadState();
    }
  }
   //Click button Listele
   async clickButtonListele() {
    if (await this.isVisible(this.buttonApply)) {
      await this.click(this.buttonApply);
      await this.waitForLoadState();
    }
   }

  /**
   * Returns true if a documents table/list is visible.
   */
  async isdocumentsListVisible() {
    return (await this.page.locator(this.attendanceRows).count()) > 0
      || (await this.isVisible(this.documentsTable))
      || (await this.isVisible(this.pageHeading));
  }

  /**
   * Get the first few grade row texts as evidence.
   */
  async getSampleAttendanceRecord(limit = 3) {
    const rows = await this.page.locator(this.attendanceRows).all();
    const items = [];
    for (const row of rows.slice(0, limit)) {
      const text = (await row.innerText()).trim();
      if (text) items.push(text);
    }
    return items;
  }
}

module.exports = AttendanceRecordPage;

