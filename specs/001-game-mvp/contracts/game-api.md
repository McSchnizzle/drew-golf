# Game API Contracts

**Feature**: 001-game-mvp
**Date**: 2025-12-06

## Overview

This document defines the internal JavaScript API contracts for all game modules. Since this is a client-side single-page application, these are JavaScript module interfaces rather than HTTP APIs.

## Module Architecture

```
GameEngine (orchestrator)
├── PhysicsEngine
├── Renderer
├── InputHandler
├── CourseGenerator
├── ClubSystem
├── ScoreKeeper
├── StorageManager
├── AudioManager
├── UIManager
└── TutorialManager
```

## 1. GameEngine Module

**Purpose**: Central orchestrator managing game loop and state transitions

### Interface

```javascript
class GameEngine {
  /**
   * Initialize the game engine
   * @param {HTMLCanvasElement} canvas - Game canvas element
   * @param {Object} settings - Initial settings from localStorage
   */
  constructor(canvas, settings)

  /**
   * Start the game loop
   * @returns {void}
   */
  start()

  /**
   * Pause the game
   * @returns {void}
   */
  pause()

  /**
   * Resume the game
   * @returns {void}
   */
  resume()

  /**
   * Start a new round
   * @param {Number} seed - Optional RNG seed for reproducibility
   * @returns {void}
   */
  startNewRound(seed = null)

  /**
   * Load a saved round from storage
   * @param {Object} savedState - Saved game state
   * @returns {void}
   */
  loadRound(savedState)

  /**
   * Execute a golf swing
   * @param {Object} swingVector - {power: Number, angle: Number}
   * @returns {void}
   */
  executeSwing(swingVector)

  /**
   * Switch to a different club
   * @param {String} clubId - Club identifier (e.g., 'driver', 'putter')
   * @returns {Boolean} - Success status (false if ball is moving)
   */
  selectClub(clubId)

  /**
   * Main game loop (called via requestAnimationFrame)
   * @param {Number} timestamp - High-resolution timestamp
   * @private
   */
  update(timestamp)
}
```

### Events Emitted

```javascript
// Custom events for UI updates
'gameStarted' - When new round begins
'holeCompleted' - { holeNumber, strokes, par, scoreRelativeToPar }
'roundCompleted' - { totalStrokes, scoreRelativeToPar }
'ballMoving' - Ball is in motion
'ballStopped' - Ball came to rest
'clubChanged' - { clubId, clubName }
```

## 2. PhysicsEngine Module

**Purpose**: Calculate ball movement, collisions, and physics interactions

### Interface

```javascript
class PhysicsEngine {
  /**
   * Initialize physics engine
   * @param {Object} config - {gravity, friction, airResistance}
   */
  constructor(config = {})

  /**
   * Update ball physics for one frame
   * @param {Object} ball - Ball entity (see data-model.md)
   * @param {Number} deltaTime - Time since last frame (seconds)
   * @param {Array<Object>} obstacles - Current hole obstacles
   * @returns {Object} - Updated ball state
   */
  updateBall(ball, deltaTime, obstacles)

  /**
   * Apply initial velocity from club swing
   * @param {Object} ball - Ball entity
   * @param {Object} swingVector - {power, angle}
   * @param {Object} club - Club entity
   * @returns {Object} - Updated ball with initial velocity
   */
  applySwing(ball, swingVector, club)

  /**
   * Check collision with an obstacle
   * @param {Object} ball - Ball entity
   * @param {Object} obstacle - Obstacle entity
   * @returns {Object|null} - Collision data or null if no collision
   */
  checkCollision(ball, obstacle)

  /**
   * Check if ball is in the hole
   * @param {Object} ball - Ball entity
   * @param {Object} holePosition - {x, y, radius}
   * @returns {Boolean}
   */
  isBallInHole(ball, holePosition)

  /**
   * Calculate distance from ball to hole
   * @param {Object} ball - Ball entity
   * @param {Object} holePosition - {x, y}
   * @returns {Number} - Distance in pixels
   */
  distanceToHole(ball, holePosition)
}
```

### Physics Constants

