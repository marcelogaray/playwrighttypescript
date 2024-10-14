import { Page, test, Locator } from "@playwright/test";
import { PlaywrightTestConfig } from '@playwright/test';

/**
 * A utility class for managing UI interactions with Playwright.
 */
export class UIManager {
    /** The Playwright page instance used for UI interactions. */
    private page: Page;

    /** 
     * The default timeout value from the Playwright config. 
     * If no timeout is set in the config, defaults to 30,000 milliseconds (30 seconds).
     */
    private readonly defaultTimeout: number;

    /**
     * Creates an instance of UIManager.
     * 
     * @param page - The Playwright Page object used for interaction.
     */
    public constructor(page: Page) {
        this.page = page;
        // Initialize defaultTimeout
        this.defaultTimeout = 30000; // Fallback value if no timeout is set in config
    }

    /**
     * Clicks on an element specified by its locator string.
     * 
     * @param locator - The locator of the element to click.
     * @param forceTimeout - The time (in milliseconds) to force the click to wait before timing out.
     *                       Defaults to 150 milliseconds if not provided.
     * @param timeout - The overall timeout for the click action, in milliseconds. 
     *                  If not provided, the default timeout from the Playwright config is used.
     * @param throwError - A boolean indicating whether to throw an error if the click fails. 
     *                     Defaults to true (throws an error). If false, logs the error but continues execution.
     * 
     * @throws {Error} Throws an error if throwError is true and the click action fails.
     */
    public async clickAsync(locator: string, forceTimeout = 150, timeout?: number, throwError = true) {
        // Use the provided timeout or fallback to the instance variable
        const effectiveTimeout = timeout || this.defaultTimeout;

        try {
            // Perform the click action with the specified timeout
            await this.page.click(locator, { timeout: effectiveTimeout });
            // Wait for the specified force timeout
            await this.page.waitForTimeout(forceTimeout);
        } catch (error) {
            // Log error details
            console.error(`Failed to click on the element with locator: ${locator}. Error: ${error.message}`);
            // Throw the error if throwError is true
            if (throwError) {
                throw error; // Re-throw the error to be handled by the caller
            }
        }
    }

    public async clickNewTabAsync(
        locator: string,
        forceTimeout = 150,
        timeout?: number,
        throwError = true
    ): Promise<Page> {
        const effectiveTimeout = timeout || this.defaultTimeout;
        const modifiers = process.platform === 'darwin' ? ['Meta'] : ['Control']; // Use Meta for Mac, Control for others

        try {
            // Wait for the new tab to open
            const [newTab] = await Promise.all([
                this.page.context().waitForEvent('page', { timeout: effectiveTimeout }), // Wait for new page
                this.page.click(locator, { modifiers, timeout: effectiveTimeout })       // Perform Ctrl+Click or Cmd+Click
            ]);

            // Wait until the new tab finishes loading
            await newTab.waitForLoadState('domcontentloaded');

            // Wait for the specified force timeout
            await this.page.waitForTimeout(forceTimeout);

            return newTab;
        } catch (error) {
            console.error(`Failed to open a new tab with locator: ${locator}. Error: ${error.message}`);

            if (throwError) {
                throw error; // Re-throw the error to be handled by the caller
            }

            return null; // Return null if error handling is disabled
        }
    }



