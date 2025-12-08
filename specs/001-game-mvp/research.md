# Research: Howlett Golf Chaos Technical Decisions

**Feature**: 001-game-mvp
**Date**: 2025-12-06
**Status**: Complete

## Overview

This document captures technical research and decisions for implementing the iPad golf game as a single-page application with client-side physics, rendering, and persistence.

## Decision 1: Physics Engine Approach

**Decision**: Custom lightweight 2D physics engine using vector mathematics

**Rationale**:
- Full physics libraries (matter.js, Box2D) add 100KB+ to file size
- Golf ball physics only needs: trajectory calculation, gravity, friction, collision detection
- Simple vector math can achieve realistic feel without complex rigid body dynamics
- Allows fine-tuning ball "feel" for gameplay (physics accuracy less critical than fun)

**Alternatives Considered**:
- **matter.js**: Full 2D physics engine (100KB+), overkill for ball-only simulation
- **Box2D (via emscripten)**: Even larger, designed for complex multi-body scenarios
- **p2.js**: Lightweight option (60KB), but still includes unused features

**Implementation Approach**:
```javascript
// Ball physics components needed:
// 1. Launch: Initial velocity from swing power/angle
// 2. Flight: Parabolic trajectory with gravity and air resistance
// 3. Landing: Bounce calculation (coefficient of restitution)
// 4. Rolling: Friction deceleration on ground
// 5. Collisions: Circle-to-polygon tests for obstacles

class BallPhysics {
  constructor(gravity = 9.8, friction = 0.95, airResistance = 0.99) {
    this.gravity = gravity;
    this.friction = friction;
    this.airResistance = airResistance;
  }

  update(ball, deltaTime) {
    // Apply forces, update position, check collisions
  }
}
```

**File Size Impact**: ~5KB for custom physics vs 60-100KB for library

## Decision 2: Rendering Strategy

**Decision**: HTML5 Canvas 2D with layered rendering and dirty rectangle optimization

**Rationale**:
- Canvas 2D API simpler than WebGL for 2D top-down view
- Supports all needed features: drawing circles, paths, images, text
- Excellent Safari iOS support since iOS 3.2
- Layered approach: static background, dynamic elements, UI overlay

**Alternatives Considered**:
- **WebGL**: More complex API, better for 3D or massive particle effects (not needed here)
- **SVG DOM manipulation**: Slower for real-time animation, harder to optimize
- **CSS animations**: Limited control over physics-driven movement

**Implementation Approach**:
```javascript
// Three-layer rendering:
// 1. Background layer: Course layout (drawn once per hole)
// 2. Game layer: Ball, dynamic obstacles, animations
// 3. UI layer: HTML overlay for scoreboard, buttons

class Renderer {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.backgroundCache = document.createElement('canvas');
  }

  renderFrame(gameState) {
    // Only redraw changed regions (dirty rectangles)
    this.clearDirtyRegions();
    this.drawBall(gameState.ball);
    this.drawAnimations(gameState.effects);
  }
}
```

**Performance Target**: 60fps achieved by:
- Caching static elements (course background)
- Only redrawing moving objects
- Using `requestAnimationFrame` for smooth updates
- Limiting particle effects (confetti) to <100 particles

## Decision 3: State Persistence Strategy

**Decision**: Hybrid approach - localStorage for settings, IndexedDB for game state/leaderboard

**Rationale**:
- localStorage: Simple key-value storage, perfect for settings (5MB limit)
- IndexedDB: Structured object storage, better for complex data like round history (50MB+ limit)
- Asynchronous IndexedDB prevents UI blocking during save/load

**Alternatives Considered**:
- **localStorage only**: Simple but 5MB limit may restrict leaderboard history
- **IndexedDB only**: More complex API for simple settings
- **Cookies**: Too small (4KB), designed for server communication

