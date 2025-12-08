# Data Model: Howlett Golf Chaos

**Feature**: 001-game-mvp
**Date**: 2025-12-06

## Overview

This document defines the data structures and state management for the golf game. All data is stored client-side using localStorage (settings) and IndexedDB (game state, leaderboard).

## Core Entities

### 1. Ball

Represents the golf ball's current state during gameplay.

```javascript
{
  // Position
  x: Number,              // X coordinate in canvas pixels
  y: Number,              // Y coordinate in canvas pixels

  // Physics state
  velocityX: Number,      // Horizontal velocity (pixels/second)
  velocityY: Number,      // Vertical velocity (pixels/second)
  spin: Number,           // Ball spin affecting trajectory (0-1)
  isAirborne: Boolean,    // True if ball is in flight, false if rolling/stopped
  isMoving: Boolean,      // True if ball has any velocity

  // Visual state
  rotation: Number,       // Current rotation angle for animation (0-360 degrees)

  // Gameplay state
  distanceFromHole: Number  // Calculated distance to hole in pixels
}
```

**Validation Rules**:
- `x` and `y` must be within canvas bounds
- `velocityX` and `velocityY` range: -2000 to 2000 pixels/second
- `spin` range: 0.0 to 1.0
- `distanceFromHole` recalculated each frame

**State Transitions**:
1. **At Rest** → **Swinging** (on touch start)
2. **Swinging** → **Airborne** (on touch end/release)
3. **Airborne** → **Rolling** (on ground contact, velocity > 0)
4. **Rolling** → **Stopped** (velocity < threshold)
5. **Stopped** → **In Hole** (distance < hole radius)

### 2. Hole

Represents one golf hole configuration.

```javascript
{
  // Metadata
  holeNumber: Number,     // 1-9
  par: Number,            // 3, 4, or 5
  lengthCategory: String, // 'short', 'medium', or 'long'

  // Course layout
  teePosition: {
    x: Number,
    y: Number
  },
  greenPosition: {
    x: Number,
    y: Number
  },
  holePosition: {        // Cup location on green
    x: Number,
    y: Number
  },
  fairwayWidth: Number,  // Width of the fairway in pixels

  // Obstacles (randomized each load)
  obstacles: [
    {
      type: String,      // 'sand', 'water', 'tree', 'rock'
      x: Number,
      y: Number,
      radius: Number,    // Or width/height for rectangular obstacles
      shape: String      // 'circle' or 'rectangle'
    }
  ],

  // Randomness tracking
  seed: Number           // RNG seed used to generate this hole layout
}
```

**Validation Rules**:
- `holeNumber` must be 1-9
- `par` must be 3, 4, or 5
- `lengthCategory` must be one of: 'short', 'medium', 'long'
- All positions must be within canvas bounds
- Obstacles must not overlap with tee or green positions

### 3. Club

Represents a golf club's characteristics.

```javascript
{
  id: String,            // 'driver', 'wood3', 'iron5', 'putter', etc.
  name: String,          // Display name: 'Driver', '3-Wood', '5-Iron', etc.
  maxPower: Number,      // Power multiplier (0.0-1.0)
  arcMultiplier: Number, // Trajectory arc modifier (0.1-1.5)
  spinMultiplier: Number // Spin influence (0.0-1.2)
}
```

**Validation Rules**:
- `maxPower` range: 0.0 to 1.0
- `arcMultiplier` range: 0.1 to 1.5
- `spinMultiplier` range: 0.0 to 1.2

**Predefined Clubs** (see research.md for full definitions):
- Driver, 3-Wood, 5-Wood
- Irons: 4, 5, 6, 7, 8, 9
- Wedge, Putter

### 4. Round

Represents a complete 9-hole game session.

```javascript
{
  // Metadata
  roundId: String,       // UUID or timestamp-based ID
  startTime: Number,     // Timestamp (milliseconds since epoch)
  endTime: Number | null,// Timestamp when round completed, null if in progress

  // Progress tracking
  currentHole: Number,   // 1-9, which hole player is on
  isComplete: Boolean,   // True when all 9 holes finished

  // Scoring
  holeScores: [
    {
      holeNumber: Number,
      strokes: Number,
      par: Number,
      scoreRelativeToPar: Number  // e.g., +1, -2, 0
    }
  ],

  totalStrokes: Number,
  totalPar: Number,      // Sum of all hole pars
  scoreRelativeToPar: Number,  // Total strokes - total par

  // Current game state (for resume functionality)
  currentBallPosition: {
    x: Number,
    y: Number
  },
  currentClubId: String,
  currentStrokeCount: Number  // Strokes on current hole
}
```