```javascript
// Default values (configurable)
const PHYSICS_CONFIG = {
  gravity: 9.8,              // m/s² (scaled to canvas units)
  friction: 0.95,            // Rolling friction coefficient
  airResistance: 0.99,       // Air drag coefficient
  bounceRestitution: 0.6,    // Energy retention on bounce (0-1)
  stoppingVelocity: 0.5,     // Velocity threshold for "stopped" state
  holeRadius: 10             // Hole cup radius in pixels
};
```

## 3. Renderer Module

**Purpose**: Draw game state to canvas

### Interface

```javascript
class Renderer {
  /**
   * Initialize renderer
   * @param {HTMLCanvasElement} canvas - Game canvas
   */
  constructor(canvas)

  /**
   * Render current game frame
   * @param {Object} gameState - Complete game state
   * @returns {void}
   */
  renderFrame(gameState)

  /**
   * Draw the course background (cached)
   * @param {Object} hole - Hole entity
   * @returns {void}
   */
  drawCourse(hole)

  /**
   * Draw the ball
   * @param {Object} ball - Ball entity
   * @returns {void}
   */
  drawBall(ball)

  /**
   * Draw obstacles
   * @param {Array<Object>} obstacles - Array of obstacle entities
   * @returns {void}
   */
  drawObstacles(obstacles)

  /**
   * Draw swing guide arrow (during touch drag)
   * @param {Object} startPos - {x, y}
   * @param {Object} swingVector - {power, angle}
   * @returns {void}
   */
  drawGuideArrow(startPos, swingVector)

  /**
   * Draw visual effects (confetti, etc.)
   * @param {Array<Object>} effects - Active effects
   * @returns {void}
   */
  drawEffects(effects)

  /**
   * Clear a specific canvas region
   * @param {Object} rect - {x, y, width, height}
   * @returns {void}
   */
  clearRegion(rect)
}
```

### Drawing Layers (Z-index order)

1. **Background**: Course layout (tee, fairway, green)
2. **Obstacles**: Sand, water, trees, rocks
3. **Guide Arrow**: Swing trajectory preview
4. **Ball**: Golf ball with rotation
5. **Effects**: Confetti, streaker, animations
6. **UI Overlay**: HTML elements (not canvas)

## 4. InputHandler Module

**Purpose**: Process touch events and translate to game actions

### Interface

```javascript
class InputHandler {
  /**
   * Initialize input handler
   * @param {HTMLCanvasElement} canvas - Game canvas
   * @param {GameEngine} gameEngine - Reference to game engine
   */
  constructor(canvas, gameEngine)

  /**
   * Enable touch input
   * @returns {void}
   */
  enable()

  /**
   * Disable touch input (e.g., during menus)
   * @returns {void}
   */
  disable()

  /**
   * Calculate swing vector from touch positions
   * @param {Object} startPos - {x, y}
   * @param {Object} endPos - {x, y}
   * @returns {Object} - {power: Number (0-1), angle: Number (radians)}
   */
  calculateSwingVector(startPos, endPos)

  /**
   * Handle touch start event
   * @param {TouchEvent} event
   * @private
   */
  onTouchStart(event)

  /**
   * Handle touch move event
   * @param {TouchEvent} event
   * @private
   */
  onTouchMove(event)

  /**
   * Handle touch end event
   * @param {TouchEvent} event
   * @private
   */
  onTouchEnd(event)
}
```

### Input Validation

```javascript
// Constraints for valid swings
const INPUT_CONSTRAINTS = {
  minSwipeDistance: 20,      // pixels
  maxSwipeDistance: 300,     // pixels
  touchTimeout: 3000         // ms - max time between start and end
};
```

## 5. CourseGenerator Module

**Purpose**: Generate hole layouts and obstacle placements

### Interface

```javascript
class CourseGenerator {
  /**
   * Initialize course generator
   * @param {Number} seed - RNG seed for reproducibility
   */
  constructor(seed = Date.now())

  /**
   * Generate a specific hole
   * @param {Number} holeNumber - 1-9
   * @returns {Object} - Complete hole entity (see data-model.md)
   */
  generateHole(holeNumber)

  /**
   * Get hole template (base layout before randomization)
   * @param {Number} holeNumber - 1-9
   * @returns {Object} - Hole template
   */
  getHoleTemplate(holeNumber)

  /**
   * Place randomized obstacles on a hole
   * @param {Object} holeTemplate - Base hole configuration
   * @returns {Array<Object>} - Array of obstacle entities
   */
  placeObstacles(holeTemplate)

  /**
   * Reset RNG seed (for debugging/testing)
   * @param {Number} seed - New seed value
   * @returns {void}
   */
  setSeed(seed)
}
```