**Implementation Approach**:
```javascript
// Settings in localStorage
const settings = {
  soundEnabled: localStorage.getItem('soundEnabled') === 'true',
  tutorialCompleted: localStorage.getItem('tutorialCompleted') === 'true'
};

// Game state and leaderboard in IndexedDB
class StorageManager {
  async saveGameState(state) {
    const db = await this.openDB();
    const tx = db.transaction('gameState', 'readwrite');
    await tx.objectStore('gameState').put(state, 'current');
  }

  async saveLeaderboardEntry(entry) {
    const db = await this.openDB();
    const tx = db.transaction('leaderboard', 'readwrite');
    const store = tx.objectStore('leaderboard');
    await store.add(entry);

    // Keep only top 10
    const all = await store.getAll();
    if (all.length > 10) {
      const sorted = all.sort((a, b) => a.scoreRelativeToPar - b.scoreRelativeToPar);
      for (let i = 10; i < sorted.length; i++) {
        await store.delete(sorted[i].id);
      }
    }
  }
}
```

**Storage Estimates**:
- Settings: <1KB
- Game state snapshot: ~2KB
- Leaderboard entry: ~200 bytes
- 10 entries: ~2KB
- Total: <5KB (well within limits)

## Decision 4: Touch Input Handling

**Decision**: Custom touch gesture system with visual feedback pipeline

**Rationale**:
- Native touch events (`touchstart`, `touchmove`, `touchend`) provide all needed data
- No gesture library needed for simple drag-to-swing mechanic
- Direct control over event handling for optimal responsiveness

**Alternatives Considered**:
- **Hammer.js**: Gesture library (24KB), overkill for single gesture type
- **Pointer Events**: Simpler API but less iOS Safari support historically
- **Mouse events as fallback**: Not needed (iPad-only target)

**Implementation Approach**:
```javascript
class InputHandler {
  constructor(canvas) {
    this.touchStartPos = null;
    this.currentTouchPos = null;

    canvas.addEventListener('touchstart', this.onTouchStart.bind(this));
    canvas.addEventListener('touchmove', this.onTouchMove.bind(this));
    canvas.addEventListener('touchend', this.onTouchEnd.bind(this));
  }

  onTouchStart(e) {
    e.preventDefault(); // Prevent scrolling
    const touch = e.touches[0];
    this.touchStartPos = { x: touch.clientX, y: touch.clientY };
  }

  onTouchMove(e) {
    e.preventDefault();
    const touch = e.touches[0];
    this.currentTouchPos = { x: touch.clientX, y: touch.clientY };

    // Calculate and display guide arrow
    const vector = this.calculateSwingVector();
    this.renderer.drawGuideArrow(vector);
  }

  onTouchEnd(e) {
    e.preventDefault();
    const swingVector = this.calculateSwingVector();
    this.gameEngine.executeSwing(swingVector);

    // Reset
    this.touchStartPos = null;
    this.currentTouchPos = null;
  }

  calculateSwingVector() {
    if (!this.touchStartPos || !this.currentTouchPos) return null;

    const dx = this.currentTouchPos.x - this.touchStartPos.x;
    const dy = this.currentTouchPos.y - this.touchStartPos.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const angle = Math.atan2(dy, dx);

    return { power: distance / 100, angle }; // Normalize power
  }
}
```

**Responsiveness Target**: <16ms (60fps) from touch to visual feedback

## Decision 5: Audio Implementation

**Decision**: Web Audio API for sound effects with lazy loading and audio sprite technique

**Rationale**:
- Web Audio API provides precise timing and mixing
- Better iOS Safari support than HTML5 Audio for short sound effects
- Audio sprites reduce HTTP requests (combine all sounds into one file)
- Lazy load after initial render to prioritize gameplay readiness

**Alternatives Considered**:
- **HTML5 Audio elements**: Simpler but limited simultaneous sounds, iOS restrictions
- **Individual sound files**: More HTTP requests, slower initial load
- **No audio**: Acceptable fallback if audio fails to load

