const { test, expect } = require('@playwright/test');
const HomePage = require('../pages/HomePage');
const LoginPage = require('../pages/LoginPage');
const CoursesPage = require('../pages/CoursesPage');
const GradesPage = require('../pages/GradesPage');
const StudentSertificateApplicationPage = require('../pages/StudentSertificateApplicationPage');
const AttendanceRecordPage = require('../pages/AttendanceRecord');
const ELSPage = require('../pages/ELS_Reports');
const ContractPage = require('../pages/ContractPage');

test.describe('Post-login Navigation - IUS SIS', () => {
  // Set timeout to 5 minutes (300000ms) per test to allow all combinations to complete
  test.setTimeout(300000);
  const username = process.env.IUS_USERNAME;
  const password = process.env.IUS_PASSWORD;

  test.beforeAll(() => {
    test.skip(!username || !password, 'Provide IUS_USERNAME and IUS_PASSWORD in environment to run these tests.');
  });

  /**
   * Helper function to perform login and verify success
   * @param {Page} page - Playwright page object
   * @returns {Promise<void>}
   */
  async function performLogin(page) {
    const loginPage = new LoginPage(page);
    const homePage = new HomePage(page);
    
    await loginPage.goToLogin();
    await loginPage.login(username, password);
    await page.waitForURL(/dashboard\.aspx|\/Dashboard/i, { timeout: 20000 }).catch(() => {});
    await page.waitForTimeout(2000);
    expect(await homePage.isLoggedIn()).toBeTruthy();
  }

  async function clickTreeAndCapture(page, selectors, directUrl) {
    const context = page.context();
    const searchContexts = [page, ...page.frames()];

    for (const ctx of searchContexts) {
      for (const sel of selectors) {
        const loc = ctx.locator(sel);
        if (await loc.count()) {
          const [popup] = await Promise.all([
            context.waitForEvent('page').catch(() => null),
            loc.first().click({ timeout: 15000 })
          ]);
          if (popup) {
            await popup.waitForLoadState('domcontentloaded');
            return popup;
          }
          await page.waitForLoadState('networkidle');
          return page;
        }
      }
    }

    if (directUrl) {
      await page.goto(directUrl, { waitUntil: 'networkidle' });
      return page;
    }
    throw new Error('Navigation target not found and no direct URL provided');
  }


  

  /**
   * Helper function to test attendance records for a range of years and all semesters.
   * This reduces code duplication across parallel batch tests.
   */
  async function testAttendanceRecordsForYearRange(page, startYear, endYear, batchName) {
    // Login
    await performLogin(page);

    // Navigate to Attendance Record (capture popup if it opens like sis portal)
    const selectors = [
      '#ctl00_treeMenu12 > li:nth-child(6) span.file',
      '#ctl00_treeMenu12 span.file:has-text("Attendance Record")',
      '#ctl00_treeMenu12 span.file[menuurl*="Ogr0123"]'
    ];
    const attendanceRecordPageHandle = await clickTreeAndCapture(
      page,
      selectors,
      '/Ogrenci/Ogr0123/Default.aspx?lang=en-US'
    );

    const attendancePage = new AttendanceRecordPage(attendanceRecordPageHandle);
    
    // Define all semesters to test (using index-based selection)
    const semesters = [
      { name: 'first', index: 1 },
      { name: 'fall', index: 2 },
      { name: 'spring', index: 3 },
      { name: 'session1', index: 4 },
      { name: 'session2', index: 5 },
      { name: 'session3', index: 6 },
      { name: 'session4', index: 7 },
    ];

    // Test all combinations: years (startYear-endYear) × semesters (7)
    for (let yearIndex = startYear; yearIndex <= endYear; yearIndex++) {
      for (const semester of semesters) {
        // Flow: Select Year -> Select Semester -> Click List
        await attendancePage.selectYear(yearIndex);
        await attendancePage.waitForLoadState();
        
        await attendancePage.selectSemester(semester.index);
        await attendancePage.waitForLoadState();
        
        await attendancePage.clickButtonListele();
        
        await attendanceRecordPageHandle
          .waitForSelector(
            'table tr, .grid tr, .data-table tr, h1:has-text("Student Attendance Status"), h2:has-text("List of criteria")',
            { timeout: 12000, state: 'visible' }
          )
          .catch(() => {});
        
        // Validate attendance record list presence
        const hasAttendanceRecord = await attendancePage.isdocumentsListVisible();
        expect(hasAttendanceRecord).toBeTruthy();
        
        // Capture sample rows for logging
        const attendanceRecord = await attendancePage.getSampleAttendanceRecord();
        console.log(`[Batch ${batchName}] Sample attendance record (Year ${yearIndex}, ${semester.name}):`, attendanceRecord);
        
        // Capture screenshot evidence with batch, year and semester in filename
        await attendanceRecordPageHandle.screenshot({
          path: `test-results/screenshots/attendance-record-batch${batchName}-year${yearIndex}-${semester.name}.png`,
          fullPage: true,
        });
      }
    }
  }
  /*
  test('TC-020: Navigate to Courses after login and capture evidence', async ({ page }) => {
    const homePage = new HomePage(page);
    const loginPage = new LoginPage(page);
    const coursesPage = new CoursesPage(page);

    // Login
    await loginPage.goToLogin();
    await loginPage.login(username, password);
    await page.waitForURL(/dashboard\.aspx|\/Dashboard/i, { timeout: 20000 }).catch(() => {});
    await page.waitForTimeout(2000);
    expect(await homePage.isLoggedIn()).toBeTruthy();

    // Navigate to Courses (capture popup if it opens)
    const selectors = [
      '#ctl00_treeMenu12 > li:nth-child(1) span.file',
      '#ctl00_treeMenu12 span.file:has-text("Course Schedule")',
      '#ctl00_treeMenu12 span.file[menuurl*="Ogr0205"]'
    ];
    const coursePageHandle = await clickTreeAndCapture(
      page,
      selectors,
      '/Ogrenci/Ogr0205/Default.aspx?lang=en-US'
    );

    // Validate course list presence
    const hasCourses = await new CoursesPage(coursePageHandle).isCourseListVisible();
    expect(hasCourses).toBeTruthy();

    // Capture sample rows for logging
    const courses = await new CoursesPage(coursePageHandle).getSampleCourses();
    console.log('Sample courses:', courses);

    // Capture screenshot evidence
    await coursePageHandle.screenshot({ path: 'test-results/screenshots/courses.png', fullPage: true });
  });

  /*test('TC-021: Navigate to Grades after login and capture evidence', async ({ page }) => {
    const homePage = new HomePage(page);
    const loginPage = new LoginPage(page);
    const gradesPage = new GradesPage(page);

    // Login
    await loginPage.goToLogin();
    await loginPage.login(username, password);
    await page.waitForURL(/dashboard\.aspx|\/Dashboard/i, { timeout: 20000 }).catch(() => {});
    await page.waitForTimeout(2000);
    expect(await homePage.isLoggedIn()).toBeTruthy();

    // Navigate to Grades (capture popup if it opens)
    const selectors = [
      '#ctl00_treeMenu12 > li:nth-child(2) span.file',
      '#ctl00_treeMenu12 > li:nth-child(3) span.file',
      '#ctl00_treeMenu12 span.file:has-text("Grade Details")',
      '#ctl00_treeMenu12 span.file:has-text("Academic Record (Transcript)")',
      '#ctl00_treeMenu12 span.file[menuurl*="Ogr0201"]',
      '#ctl00_treeMenu12 span.file[menuurl*="Ogr0204"]'
    ];
    const gradesPageHandle = await clickTreeAndCapture(
      page,
      selectors,
      '/Ogrenci/Ogr0201/Default.aspx?lang=en-US'
    );

    // Validate grades list presence
    const hasGrades = await new GradesPage(gradesPageHandle).isGradesListVisible();
    expect(hasGrades).toBeTruthy();

    // Capture sample rows for logging
    const grades = await new GradesPage(gradesPageHandle).getSampleGrades();
    console.log('Sample grades:', grades);

    // Capture screenshot evidence
    await gradesPageHandle.screenshot({ path: 'test-results/screenshots/grades.png', fullPage: true });
  });
  test('TC-022: Navigate to Student Certificate Application after login and capture evidence', async ({ page }) => {
    const homePage = new HomePage(page);
    const loginPage = new LoginPage(page);
    const studentCertificateApplicationPage = new StudentSertificateApplicationPage(page);

    // Login
    await loginPage.goToLogin();
    await loginPage.login(username, password);
    await page.waitForURL(/dashboard\.aspx|\/Dashboard/i, { timeout: 20000 }).catch(() => {});
    await page.waitForTimeout(2000);
    expect(await homePage.isLoggedIn()).toBeTruthy();

    // Navigate to Student Certificate Application (capture popup if it opens)
    const selectors = [
      '#ctl00_treeMenu12 > li:nth-child(8) span.file',
      '#ctl00_treeMenu12 span.file:has-text("Student Certificate Application")',
      '#ctl00_treeMenu12 span.file[menuurl*="Ogr0170"]'
    ];
    const scaPageHandle = await clickTreeAndCapture(
      page,
      selectors,
      '/Ogrenci/Ogr0170/Default.aspx?lang=en-US'
    );

    // Validate student certificate application list presence
    const hasStudentCertificateApplication = await new StudentSertificateApplicationPage(scaPageHandle).isdocumentsListVisible();
    expect(hasStudentCertificateApplication).toBeTruthy();

    // Capture sample rows for logging
    const studentCertificateApplication = await new StudentSertificateApplicationPage(scaPageHandle).getSampledocuments();
    console.log('Sample student certificate application:', studentCertificateApplication);

    // Capture screenshot evidence
    await scaPageHandle.screenshot({ path: 'test-results/screenshots/student-certificate-application.png', fullPage: true });
  });
  
  // Parallel batch tests for Attendance Records
  // Split into 5 batches: each tests 5 years × 7 semesters = 35 combinations
  // All batches run in parallel for faster execution
  */
  /**

*/

  async function testPaymentDetails(page, batchName) {
    const homePage = new HomePage(page);
    const loginPage = new LoginPage(page);

    await loginPage.goToLogin();
    await loginPage.login(username, password);
    await page.waitForURL(/dashboard\.aspx|\/Dashboard/i, { timeout: 20000 }).catch(() => {});
    await page.waitForTimeout(2000);
    expect(await homePage.isLoggedIn()).toBeTruthy();

    const selectors = [
      '#ctl00_treeMenu12 > li:nth-child(12) span.file',
      '#ctl00_treeMenu12 span.file:has-text("Contract and Payment Records")',
      '#ctl00_treeMenu12 span.file[menuurl*="Ogr0137"]'
    ];
    const contractPageHandle = await clickTreeAndCapture(
      page,
      selectors,
      '/Ogrenci/Ogr0137/Default.aspx?lang=en-US'
    );

    const contractPage = new ContractPage(contractPageHandle);
    
    await contractPage.waitForElement(contractPage.table);
    const rows = await contractPage.getAllTableRows();
    const totalRows = rows.length;
    
    console.log(`[Batch ${batchName}] Found ${totalRows} rows to test`);
    
    for (let rowIndex = 1; rowIndex <= totalRows; rowIndex++) {
        if (rowIndex > 1) {
            await contractPageHandle.goto('/Ogrenci/Ogr0137/Default.aspx?lang=en-US', { waitUntil: 'networkidle' });
            await contractPage.waitForElement(contractPage.table);
            await contractPage.waitForLoadState();
        }
        
        await contractPage.selectTableRow(rowIndex);
        await contractPage.waitForLoadState();
        
        await contractPage.clickButtonReport();
        await contractPage.waitForLoadState();
        
        await contractPageHandle
          .waitForSelector(
            `${contractPage.tableResults}, ${contractPage.pageHeading}`,
            { timeout: 20000, state: 'visible' }
          )
          .catch(() => {});
        
        await contractPageHandle.waitForTimeout(2000);
        
        const hasContractRecord = await contractPage.isdocumentsListVisible();
        expect(hasContractRecord).toBeTruthy();
        
        console.log(`[Batch ${batchName}] Row ${rowIndex}/${totalRows} tested successfully`);
        
        await contractPageHandle.screenshot({
          path: `test-results/screenshots/contract-record-batch${batchName}-row${rowIndex}.png`,
          fullPage: true,
        });
    }
    
    console.log(`[Batch ${batchName}] All ${totalRows} rows tested successfully`);
  }

  /*
  test('TC-023-Batch1: Attendance Record - Years 1-5 with all semesters', async ({ page }) => {
    test.setTimeout(300000); // 5 minutes per batch (35 combinations)
    await testAttendanceRecordsForYearRange(page, 1, 5, '1');
  });

  test('TC-023-Batch2: Attendance Record - Years 6-10 with all semesters', async ({ page }) => {
    test.setTimeout(300000); 
    await testAttendanceRecordsForYearRange(page, 6, 10, '2');
  });

  test('TC-023-Batch3: Attendance Record - Years 11-15 with all semesters', async ({ page }) => {
    test.setTimeout(300000); 
    await testAttendanceRecordsForYearRange(page, 11, 15, '3');
  });

  test('TC-023-Batch4: Attendance Record - Years 16-20 with all semesters', async ({ page }) => {
    test.setTimeout(300000); 
    await testAttendanceRecordsForYearRange(page, 16, 20, '4');
  });

  test('TC-023-Batch5: Attendance Record - Years 21-25 with all semesters', async ({ page }) => {
    test.setTimeout(300000); 
    await testAttendanceRecordsForYearRange(page, 21, 25, '5');
  });
  */
  test('TC-025: Navigate to Contract and Payment Details after login and capture evidence', async ({ page }) => {
    await testPaymentDetails(page, '1');
  });
/*
  test('TC-024: Navigate to ELS Report after login and capture evidence', async ({ page }) => {
    await performLogin(page);

    const selectors = [
      '#ctl00_treeMenu12 > li:nth-child(9) span.file',
      '#ctl00_treeMenu12 span.file:has-text("ELS Report")',
      '#ctl00_treeMenu12 span.file[menuurl*="Ogr0320"]',
      '#ctl00_treeMenu12 span.file[menuurl*="ogr0320"]'
    ];
    const elsPageHandle = await clickTreeAndCapture(
      page,
      selectors,
      '/ogrenci/ogr0320/default.aspx?lang=en-US'
    );

    const elsPage = new ELSPage(elsPageHandle);
    
    await elsPage.clickELSActionButton();
    await elsPageHandle.waitForTimeout(2000); // Wait for report to load

    const hasELS = await elsPage.isELSListVisible();
    expect(hasELS).toBeTruthy();

    const elsData = await elsPage.getSampleELS();
    console.log('Sample ELS report:', elsData);

    await elsPageHandle.screenshot({ path: 'test-results/screenshots/els-report.png', fullPage: true });
  });*/
  
});