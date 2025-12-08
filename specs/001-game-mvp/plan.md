# Implementation Plan: Howlett Golf Chaos - Complete Game

**Branch**: `001-game-mvp` | **Date**: 2025-12-06 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-game-mvp/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Building a complete single-page iPad golf game with 9 holes, touch-based swing controls, realistic ball physics, club selection, scoring system, and game state persistence. The game targets iPad Safari, runs entirely client-side with no server dependencies, and follows a progressive delivery model (P1 MVP → P2 full game → P3 enhanced features → P4 polish).

Technical approach uses vanilla JavaScript with HTML5 Canvas for rendering, a custom 2D physics engine for ball movement, localStorage/IndexedDB for persistence, and Web Audio API for sound. Architecture follows modular patterns within a single HTML file to maintain simplicity while ensuring maintainability.

## Technical Context

**Language/Version**: JavaScript ES6+ (supported natively in Safari iOS 15+)
**Primary Dependencies**: None required; optional CDN libraries for physics helper functions (e.g., matter.js for collision detection) if needed
**Storage**: localStorage for user preferences (sound on/off, tutorial status), IndexedDB for game state and leaderboard (handles larger structured data)
**Testing**: Manual playtesting on iPad devices (primary), optional Jest for unit testing physics/math functions
**Target Platform**: iPad Safari (iOS 15+), landscape orientation only
**Project Type**: Single-page web application (single HTML file with embedded JS/CSS)
**Performance Goals**: 60fps rendering during gameplay, <100ms touch response latency, <3s initial load time
**Constraints**: <2MB total file size, no external HTTP requests after initial load, offline-capable, touch-only input
**Scale/Scope**: Single-player game, 9 holes per round, unlimited rounds stored locally (limited by browser storage quota ~5-10MB for IndexedDB)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Principle I: Single-Page Simplicity ✅

**Status**: PASS

- Game exists as one HTML file with embedded `<script>` and `<style>` tags
- No build tools, bundlers, or transpilers required
- Runs directly in Safari without external dependencies
- Optional: Could use CDN links for physics libraries, but core game must function without them

### Principle II: Touch-First Design ✅

**Status**: PASS

- All interactions via touch events (`touchstart`, `touchmove`, `touchend`)
- Visual feedback for all touch inputs (guide arrows, power indicators)
- 60fps target ensures responsive feel
- No mouse/keyboard controls implemented

### Principle III: Client-Only Architecture ✅

**Status**: PASS

- All game logic executes in browser JavaScript
- Physics calculations client-side
- Canvas/WebGL rendering client-side
- localStorage/IndexedDB for persistence (no server calls)
- No backend, API, or authentication

### Principle IV: Progressive Feature Delivery ✅

**Status**: PASS

- P1 (MVP): Single hole gameplay - independently playable
- P2: Full 9-hole game with clubs and scoring - builds on P1
- P3: Persistence, leaderboard, tutorial, audio - optional enhancements
- P4: Visual polish and random events - pure delight features
- Each priority level can be developed, tested, and deployed independently

### Principle V: Performance-First Rendering ✅

**Status**: PASS

- Canvas rendering with requestAnimationFrame for 60fps
- Minimize redraws by only updating changed regions (dirty rectangle technique)
- Lightweight 2D physics (simple vector math, no complex simulations)
- SVG or procedural graphics preferred over large PNG/JPG assets
- Lazy load audio files after initial render

### Principle VI: Playful & Testable Randomness ✅

**Status**: PASS

- Obstacle placement uses seeded random number generator (seedrandom.js or custom implementation)
- Debug mode allows setting seed for reproducible layouts
- Random events (streaker) use same seeded approach
- Configuration flags for enabling/disabling random features during testing

### Constitution Compliance Summary

**Overall Status**: ✅ FULL COMPLIANCE

All six core principles satisfied. No violations requiring justification.

## Project Structure

### Documentation (this feature)

```text
specs/001-game-mvp/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
│   └── game-api.md      # Internal JavaScript API contracts (modules)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

Since this is a single-page application, the structure differs from typical projects:

```text
game.html                # Single HTML file containing everything

# Internal organization within game.html:
# <style>
#   - CSS for layout, animations, UI elements
# </style>
#
# <canvas id="game-canvas"></canvas>
# <div id="ui-overlay">
#   - Scoreboard, club selector, menus
# </div>
#
# <script>
#   // Modular structure using IIFEs or ES6 modules:
#   - GameEngine module (main loop, state management)
#   - PhysicsEngine module (ball movement, collisions)
#   - Renderer module (Canvas drawing)
#   - InputHandler module (touch events)
#   - CourseGenerator module (hole layouts, obstacles)
#   - ClubSystem module (club characteristics)
#   - ScoreKeeper module (stroke tracking, par calculation)
#   - StorageManager module (localStorage/IndexedDB)
#   - AudioManager module (sound effects, music)
#   - UIManager module (overlays, menus, buttons)
#   - TutorialManager module (onboarding flow)
# </script>

# Optional development structure (not deployed):
src/
├── modules/
│   ├── game-engine.js
│   ├── physics-engine.js
│   ├── renderer.js
│   ├── input-handler.js
│   ├── course-generator.js
│   ├── club-system.js
│   ├── score-keeper.js
│   ├── storage-manager.js
│   ├── audio-manager.js
│   ├── ui-manager.js
│   └── tutorial-manager.js
├── styles/
│   └── main.css
└── assets/
    └── sounds/
        ├── club-hit.mp3
        ├── ball-land-grass.mp3
        ├── ball-land-sand.mp3
        ├── ball-land-water.mp3
        ├── cheer.mp3
        └── hole-complete.mp3

# Build script (optional):
build.sh  # Concatenates src/ files into single game.html

tests/  # Optional
├── physics.test.js
├── scoring.test.js
└── storage.test.js
```

**Structure Decision**: Single HTML file deployment with optional modular development structure. During development, code can be split into separate files in `src/` for maintainability, then concatenated into `game.html` for deployment. This maintains Single-Page Simplicity while allowing organized development.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

**Status**: No violations - this section is empty.