### Hole Template Format

```javascript
{
  holeNumber: 1,
  par: 3,
  lengthCategory: 'short',
  teePosition: { x: 50, y: 400 },
  greenPosition: { x: 700, y: 400 },
  greenRadius: 80,
  fairwayWidth: 100,
  // Obstacle placement regions (where obstacles CAN be placed)
  obstacleRegions: [
    { x: 200, y: 300, width: 200, height: 200 }
  ]
}
```

## 6. ClubSystem Module

**Purpose**: Manage club selection and characteristics

### Interface

```javascript
class ClubSystem {
  /**
   * Get club by ID
   * @param {String} clubId - e.g., 'driver', 'putter'
   * @returns {Object} - Club entity (see data-model.md)
   */
  getClub(clubId)

  /**
   * Get all available clubs
   * @returns {Array<Object>} - Array of club entities
   */
  getAllClubs()

  /**
   * Get clubs available for current ball position
   * @param {Object} ball - Ball entity
   * @param {Object} hole - Hole entity
   * @param {Boolean} isFirstStroke - True if this is tee shot
   * @returns {Array<Object>} - Array of selectable clubs
   */
  getAvailableClubs(ball, hole, isFirstStroke)

  /**
   * Apply club characteristics to a swing
   * @param {Object} club - Club entity
   * @param {Object} baseSwing - {power, angle}
   * @returns {Object} - Modified swing with club multipliers
   */
  applyClubToSwing(club, baseSwing)

  /**
   * Get recommended club for current situation
   * @param {Object} ball - Ball entity
   * @param {Object} hole - Hole entity
   * @returns {String} - Recommended club ID
   */
  getRecommendedClub(ball, hole)
}
```

### Club Selection Rules

```javascript
// Business logic for club availability
const CLUB_RULES = {
  // First stroke of each hole must use driver
  firstStroke: ['driver'],

  // When on green (distance < green radius), recommend putter
  onGreen: (distanceToHole, greenRadius) => distanceToHole < greenRadius,

  // In sand, recommend wedge
  inSand: (ball, obstacles) => {
    // Check if ball is in sand obstacle
  }
};
```

## 7. ScoreKeeper Module

**Purpose**: Track strokes and calculate scores

### Interface

```javascript
class ScoreKeeper {
  /**
   * Initialize score keeper
   */
  constructor()

  /**
   * Start tracking a new hole
   * @param {Number} holeNumber - 1-9
   * @param {Number} par - Hole par value
   * @returns {void}
   */
  startHole(holeNumber, par)

  /**
   * Record a stroke
   * @returns {Number} - Current stroke count for hole
   */
  recordStroke()

  /**
   * Complete the current hole
   * @returns {Object} - {holeNumber, strokes, par, scoreRelativeToPar}
   */
  completeHole()

  /**
   * Get current round summary
   * @returns {Object} - {totalStrokes, totalPar, scoreRelativeToPar, holeScores}
   */
  getRoundSummary()

  /**
   * Reset score keeper (start new round)
   * @returns {void}
   */
  reset()
}
```

### Score Calculation

```javascript
// Score relative to par calculation
function calculateScoreRelativeToPar(strokes, par) {
  return strokes - par; // Negative is under par (good), positive is over par
}

// Score labels
const SCORE_LABELS = {
  '-4': 'Condor',
  '-3': 'Albatross',
  '-2': 'Eagle',
  '-1': 'Birdie',
  '0': 'Par',
  '1': 'Bogey',
  '2': 'Double Bogey',
  '3': 'Triple Bogey'
  // 4+: Just show "+4", "+5", etc.
};
```

## 8. StorageManager Module

**Purpose**: Persist and retrieve game data

### Interface

