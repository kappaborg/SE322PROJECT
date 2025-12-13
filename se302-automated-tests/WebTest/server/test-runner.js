import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import dotenv from 'dotenv';

// Load environment variables from parent directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, '../..');

// Load .env from tests root directory
const envPath = path.join(PROJECT_ROOT, '.env');
if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
  console.log('[Test Runner] Loaded credentials from:', envPath);
} else {
  console.warn('[Test Runner] No .env file found at:', envPath);
}

let currentProcess = null;
let isRunning = false;

/**
 * Run Playwright tests programmatically
 */
async function runTests(testIds, options = {}, onEvent) {
  if (isRunning) {
    throw new Error('Tests are already running');
  }
  
  isRunning = true;
  onEvent('test:started', { testIds, timestamp: new Date().toISOString() });
  
  try {
    // Build Playwright command
    const args = buildPlaywrightArgs(testIds, options);
    
    // Prepare environment variables - load from process.env which now has .env loaded
    const env = {
      ...process.env,
      FORCE_COLOR: '1',
      // Ensure credentials are passed to Playwright
      IUS_USERNAME: process.env.IUS_USERNAME || '',
      IUS_PASSWORD: process.env.IUS_PASSWORD || ''
    };
    
    // Build full command for logging
    const fullCommand = `npx playwright test ${args.map(a => a.includes('|') || a.includes(' ') ? `"${a}"` : a).join(' ')}`;
    console.log('[Test Runner] Executing command:', fullCommand);
    
    // Use Node's execPath to run playwright directly
    // This avoids any shell interpretation issues
    const playwrightBin = path.join(PROJECT_ROOT, 'node_modules', '.bin', 'playwright');
    
    currentProcess = spawn(playwrightBin, ['test', ...args], {
      cwd: PROJECT_ROOT,
      stdio: ['pipe', 'pipe', 'pipe'],
      env
    });
    
    let outputBuffer = '';
    
    // Capture stdout
    currentProcess.stdout.on('data', (data) => {
      const output = data.toString();
      outputBuffer += output;
      
      // Send to console immediately
      onEvent('test:output', { type: 'stdout', data: output });
      
      // Also log to server console for debugging
      console.log('[TEST OUTPUT]', output);
      
      // Parse test progress from output
      parseTestProgress(output, onEvent);
    });
    
    // Capture stderr
    currentProcess.stderr.on('data', (data) => {
      const output = data.toString();
      
      // Send to console immediately
      onEvent('test:output', { type: 'stderr', data: output });
      
      // Also log to server console for debugging
      console.error('[TEST ERROR]', output);
    });
    
    // Handle process completion
    currentProcess.on('close', (code) => {
      isRunning = false;
      currentProcess = null;
      
      const results = parseResults(outputBuffer);
      onEvent('test:completed', {
        code,
        results,
        timestamp: new Date().toISOString()
      });
    });
    
    // Handle errors
    currentProcess.on('error', (error) => {
      isRunning = false;
      currentProcess = null;
      onEvent('test:error', { error: error.message });
    });
    
  } catch (error) {
    isRunning = false;
    onEvent('test:error', { error: error.message });
  }
}

/**
 * Build Playwright command arguments
 */
function buildPlaywrightArgs(testIds, options) {
  const args = [];
  
  console.log('[Test Runner] Building args for testIds:', testIds);
  
  // Extract test case IDs (TC-XXX format) from testIds
  // Format: "suiteId-TC-XXX" (e.g., "login-TC-001", "postlogin-navigation-TC-002")
  const testCaseIds = testIds.map(testId => {
    // Extract TC-XXX part
    const parts = testId.split('-');
    // Find the part that starts with TC
    const tcIndex = parts.findIndex(p => p === 'TC');
    if (tcIndex >= 0 && tcIndex < parts.length - 1) {
      return `TC-${parts[tcIndex + 1]}`;
    }
    return null;
  }).filter(Boolean);
  
  console.log('[Test Runner] Extracted test case IDs:', testCaseIds);
  
  // Build --grep pattern to match specific test cases
  // This will run ONLY the selected tests
  if (testCaseIds.length > 0) {
    // Use regex pattern without pipes - escape each test ID separately
    // Instead of: (TC-004|TC-005|TC-006)
    // We'll match any of them: TC-(004|005|006)
    // Or even better, pass multiple --grep flags or use a safer pattern
    
    // Extract just the numbers
    const tcNumbers = testCaseIds.map(id => id.replace('TC-', ''));
    // Create pattern: TC-(004|005|006)
    const grepPattern = `TC-(${tcNumbers.join('|')})`;
    args.push('--grep', grepPattern);
    console.log('[Test Runner] Using grep pattern:', grepPattern);
  }
  
  // Add options
  if (options.project) {
    args.push('--project', options.project);
  } else {
    args.push('--project', 'chromium');
  }
  
  if (options.workers !== undefined) {
    args.push('--workers', options.workers.toString());
  } else {
    args.push('--workers', '1');
  }
  
  if (options.headed) {
    args.push('--headed');
  }
  
  if (options.ui) {
    args.push('--ui');
  }
  
  // Reporter - use list for console, json for structured data
  args.push('--reporter', 'list');
  
  console.log('[Test Runner] Final Playwright args:', args);
  
  return args;
}

/**
 * Parse test progress from output
 */
function parseTestProgress(output, onEvent) {
  // Match test execution patterns
  const runningMatch = output.match(/Running (\d+) tests/);
  if (runningMatch) {
    onEvent('test:progress', { total: parseInt(runningMatch[1]) });
  }
  
  // Match test results: ✓ or ✘
  const passMatch = output.match(/✓\s+(\d+)\s+\[([^\]]+)\]\s+›\s+([^\n]+)/);
  if (passMatch) {
    onEvent('test:passed', {
      test: passMatch[3].trim(),
      browser: passMatch[2]
    });
  }
  
  const failMatch = output.match(/✘\s+(\d+)\s+\[([^\]]+)\]\s+›\s+([^\n]+)/);
  if (failMatch) {
    onEvent('test:failed', {
      test: failMatch[3].trim(),
      browser: failMatch[2]
    });
  }
}

/**
 * Parse final results
 */
function parseResults(output) {
  const passedMatch = output.match(/(\d+)\s+passed/);
  const failedMatch = output.match(/(\d+)\s+failed/);
  const skippedMatch = output.match(/(\d+)\s+skipped/);
  
  return {
    passed: passedMatch ? parseInt(passedMatch[1]) : 0,
    failed: failedMatch ? parseInt(failedMatch[1]) : 0,
    skipped: skippedMatch ? parseInt(skippedMatch[1]) : 0
  };
}

/**
 * Stop running tests
 */
function stopTests() {
  if (currentProcess && isRunning) {
    currentProcess.kill('SIGTERM');
    isRunning = false;
    currentProcess = null;
  }
}

export default {
  runTests,
  stopTests
};

