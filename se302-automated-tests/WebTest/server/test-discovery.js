import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, '../..');
const TESTS_DIR = path.join(PROJECT_ROOT, 'tests');

/**
 * Discover all test files and extract test metadata
 */
async function discoverTests() {
  const testSuites = [];
  
  // Scan test directories
  const testDirs = ['functional', 'smoke'];
  
  for (const dir of testDirs) {
    const dirPath = path.join(TESTS_DIR, dir);
    if (!fs.existsSync(dirPath)) continue;
    
    const files = fs.readdirSync(dirPath).filter(f => f.endsWith('.test.js'));
    
    for (const file of files) {
      const filePath = path.join(dirPath, file);
      const content = fs.readFileSync(filePath, 'utf-8');
      const suite = parseTestFile(filePath, content, dir);
      if (suite) {
        testSuites.push(suite);
      }
    }
  }
  
  return testSuites;
}

/**
 * Parse test file to extract test cases
 */
function parseTestFile(filePath, content, category) {
  const relativePath = path.relative(TESTS_DIR, filePath);
  const fileName = path.basename(filePath, '.test.js');
  
  // Extract test.describe block
  const describeMatch = content.match(/test\.describe\(['"]([^'"]+)['"]/);
  const suiteName = describeMatch ? describeMatch[1] : fileName;
  
  // Extract all test cases
  const testCases = [];
  const testRegex = /test\(['"]([^'"]+)['"]/g;
  let match;
  
  while ((match = testRegex.exec(content)) !== null) {
    const testName = match[1];
    const testId = extractTestId(testName);
    
    // Extract test description (next few lines after test declaration)
    const testStart = match.index;
    const testEnd = content.indexOf('});', testStart);
    const testBody = content.substring(testStart, testEnd);
    
    // Extract timeout if present
    const timeoutMatch = testBody.match(/test\.setTimeout\((\d+)\)/);
    const timeout = timeoutMatch ? parseInt(timeoutMatch[1]) : null;
    
    // Extract skip condition
    const skipMatch = testBody.match(/test\.skip\(/);
    const skipped = !!skipMatch;
    
    testCases.push({
      id: testId || `${fileName}-${testCases.length + 1}`,
      name: testName,
      description: extractDescription(testName),
      timeout,
      skipped,
      file: relativePath,
      category
    });
  }
  
  if (testCases.length === 0) return null;
  
  return {
    id: fileName,
    name: suiteName,
    file: relativePath,
    category,
    testCases,
    path: filePath
  };
}

/**
 * Extract test case ID (TC-XXX format)
 */
function extractTestId(testName) {
  const match = testName.match(/TC-[\w-]+/);
  return match ? match[0] : null;
}

/**
 * Extract description from test name
 */
function extractDescription(testName) {
  // Remove TC-XXX prefix if present
  return testName.replace(/TC-[\w-]+:\s*/, '').trim();
}

export default {
  discoverTests
};