```javascript
class StorageManager {
  /**
   * Initialize storage (open IndexedDB connection)
   * @returns {Promise<void>}
   */
  static async init()

  /**
   * Save current game state
   * @param {Object} gameState - Complete game state
   * @returns {Promise<void>}
   */
  static async saveGameState(gameState)

  /**
   * Load saved game state
   * @returns {Promise<Object|null>} - Saved state or null if none exists
   */
  static async loadGameState()

  /**
   * Clear saved game state (after round completion)
   * @returns {Promise<void>}
   */
  static async clearGameState()

  /**
   * Add entry to leaderboard
   * @param {Object} entry - LeaderboardEntry entity
   * @returns {Promise<void>}
   */
  static async addLeaderboardEntry(entry)

  /**
   * Get top N leaderboard entries
   * @param {Number} limit - Default 10
   * @returns {Promise<Array<Object>>} - Array of leaderboard entries, sorted
   */
  static async getLeaderboard(limit = 10)

  /**
   * Save setting to localStorage
   * @param {String} key - Setting key
   * @param {any} value - Setting value
   * @returns {void}
   */
  static saveSetting(key, value)

  /**
   * Load setting from localStorage
   * @param {String} key - Setting key
   * @param {any} defaultValue - Default if not found
   * @returns {any} - Setting value
   */
  static loadSetting(key, defaultValue)
}
```

### Storage Error Handling

```javascript
// Error recovery strategies
const STORAGE_ERRORS = {
  QUOTA_EXCEEDED: 'StorageQuotaExceeded',
  NOT_AVAILABLE: 'StorageNotAvailable',
  CORRUPT_DATA: 'CorruptData'
};

// Fallback chain: IndexedDB → localStorage → in-memory only
```

## 9. AudioManager Module

**Purpose**: Play sound effects and manage audio

### Interface

```javascript
class AudioManager {
  /**
   * Initialize audio manager
   * @returns {Promise<void>}
   */
  async init()

  /**
   * Play a sound effect
   * @param {String} soundName - e.g., 'clubHit', 'ballLandGrass'
   * @returns {void}
   */
  play(soundName)

  /**
   * Toggle mute
   * @param {Boolean} muted - True to mute, false to unmute
   * @returns {void}
   */
  setMuted(muted)

  /**
   * Check if audio is ready
   * @returns {Boolean}
   */
  isReady()

  /**
   * Preload all audio files
   * @returns {Promise<void>}
   */
  preload()
}
```

### Sound Effects

```javascript
const SOUND_EFFECTS = {
  clubHit: { file: 'sounds/club-hit.mp3', duration: 0.5 },
  ballLandGrass: { file: 'sounds/ball-land-grass.mp3', duration: 0.3 },
  ballLandSand: { file: 'sounds/ball-land-sand.mp3', duration: 0.4 },
  ballLandWater: { file: 'sounds/ball-land-water.mp3', duration: 0.6 },
  cheer: { file: 'sounds/cheer.mp3', duration: 1.0 },
  holeComplete: { file: 'sounds/hole-complete.mp3', duration: 1.5 },
  streaker: { file: 'sounds/streaker.mp3', duration: 0.8 }
};
```

## 10. UIManager Module

**Purpose**: Manage HTML UI overlays (menus, scoreboard, buttons)

### Interface

```javascript
class UIManager {
  /**
   * Initialize UI manager
   * @param {HTMLElement} uiContainer - Container for UI overlays
   */
  constructor(uiContainer)

  /**
   * Show main menu
   * @returns {void}
   */
  showMainMenu()

  /**
   * Hide main menu
   * @returns {void}
   */
  hideMainMenu()

  /**
   * Update scoreboard display
   * @param {Object} scoreData - {currentHole, strokes, par, totalScore}
   * @returns {void}
   */
  updateScoreboard(scoreData)

  /**
   * Show club selector
   * @param {Array<Object>} availableClubs - Array of club entities
   * @param {String} selectedClubId - Currently selected club
   * @returns {void}
   */
  showClubSelector(availableClubs, selectedClubId)

  /**
   * Hide club selector
   * @returns {void}
   */
  hideClubSelector()

  /**
   * Show leaderboard overlay
   * @param {Array<Object>} entries - Leaderboard entries
   * @returns {void}
   */
  showLeaderboard(entries)

  /**
   * Show tutorial overlay
   * @param {Number} stepIndex - Current tutorial step (0-based)
   * @returns {void}
   */
  showTutorial(stepIndex)

  /**
   * Show round completion screen
   * @param {Object} roundSummary - Final round stats
   * @returns {void}
   */
  showRoundComplete(roundSummary)

  /**
   * Show confirmation dialog
   * @param {String} message - Confirmation message
   * @param {Function} onConfirm - Callback for confirm action
   * @param {Function} onCancel - Callback for cancel action
   * @returns {void}
   */
  showConfirmDialog(message, onConfirm, onCancel)
}
```

