# SE302 - Software Testing and Maintenance
## IUS Student Information System Testing with Playwright

[![Playwright](https://img.shields.io/badge/Playwright-1.40.0-blue.svg)](https://playwright.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

## Table of Contents

- [Project Overview](#project-overview)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [Test Cases](#test-cases)
- [Page Object Model](#page-object-model)
- [WebTest Interface](#webtest-interface)
- [Test Reports](#test-reports)
- [Contributors](#contributors)
- [Academic Information](#academic-information)
- [License](#license)

---

## Project Overview

This project is an automated testing framework for the International University of Sarajevo (IUS) Student Information System (SIS). We built it using Playwright and implemented the Page Object Model (POM) design pattern to keep the code maintainable and scalable.

### What We Accomplished

We created 22 comprehensive test cases, which exceeds the minimum requirement of 15. The suite includes 17 functional tests that cover critical user workflows and 5 smoke tests for quick system validation. We also developed 11 Page Object classes following the POM pattern and built a custom WebTest Interface for real-time test execution monitoring. The framework supports multi-browser testing (Chromium and Firefox) and can run tests in parallel with configurable workers.

### Application Under Test

We're testing the IUS Student Information System (SIS), available at https://sis.ius.edu.ba/. This is the web portal that IUS students use to access their academic records, course information, grades, contracts, attendance records, and various administrative services.

---

## Features

### Testing Capabilities

The framework tests various aspects of the IUS SIS:

**Login Functionality**
- Valid and invalid credential handling
- Empty field validation
- Password recovery workflows
- Session management

**Navigation and Data Access**
- Course schedule viewing
- Grade records retrieval
- Student certificate applications
- Attendance records across 25 years and 6 semesters
- ELS (English Language School) reports
- Contract and payment details

**Smoke Testing**
- Critical path validation
- Key page accessibility checks
- Essential element verification

### Framework Features

The framework includes several useful features:
- Page Object Model implementation for better code organization
- Automatic screenshot capture when tests fail
- Multiple report formats: HTML, JUnit XML, and JSON
- Parallel test execution with configurable workers
- Multi-browser support (Chromium and Firefox)
- Custom WebTest Interface with real-time monitoring
- Comprehensive error handling and retry mechanisms

---

## Technologies Used

### Core Technologies

- **Playwright** (v1.40.0) - Our main testing framework
- **Node.js** (v18+) - JavaScript runtime
- **JavaScript** - Programming language

### Design Patterns

- **Page Object Model (POM)** - We use this to abstract UI elements
- **Base Page Pattern** - Inheritance for shared functionality

### Additional Tools

For the WebTest Interface, we used:
- **React.js** - Frontend framework
- **Express.js** - Backend server
- **Socket.IO** - Real-time communication
- **TailwindCSS** - Styling
- **Vite** - Build tool

---

## Project Structure

```
SE322PROJECT/
│
├── se302-automated-tests/          # Main test automation project
│   ├── tests/
│   │   ├── functional/            # Functional test cases
│   │   │   ├── login.test.js      # Login functionality tests (7 tests)
│   │   │   └── postlogin-navigation.test.js  # Navigation tests (10 tests)
│   │   ├── smoke/                 # Smoke test cases
│   │   │   └── smoke-tests.test.js  # Smoke tests (5 tests)
│   │   └── pages/                 # Page Object classes
│   │       ├── BasePage.js        # Base page class
│   │       ├── LoginPage.js       # Login page object
│   │       ├── HomePage.js        # Home page object
│   │       ├── CoursesPage.js     # Courses page object
│   │       ├── GradesPage.js      # Grades page object
│   │       ├── ContractPage.js    # Contract page object
│   │       ├── ELS_Reports.js     # ELS reports page object
│   │       ├── AttendanceRecord.js # Attendance page object
│   │       ├── StudentSertificateApplicationPage.js
│   │       ├── LogOut.js
│   │       └── LostPasswordPage.js
│   ├── utils/                     # Utility functions
│   │   ├── helpers.js
│   │   └── testData.js
│   ├── WebTest/                   # Custom web-based test runner
│   │   ├── client/                # React frontend
│   │   ├── server/                # Express backend
│   │   └── start-all.js           # Startup script
│   ├── playwright.config.js      # Playwright configuration
│   └── package.json               # Dependencies
│
├── screenshots/                   # Test evidence screenshots
│   ├── 01-terminal-test-execution.png
│   ├── 02-terminal-smoke-tests.png
│   ├── 03-html-report-dashboard.png
│   ├── 04-tc008-courses-page.png
│   ├── 05-tc009-grades-page.png
│   ├── 06-tc010-student-certificate.png
│   ├── 07-tc011-attendance-record.png
│   ├── 08-tc016-els-report.png
│   └── 09-tc017-contract-payment.png
│
├── Document.tex                   # LaTeX project documentation
├── SE302_PROJECT 1.pdf            # Compiled project report
└── README.md                      # This file
```

---

## Prerequisites

Before getting started, make sure you have:

- **Node.js** (v18.0.0 or higher)
- **npm** (v9.0.0 or higher) - comes with Node.js
- **Git** - for cloning the repository
- **Valid IUS SIS credentials** - you'll need your username and password for testing

### System Requirements

- **Operating System:** Windows, macOS, or Linux
- **RAM:** At least 4GB (8GB recommended if you want to run tests in parallel)
- **Disk Space:** About 500MB for dependencies and browsers

---

## Installation

### Step 1: Clone the Repository

```bash
git clone https://github.com/kappaborg/SE322PROJECT.git
cd SE322PROJECT/se302-automated-tests
```

### Step 2: Install Dependencies

```bash
npm install
```

This installs the Playwright testing framework and other project dependencies.

### Step 3: Install Playwright Browsers

```bash
npx playwright install
```

This downloads Chromium, Firefox, and WebKit browsers. Each browser is about 300MB, so this might take a few minutes.

**Note for Linux users:** You may need to install system dependencies first:

```bash
npx playwright install-deps
```

### Step 4: Configure Environment Variables

Create a `.env` file in the `se302-automated-tests` directory:

```bash
# .env file
IUS_USERNAME=your_ius_username
IUS_PASSWORD=your_ius_password
```

**Important:** Never commit your `.env` file to version control. The `.gitignore` file already excludes it, but double-check to be safe.

### Step 5: Verify Installation

Check that Playwright is installed correctly:

```bash
npx playwright --version
```

---

## Configuration

### Playwright Configuration

The main configuration file is `playwright.config.js`. Here's what's configured:

- **Test Directory:** `./tests`
- **Timeout:** 30 seconds per test
- **Workers:** 5 parallel workers (you can change this with the `WORKERS` environment variable)
- **Browsers:** Chromium and Firefox
- **Viewport:** 1920x1080
- **Screenshots:** Automatically captured when tests fail
- **Reports:** Generated in HTML, JUnit XML, and JSON formats

### Environment Variables

| Variable | Description | Required |
|---------|-------------|----------|
| `IUS_USERNAME` | Your IUS SIS username | Yes |
| `IUS_PASSWORD` | Your IUS SIS password | Yes |
| `WORKERS` | Number of parallel workers | No (default: 5) |
| `BASE_URL` | Base URL for tests | No (default: https://sis.ius.edu.ba) |

---

## Usage

### Running Tests

#### Run All Tests

```bash
npm test
# or
npx playwright test
```

#### Run Functional Tests Only

```bash
npm run test:functional
# or
npx playwright test tests/functional
```

#### Run Smoke Tests Only

```bash
npm run test:smoke
# or
npx playwright test tests/smoke
```

#### Run Tests in Specific Browser

```bash
# Chromium only
npm run test:chromium

# Firefox only
npm run test:firefox
```

#### Run Tests in UI Mode (Interactive)

This opens an interactive UI where you can see tests running and debug them:

```bash
npm run test:ui
# or
npx playwright test --ui
```

#### Run Tests in Headed Mode (Visible Browser)

This runs tests with the browser visible, which is useful for debugging:

```bash
npm run test:headed
# or
npx playwright test --headed
```

#### Debug Tests

Opens the Playwright debugger:

```bash
npm run test:debug
# or
npx playwright test --debug
```

### Viewing Test Reports

After running tests, you can view the HTML report:

```bash
npm run test:report
# or
npx playwright show-report
```

Reports are saved in:
- **HTML:** `reports/html-report/index.html`
- **JUnit XML:** `reports/junit.xml`
- **JSON:** `reports/test-results.json`

### WebTest Interface

We also built a custom web-based test runner interface. To use it:

```bash
cd WebTest
node start-all.js
```

Then open your browser to:
- **Frontend:** http://localhost:5173
- **Backend:** http://localhost:3001

The interface lets you:
- Monitor test execution in real-time
- Run tests in parallel
- View live console output
- Browse captured screenshots
- Filter and select specific tests

---

## Test Cases

### Test Case Summary

| Test Type | Required | Implemented | Status |
|-----------|----------|-------------|--------|
| Functional Tests | 10 | 17 | Exceeded |
| Smoke Tests | 5 | 5 | Complete |
| **Total** | **15** | **22** | **147% Coverage** |

### Functional Test Cases

#### Login Tests (TC-001 to TC-007)

- **TC-001:** Valid Login (Positive)
- **TC-002:** Invalid Username or Password (Negative)
- **TC-003:** Empty Username Input Field (Negative)
- **TC-004:** Empty Password Input Field (Negative)
- **TC-005:** Lost Password Link (Positive)
- **TC-006:** Generate First Time Password Link (Positive)
- **TC-007:** Logout after Login (Positive)

#### Navigation Tests (TC-008 to TC-017)

- **TC-008:** Navigate to Courses
- **TC-009:** Navigate to Grades
- **TC-010:** Navigate to Student Certificate Application
- **TC-011:** Attendance Record - Years 1-5
- **TC-012:** Attendance Record - Years 6-10
- **TC-013:** Attendance Record - Years 11-15
- **TC-014:** Attendance Record - Years 16-20
- **TC-015:** Attendance Record - Years 21-25
- **TC-016:** Navigate to ELS Report
- **TC-017:** Navigate to Contract and Payment Details

### Smoke Test Cases (TC-S001 to TC-S005)

- **TC-S001:** Login Page Loads and Form is Accessible
- **TC-S002:** Contract Page Loads and Key Elements are Accessible
- **TC-S003:** Course Page Loads and Key Elements are Accessible
- **TC-S004:** Grade Page Loads and Key Elements are Accessible
- **TC-S005:** ELS Reports Page Loads and Key Elements are Accessible

---

## Page Object Model

We implemented the Page Object Model (POM) design pattern throughout the project. This approach has several benefits:

### Benefits

- **Separation of Concerns** - Test logic is separated from page structure, making both easier to maintain
- **Reusability** - Page methods can be reused across multiple tests
- **Maintainability** - When the UI changes, you only need to update the page classes, not every test
- **Readability** - Tests read like plain English and are self-documenting
- **Reduced Code Duplication** - Common actions are centralized in one place

### Page Object Classes

We created 11 page object classes:

1. **BasePage.js** - Parent class with common methods that all pages inherit from
2. **LoginPage.js** - Handles login functionality and credential management
3. **HomePage.js** - Main dashboard navigation
4. **CoursesPage.js** - Course schedule and details
5. **GradesPage.js** - Grade records and academic performance
6. **ContractPage.js** - Financial contracts and payments
7. **ELS_Reports.js** - English Language School reports
8. **AttendanceRecord.js** - Attendance tracking
9. **StudentSertificateApplicationPage.js** - Certificate applications
10. **LogOut.js** - Logout functionality
11. **LostPasswordPage.js** - Password recovery

### Example Usage

Here's how we use the Page Object Model in our tests:

```javascript
const LoginPage = require('./pages/LoginPage');
const HomePage = require('./pages/HomePage');

test('TC-001: Valid Login', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const homePage = new HomePage(page);
  
  await loginPage.goToLogin();
  await loginPage.login(username, password);
  expect(await homePage.isLoggedIn()).toBeTruthy();
});
```

---

## WebTest Interface

We built a custom WebTest Interface - a web-based test runner that provides a better experience for running and monitoring tests.

### Features

- **Real-time Test Execution** - Watch tests run live
- **Parallel Execution** - Run multiple tests at the same time
- **Interactive Console** - See test output as it happens
- **Screenshot Gallery** - Browse all captured screenshots
- **Test Filtering** - Filter by test type or file
- **Results Dashboard** - Get a comprehensive summary of test results

### Technology Stack

- **Frontend:** React.js 18, Vite, TailwindCSS
- **Backend:** Express.js, Socket.IO
- **Communication:** WebSocket-based real-time updates

### Usage

To start the WebTest Interface:

```bash
cd WebTest
node start-all.js
```

Then open http://localhost:5173 in your browser.

---

## Test Reports

The framework generates several types of reports:

### Report Types

1. **HTML Report** - Interactive, visual test results
   - Location: `reports/html-report/index.html`
   - Features: Test timeline, screenshots, traces, filtering

2. **JUnit XML** - For CI/CD integration
   - Location: `reports/junit.xml`
   - Works with Jenkins, GitLab CI, GitHub Actions

3. **JSON Results** - Machine-readable format
   - Location: `reports/test-results.json`
   - Useful for custom reporting and analysis

### Screenshots

Screenshots are automatically captured when tests fail and stored in:
- `test-results/screenshots/` - Automatic screenshots on failures
- `screenshots/` - Manual screenshots for documentation

---

## Contributors

### Project Team

- **İsmet Ozan KARABINAR** (250302276)
- **Hüseying Talha BAYCAN** (230302041)
- **Ismail Eyüp Göçmen** (240302336)
- **Kayra Yılmaz** (220302421)

### Institution

**International University of Sarajevo (IUS)**
- Website: https://www.ius.edu.ba/en

---

## Academic Information

### Course Details

- **Course Code:** SE302
- **Course Name:** Software Testing and Maintenance
- **Institution:** International University of Sarajevo (IUS)
- **Project Type:** Automated Testing Framework

### Project Requirements

We met and exceeded all requirements:
- Minimum 15 test cases (we created 22)
- Page Object Model implementation
- Multiple test types (functional, smoke)
- Test documentation and evidence
- Screenshot capture
- Test reports

### Learning Outcomes

This project demonstrates our understanding of:
- Automated testing principles and practices
- Page Object Model design pattern implementation
- Playwright testing framework proficiency
- Test case design and execution strategies
- Test reporting and documentation
- Applying testing knowledge to real-world scenarios

---

## License

This project is licensed under the MIT License which is still nonsense in 2025.

---

## Links

- **GitHub Repository:** https://github.com/kappaborg/SE322PROJECT
- **IUS SIS:** https://sis.ius.edu.ba/
- **IUS Website:** https://www.ius.edu.ba/en
- **Playwright Documentation:** https://playwright.dev/

---

## Support

If you have questions or run into issues:

1. Check the [Document.tex](./Document.tex) for detailed documentation
2. Review test files in the `tests/` directory for examples
3. Consult the [Playwright Documentation](https://playwright.dev/)

---

## Acknowledgments

We'd like to thank!:
- **International University of Sarajevo** for providing the testing environment
- **Playwright Team** for the excellent testing framework
- **SE302 Course Instructors** for their guidance and requirements

---

## Project Statistics

- **Total Test Cases:** 22
- **Page Objects:** 11
- **Lines of Code:** 3000+
- **Test Coverage:** Critical user workflows
- **Browsers Supported:** Chromium, Firefox
- **Execution Time:** Approximately 6-7 minutes for the full suite

---


**Project Status:** Complete and Ready

---

*This README is part of the SE302 Software Testing and Maintenance course project at the International University of Sarajevo.*
