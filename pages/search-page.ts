import { Page } from '@playwright/test';
import { BasePage } from './common/base-page';

/**
 * Represents the search page of the application.
 */
export class SearchPage extends BasePage {
    constructor(page: Page) {
        super(page);
    }

    async chooseSailToByCityName(cityName: string) {
        await this.uiManager.clickAsync("a#cdc-destinations");

        // Example using clickAsyncLocator using ILocator
        // let theBahamasOption = await this.page.getByLabel('The Bahamas', { exact: true });
        // await this.uiManager.clickAsyncLocator(theBahamasOption);

        // otherwise use Locator as string
        await this.uiManager.clickAsync(`button[aria-label*='${cityName}']`)

    }

    async chooseDurationByOption(durationOption: '2 - 5 Days' | '6 - 9 Days' | '10+ Days' = '6 - 9 Days') {
        await this.uiManager.clickAsync("a#cdc-durations");
        await this.uiManager.clickAsync(`button[aria-label*='${durationOption}']`);
        console.log(`Selected duration filter: ${durationOption}`);
    }

    async clickSearchButton() {
        await this.uiManager.clickAsync("li a[data-tealium='cdc-search-cruises-cta']");
        await this.uiManager.waitForPageLoad(2000);
    }

    async filterByPrice() {
        await this.page.getByLabel('Vacation Budget').click();
        await this.page.getByTestId('pricingSlider').click();
        await this.page.getByTestId('pricingFilterButton').getByLabel('Vacation Budget').click();
    }

    async isResultGridDisplayed() {
        return this.uiManager.isVisible('div#mainContent [data-testid="tripTilesContainer"]')
    }

    async isFilterItsSliderBarEnabled() {
        this.uiManager.clickAsync("[aria-label='Vacation Budget']");
        return this.uiManager.isEnabled("span[data-testid='pricingSlider']");
    }

    async isCheapestFirstOptionDefault(){
        return this.uiManager.isVisible('[data-testid="sortBySelect"]');
    }

    async selectFirstSail() {
        this.uiManager.clickAsync("(//a[text()='View Itinerary'])[1]");
        this.uiManager.forceWait(5000);
    }

    async isContactSupportLinkVisible(){
        return this.uiManager.isVisible("[data-testid='footerCategoryItem3'] a[data-testid='link-item-url-1']");
    }

    async clickContactSupportLink(){
        this.uiManager.clickNewTabAsync("[data-testid='footerCategoryItem3'] a[data-testid='link-item-url-1']");
    }
}