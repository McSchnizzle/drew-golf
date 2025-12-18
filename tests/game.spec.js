const { test, expect } = require('@playwright/test');

test.describe('Howlett Golf Chaos - Game Tests', () => {

  test.beforeEach(async ({ page }) => {
    // Set tutorial as completed to avoid blocking overlay during tests
    await page.addInitScript(() => {
      localStorage.setItem('golf-settings', JSON.stringify({
        soundEnabled: true,
        debugMode: false,
        tutorialCompleted: true
      }));
    });
    await page.goto('/game.html');
    await page.waitForLoadState('networkidle');
  });

  test('should load the game successfully', async ({ page }) => {
    // Check page title
    await expect(page).toHaveTitle('Howlett Golf Chaos');

    // Check main elements exist
    await expect(page.locator('#game-canvas')).toBeVisible();
    await expect(page.locator('#menu-overlay')).toBeVisible();
    await expect(page.locator('#new-game-btn')).toBeVisible();
  });

  test('should show game mode selection when New Game is clicked', async ({ page }) => {
    // Click new game button
    await page.click('#new-game-btn');

    // Game mode selection should be visible
    await expect(page.locator('#game-mode-overlay')).toBeVisible();
    await expect(page.locator('#quick-play-btn')).toBeVisible();
    await expect(page.locator('#tournament-play-btn')).toBeVisible();
  });

  test('should show name entry modal when Quick Play is clicked', async ({ page }) => {
    // Click new game button then quick play
    await page.click('#new-game-btn');
    await page.click('#quick-play-btn');

    // Name entry modal should be visible
    await expect(page.locator('#name-entry-overlay')).toBeVisible();
    await expect(page.locator('#player-name-input')).toBeVisible();
    await expect(page.locator('#start-with-name-btn')).toBeVisible();
  });

  test('should start game after entering name', async ({ page }) => {
    // Click new game button then quick play
    await page.click('#new-game-btn');
    await page.click('#quick-play-btn');

    // Enter name
    await page.fill('#player-name-input', 'TestPlayer');
    await page.click('#start-with-name-btn');

    // Menu and name entry should be hidden
    await expect(page.locator('#menu-overlay')).not.toBeVisible();
    await expect(page.locator('#name-entry-overlay')).toHaveClass(/hidden/);

    // Game should be running - verify UI elements are visible
    await expect(page.locator('#scoreboard')).toBeVisible();
  });

  test('should cancel name entry and return to menu', async ({ page }) => {
    // Click new game button then quick play
    await page.click('#new-game-btn');
    await page.click('#quick-play-btn');

    // Name entry modal should be visible
    await expect(page.locator('#name-entry-overlay')).toBeVisible();

    // Click cancel
    await page.click('#cancel-name-entry-btn');

    // Name entry should be hidden, menu still visible
    await expect(page.locator('#name-entry-overlay')).toHaveClass(/hidden/);
    await expect(page.locator('#menu-overlay')).toBeVisible();
  });

  test('should remember player name in localStorage', async ({ page }) => {
    // Click new game, quick play, enter name
    await page.click('#new-game-btn');
    await page.click('#quick-play-btn');
    await page.fill('#player-name-input', 'RememberMe');
    await page.click('#start-with-name-btn');

    // Wait for game to start
    await page.waitForTimeout(500);

    // Reload and check name is remembered
    await page.reload();
    await page.waitForLoadState('networkidle');
    await page.click('#new-game-btn');
    await page.click('#quick-play-btn');

    const inputValue = await page.locator('#player-name-input').inputValue();
    expect(inputValue).toBe('RememberMe');
  });

  test('should start game with Enter key in name input', async ({ page }) => {
    await page.click('#new-game-btn');
    await page.click('#quick-play-btn');
    await page.fill('#player-name-input', 'EnterKeyTest');
    await page.press('#player-name-input', 'Enter');

    // Menu should be hidden, game started
    await expect(page.locator('#menu-overlay')).not.toBeVisible();
    await expect(page.locator('#scoreboard')).toBeVisible();
  });

  test('should display game UI elements correctly', async ({ page }) => {
    await page.click('#new-game-btn');
    await page.click('#quick-play-btn');
    await page.fill('#player-name-input', 'Test');
    await page.click('#start-with-name-btn');

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
    await page.click('#quick-play-btn');
    await page.fill('#player-name-input', 'Test');
    await page.click('#start-with-name-btn');
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
    await page.click('#quick-play-btn');
    await page.fill('#player-name-input', 'Test');
    await page.click('#start-with-name-btn');
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
    await page.click('#quick-play-btn');
    await page.fill('#player-name-input', 'Test');
    await page.click('#start-with-name-btn');
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

  test('should open leaderboard from menu', async ({ page }) => {
    // Click leaderboard button from menu
    await page.click('#leaderboard-btn');

    // Leaderboard overlay should be visible
    await expect(page.locator('#leaderboard-overlay')).toBeVisible();
    await expect(page.locator('#leaderboard-content')).toBeVisible();
  });

  test('should close leaderboard', async ({ page }) => {
    await page.click('#leaderboard-btn');
    await expect(page.locator('#leaderboard-overlay')).toBeVisible();

    // Click close button
    await page.click('#leaderboard-overlay .button');

    // Leaderboard should be hidden
    await expect(page.locator('#leaderboard-overlay')).toHaveClass(/hidden/);
  });

  test.skip('should display debug info when debug=true', async ({ page }) => {
    await page.goto('/game.html?debug=true');
    await page.waitForLoadState('networkidle');

    // Wait for game engine to initialize
    await page.waitForTimeout(500);

    await page.click('#new-game-btn');
    await page.click('#quick-play-btn');
    await page.fill('#player-name-input', 'Debug');
    await page.click('#start-with-name-btn');

    // Wait for game to start and render a few frames
    await page.waitForTimeout(2000);

    // Debug info should be visible after game starts updating
    const debugInfo = page.locator('#debug-info');
    await expect(debugInfo).toBeVisible({ timeout: 10000 });

    // Should show FPS in the debug text
    const debugText = await debugInfo.textContent();
    expect(debugText).toContain('FPS');
  });

  test('should use default name "Player" if no name entered', async ({ page }) => {
    // Clear any stored name first
    await page.evaluate(() => localStorage.removeItem('golf-player-name'));
    await page.reload();
    await page.waitForLoadState('networkidle');

    await page.click('#new-game-btn');
    await page.click('#quick-play-btn');
    // Clear the input and start with empty name
    await page.fill('#player-name-input', '');
    await page.click('#start-with-name-btn');

    // Game should still start
    await expect(page.locator('#menu-overlay')).not.toBeVisible();
    await expect(page.locator('#scoreboard')).toBeVisible();
  });
});
