import { expect } from '@playwright/test';
import { test } from './helpers/test-setup';
import { SearchPage } from '../pages/search-page';

test.describe('Smoke Testing', () => {
  let searchPage: SearchPage;

  test.beforeEach(async ({ page }) => {
    searchPage = new SearchPage(page);
    await searchPage.navigateTo();

    // Step 1: Initialize the search for Bahamas cruises with a duration between 6 and 9 days.
    await searchPage.chooseSailToByCityName('The Bahamas');
    await searchPage.chooseDurationByOption('6 - 9 Days');
    await searchPage.clickSearchButton();
  });

  test('@desktop_chrome User #1 can search for cruises to Bahamas between 6 and 9 days', async ({ page }) => {
    // Step 2: Validate that the results are displayed in a grid view by default.
    const resultGridDisplayed = await searchPage.isResultGridDisplayed();

    // Step 3: Verify that the price filter slider bar is enabled.
    const sliderIsEnabled = await searchPage.isFilterItsSliderBarEnabled();

    // Step 4: Confirm that the default sorting is set to "cheapest first".
    const isCheapestFirstOptionDefault = await searchPage.isCheapestFirstOptionDefault();

    // Step 5: Collect all assertions to verify against the acceptance criteria.
    const assertions = [
      { value: resultGridDisplayed, message: 'Results grid should be displayed by default.' }, // AC 1
      { value: sliderIsEnabled, message: 'Price slider should be enabled.' },                  // AC 2
      { value: isCheapestFirstOptionDefault, message: 'Default sort should be "cheapest first".' } // AC 3
    ];

    // Step 6: Gather any failed assertions for reporting.
    const errors = assertions
      .filter(assertion => !assertion.value)
      .map(assertion => assertion.message);

    // Step 7: Assert that no errors were found.
    expect(errors.length, `Failed assertions:\n${errors.join('\n')}`).toBe(0);
  });
});
