const { test, expect } = require('@playwright/test');

test.describe('Calculator E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Wait for calculator to load
    await page.waitForSelector('.calculator');
    // Ensure a clean UI state between tests
    await page.click('[data-action="clear"]');
    await page.click('#clear-history');
  });

  test.describe('Basic UI', () => {
    test('should display calculator interface', async ({ page }) => {
      await expect(page.locator('h1')).toHaveText('Kalkulator');
      await expect(page.locator('#display')).toBeVisible();
      await expect(page.locator('.buttons')).toBeVisible();
    });

    test('should have all number buttons', async ({ page }) => {
      for (let i = 0; i <= 9; i++) {
        await expect(page.locator(`[data-number="${i}"]`)).toBeVisible();
      }
    });

    test('should have all operation buttons', async ({ page }) => {
      const operations = ['add', 'subtract', 'multiply', 'divide', 'power', 'sqrt'];
      for (const op of operations) {
        await expect(page.locator(`[data-operation="${op}"]`)).toBeVisible();
      }
    });

    test('should display initial value of 0', async ({ page }) => {
      const display = page.locator('#display');
      await expect(display).toHaveValue('0');
    });
  });

  test.describe('Number Input', () => {
    test('should input single digit', async ({ page }) => {
      await page.click('[data-number="5"]');
      await expect(page.locator('#display')).toHaveValue('5');
    });

    test('should input multiple digits', async ({ page }) => {
      await page.click('[data-number="1"]');
      await page.click('[data-number="2"]');
      await page.click('[data-number="3"]');
      await expect(page.locator('#display')).toHaveValue('123');
    });

    test('should input decimal numbers', async ({ page }) => {
      await page.click('[data-number="5"]');
      await page.click('[data-number="."]');
      await page.click('[data-number="5"]');
      await expect(page.locator('#display')).toHaveValue('5.5');
    });

    test('should handle keyboard input', async ({ page }) => {
      await page.keyboard.type('123');
      await expect(page.locator('#display')).toHaveValue('123');
    });
  });

  test.describe('Basic Operations', () => {
    test('should add two numbers', async ({ page }) => {
      await page.click('[data-number="5"]');
      await page.click('[data-operation="add"]');
      await page.click('[data-number="3"]');
      await page.click('[data-action="equals"]');

      // Wait for API call
      await page.waitForTimeout(500);
      await expect(page.locator('#display')).toHaveValue('8');
    });

    test('should subtract two numbers', async ({ page }) => {
      await page.click('[data-number="1"]');
      await page.click('[data-number="0"]');
      await page.click('[data-operation="subtract"]');
      await page.click('[data-number="3"]');
      await page.click('[data-action="equals"]');

      await page.waitForTimeout(500);
      await expect(page.locator('#display')).toHaveValue('7');
    });

    test('should multiply two numbers', async ({ page }) => {
      await page.click('[data-number="5"]');
      await page.click('[data-operation="multiply"]');
      await page.click('[data-number="3"]');
      await page.click('[data-action="equals"]');

      await page.waitForTimeout(500);
      await expect(page.locator('#display')).toHaveValue('15');
    });

    test('should divide two numbers', async ({ page }) => {
      await page.click('[data-number="1"]');
      await page.click('[data-number="5"]');
      await page.click('[data-operation="divide"]');
      await page.click('[data-number="3"]');
      await page.click('[data-action="equals"]');

      await page.waitForTimeout(500);
      await expect(page.locator('#display')).toHaveValue('5');
    });
  });

  test.describe('Advanced Operations', () => {
    test('should calculate power', async ({ page }) => {
      await page.click('[data-number="2"]');
      await page.click('[data-operation="power"]');
      await page.click('[data-number="3"]');
      await page.click('[data-action="equals"]');

      await page.waitForTimeout(500);
      await expect(page.locator('#display')).toHaveValue('8');
    });

    test('should calculate square root', async ({ page }) => {
      await page.click('[data-number="9"]');
      await page.click('[data-operation="sqrt"]');

      await page.waitForTimeout(500);
      await expect(page.locator('#display')).toHaveValue('3');
    });
  });

  test.describe('Calculator Functions', () => {
    test('should clear display', async ({ page }) => {
      await page.click('[data-number="1"]');
      await page.click('[data-number="2"]');
      await page.click('[data-number="3"]');
      await page.click('[data-action="clear"]');

      await expect(page.locator('#display')).toHaveValue('0');
    });

    test('should delete last digit', async ({ page }) => {
      await page.click('[data-number="1"]');
      await page.click('[data-number="2"]');
      await page.click('[data-number="3"]');
      await page.click('[data-action="delete"]');

      await expect(page.locator('#display')).toHaveValue('12');
    });

    test('should use keyboard shortcuts', async ({ page }) => {
      await page.keyboard.type('5+3');
      await page.keyboard.press('Enter');

      await page.waitForTimeout(500);
      await expect(page.locator('#display')).toHaveValue('8');
    });

    test('should clear with Escape key', async ({ page }) => {
      await page.keyboard.type('123');
      await page.keyboard.press('Escape');

      await expect(page.locator('#display')).toHaveValue('0');
    });
  });

  test.describe('Expression Display', () => {
    test('should show expression during operation', async ({ page }) => {
      await page.click('[data-number="5"]');
      await page.click('[data-operation="add"]');

      await expect(page.locator('#expression')).toHaveText('5 +');
    });

    test('should clear expression after calculation', async ({ page }) => {
      await page.click('[data-number="5"]');
      await page.click('[data-operation="add"]');
      await page.click('[data-number="3"]');
      await page.click('[data-action="equals"]');

      await page.waitForTimeout(500);
      await expect(page.locator('#expression')).toHaveText('');
    });
  });

  test.describe('History Panel', () => {
    test('should display history panel', async ({ page }) => {
      await expect(page.locator('.history-panel')).toBeVisible();
      await expect(page.locator('h2')).toContainText('Historia');
    });

    test('should add calculation to history', async ({ page }) => {
      // Perform calculation
      await page.click('[data-number="5"]');
      await page.click('[data-operation="add"]');
      await page.click('[data-number="3"]');
      await page.click('[data-action="equals"]');

      await page.waitForTimeout(1000);

      // Check history
      const historyItems = page.locator('.history-item');
      await expect(historyItems).toHaveCount(1);
      await expect(historyItems.first()).toContainText('5 + 3 = 8');
    });

    test('should clear history', async ({ page }) => {
      // Add calculation
      await page.click('[data-number="5"]');
      await page.click('[data-operation="add"]');
      await page.click('[data-number="3"]');
      await page.click('[data-action="equals"]');

      await page.waitForTimeout(1000);

      // Clear history
      await page.click('#clear-history');
      await page.waitForTimeout(500);

      // Verify empty
      await expect(page.locator('.empty')).toBeVisible();
    });
  });

  test.describe('Theme Toggle', () => {
    test('should toggle theme', async ({ page }) => {
      const html = page.locator('html');

      // Check initial theme (light)
      await expect(html).toHaveAttribute('data-theme', 'light');

      // Toggle to dark
      await page.click('#theme-toggle');
      await expect(html).toHaveAttribute('data-theme', 'dark');

      // Toggle back to light
      await page.click('#theme-toggle');
      await expect(html).toHaveAttribute('data-theme', 'light');
    });

    test('should persist theme in localStorage', async ({ page }) => {
      await page.click('#theme-toggle');

      // Reload page
      await page.reload();

      // Theme should persist
      await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    });
  });

  test.describe('API Status', () => {
    test('should show API status indicator', async ({ page }) => {
      await expect(page.locator('.api-status')).toBeVisible();
      await expect(page.locator('#api-indicator')).toBeVisible();
      await expect(page.locator('#api-status-text')).toBeVisible();
    });
  });

  test.describe('Error Handling', () => {
    test('should handle division by zero', async ({ page }) => {
      await page.click('[data-number="5"]');
      await page.click('[data-operation="divide"]');
      await page.click('[data-number="0"]');
      await page.click('[data-action="equals"]');

      await page.waitForTimeout(500);
      await expect(page.locator('#display')).toHaveValue('Error');

      // Should auto-clear after 2 seconds
      await page.waitForTimeout(2500);
      await expect(page.locator('#display')).toHaveValue('0');
    });
  });

  test.describe('Complex Operations', () => {
    test('should perform multiple operations in sequence', async ({ page }) => {
      // 5 + 3 = 8
      await page.click('[data-number="5"]');
      await page.click('[data-operation="add"]');
      await page.click('[data-number="3"]');
      await page.click('[data-action="equals"]');
      await page.waitForTimeout(500);

      // 8 * 2 = 16
      await page.click('[data-operation="multiply"]');
      await page.click('[data-number="2"]');
      await page.click('[data-action="equals"]');
      await page.waitForTimeout(500);

      await expect(page.locator('#display')).toHaveValue('16');

      // Check history has 2 items
      await page.waitForTimeout(500);
      const historyItems = page.locator('.history-item');
      await expect(historyItems).toHaveCount(2);
    });
  });

  test.describe('Mobile Responsiveness', () => {
    test('should work on mobile viewport', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });

      await expect(page.locator('.calculator')).toBeVisible();
      await page.click('[data-number="5"]');
      await expect(page.locator('#display')).toHaveValue('5');
    });
  });
});