**Validation Rules**:
- `currentHole` must be 1-9
- `holeScores` length must equal `currentHole - 1` for in-progress rounds
- `totalStrokes` must equal sum of all `holeScores[].strokes`
- `isComplete` true only when `holeScores.length === 9`

**State Transitions**:
1. **New Round** → created with `currentHole = 1`, empty `holeScores`
2. **Hole Complete** → append to `holeScores`, increment `currentHole`
3. **Round Complete** → set `isComplete = true`, record `endTime`

### 5. LeaderboardEntry

Represents a completed round stored in leaderboard.

```javascript
{
  // Unique identifier
  entryId: String,       // UUID

  // Round summary
  scoreRelativeToPar: Number,  // e.g., +7, -3, 0
  totalStrokes: Number,
  totalPar: Number,

  // Metadata
  completedAt: Number,   // Timestamp (milliseconds)
  playerInitials: String | null,  // Optional 2-3 character initials

  // Detailed breakdown (optional, for review)
  holeScores: [
    {
      holeNumber: Number,
      strokes: Number,
      par: Number
    }
  ]
}
```

**Validation Rules**:
- Only top 10 entries stored (sorted by `scoreRelativeToPar` ascending)
- `playerInitials` max length: 3 characters
- `completedAt` must be valid timestamp

**Sorting**:
- Primary: `scoreRelativeToPar` ascending (lower is better)
- Secondary: `completedAt` descending (more recent ties ranked higher)

### 6. GameState

Represents the current global game state (singleton).

```javascript
{
  // Active round
  currentRound: Round | null,  // Null if no round in progress

  // Current gameplay state
  currentHole: Hole,
  ball: Ball,
  selectedClub: Club,

  // UI state
  isSwinging: Boolean,    // True while player is dragging for swing
  isPaused: Boolean,      // True if game paused
  showTutorial: Boolean,  // True if tutorial overlay active

  // Settings (synced with localStorage)
  soundEnabled: Boolean,
  tutorialCompleted: Boolean,

  // Debug state
  debugMode: Boolean,
  fixedSeed: Number | null  // If set, use this seed instead of random
}
```

**Validation Rules**:
- If `currentRound` is null, `currentHole` and `ball` should be in "menu" state
- `selectedClub` must be 'driver' for first stroke of each hole
- Cannot change `selectedClub` while `isSwinging === true` or `ball.isMoving === true`

### 7. Obstacle

Represents a course hazard.

```javascript
{
  type: String,          // 'sand', 'water', 'tree', 'rock'
  x: Number,
  y: Number,
  width: Number,         // For rectangular obstacles
  height: Number,        // For rectangular obstacles
  radius: Number,        // For circular obstacles
  shape: String          // 'circle' or 'rectangle'
}
```

**Physics Interactions**:
- **Sand**: Stops ball immediately, increases friction (ball settles in sand)
- **Water**: Resets ball to last position before water, adds 1 stroke penalty
- **Tree**: Solid collision, ball bounces off with velocity reversal
- **Rock**: Solid collision, ball bounces off with velocity reversal

**Rendering**:
- Sand: Tan/beige circle or oval with textured pattern
- Water: Blue rectangle or irregular shape with wave animation
- Tree: Green circle (canopy) with brown trunk
- Rock: Gray circle with shadow

## Storage Schema

### localStorage Keys

```javascript
// Settings (simple key-value)
'soundEnabled': 'true' | 'false'
'tutorialCompleted': 'true' | 'false'
'playerInitials': String  // Last used initials for leaderboard
```

### IndexedDB Schema

**Database Name**: `cartoonGolfChaos`
**Version**: 1

**Object Stores**:

1. **gameState**
   - Key: `'current'` (single record)
   - Value: Complete `GameState` object
   - Used for: Save/resume functionality

2. **leaderboard**
   - Key: Auto-incrementing integer
   - Value: `LeaderboardEntry` object
   - Index: `scoreRelativeToPar` (for sorting)
   - Max entries: 10 (prune on insert)

3. **roundHistory** (optional, for future features)
   - Key: `roundId` (UUID string)
   - Value: Complete `Round` object
   - Used for: Viewing past rounds beyond top 10

## Data Flow Diagrams

### Game Loop Data Flow

