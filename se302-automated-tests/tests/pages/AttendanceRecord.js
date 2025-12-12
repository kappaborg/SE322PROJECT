const BasePage = require("./BasePage");
class AttendanceRecordPage extends BasePage {
	constructor(page) {
		super(page);
		// Navigation links
		// Left tree menu (per inspected DOM)
		this.treeRoot = "#leftPanel";
		this.treeList = "#ctl00_treeMenu12";

		// Fallbacks by text if structure shifts
		this.documentsNavLink = [
			'#ctl00_treeMenu12 span.file:has-text("Attendance Record")',
			'span.file:has-text("Attendance Record")',
		];

		// Semester dropdown (observed in DOM)-
		this.semesterDropdown = "#ccYilDonem__cmbDonem";
		this.semesterDropdownArrow = "#ccYilDonem__cmbDonem .rcbArrowCell";
		// First semester option (nth-child(1))
		this.semesterOptionFirst =
			"#ccYilDonem__cmbDonem_DropDown > div > ul > li:nth-child(1)";
		// Exact selector for Semesters
		this.semesterOptionFall =
			"#ccYilDonem__cmbDonem_DropDown > div > ul > li:nth-child(2)";
		this.semesterOptionSpring =
			"#ccYilDonem__cmbDonem_DropDown > div > ul > li:nth-child(3)";
		this.semesterOptionSession1 =
			"#ccYilDonem__cmbDonem_DropDown > div > ul > li:nth-child(4)";
		this.semesterOptionSession2 =
			"#ccYilDonem__cmbDonem_DropDown > div > ul > li:nth-child(5)";
		this.semesterOptionSession3 =
			"#ccYilDonem__cmbDonem_DropDown > div > ul > li:nth-child(6)";
		this.semesterOptionSession4 =
			"#ccYilDonem__cmbDonem_DropDown > div > ul > li:nth-child(7)";

		// Year dropdown (observed in DOM)
		this.yearDropdown = "#ccYilDonem__cmbYil";
		this.yearDropdownArrow = "#ccYilDonem__cmbYil .rcbArrowCell";
		// Year options from nth-child(1) to nth-child(25)
		this.yearOptionBase =
			"#ccYilDonem__cmbYil_DropDown > div > ul > li:nth-child";

		this.buttonListele = "#btnListele";
		this.buttonApply = "#btnListele_input";
		this.buttonListeleClientState = "#btnListele_ClientState";
		this.addtofavoritebutton = "#AppHeader1_ctl08 > input:nth-child(1)";

		// Common grade list structures
		this.documentsTable = "table, .grid, .data-table";
		this.attendanceRows = "table tr, .grid tr, .data-table tr";
		this.gradeCells = "td, th";

		// Possible headings
		this.pageHeading =
			'h1:has-text("Student Attendance Status"), h2:has-text("List of criteria"), h3:has-text("Courses"), [class*="Student Attendance Status" i] h1, [class*="List of criteria" i] h2';
	}

	async goTodocuments() {
		const contexts = [this.page, ...this.page.frames()];
		const selectors = [
			this.attendanceRecord,
			'#ctl00_treeMenu12 span.file[menuurl*="Ogr0123"]',
			...this.documentsNavLink,
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
		await this.navigate("/Ogrenci/Ogr0123/Default.aspx?lang=en-US");
	}
	/**
	 * Selects a semester from the semester dropdown (1-7).
	 * @param {number} semesterIndex - The semester index (1 to 7)
	 */
	async selectSemester(semesterIndex) {
		if (semesterIndex < 1 || semesterIndex > 7) {
			throw new Error("Semester index must be between 1 and 7");
		}

		if (await this.isVisible(this.semesterDropdownArrow)) {
			await this.click(this.semesterDropdownArrow);
			await this.page.waitForTimeout(500);
		} else if (await this.isVisible(this.semesterDropdown)) {
			await this.click(this.semesterDropdown);
			await this.page.waitForTimeout(500);
		}

		// Select the semester option by index
		const semesterOption = this.page.locator(
			`#ccYilDonem__cmbDonem_DropDown > div > ul > li:nth-child(${semesterIndex})`,
		);
		if (await semesterOption.count()) {
			await semesterOption.first().click({ timeout: 5000 });
			await this.waitForLoadState();
		}
	}

	// Convenience methods for backward compatibility (optional - can be removed if not needed)
	async selectFirstSemester() {
		return this.selectSemester(1);
	}
	async selectFallSemester() {
		return this.selectSemester(2);
	}
	async selectSpringSemester() {
		return this.selectSemester(3);
	}
	async selectSession1Semester() {
		return this.selectSemester(4);
	}
	async selectSession2Semester() {
		return this.selectSemester(5);
	}
	async selectSession3Semester() {
		return this.selectSemester(6);
	}
	async selectSession4Semester() {
		return this.selectSemester(7);
	}

	/**
	 * Selects a year from the year dropdown (1-25).
	 * @param {number} yearIndex - The year index (1 to 25, where 1 is the first year option)
	 */
	async selectYear(yearIndex) {
		if (yearIndex < 1 || yearIndex > 25) {
			throw new Error("Year index must be between 1 and 25");
		}

		if (await this.isVisible(this.yearDropdownArrow)) {
			await this.click(this.yearDropdownArrow);
			await this.page.waitForTimeout(500);
		} else if (await this.isVisible(this.yearDropdown)) {
			await this.click(this.yearDropdown);
			await this.page.waitForTimeout(500);
		}

		// Select the year by index
		const yearOption = this.page.locator(
			`${this.yearOptionBase}(${yearIndex})`,
		);
		if (await yearOption.count()) {
			await yearOption.first().click({ timeout: 5000 });
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

	async addtofavorite() {
		await this.click(this.addtofavoritebutton);
		await this.waitForLoadState();
	}

	async isdocumentsListVisible() {
		return (
			(await this.page.locator(this.attendanceRows).count()) > 0 ||
			(await this.isVisible(this.documentsTable)) ||
			(await this.isVisible(this.pageHeading))
		);
	}

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
