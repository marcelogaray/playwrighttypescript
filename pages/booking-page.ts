import { Page } from '@playwright/test';
import { BasePage } from './common/base-page';

/**
 * Represents the Booking Page of the application.
 */
export class BookingPage extends BasePage {
    constructor(page: Page) {
        super(page);
    }

    async isBookingPageVisible(){
        return this.uiManager.isVisible("[data-testid='itineraryContainer']");
    }

    async isStateroomQuestionVisible(){
        return this.uiManager.isVisible("[data-testid='cabinsPanel2021Section']");
    }
}