```
┌─────────────────┐
│  Input Handler  │ (touch events)
└────────┬────────┘
         │
         v
┌─────────────────┐
│  Game Engine    │ (update game state)
└────────┬────────┘
         │
         v
┌─────────────────┐
│ Physics Engine  │ (update ball position/velocity)
└────────┬────────┘
         │
         v
┌─────────────────┐
│    Renderer     │ (draw to canvas)
└─────────────────┘
```

### Persistence Data Flow

```
┌──────────────┐
│  Game Engine │
└──────┬───────┘
       │ (on state change)
       v
┌──────────────┐
│   Storage    │
│   Manager    │
└──────┬───────┘
       │
       ├─────> localStorage (settings)
       │
       └─────> IndexedDB (game state, leaderboard)
```

### Round Completion Flow

```
Player sinks ball on hole 9
       │
       v
Update holeScores[], set isComplete=true
       │
       v
Calculate scoreRelativeToPar
       │
       v
Create LeaderboardEntry
       │
       v
Insert into IndexedDB leaderboard store
       │
       v
Prune to top 10 entries
       │
       v
Clear currentRound from gameState
       │
       v
Save updated gameState to IndexedDB
```

## State Management Patterns

### Initialization

```javascript
async function initGame() {
  // 1. Load settings from localStorage
  const settings = loadSettings();

  // 2. Attempt to load saved game state from IndexedDB
  const savedState = await StorageManager.loadGameState();

  // 3. If saved state exists, offer resume or new game
  if (savedState && savedState.currentRound) {
    // Show "Continue" or "New Game" menu
  } else {
    // Start new game
    gameState = createNewGameState();
  }

  // 4. Initialize game engine with loaded/new state
  gameEngine.init(gameState);
}
```

### Auto-Save Strategy

Save game state to IndexedDB when:
- Ball comes to rest after each stroke
- Player switches clubs
- Hole completes
- Game paused/backgrounded (via `visibilitychange` event)

**Debouncing**: Only save once per 2 seconds max to avoid excessive writes

### Leaderboard Update

```javascript
async function addLeaderboardEntry(round) {
  const entry = {
    entryId: generateUUID(),
    scoreRelativeToPar: round.scoreRelativeToPar,
    totalStrokes: round.totalStrokes,
    totalPar: round.totalPar,
    completedAt: Date.now(),
    playerInitials: localStorage.getItem('playerInitials') || null,
    holeScores: round.holeScores
  };

  await StorageManager.addLeaderboardEntry(entry);
}
```

## Validation and Error Handling

### Data Validation

All entities include validation functions:

```javascript
function validateBall(ball) {
  if (ball.x < 0 || ball.x > canvasWidth) return false;
  if (ball.y < 0 || ball.y > canvasHeight) return false;
  if (ball.velocityX < -2000 || ball.velocityX > 2000) return false;
  // ... more validations
  return true;
}
```

### Storage Error Handling

```javascript
async function saveWithFallback(data) {
  try {
    await IndexedDB.save(data);
  } catch (error) {
    console.warn('IndexedDB failed, attempting localStorage fallback');
    try {
      localStorage.setItem('gameState_backup', JSON.stringify(data));
    } catch (localError) {
      // Storage completely failed, warn user
      showWarning('Unable to save game progress. Storage may be full.');
    }
  }
}
```

### Corrupt Data Recovery

If loaded data fails validation:
1. Log error to console
2. Discard corrupt data
3. Start fresh game state
4. Notify user: "Previous game data was corrupted. Starting new game."

## Performance Considerations

### Memory Management

- Limit `roundHistory` to 50 most recent rounds to prevent unbounded growth
- Clear old leaderboard entries beyond top 10 immediately on insert
- Reuse object instances for frequently updated entities (Ball, GameState) instead of creating new objects each frame

### Indexing Strategy

IndexedDB indexes:
- `leaderboard.scoreRelativeToPar` - for fast sorted queries
- `roundHistory.completedAt` - for chronological lookups (if implemented)

### Serialization Optimization

- Use structured cloning for IndexedDB (native support)
- Avoid serializing functions or circular references
- Keep serialized game state under 10KB for fast save/load

## Future Extensibility

Potential additions (not in current scope):

1. **Achievements**: New object store tracking unlocked achievements
2. **Custom Courses**: User-created hole templates stored in IndexedDB
3. **Replay Data**: Stroke-by-stroke recording for replay feature
4. **Multiplayer**: Store multiple player profiles with separate leaderboards

These would require schema version increments and migration logic.