**Implementation Approach**:
```javascript
class AudioManager {
  constructor() {
    this.context = null;
    this.sounds = {};
    this.muted = localStorage.getItem('soundEnabled') !== 'true';
  }

  async init() {
    // Initialize Web Audio Context
    this.context = new (window.AudioContext || window.webkitAudioContext)();

    // Load audio sprite (all sounds in one file with timing map)
    const audioBuffer = await this.loadAudioFile('/sounds/sprite.mp3');

    // Define sound regions in sprite
    this.sounds = {
      clubHit: { buffer: audioBuffer, start: 0, duration: 0.5 },
      ballLandGrass: { buffer: audioBuffer, start: 0.5, duration: 0.3 },
      ballLandSand: { buffer: audioBuffer, start: 0.8, duration: 0.4 },
      ballLandWater: { buffer: audioBuffer, start: 1.2, duration: 0.6 },
      cheer: { buffer: audioBuffer, start: 1.8, duration: 1.0 },
      holeComplete: { buffer: audioBuffer, start: 2.8, duration: 1.5 }
    };
  }

  play(soundName) {
    if (this.muted || !this.sounds[soundName]) return;

    const sound = this.sounds[soundName];
    const source = this.context.createBufferSource();
    source.buffer = sound.buffer;
    source.connect(this.context.destination);
    source.start(0, sound.start, sound.duration);
  }
}
```

**File Size Impact**: ~50KB for audio sprite (compressed MP3)

## Decision 6: Randomness and Seeding

**Decision**: Custom seeded PRNG (Mulberry32) for reproducible randomness

**Rationale**:
- Seeded random allows same course layout for testing/debugging
- Tiny implementation (~10 lines) vs including seedrandom.js library
- Sufficient quality for game randomness (not cryptographic needs)

**Alternatives Considered**:
- **Math.random()**: Not seedable, can't reproduce layouts
- **seedrandom.js**: Library (3KB), more features than needed
- **Crypto.getRandomValues()**: Not seedable, overkill for games

**Implementation**:
```javascript
class SeededRandom {
  constructor(seed = Date.now()) {
    this.state = seed;
  }

  // Mulberry32 algorithm
  next() {
    let t = this.state += 0x6D2B79F5;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  }

  nextInt(min, max) {
    return Math.floor(this.next() * (max - min + 1)) + min;
  }
}

// Usage:
const rng = new SeededRandom(12345); // Same seed = same obstacles
const obstacleX = rng.nextInt(100, 700);
```

**Debug Mode**: URL parameter `?seed=12345` allows testing specific layouts

## Decision 7: Course Generation Algorithm

**Decision**: Procedural generation with template-based holes and random obstacle placement

**Rationale**:
- 9 hand-crafted hole templates ensure quality and variety
- Obstacle placement randomized within valid regions each time
- Balances consistency (par values, hole feel) with variety (obstacle positions)

**Implementation Approach**:
```javascript
class CourseGenerator {
  constructor(seed) {
    this.rng = new SeededRandom(seed);
    this.holeTemplates = this.defineHoleTemplates();
  }

  defineHoleTemplates() {
    return [
      { id: 1, par: 3, length: 'short', teePos: [50, 400], greenPos: [700, 400], fairwayWidth: 100 },
      { id: 2, par: 4, length: 'medium', teePos: [50, 200], greenPos: [600, 500], fairwayWidth: 80 },
      { id: 3, par: 5, length: 'long', teePos: [100, 100], greenPos: [700, 700], fairwayWidth: 90 },
      // ... 6 more hole templates
    ];
  }

  generateHole(holeNumber) {
    const template = this.holeTemplates[holeNumber - 1];
    const obstacles = this.placeObstacles(template);

    return {
      ...template,
      obstacles,
      seed: this.rng.state // Store seed for reproducibility
    };
  }

  placeObstacles(template) {
    const obstacles = [];
    const obstacleCount = this.rng.nextInt(3, 6);

    for (let i = 0; i < obstacleCount; i++) {
      const type = this.rng.next() < 0.4 ? 'sand' :
                   this.rng.next() < 0.7 ? 'tree' : 'water';

      // Place in fairway region, avoiding tee and green
      const x = this.rng.nextInt(template.teePos[0] + 100, template.greenPos[0] - 100);
      const y = this.rng.nextInt(template.fairwayWidth / 2, template.fairwayWidth * 1.5);

      obstacles.push({ type, x, y, radius: this.rng.nextInt(20, 40) });
    }

    return obstacles;
  }
}
```

**Variety**: 9 templates × random obstacle layouts = high replayability

## Decision 8: Club Mechanics System

**Decision**: Data-driven club characteristics with physics multipliers

