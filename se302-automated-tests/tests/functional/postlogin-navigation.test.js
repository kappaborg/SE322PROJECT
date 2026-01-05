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



  

  /**
   * Helper function to test attendance records for a range of years and all semesters.
   * This reduces code duplication across parallel batch tests.
   */
  async function testAttendanceRecordsForYearRange(page, startYear, endYear, batchName) {
    await performLogin(page);

    const attendancePage = new AttendanceRecordPage(page);
    const selectors = [
      attendancePage.attendanceRecord,
      ...attendancePage.documentsNavLink,
      '#ctl00_treeMenu12 span.file[menuurl*="Ogr0123"]'
    ];
    const attendanceRecordPageHandle = await attendancePage.clickTreeAndCapture(
      selectors,
      '/Ogrenci/Ogr0123/Default.aspx?lang=en-US'
    );

    const attendancePageInstance = new AttendanceRecordPage(attendanceRecordPageHandle);
    
    const semesters = [
      { name: 'first', index: 1 },
      { name: 'fall', index: 2 },
      { name: 'spring', index: 3 },
      { name: 'session1', index: 4 },
      { name: 'session2', index: 5 },
      { name: 'session3', index: 6 },
      { name: 'session4', index: 7 },
    ];

    for (let yearIndex = startYear; yearIndex <= endYear; yearIndex++) {
      for (const semester of semesters) {
        await attendancePageInstance.selectYear(yearIndex);
        await attendancePageInstance.waitForLoadState();
        
        await attendancePageInstance.selectSemester(semester.index);
        await attendancePageInstance.waitForLoadState();
        
        await attendancePageInstance.clickButtonListele();
        
        await attendanceRecordPageHandle
          .waitForSelector(
            'table tr, .grid tr, .data-table tr, h1:has-text("Student Attendance Status"), h2:has-text("List of criteria")',
            { timeout: 12000, state: 'visible' }
          )
          .catch(() => {});
        
        const hasAttendanceRecord = await attendancePageInstance.isdocumentsListVisible();
        expect(hasAttendanceRecord).toBeTruthy();
        
        const attendanceRecord = await attendancePageInstance.getSampleAttendanceRecord();
        console.log(`[Batch ${batchName}] Sample attendance record (Year ${yearIndex}, ${semester.name}):`, attendanceRecord);
        
        // Save first attendance record with documentation name, others with detailed names
        const screenshotName = (batchName === '1' && yearIndex === 1 && semester.name === 'Fall') 
          ? 'test-results/screenshots/07-tc011-attendance-record.png'
          : `test-results/screenshots/attendance-record-batch${batchName}-year${yearIndex}-${semester.name}.png`;
        await attendanceRecordPageHandle.screenshot({
          path: screenshotName,
          fullPage: true,
        });
      }
    }
  }
  test('TC-008: Navigate to Courses after login and capture evidence', async ({ page }) => {
    await performLogin(page);

    const coursesPage = new CoursesPage(page);
    const selectors = [
      coursesPage.courseSchedule,
      ...coursesPage.coursesNavLink,
      '#ctl00_treeMenu12 span.file[menuurl*="Ogr0205"]'
    ];
    const coursePageHandle = await coursesPage.clickTreeAndCapture(
      selectors,
      '/Ogrenci/Ogr0205/Default.aspx?lang=en-US'
    );

    const coursePage = new CoursesPage(coursePageHandle);
    const hasCourses = await coursePage.isCourseListVisible();
    expect(hasCourses).toBeTruthy();

    const courses = await coursePage.getSampleCourses();
    console.log('Sample courses:', courses);

    await coursePageHandle.screenshot({ path: 'test-results/screenshots/04-tc008-courses-page.png', fullPage: true });
  });

  test('TC-009: Navigate to Grades after login and capture evidence', async ({ page }) => {
    await performLogin(page);

    const gradesPage = new GradesPage(page);
    const selectors = [
      gradesPage.gradeDetails,
      gradesPage.academicRecord,
      ...gradesPage.gradesNavLink,
      '#ctl00_treeMenu12 span.file[menuurl*="Ogr0201"]',
      '#ctl00_treeMenu12 span.file[menuurl*="Ogr0204"]'
    ];
    const gradesPageHandle = await gradesPage.clickTreeAndCapture(
      selectors,
      '/Ogrenci/Ogr0201/Default.aspx?lang=en-US'
    );

    const gradePage = new GradesPage(gradesPageHandle);
    const hasGrades = await gradePage.isGradesListVisible();
    expect(hasGrades).toBeTruthy();

    const grades = await gradePage.getSampleGrades();
    console.log('Sample grades:', grades);

    await gradesPageHandle.screenshot({ path: 'test-results/screenshots/05-tc009-grades-page.png', fullPage: true });
  });

  test('TC-010: Navigate to Student Certificate Application after login and capture evidence', async ({ page }) => {
    await performLogin(page);

    const studentCertificateApplicationPage = new StudentSertificateApplicationPage(page);
    const selectors = [
      studentCertificateApplicationPage.certificateDetails,
      ...studentCertificateApplicationPage.documentsNavLink,
      '#ctl00_treeMenu12 span.file[menuurl*="Ogr0170"]'
    ];
    const scaPageHandle = await studentCertificateApplicationPage.clickTreeAndCapture(
      selectors,
      '/Ogrenci/Ogr0170/Default.aspx?lang=en-US'
    );

    const scaPage = new StudentSertificateApplicationPage(scaPageHandle);
    const hasStudentCertificateApplication = await scaPage.isdocumentsListVisible();
    expect(hasStudentCertificateApplication).toBeTruthy();

    const studentCertificateApplication = await scaPage.getSampledocuments();
    console.log('Sample student certificate application:', studentCertificateApplication);

    await scaPageHandle.screenshot({ path: 'test-results/screenshots/06-tc010-student-certificate.png', fullPage: true });
  });

  async function testPaymentDetails(page, batchName) {
    const homePage = new HomePage(page);
    const loginPage = new LoginPage(page);

    await loginPage.goToLogin();
    await loginPage.login(username, password);
    await page.waitForURL(/dashboard\.aspx|\/Dashboard/i, { timeout: 20000 }).catch(() => {});
    await page.waitForTimeout(2000);
    expect(await homePage.isLoggedIn()).toBeTruthy();

    const contractPage = new ContractPage(page);
    const selectors = [
      contractPage.contractsLink,
      ...contractPage.contractsNavLink,
      '#ctl00_treeMenu12 span.file[menuurl*="Ogr0137"]'
    ];
    const contractPageHandle = await contractPage.clickTreeAndCapture(
      selectors,
      '/Ogrenci/Ogr0137/Default.aspx?lang=en-US'
    );

    const contractPageInstance = new ContractPage(contractPageHandle);
    
    await contractPageInstance.waitForElement(contractPageInstance.table);
    const rows = await contractPageInstance.getAllTableRows();
    const totalRows = rows.length;
    
    console.log(`[Batch ${batchName}] Found ${totalRows} rows to test`);
    
    for (let rowIndex = 1; rowIndex <= totalRows; rowIndex++) {
        if (rowIndex > 1) {
            await contractPageHandle.goto('/Ogrenci/Ogr0137/Default.aspx?lang=en-US', { waitUntil: 'networkidle' });
            await contractPageInstance.waitForElement(contractPageInstance.table);
            await contractPageInstance.waitForLoadState();
        }
        
        await contractPageInstance.selectTableRow(rowIndex);
        await contractPageInstance.waitForLoadState();
        
        await contractPageInstance.clickButtonReport();
        await contractPageInstance.waitForLoadState();
        
        await contractPageHandle
          .waitForSelector(
            `${contractPageInstance.tableResults}, ${contractPageInstance.pageHeading}`,
            { timeout: 20000, state: 'visible' }
          )
          .catch(() => {});
        
        await contractPageHandle.waitForTimeout(2000);
        
        const hasContractRecord = await contractPageInstance.isdocumentsListVisible();
        expect(hasContractRecord).toBeTruthy();
        
        console.log(`[Batch ${batchName}] Row ${rowIndex}/${totalRows} tested successfully`);
        
        // Save first contract with documentation name, others with detailed names
        const contractScreenshotName = (batchName === '1' && rowIndex === 1)
          ? 'test-results/screenshots/09-tc017-contract-payment.png'
          : `test-results/screenshots/contract-record-batch${batchName}-row${rowIndex}.png`;
        await contractPageHandle.screenshot({
          path: contractScreenshotName,
          fullPage: true,
        });
    }
    
    console.log(`[Batch ${batchName}] All ${totalRows} rows tested successfully`);
  }

  test('TC-011: Attendance Record - Years 1-5 with all semesters', async ({ page }) => {
    test.setTimeout(300000);
    await testAttendanceRecordsForYearRange(page, 1, 5, '1');
  });

  test('TC-012: Attendance Record - Years 6-10 with all semesters', async ({ page }) => {
    test.setTimeout(300000); 
    await testAttendanceRecordsForYearRange(page, 6, 10, '2');
  });

  test('TC-013: Attendance Record - Years 11-15 with all semesters', async ({ page }) => {
    test.setTimeout(300000); 
    await testAttendanceRecordsForYearRange(page, 11, 15, '3');
  });

  test('TC-014: Attendance Record - Years 16-20 with all semesters', async ({ page }) => {
    test.setTimeout(300000); 
    await testAttendanceRecordsForYearRange(page, 16, 20, '4');
  });

  test('TC-015: Attendance Record - Years 21-25 with all semesters', async ({ page }) => {
    test.setTimeout(300000); 
    await testAttendanceRecordsForYearRange(page, 21, 25, '5');
  });
  test('TC-016: Navigate to ELS Report after login and capture evidence', async ({ page }) => {
    await performLogin(page);

    const elsPage = new ELSPage(page);
    const selectors = [
      elsPage.elsLink,
      ...elsPage.elsNavLink,
      '#ctl00_treeMenu12 span.file[menuurl*="Ogr0320"]',
      '#ctl00_treeMenu12 span.file[menuurl*="ogr0320"]'
    ];
    const elsPageHandle = await elsPage.clickTreeAndCapture(
      selectors,
      '/ogrenci/ogr0320/default.aspx?lang=en-US'
    );

    const elsPageInstance = new ELSPage(elsPageHandle);
    
    await elsPageInstance.clickELSActionButton();
    await elsPageHandle.waitForTimeout(2000);

    const hasELS = await elsPageInstance.isELSListVisible();
    expect(hasELS).toBeTruthy();

    const elsData = await elsPageInstance.getSampleELS();
    console.log('Sample ELS report:', elsData);

    await elsPageHandle.screenshot({ path: 'test-results/screenshots/08-tc016-els-report.png', fullPage: true });
  });

  test('TC-017: Navigate to Contract and Payment Details after login and capture evidence', async ({ page }) => {
    await testPaymentDetails(page, '1');
  });
  
});