    /**
     * Clicks on an element specified by its Locator.
     * 
     * @param locator - The Locator object of the element to click.
     * @param forceTimeout - The time (in milliseconds) to force the click to wait before timing out.
     *                       Defaults to 150 milliseconds if not provided.
     * @param timeout - The overall timeout for the click action, in milliseconds. 
     *                  If not provided, the default timeout from the Playwright config is used.
     * @param throwError - A boolean indicating whether to throw an error if the click fails. 
     *                     Defaults to true (throws an error). If false, logs the error but continues execution.
     * 
     * @throws {Error} Throws an error if throwError is true and the click action fails.
     */
    public async clickAsyncLocator(locator: Locator, forceTimeout = 150, timeout?: number, throwError = true) {
        // Use the provided timeout or fallback to the default
        const effectiveTimeout = timeout || this.defaultTimeout;

        try {
            // Perform the click action on the Locator with the specified timeout
            await locator.click({ timeout: effectiveTimeout });
            // Wait for the specified force timeout
            await this.page.waitForTimeout(forceTimeout);
        } catch (error) {
            console.error(`Failed to click on the element. Error: ${error.message}`);
            // Re-throw the error if throwError is true
            if (throwError) {
                throw error; // Re-throw the error to be handled by the caller
            }
        }
    }

    /**
     * Forces the Playwright page to wait for a specified amount of time.
     * 
     * @param forceTimeout - The time (in milliseconds) to wait. Defaults to 150ms if not provided.
     * @param throwError - A boolean indicating whether to throw an error if the wait fails. 
     *                     Defaults to false (does not throw an error). If true, throws the error after logging it.
     * 
     * @throws {Error} Throws an error if `throwError` is true and the wait fails.
     */
    public async forceWait(
        forceTimeout: number = 150,
        throwError: boolean = false
    ): Promise<void> {
        try {
            console.log(`Waiting for ${forceTimeout} milliseconds...`);
            await this.page.waitForTimeout(forceTimeout);
            console.log(`Wait of ${forceTimeout} milliseconds completed.`);
        } catch (error) {
            console.error(`Failed to wait for ${forceTimeout} milliseconds. Error: ${error.message}`);
            if (throwError) {
                throw error; // Re-throw the error if throwError is true
            }
        }
    }

    /**
     * Waits for the page to fully load by sequentially waiting for different load states: 
     * `'domcontentloaded'`, `'load'`, and `'networkidle'`. 
     * After these states are reached, it applies a forced timeout to ensure stability.
     * 
     * This method ensures the page has completed loading and handles potential delays gracefully. 
     * If the `'networkidle'` state is not reached within the provided timeout, it logs a warning and continues.
     * 
     * @param {number} [forceTimeout=150] - The time (in milliseconds) to wait after the page has fully loaded. 
     *                                      Ensures additional stability after the load states are reached.
     * @param {number} [timeout] - The maximum time (in milliseconds) to wait for each load state. 
     *                             If not provided, `this.defaultTimeout` is used.
     * @param {boolean} [throwError=false] - Determines whether to throw an error if the page load or 
     *                                       any of its states fail. If set to `false`, errors are logged but execution continues.
     * 
     * @throws {Error} - If `throwError` is set to `true` and the wait for any state fails, the method throws an error.
     * 
     * @example
     * const uiManager = new UIManager(page);
     * 
     * // Example usage with custom timeouts
     * await uiManager.waitForPageLoad(200, 10000); 
     * // Waits for the page to fully load with a 200ms forced wait, and each state has a 10s timeout.
     * 
     * @remarks
     * - **domcontentloaded**: Ensures the initial HTML has been parsed and the DOM is ready.
     * - **load**: Indicates that all external resources (like images and scripts) are fully loaded.
     * - **networkidle**: Ensures there are no ongoing network requests, providing additional stability.
     * - If the `'networkidle'` state is not reached within the timeout, it logs a warning and continues.
     */
    public async waitForPageLoad(
        forceTimeout: number = 550,
        timeout?: number,
        throwError: boolean = false
    ): Promise<void> {
        const effectiveTimeout = timeout || this.defaultTimeout;

        try {
            console.log(`Effective Timeout '${effectiveTimeout}'...`);
            console.log(`Waiting for 'networkidle' state...`);
            try {
                // If 'networkidle' takes too long, continue without throwing.
                await this.page.waitForLoadState('networkidle', { timeout: effectiveTimeout });
                console.log(`'networkidle' state reached.`);
            } catch (networkError) {
                if (throwError) {
                    throw error; // Re-throw if throwError is true.
                    //console.warn(`'networkidle' not reached in ${effectiveTimeout}ms. Continuing...`);
                }
            }

            console.log(`Waiting for 'domcontentloaded' state...`);
            await this.page.waitForLoadState('domcontentloaded', { timeout: effectiveTimeout });
            console.log(`'domcontentloaded' reached.`);

            console.log(`Waiting for 'load' state...`);
            await this.page.waitForLoadState('load', { timeout: effectiveTimeout });
            console.log(`'load' state reached.`);

            console.log(`Applying force timeout of ${forceTimeout}ms...`);
            await this.forceWait(forceTimeout, throwError);

            console.log(`Page fully loaded with all states and force timeout applied.`);
        } catch (error) {
            console.error(`Failed during page load wait. Error: ${error.message}`);
            if (throwError) {
                throw error; // Re-throw if throwError is true.
            }
        }
    }

