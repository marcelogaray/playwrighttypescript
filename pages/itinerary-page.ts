import { Page } from '@playwright/test';
import { BasePage } from './common/base-page';

/**
 * Represents the Itinerary Page of the application.
 */
export class ItineraryPage extends BasePage {
    constructor(page: Page) {
        super(page);
    }

    async isDaysInfoEnabled(){
        return this.uiManager.isEnabled("[data-testid='dayTileContent']");
    }

    async isStartBookingDisplayed(){
        return this.uiManager.isVisible("[data-testid='startBooking']");
    }

    async clickStartBooking(){
        this.uiManager.clickAsync("[data-testid='startBooking'] a");
        this.uiManager.waitForPageLoad(3000);
    }
}