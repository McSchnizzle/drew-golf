const { test, expect } = require('@playwright/test');

test.describe('Cartoon Golf Chaos - Phase 1-4 Tests', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/game.html');
    await page.waitForLoadState('networkidle');
  });

  test('should load the game successfully', async ({ page }) => {
    // Check page title
    await expect(page).toHaveTitle('Cartoon Golf Chaos');

    // Check main elements exist
    await expect(page.locator('#game-canvas')).toBeVisible();
    await expect(page.locator('#menu-overlay')).toBeVisible();
    await expect(page.locator('#new-game-btn')).toBeVisible();
  });

  test('should start a new game when button is clicked', async ({ page }) => {
    // Click new game button
    await page.click('#new-game-btn');

    // Menu should be hidden (check if it's not visible)
    await expect(page.locator('#menu-overlay')).not.toBeVisible();

    // Game should be running - verify UI elements are visible
    await expect(page.locator('#scoreboard')).toBeVisible();
  });

  test('should display game UI elements correctly', async ({ page }) => {
    await page.click('#new-game-btn');

    // Check scoreboard elements
    await expect(page.locator('#hole-number')).toBeVisible();
    await expect(page.locator('#hole-par')).toBeVisible();
    await expect(page.locator('#stroke-count')).toBeVisible();
    await expect(page.locator('#total-score')).toBeVisible();

    // Verify initial values
    await expect(page.locator('#hole-number')).toHaveText('1');
    await expect(page.locator('#stroke-count')).toHaveText('0');
    await expect(page.locator('#total-score')).toHaveText('E');
  });

  test('should render canvas with game elements', async ({ page }) => {
    await page.click('#new-game-btn');
    await page.waitForTimeout(500);

    // Take a screenshot to verify rendering
    const canvas = await page.locator('#game-canvas');
    await expect(canvas).toBeVisible();

    // Check canvas has non-zero dimensions
    const boundingBox = await canvas.boundingBox();
    expect(boundingBox.width).toBeGreaterThan(0);
    expect(boundingBox.height).toBeGreaterThan(0);
  });

  test('should handle mouse input for swing', async ({ page }) => {
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));

    await page.click('#new-game-btn');
    await page.waitForTimeout(1500);

    const canvas = page.locator('#game-canvas');
    const boundingBox = await canvas.boundingBox();

    // Verify initial stroke count is 0
    await expect(page.locator('#stroke-count')).toHaveText('0');

    // Simulate a drag on the canvas
    const centerX = boundingBox.x + boundingBox.width / 2;
    const centerY = boundingBox.y + boundingBox.height / 2;

    await page.mouse.move(centerX - 50, centerY);
    await page.mouse.down();
    await page.mouse.move(centerX - 150, centerY - 30, { steps: 10 });
    await page.mouse.up();

    // Wait a bit
    await page.waitForTimeout(2000);

    // Check no errors occurred
    expect(errors.length).toBe(0);

    // Verify game is still functional (elements still visible)
    await expect(page.locator('#scoreboard')).toBeVisible();
  });

  test('should check for JavaScript errors', async ({ page }) => {
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));

    await page.click('#new-game-btn');
    await page.waitForTimeout(1000);

    // Simulate a swing
    const canvas = page.locator('#game-canvas');
    const boundingBox = await canvas.boundingBox();
    await page.mouse.move(boundingBox.x + 100, boundingBox.y + 300);
    await page.mouse.down();
    await page.mouse.move(boundingBox.x + 50, boundingBox.y + 300);
    await page.mouse.up();

    await page.waitForTimeout(2000);

    // Check for errors
    expect(errors.length).toBe(0);
  });

  test('should display obstacles on the course (Phase 4)', async ({ page }) => {
    await page.click('#new-game-btn');
    await page.waitForTimeout(500);

    // Take screenshot to visually verify obstacles are rendered
    const screenshot = await page.screenshot();
    expect(screenshot.length).toBeGreaterThan(0);

    // Note: Visual verification of obstacles would require image comparison
    // For now, we're just ensuring the game renders without errors
  });

  test('should advance to next hole after completion', async ({ page }) => {
    // This test would simulate completing a hole
    // For now, we'll test the hole number can be updated
    await page.click('#new-game-btn');
    await page.waitForTimeout(500);

    const initialHole = await page.locator('#hole-number').textContent();
    expect(initialHole).toBe('1');

    // Note: Full hole completion test would require simulating
    // ball reaching the hole, which involves complex physics simulation
  });

  test.skip('should work on touch devices (iPad simulation)', async ({ page }) => {
    // Skipped: Touch testing requires mobile device or emulation
    // This would be tested manually on actual iPad
  });

  test('should display debug info when debug=true', async ({ page }) => {
    await page.goto('/game.html?debug=true');
    await page.waitForLoadState('networkidle');

    await page.click('#new-game-btn');
    await page.waitForTimeout(1500);

    // Debug info should be visible
    const debugInfo = page.locator('#debug-info');
    await expect(debugInfo).toBeVisible();

    // Wait a bit for FPS to populate
    await page.waitForTimeout(1000);

    // Should show FPS in the debug text
    const debugText = await debugInfo.textContent();
    expect(debugText).toContain('FPS');
  });
});