### UI Events

```javascript
// UI interactions that trigger game actions
'clubSelected' - { clubId }
'newGameRequested' - {}
'continueGameRequested' - {}
'viewLeaderboardRequested' - {}
'tutorialStepCompleted' - { stepIndex }
'settingsChanged' - { key, value }
```

## 11. TutorialManager Module

**Purpose**: Guide first-time players through game mechanics

### Interface

```javascript
class TutorialManager {
  /**
   * Initialize tutorial manager
   * @param {GameEngine} gameEngine - Reference to game engine
   * @param {UIManager} uiManager - Reference to UI manager
   */
  constructor(gameEngine, uiManager)

  /**
   * Start the tutorial
   * @returns {void}
   */
  start()

  /**
   * Advance to next tutorial step
   * @returns {void}
   */
  nextStep()

  /**
   * Skip tutorial
   * @returns {void}
   */
  skip()

  /**
   * Check if tutorial is complete
   * @returns {Boolean}
   */
  isComplete()

  /**
   * Mark tutorial as completed (persist to storage)
   * @returns {void}
   */
  markComplete()
}
```

### Tutorial Steps

```javascript
const TUTORIAL_STEPS = [
  {
    title: 'Welcome to Howlett Golf Chaos!',
    instruction: 'Drag your finger backward to aim and set power, then release to swing.',
    action: 'performSwing'
  },
  {
    title: 'Club Selection',
    instruction: 'Tap the club icon to choose different clubs for different distances.',
    action: 'selectClub'
  },
  {
    title: 'Reading Indicators',
    instruction: 'Watch the guide arrow to see your shot direction and power.',
    action: 'watchIndicator'
  },
  {
    title: 'Avoiding Obstacles',
    instruction: 'Avoid sand, water, and trees. Plan your shots carefully!',
    action: 'completeHole'
  }
];
```

## Module Dependencies

```
GameEngine
├── PhysicsEngine (no dependencies)
├── Renderer (no dependencies)
├── InputHandler → GameEngine (circular ref managed via callbacks)
├── CourseGenerator (no dependencies)
├── ClubSystem (no dependencies)
├── ScoreKeeper (no dependencies)
├── StorageManager (no dependencies)
├── AudioManager (no dependencies)
├── UIManager → GameEngine (via events)
└── TutorialManager → GameEngine, UIManager
```

## Error Handling Patterns

All modules should follow consistent error handling:

```javascript
try {
  // Operation
} catch (error) {
  console.error(`[ModuleName] Error: ${error.message}`, error);
  // Graceful degradation or user notification
  // Never crash the entire game
}
```

## Testing Contracts

Each module should expose a test interface for unit testing:

```javascript
// Example: PhysicsEngine test interface
class PhysicsEngine {
  // ... normal methods ...

  // Test-only methods (removed in production build)
  _test() {
    return {
      getGravity: () => this.gravity,
      setGravity: (g) => { this.gravity = g; },
      resetState: () => { /* reset internal state */ }
    };
  }
}
```

## Performance Contracts

### Frame Budget

Each module must stay within its frame budget for 60fps (16.67ms total):

| Module | Max Time per Frame |
|--------|-------------------|
| PhysicsEngine | 3ms |
| Renderer | 10ms |
| InputHandler | 1ms |
| GameEngine (orchestration) | 2ms |
| Other | 0.67ms |

### Memory Budget

Rough estimates to stay under 50MB total:

| Module | Memory Budget |
|--------|--------------|
| Renderer (canvas buffers) | 10MB |
| Audio (loaded sounds) | 5MB |
| Game state | 1MB |
| Course data | 2MB |
| Other | 2MB |

## Next Steps

These API contracts serve as the blueprint for implementation. Each module should be developed independently following these contracts, allowing parallel development and easy testing.