    /**
     * Checks if an element specified by the locator is visible on the page.
     * 
     * @param locator - The selector for the element to check visibility.
     * @param forceTimeout - Optional; time to wait after the visibility check (default is 150 ms).
     * @param timeout - Optional; custom timeout for the visibility check.
     * @param throwError - Optional; if true, throws an error when the element is not visible.
     * @returns Promise<boolean> - Resolves to true if the element is visible; otherwise false.
     */
    public async isVisible(locator: string, forceTimeout = 150, timeout?: number, throwError = false): Promise<boolean> {
        const effectiveTimeout = timeout || this.defaultTimeout; // Determine the timeout to use

        try {
            // Wait for the element to be visible with the specified timeout
            await this.page.waitForSelector(locator, { state: 'visible', timeout: effectiveTimeout });
            console.log(`Element located by '${locator}' is visible.`); // Log visibility status
            return true; // Return true if the element is visible
        } catch (error) {
            console.warn(`Element located by '${locator}' is not visible. Error: ${error.message}`); // Log error message
            if (throwError) {
                throw error; // Re-throw the error if throwError is true
            }
            return false; // Return false if the element is not visible
        } finally {
            // Apply a force wait if needed
            if (forceTimeout > 0) {
                await this.forceWait(forceTimeout); // Wait for the specified force timeout
            }
        }
    }

    /**
     * Checks if an element specified by the locator is enabled (not disabled) on the page.
     * 
     * @param locator - The selector for the element to check enabled state.
     * @param forceTimeout - Optional; time to wait after the enabled state check (default is 150 ms).
     * @param timeout - Optional; custom timeout for the enabled state check.
     * @param throwError - Optional; if true, throws an error when the enabled state cannot be checked.
     * @returns Promise<boolean> - Resolves to true if the element is enabled; otherwise false.
     */
    public async isEnabled(locator: string, forceTimeout = 150, timeout?: number, throwError = false): Promise<boolean> {
        const effectiveTimeout = timeout || this.defaultTimeout; // Determine the timeout to use

        try {
            // Wait for the element to be present on the page with the specified timeout
            const elementHandle = await this.page.waitForSelector(locator, { timeout: effectiveTimeout });
            // Evaluate if the element is disabled
            const isDisabled = await elementHandle.evaluate(el => el.disabled);
            const isEnabled = !isDisabled; // An element is enabled if it is not disabled

            console.log(`Element located by '${locator}' is ${isEnabled ? 'enabled' : 'disabled'}.`); // Log enabled status
            return isEnabled; // Return true if the element is enabled
        } catch (error) {
            console.warn(`Element located by '${locator}' could not be checked for enabled state. Error: ${error.message}`); // Log error message
            if (throwError) {
                throw error; // Re-throw the error if throwError is true
            }
            return false; // Return false if the element could not be checked
        } finally {
            // Apply a force wait if needed
            if (forceTimeout > 0) {
                await this.forceWait(forceTimeout); // Wait for the specified force timeout
            }
        }
    }
}