**Rationale**:
- Each club defined by simple parameters: power, arc, spin
- Physics engine applies these multipliers to base swing calculations
- Easy to balance and tune without changing physics code

**Implementation**:
```javascript
const CLUBS = {
  driver: { name: 'Driver', maxPower: 1.0, arcMultiplier: 0.8, spinMultiplier: 0.6 },
  wood3: { name: '3-Wood', maxPower: 0.9, arcMultiplier: 0.85, spinMultiplier: 0.65 },
  wood5: { name: '5-Wood', maxPower: 0.85, arcMultiplier: 0.9, spinMultiplier: 0.7 },
  iron4: { name: '4-Iron', maxPower: 0.75, arcMultiplier: 1.0, spinMultiplier: 0.8 },
  iron5: { name: '5-Iron', maxPower: 0.7, arcMultiplier: 1.05, spinMultiplier: 0.85 },
  iron6: { name: '6-Iron', maxPower: 0.65, arcMultiplier: 1.1, spinMultiplier: 0.9 },
  iron7: { name: '7-Iron', maxPower: 0.6, arcMultiplier: 1.15, spinMultiplier: 0.95 },
  iron8: { name: '8-Iron', maxPower: 0.55, arcMultiplier: 1.2, spinMultiplier: 1.0 },
  iron9: { name: '9-Iron', maxPower: 0.5, arcMultiplier: 1.25, spinMultiplier: 1.05 },
  wedge: { name: 'Wedge', maxPower: 0.4, arcMultiplier: 1.4, spinMultiplier: 1.2 },
  putter: { name: 'Putter', maxPower: 0.2, arcMultiplier: 0.1, spinMultiplier: 0.0 }
};

class ClubSystem {
  applyClubToSwing(club, baseSwing) {
    return {
      power: baseSwing.power * club.maxPower,
      angle: baseSwing.angle,
      arc: club.arcMultiplier,
      spin: club.spinMultiplier
    };
  }
}
```

**Balancing**: Playtest and adjust multipliers for desired shot distances/behavior

## Decision 9: Build Process (Optional)

**Decision**: Simple shell script for development-to-production concatenation

**Rationale**:
- During development: separate files for maintainability
- For deployment: single HTML file for simplicity
- No npm, webpack, or complex tooling needed

**Implementation**:
```bash
#!/bin/bash
# build.sh - Concatenates modular source into single game.html

cat > game.html <<'EOF'
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
  <title>Howlett Golf Chaos</title>
  <style>
EOF

cat src/styles/main.css >> game.html

cat >> game.html <<'EOF'
  </style>
</head>
<body>
  <canvas id="game-canvas"></canvas>
  <div id="ui-overlay"></div>

  <script>
EOF

# Concatenate all JavaScript modules
cat src/modules/*.js >> game.html

cat >> game.html <<'EOF'

  // Initialize game
  window.addEventListener('DOMContentLoaded', () => {
    const game = new GameEngine();
    game.start();
  });
  </script>
</body>
</html>
EOF

echo "Build complete: game.html"
```

**Alternative**: Manual copy-paste during development if build script feels like overkill

## Summary of Key Decisions

| Decision Area | Choice | Impact |
|---------------|--------|--------|
| Physics Engine | Custom 2D vector math | ~5KB vs 60-100KB library |
| Rendering | Canvas 2D with dirty rectangles | 60fps achievable |
| Persistence | localStorage + IndexedDB hybrid | <5KB total storage |
| Touch Input | Native touch events | <16ms response time |
| Audio | Web Audio API + audio sprite | ~50KB, lazy loaded |
| Randomness | Custom Mulberry32 PRNG | ~10 lines, seedable |
| Course Generation | Template + procedural obstacles | High variety, quality |
| Club Mechanics | Data-driven multipliers | Easy balancing |
| Build Process | Optional shell script | Development flexibility |

**Total Estimated File Size**: ~150KB (HTML + JS + CSS) + ~50KB (audio sprite) = ~200KB
**Well under 2MB target**

## Next Steps

Phase 1 artifacts can now be generated with full technical clarity:
1. data-model.md - Entity schemas based on decisions above
2. contracts/ - Internal JavaScript API contracts for modules
3. quickstart.md - Development setup and testing guide
