import { expect } from '@playwright/test';
import { test } from './helpers/test-setup';
import { SearchPage } from '../pages/search-page';
import { ItineraryPage } from '../pages/itinerary-page';
import { BookingPage } from '../pages/booking-page';

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

  test('@desktop_firefox User #2 can learn more about the trip itinerary', async ({ page }) => {
    const itineraryPage = new ItineraryPage(page);

    // Step 1: Select the first sail to view its itinerary
    await searchPage.selectFirstSail();

    // Step 2: Verify if the user can read information about each day of the itinerary
    const isDaysInfoEnabled = await itineraryPage.isDaysInfoEnabled();

    // Step 3: Verify if the 'BOOK NOW' button is displayed
    const isStartBookingDisplayed = await itineraryPage.isStartBookingDisplayed();

    // Step 4: Collect all assertions for validation
    const assertions = [
      {
        value: isDaysInfoEnabled,
        message: 'Each day’s information should be available to read.'
      },
      {
        value: isStartBookingDisplayed,
        message: 'The "BOOK NOW" button should be visible on the itinerary page.'
      }
    ];

    // Step 5: Collect error messages from failed assertions
    const errors: string[] = assertions
      .filter(assertion => !assertion.value) // Filter out failed assertions
      .map(assertion => assertion.message);  // Map them to their corresponding error messages

    // Step 6: Assert that no errors were found (i.e., all assertions passed)
    expect(errors.length, `Failed assertions:\n${errors.join('\n')}`).toBe(0);
  });

  test('@mobile_chrome User #3 can start the booking process from the itinerary page', async ({ page }) => {
    const itineraryPage = new ItineraryPage(page);
    const bookingPage = new BookingPage(page);

    // Step 1: Click the 'START BOOKING' button on the itinerary page
    await searchPage.selectFirstSail();
    await itineraryPage.clickStartBooking();

    // Step 2: Verify that the booking page is displayed
    const isBookingPageVisible = await bookingPage.isBookingPageVisible();

    // Step 3: Verify that the first question on the booking page is about stateroom quantity
    const isStateroomQuestionVisible = await bookingPage.isStateroomQuestionVisible();

    // Step 4: Collect all assertions with descriptive messages
    const assertions = [
      {
        value: isBookingPageVisible,
        message: 'Booking page should be visible after clicking "START BOOKING".'
      },
      {
        value: isStateroomQuestionVisible,
        message: 'First question on the booking page should be about stateroom quantity.'
      }
    ];

    // Step 5: Identify failed assertions and collect their messages
    const errors: string[] = assertions
      .filter(assertion => !assertion.value) // Filter out failed assertions
      .map(assertion => assertion.message);  // Extract error messages

    // Step 6: Assert that no assertions have failed
    expect(errors.length, `Failed assertions:\n${errors.join('\n')}`).toBe(0);
  });
});

// test.describe('Smoke New tab Testing', () => {
//   let searchPage: SearchPage;

//   test.beforeEach(async ({ page }) => {
//     searchPage = new SearchPage(page);
//     await searchPage.navigateTo();
//   });

//   // test('User #4 can contact support via footer link during the booking process @smoke', async ({ page, context }) => {
//   //   // Step 1: Validate the presence of the contact support link in the footer
//   //   const isContactLinkVisible = await searchPage.isContactSupportLinkVisible();
//   //   expect(isContactLinkVisible, 'Contact support link should be visible in the footer of the booking page.').toBeTruthy();

//   //   // Step 2: Trigger a click on the contact support link and wait for the new tab to open.
//   //   const [newTab] = await Promise.all([
//   //     context.waitForEvent('page'),  // Wait for a new tab to open
//   //     searchPage.clickContactSupportLink()  // Click the contact support link
//   //   ]);

//   //   // Step 3: Verify the URL of the new tab to ensure it provides contact instructions.
//   //   const newTabUrl = newTab.url();
//   //   expect(newTabUrl, 'The contact support link should open a new tab with instructions.').toContain('about-carnival/contact-us');
//   // });
//});