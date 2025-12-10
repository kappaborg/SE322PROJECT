/**
 * Test Data Generator Utility
 * 
 * Provides functions to generate unique test data for automated tests.
 * This ensures test isolation and prevents data conflicts.
 */

/**
 * Generates a random email address for testing
 * @returns {string} Random email address
 */
function generateRandomEmail() {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  return `test_${timestamp}_${random}@example.com`;
}

/**
 * Generates a random string of specified length
 * @param {number} length - Length of the string to generate
 * @returns {string} Random string
 */
function generateRandomString(length = 10) {
  return Math.random().toString(36).substring(2, length + 2);
}

/**
 * Generates a random phone number
 * @returns {string} Random phone number
 */
function generateRandomPhone() {
  return `+1${Math.floor(Math.random() * 9000000000) + 1000000000}`;
}

/**
 * Generates a random date of birth (18-65 years old)
 * @returns {string} Date of birth in YYYY-MM-DD format
 */
function generateRandomDateOfBirth() {
  const today = new Date();
  const maxAge = 65;
  const minAge = 18;
  const maxDate = new Date(today.getFullYear() - minAge, today.getMonth(), today.getDate());
  const minDate = new Date(today.getFullYear() - maxAge, today.getMonth(), today.getDate());
  const randomTime = minDate.getTime() + Math.random() * (maxDate.getTime() - minDate.getTime());
  const randomDate = new Date(randomTime);
  return randomDate.toISOString().split('T')[0];
}

/**
 * Generates a random postal code
 * @returns {string} Random postal code
 */
function generateRandomPostalCode() {
  return Math.floor(Math.random() * 90000) + 10000;
}

/**
 * Test user data template
 */
const testUserData = {
  firstName: 'John',
  lastName: 'Doe',
  email: generateRandomEmail(),
  password: 'TestPassword123!',
  phone: generateRandomPhone(),
  address: '123 Test Street',
  city: 'Test City',
  state: 'Test State',
  country: 'United States',
  postalCode: generateRandomPostalCode(),
  dateOfBirth: generateRandomDateOfBirth()
};

/**
 * Invalid test data for negative test cases
 */
const invalidTestData = {
  invalidEmail: 'invalid-email',
  shortPassword: '123',
  emptyString: '',
  specialCharacters: '!@#$%^&*()',
  numbersOnly: '1234567890'
};

module.exports = {
  generateRandomEmail,
  generateRandomString,
  generateRandomPhone,
  generateRandomDateOfBirth,
  generateRandomPostalCode,
  testUserData,
  invalidTestData
};

