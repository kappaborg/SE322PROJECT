const { test, expect } = require('@playwright/test');
const HomePage = require('../pages/HomePage');
const LoginPage = require('../pages/LoginPage');
const CoursesPage = require('../pages/CoursesPage');
const GradesPage = require('../pages/GradesPage');
const StudentSertificateApplicationPage = require('../pages/StudentSertificateApplicationPage');
const AttendanceRecordPage = require('../pages/AttendanceRecod');
/**
 * Post-login navigation tests for IUS SIS
 * - Navigates to Courses and Grades after successful login
 * - Captures screenshots as evidence
 *
 * These tests require valid credentials via environment:
 *   IUS_USERNAME, IUS_PASSWORD
 */

test.describe('Post-login Navigation - IUS SIS', () => {
  test.setTimeout(60000);
  const username = process.env.IUS_USERNAME;
  const password = process.env.IUS_PASSWORD;

  test.beforeAll(() => {
    test.skip(!username || !password, 'Provide IUS_USERNAME and IUS_PASSWORD in environment to run these tests.');
  });

  /**
   * Clicks a tree item (searching page and frames), waits for popup if it opens, otherwise continues on current page.
   * Falls back to direct navigation if no element is found.
   */
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

  test('TC-021: Navigate to Grades after login and capture evidence', async ({ page }) => {
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
  test('TC-023: Navigate to Attendance Record, selecting semester and applying filters after login and capture evidence', async ({ page }) => {
    const homePage = new HomePage(page);
    const loginPage = new LoginPage(page);
    const attendanceRecordPage = new AttendanceRecordPage(page);

    // Login
    await loginPage.goToLogin();
    await loginPage.login(username, password);
    await page.waitForURL(/dashboard\.aspx|\/Dashboard/i, { timeout: 20000 }).catch(() => {});
    await page.waitForTimeout(2000);
    expect(await homePage.isLoggedIn()).toBeTruthy();

    // Navigate to Attendance Record (capture popup if it opens)
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

    // Select Fall semester if dropdown exists, then list/apply
    const attendancePage = new AttendanceRecordPage(attendanceRecordPageHandle);
    await attendancePage.selectFallSemester();
    await attendancePage.clickButtonListele();
    // Allow the listing to render before validation/screenshot
    await attendanceRecordPageHandle.waitForTimeout(2000);

    // Wait for table/list to render and validate presence
    await attendanceRecordPageHandle.waitForSelector('table tr, .grid tr, .data-table tr, h1:has-text("Student Attendance Status"), h2:has-text("List of criteria")', { timeout: 10000 }).catch(() => {});
    const hasAttendanceRecord = await attendancePage.isdocumentsListVisible();
    expect(hasAttendanceRecord).toBeTruthy();

    // Capture sample rows for logging
    const attendanceRecord = await attendancePage.getSampleAttendanceRecord();
    console.log('Sample attendance record:', attendanceRecord);

    // Capture screenshot evidence
    await attendanceRecordPageHandle.screenshot({ path: 'test-results/screenshots/attendance-record.png', fullPage: true });
  });
});

