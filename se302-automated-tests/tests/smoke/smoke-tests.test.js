const { test, expect } = require('@playwright/test');
const HomePage = require('../pages/HomePage');
const LoginPage = require('../pages/LoginPage');
const ContractPage = require('../pages/ContractPage');
const CoursePage = require('../pages/CoursesPage');
const GradesPage = require('../pages/GradesPage');
const ElsPage = require('../pages/ELS_Reports');

/**
 * Smoke Test Suite - IUS SIS
 * 
 * Critical path tests to verify that key pages load and essential elements are accessible.
 * These tests ensure the basic functionality of the IUS Student Information System.
 * 
 * Test Cases:
 * - TC-S001: Login Page Loads and Form is Accessible
 * - TC-S002: Contract Page Loads and Key Elements are Accessible
 * - TC-S003: Course Page Loads and Key Elements are Accessible
 * - TC-S004: Grade Page Loads and Key Elements are Accessible
 * - TC-S005: ELS Reports Page Loads and Key Elements are Accessible
 */

test.describe('Smoke Tests - IUS SIS', () => {
  const username = String(process.env.IUS_USERNAME);
  const password = String(process.env.IUS_PASSWORD);

  test('TC-S001: Login Page Loads and Form is Accessible', async ({ page }) => {
    const loginPage = new LoginPage(page);
    
    await loginPage.goToLogin();
    
    const pageTitle = await loginPage.getTitle();
    expect(pageTitle).toBeTruthy();
    
    expect(await loginPage.isUsernameFieldVisible()).toBeTruthy();
    expect(await loginPage.isPasswordFieldVisible()).toBeTruthy();
    expect(await loginPage.isLoginButtonVisible()).toBeTruthy();
  });

  test('TC-S002: Contract Page Loads and Key Elements are Accessible', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const contractPage = new ContractPage(page);

    await loginPage.goToLogin();
    await loginPage.login(username, password);

    // Ensure login was successful (avoids the "Session Expired" trap)
    await page.waitForTimeout(2000);
    expect(await loginPage.isLoggedIn()).toBeTruthy();

    await page.goto('Ogrenci/Ogr0137/Default.aspx?lang=en-US');

    const pageTitle = await contractPage.getTitle();
    expect(pageTitle).toBeTruthy();
    expect(await contractPage.isContractListVisible()).toBeTruthy();
  });

  test('TC-S003: Course Page Loads and Key Elements are Accessible', async ({ page }) => {
    const homePage = new HomePage(page);
    const loginPage = new LoginPage(page);
    const coursePage = new CoursePage(page);
    
    test.setTimeout(300000);

    await loginPage.goToLogin();
    await loginPage.login(username, password);
    await homePage.goToCourses();

    const pageTitle = await coursePage.getTitle();
    expect(pageTitle).toBeTruthy();
    expect(await coursePage.isCourseListVisible()).toBeTruthy();
  });

  test('TC-S004: Grade Page Loads and Key Elements are Accessible', async ({ page }) => {
    const homePage = new HomePage(page);
    const loginPage = new LoginPage(page);
    const gradePage = new GradesPage(page);
    
    test.setTimeout(300000);

    await loginPage.goToLogin();
    await loginPage.login(username, password);
    await homePage.goToGrades();

    const pageTitle = await gradePage.getTitle();
    expect(pageTitle).toBeTruthy();
    expect(await gradePage.isGradesListVisible()).toBeTruthy();
  });

  test('TC-S005: ELS Reports Page Loads and Key Elements are Accessible', async ({ page }) => {
    const homePage = new HomePage(page);
    const loginPage = new LoginPage(page);
    const elsPage = new ElsPage(page);
    
    test.setTimeout(300000);

    await loginPage.goToLogin();
    await loginPage.login(username, password);
    await homePage.goToEls();

    const pageTitle = await elsPage.getTitle();
    expect(pageTitle).toBeTruthy();
    expect(await elsPage.isELSListVisible()).toBeTruthy();
  });
});

