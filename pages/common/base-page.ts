import { Page } from '@playwright/test';
import { UIManager } from '../../core/web/ui-manager';

/**
 * Base class for all page objects. 
 * This class provides common functionalities that can be reused across various page implementations.
 */
export class BasePage {
    /** The Playwright page instance used for UI interactions. */
    protected readonly page: Page;
    /** Instance of UIManager to handle UI interactions. */
    protected readonly uiManager: UIManager;

    /**
     * Creates an instance of BasePage.
     * @param page - The Playwright Page object used for interaction.
     */
    constructor(page: Page) {
        this.page = page;
        this.uiManager = new UIManager(page); // Instantiate UIManager
    }

    async navigateTo(agreeAction: boolean = true) {
        await this.page.goto('/');
        await this.page.reload();
        if (agreeAction) {
            // Accept the Agree button
            let agreeButton = await this.page.getByRole('button', { name: 'AGREE' });
            await this.uiManager.clickAsyncLocator(agreeButton);

            // Workaround to load content due to weird behavior
            await this.uiManager.forceWait(2000)
        }
    }
}
