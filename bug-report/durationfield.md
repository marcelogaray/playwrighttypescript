### **Bug Report: [Search][Mobile]"Duration" dropdown not visible on mobile device**

#### **Summary**  
The "Duration" dropdown does not appear on the mobile version of the application when tested on **Mobile Chrome**.

---

### **Steps to Reproduce**
1. Open the **Mobile Chrome** browser on your device.
2. Navigate to the application’s URL.
3. Go to the page or section where the **Duration** dropdown is expected to be visible.
4. Attempt to click or interact with the **Duration** dropdown.

---

### **Expected Behavior**  
The **Duration** dropdown should be visible and interactable. When tapped, it should display the list of available options.

---

### **Actual Behavior**  
- The **Duration** dropdown is not visible on the mobile version of the page.
- No errors are displayed in the console logs.
- The dropdown appears correctly on desktop browsers (Chrome and Firefox).

---

### **Environment Details**  
- **Browser**: Mobile Chrome  
- **Device Emulation**: Not applicable (tested directly on mobile device)  
- **Operating System**: MacOS (M1)/Windows
- **Playwright Version**: 1.46.0  
- **Test Configuration**: 
  ```ts
  projects: [
    {
      name: 'chrome-mobile',
      use: {
        browserName: 'chromium',
        ...devices['Mobile Chrome']
      }
    }
  ]
  ```

---

### **Console/Network Logs**  
- No visible error messages in the browser console during interaction.
- Network requests related to the dropdown load without issues.

---

### **Attachments**  
- Screenshot of the page 
![Screenshot of the application](/bug-report/evidence-mobile-bug.jpg) 

- Relevant section of the Playwright test script for context:  
   ```ts
   test('@bugsearch Verify Duration dropdown is visible', async ({ page }) => {
    await searchPage.chooseSailToByCityName('The Bahamas');
    await searchPage.chooseDurationByOption('6 - 9 Days');
    await searchPage.isDurationVisible();
    const durationDropdown = await page.isVisible('a#cdc-durations');
     expect(durationDropdown).toBe(true); // This fails on mobile
   });
   ```

---

### **Priority**:  
- **High**: Critical functionality is not available on mobile.

