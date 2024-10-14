import { test as baseTest } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

// Custom test setup
const test = baseTest.extend({
  // Hook that runs before each test
  async beforeEach({ page }, testInfo) {
    // Start tracing for the test
    await page.tracing.start({ path: 'trace.zip', screenshots: true, snapshots: true });

    // Get the class name and test name
    const className = path.basename(testInfo.file, '.ts');
    const testName = testInfo.title.replace(/\s+/g, '_');

    // Create folder path for results
    const folderPath = path.join('test-results', className, testName);
    fs.mkdirSync(folderPath, { recursive: true });
  },

  // Hook that runs after each test
  async afterEach({ page }, testInfo) {
    // Stop tracing and save it if the test failed or if tracing is enabled
    if (testInfo.status !== 'passed' || testInfo.retry) {
      const className = path.basename(testInfo.file, '.ts');
      const testName = testInfo.title.replace(/\s+/g, '_');
      const folderPath = path.join('test-results', className, testName);

      // Save the trace as trace.zip in the appropriate folder
      await page.tracing.stop({ path: path.join(folderPath, 'trace.zip') });
    } else {
      // Stop tracing without saving if the test passed
      await page.tracing.stop();
    }
  }
});

export { test };
