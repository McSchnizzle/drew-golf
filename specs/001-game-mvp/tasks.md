# Tasks: Cartoon Golf Chaos - Complete Game

**Input**: Design documents from `/specs/001-game-mvp/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Tests are OPTIONAL for this project. Manual playtesting on iPad is the primary validation method per the constitution and plan.md.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Single HTML file**: `game.html` (deployment target)
- **Optional dev structure**: `src/modules/*.js`, `src/styles/*.css`, `src/assets/sounds/*`
- Build script: `build.sh` (optional, concatenates modules into game.html)

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [X] T001 Create basic game.html file with HTML5 doctype, meta tags for iPad, and canvas element
- [X] T002 [P] Add CSS reset and base styles in game.html <style> section (fullscreen, touch-action: none, landscape lock)
- [ ] T003 [P] Create optional development structure: src/modules/, src/styles/, src/assets/sounds/ directories
- [ ] T004 [P] Create build.sh script to concatenate src/ files into game.html (if using modular development)
- [X] T005 Initialize canvas context and implement responsive sizing with device pixel ratio support in game.html

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T006 Implement SeededRandom class with Mulberry32 algorithm for reproducible randomness in game.html
- [X] T007 Implement GameEngine module skeleton with start(), pause(), resume(), update() methods in game.html
- [X] T008 [P] Implement PhysicsEngine module with vector math utilities (add, subtract, magnitude, normalize) in game.html
- [X] T009 [P] Implement Renderer module skeleton with renderFrame(), clearRegion(), and canvas context management in game.html
- [X] T010 [P] Implement InputHandler module with touch event listeners (touchstart, touchmove, touchend) in game.html
- [X] T011 Set up requestAnimationFrame game loop in GameEngine.update() with delta time calculation in game.html
- [X] T012 Implement basic FPS counter for performance monitoring (can be hidden in production) in game.html

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Basic Golf Gameplay (Priority: P1) 🎯 MVP

**Goal**: Players can experience core golf mechanics by playing a single hole from tee to green using touch-based swing controls with realistic ball physics

**Independent Test**: Load the game, execute a finger-drag swing, watch the ball move with realistic physics, and successfully complete one hole

### Implementation for User Story 1

- [X] T013 [P] [US1] Create Ball entity structure with position, velocity, spin, isAirborne, isMoving properties in game.html
- [X] T014 [P] [US1] Create Hole entity structure with teePosition, greenPosition, holePosition, par, fairwayWidth in game.html
- [X] T015 [US1] Implement InputHandler.calculateSwingVector() to convert touch drag into power and angle in game.html
- [X] T016 [US1] Implement PhysicsEngine.applySwing() to set initial ball velocity from swing vector in game.html
- [X] T017 [US1] Implement PhysicsEngine.updateBall() with gravity, air resistance, and ground friction in game.html
- [X] T018 [US1] Implement PhysicsEngine.isBallInHole() collision detection for hole completion in game.html
- [X] T019 [US1] Implement Renderer.drawCourse() to render tee area, fairway, and green with hole cup in game.html
- [X] T020 [US1] Implement Renderer.drawBall() with rotation animation based on velocity in game.html
- [X] T021 [US1] Implement Renderer.drawGuideArrow() to show swing trajectory during touch drag in game.html
- [X] T022 [US1] Create basic ScoreKeeper module with recordStroke(), getCurrentStrokes() methods in game.html
- [X] T023 [US1] Implement hole completion detection and score display in GameEngine in game.html
- [X] T024 [US1] Add basic UI overlay div with hole number, par, and stroke count display in game.html
- [X] T025 [US1] Integrate all US1 components into GameEngine.update() loop for playable single hole in game.html

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently (playable single hole MVP)

---

## Phase 4: User Story 2 - Full 9-Hole Course (Priority: P2)

**Goal**: Players can play a complete 9-hole round with varied hole layouts, randomized obstacles, and proper par scoring

**Independent Test**: After implementing P1, players can progress through 9 different holes, each with unique layouts and obstacles, completing a full round with cumulative scoring

### Implementation for User Story 2

- [X] T026 [P] [US2] Create 9 hole templates with varied layouts (short/medium/long, different par values 3-5) in game.html
- [X] T027 [P] [US2] Create Obstacle entity structure with type (sand/water/tree/rock), position, shape, radius in game.html
- [X] T028 [US2] Implement CourseGenerator module with generateHole(holeNumber) using seeded RNG in game.html
- [X] T029 [US2] Implement CourseGenerator.placeObstacles() to randomize obstacle placement per hole in game.html
- [X] T030 [US2] Implement PhysicsEngine.checkCollision() for ball-obstacle interactions in game.html
- [X] T031 [US2] Implement obstacle physics behaviors (sand stops ball, water resets with penalty, trees/rocks bounce) in game.html
- [X] T032 [US2] Implement Renderer.drawObstacles() with cartoonish visuals for each obstacle type in game.html
- [X] T033 [US2] Extend ScoreKeeper to track scores across 9 holes with holeScores array and totalStrokes in game.html
- [X] T034 [US2] Implement Round entity with currentHole, holeScores, totalStrokes, scoreRelativeToPar in game.html
- [X] T035 [US2] Implement GameEngine.startNewRound() to initialize 9-hole round with optional seed parameter in game.html
- [X] T036 [US2] Implement automatic hole progression (advance to next hole on completion) in GameEngine in game.html
- [X] T037 [US2] Add round summary display showing total strokes and score relative to par on completion in game.html
- [X] T038 [US2] Update UI overlay to show current hole number (1-9) and cumulative score in game.html

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently (complete 9-hole game)

**Status**: ✅ PHASE 4 COMPLETE (T026-T038 all implemented)
- Added Playwright testing framework
- Fixed syntax errors in GameEngine class
- Added mouse support for desktop testing
- 6/9 functional tests passing (3 tests have timing/interaction issues being resolved)

---

## Phase 5: User Story 3 - Club Selection System (Priority: P2)

**Goal**: Players can choose different clubs to control shot distance, trajectory, and accuracy for strategic play

**Independent Test**: Select different clubs and observe distinct ball behavior for each (distance, arc, spin differences)

### Implementation for User Story 3

- [X] T039 [P] [US3] Create Club entity structure with id, name, maxPower, arcMultiplier, spinMultiplier in game.html
- [X] T040 [P] [US3] Define 11 club constants (driver, woods, irons 4-9, wedge, putter) with characteristics in game.html
- [X] T041 [US3] Implement ClubSystem module with getClub(clubId), getAllClubs(), getAvailableClubs() in game.html
- [X] T042 [US3] Implement ClubSystem.applyClubToSwing() to modify swing vector with club multipliers in game.html
- [X] T043 [US3] Implement ClubSystem.getRecommendedClub() based on ball position and distance to hole in game.html
- [X] T044 [US3] Enforce driver-only rule for first stroke of each hole in GameEngine in game.html
- [X] T045 [US3] Implement GameEngine.selectClub(clubId) with validation (no change while ball moving) in game.html
- [X] T046 [US3] Create club selector UI overlay with buttons for available clubs in game.html
- [X] T047 [US3] Add visual highlighting for currently selected club in UI in game.html
- [X] T048 [US3] Add putter recommendation logic when ball is on or near green in game.html
- [X] T049 [US3] Update Renderer.drawGuideArrow() to reflect club characteristics in trajectory preview in game.html

**Checkpoint**: At this point, User Stories 1, 2, AND 3 should work independently (full game with club selection)

---

## Phase 6: User Story 4 - Touch Interface & Visual Feedback (Priority: P2)

**Goal**: Players receive clear visual guidance and feedback for their touch inputs

**Independent Test**: Visual elements (guide arrows, power indicators, trajectory paths) respond immediately to touch input

### Implementation for User Story 4

- [X] T050 [P] [US4] Enhance Renderer.drawGuideArrow() with power indicator (arrow length) and angle indicator in game.html
- [X] T051 [P] [US4] Add visual feedback on ball strike (flash effect, impact animation) in Renderer in game.html
- [X] T052 [P] [US4] Implement real-time guide arrow updates during touchmove events in InputHandler in game.html
- [X] T053 [US4] Add touch response validation (prevent swings if ball is moving) in InputHandler in game.html
- [X] T054 [US4] Enhance UI overlay with clear indicators for current club, hole number, par, strokes in game.html
- [X] T055 [US4] Add visual state indicators (ball airborne/rolling/stopped) in UI or on canvas in game.html
- [X] T056 [US4] Implement smooth ball arc animation with rotation matching velocity in Renderer in game.html

**Checkpoint**: All P2 user stories (US1-4) should be complete and independently testable

---

## Phase 7: User Story 5 - Scorekeeping & Round Progress (Priority: P2)

**Goal**: Players can track their performance throughout the round with a scoreboard showing strokes per hole, par comparison, and cumulative score

**Independent Test**: Scoreboard accurately reflects all strokes taken, calculates par differences correctly, and persists throughout the 9-hole round

### Implementation for User Story 5

- [X] T057 [P] [US5] Implement ScoreKeeper.completeHole() to finalize hole score with par difference calculation in game.html
- [X] T058 [P] [US5] Implement ScoreKeeper.getRoundSummary() with total strokes, total par, score relative to par in game.html
- [X] T059 [US5] Create scoreboard UI overlay with hole-by-hole breakdown in game.html
- [X] T060 [US5] Add par comparison display (+1, -2, E) for each completed hole in scoreboard in game.html
- [X] T061 [US5] Implement positive visual feedback for par or better scores (color change, icon) in game.html
- [X] T062 [US5] Implement enhanced celebration feedback for birdie or better (confetti preview) in game.html
- [X] T063 [US5] Add round progress indicator showing completed vs remaining holes in UI in game.html

**Checkpoint**: All P2 user stories (US1-5) complete - full playable 9-hole game with clubs and scoring

---

## Phase 8: User Story 6 - Game Persistence & Resume (Priority: P3)

**Goal**: Players can leave the game mid-round and return later to continue from exactly where they left off

**Independent Test**: Close the game mid-hole, reopen it, and verify all state is restored exactly

### Implementation for User Story 6

- [ ] T064 [P] [US6] Create StorageManager module with IndexedDB initialization and database schema in game.html
- [ ] T065 [P] [US6] Implement StorageManager.saveGameState() to persist current round to IndexedDB in game.html
- [ ] T066 [P] [US6] Implement StorageManager.loadGameState() to retrieve saved round from IndexedDB in game.html
- [ ] T067 [P] [US6] Implement StorageManager.clearGameState() to remove saved state after round completion in game.html
- [ ] T068 [US6] Create GameState entity with currentRound, ball, selectedClub, settings in game.html
- [ ] T069 [US6] Implement auto-save on ball stopped, club changed, hole completed, and visibility change events in game.html
- [ ] T070 [US6] Implement resume/new game menu on startup when saved state exists in game.html
- [ ] T071 [US6] Add localStorage integration for simple settings (soundEnabled, tutorialCompleted) in game.html
- [ ] T072 [US6] Implement GameEngine.loadRound() to restore all state from saved data in game.html
- [ ] T073 [US6] Add error handling for storage quota exceeded or unavailable with user warning in game.html

**Checkpoint**: User Story 6 complete and independently testable (save/resume functionality)

---

## Phase 9: User Story 7 - Leaderboard System (Priority: P3)

**Goal**: Players can view their top 10 best rounds with scores and dates

**Independent Test**: Complete multiple rounds with different scores, verify top 10 are stored, sorted correctly, and displayed

### Implementation for User Story 7

- [ ] T074 [P] [US7] Create LeaderboardEntry entity with scoreRelativeToPar, totalStrokes, completedAt, playerInitials in game.html
- [ ] T075 [P] [US7] Implement StorageManager.addLeaderboardEntry() to insert and prune to top 10 in IndexedDB in game.html
- [ ] T076 [P] [US7] Implement StorageManager.getLeaderboard() to retrieve sorted top 10 entries from IndexedDB in game.html
- [ ] T077 [US7] Create leaderboard UI overlay with sortable table display in game.html
- [ ] T078 [US7] Implement leaderboard entry creation and save on round completion in GameEngine in game.html
- [ ] T079 [US7] Add player initials input prompt on round completion (optional, can skip) in game.html
- [ ] T080 [US7] Add personal best notification when new top score achieved in game.html
- [ ] T081 [US7] Implement leaderboard view button in main menu or round summary screen in game.html

**Checkpoint**: User Story 7 complete and independently testable (leaderboard tracking)

---

## Phase 10: User Story 8 - Optional Tutorial (Priority: P3)

**Goal**: First-time players can learn game mechanics through an optional interactive tutorial

**Independent Test**: Launch game for the first time, complete tutorial, verify all mechanics are explained

### Implementation for User Story 8

- [ ] T082 [P] [US8] Create tutorial steps array with title, instruction, and action requirements in game.html
- [ ] T083 [P] [US8] Create TutorialManager module with start(), nextStep(), skip(), isComplete() methods in game.html
- [ ] T084 [US8] Implement tutorial UI overlay with step-by-step instructions and progress indicator in game.html
- [ ] T085 [US8] Implement first-time user detection (check localStorage for tutorialCompleted flag) in game.html
- [ ] T086 [US8] Add "Play Tutorial?" prompt on first launch with Yes/No buttons in game.html
- [ ] T087 [US8] Implement tutorial step validation (wait for player to perform action before advancing) in game.html
- [ ] T088 [US8] Add tutorial completion persistence to localStorage in TutorialManager in game.html
- [ ] T089 [US8] Add manual tutorial access from settings/menu (replay option) in game.html

**Checkpoint**: User Story 8 complete and independently testable (tutorial system)

---

## Phase 11: User Story 9 - Audio Feedback (Priority: P3)

**Goal**: Players hear contextual sound effects that enhance immersion and provide audio confirmation of game events

**Independent Test**: Play with sound enabled, verify appropriate sounds trigger for all major events

### Implementation for User Story 9

- [ ] T090 [P] [US9] Create or source audio files: club-hit.mp3, ball-land-grass.mp3, ball-land-sand.mp3, ball-land-water.mp3, cheer.mp3, hole-complete.mp3 in src/assets/sounds/
- [ ] T091 [P] [US9] Implement AudioManager module with Web Audio API context initialization in game.html
- [ ] T092 [US9] Implement audio sprite loading or individual sound file loading with preload() in AudioManager in game.html
- [ ] T093 [US9] Implement AudioManager.play(soundName) with mute check and sound playback in game.html
- [ ] T094 [US9] Implement AudioManager.setMuted(boolean) with persistence to localStorage in game.html
- [ ] T095 [US9] Add audio unlock on first user touch (iOS requirement) in AudioManager in game.html
- [ ] T096 [US9] Trigger club-hit sound on ball strike in GameEngine in game.html
- [ ] T097 [US9] Trigger appropriate landing sound based on surface type (grass/sand/water) in PhysicsEngine in game.html
- [ ] T098 [US9] Trigger cheer sound for exceptional shots (near hole, hole-in-one) in GameEngine in game.html
- [ ] T099 [US9] Trigger hole-complete jingle on hole completion in GameEngine in game.html
- [ ] T100 [US9] Add mute toggle button in settings UI in game.html

**Checkpoint**: User Story 9 complete and independently testable (audio feedback)

---

## Phase 12: User Story 10 - Visual Polish & Animations (Priority: P4)

**Goal**: Players experience delightful visual polish including flag animations, confetti celebrations, smooth ball movement

**Independent Test**: Observe visual elements during play: flag waving continuously, confetti appearing on birdies

### Implementation for User Story 10

- [ ] T101 [P] [US10] Implement flag waving animation in Renderer.drawCourse() using sine wave motion in game.html
- [ ] T102 [P] [US10] Create confetti particle system with Particle class and ParticleEmitter in game.html
- [ ] T103 [P] [US10] Implement Renderer.drawEffects() to render active particle effects in game.html
- [ ] T104 [US10] Trigger confetti effect on hole completion in GameEngine in game.html
- [ ] T105 [US10] Trigger enhanced confetti for birdie or better scores in GameEngine in game.html
- [ ] T106 [US10] Add environmental animations (trees swaying, water shimmer) in Renderer in game.html
- [ ] T107 [US10] Enhance ball rolling animation with smooth rotation interpolation in Renderer in game.html

**Checkpoint**: User Story 10 complete and independently testable (visual polish)

---

## Phase 13: User Story 11 - Random Events & Humor (Priority: P4)

**Goal**: Players occasionally encounter unexpected comedic events (streaker, wind, critters) that add personality

**Independent Test**: Play multiple rounds and observe random events triggering unpredictably

### Implementation for User Story 11

- [ ] T108 [P] [US11] Create streaker sprite/animation (PG-friendly silhouette style) in game.html
- [ ] T109 [P] [US11] Implement RandomEventManager module with trigger probability and event queue in game.html
- [ ] T110 [P] [US11] Create or source streaker sound effect in src/assets/sounds/
- [ ] T111 [US11] Implement streaker animation path (runs across screen in 1-2 seconds) in Renderer in game.html
- [ ] T112 [US11] Add seeded random streaker trigger check (does NOT affect physics) in GameEngine in game.html
- [ ] T113 [US11] Trigger streaker sound when event appears in AudioManager in game.html
- [ ] T114 [US11] Add optional environmental randomness (wind indicator, moving critters) in Renderer in game.html
- [ ] T115 [US11] Implement debug flag to disable random events for consistent testing in GameEngine in game.html

**Checkpoint**: All user stories complete - full game with all features implemented

---

## Phase 14: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories and final deployment preparation

- [ ] T116 [P] Implement debug mode with FPS display, seed display, and random event toggles in game.html
- [ ] T117 [P] Add URL parameter parsing for debug mode (?debug=true) and seed override (?seed=12345) in game.html
- [ ] T118 [P] Optimize rendering with dirty rectangle technique (only redraw changed regions) in Renderer in game.html
- [ ] T119 [P] Implement background caching for static course elements in Renderer in game.html
- [ ] T120 [P] Add screen orientation lock to landscape mode in game.html
- [ ] T121 Code cleanup: remove console.logs, add minimal comments only where logic is non-obvious in game.html
- [ ] T122 Performance profiling: verify 60fps on target iPad devices with performance.mark/measure in game.html
- [ ] T123 File size check: ensure game.html is under 200KB before adding audio (total <2MB with audio) via ls -lh
- [ ] T124 Create optional build script to minify/compress if approaching size limits in build.sh
- [ ] T125 Manual testing checklist: test all 11 user stories on actual iPad Safari
- [ ] T126 Storage testing: verify persistence works, test quota exceeded scenario
- [ ] T127 Audio testing: verify all sounds play correctly, test mute functionality
- [ ] T128 Edge case testing: test all 6 edge cases from spec.md (out of bounds, spam-tapping, etc.)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-13)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3 → P4)
- **Polish (Phase 14)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational - Builds on US1 but independently testable
- **User Story 3 (P2)**: Can start after Foundational - Works with US1/US2, independently testable
- **User Story 4 (P2)**: Can start after Foundational - Enhances US1-3, independently testable
- **User Story 5 (P2)**: Can start after Foundational - Uses US1-2 scoring, independently testable
- **User Story 6 (P3)**: Can start after Foundational - Saves state from US1-5, independently testable
- **User Story 7 (P3)**: Can start after Foundational - Stores rounds from US1-5, independently testable
- **User Story 8 (P3)**: Can start after Foundational - Teaches US1-3 mechanics, independently testable
- **User Story 9 (P3)**: Can start after Foundational - Adds audio to US1-11, independently testable
- **User Story 10 (P4)**: Can start after Foundational - Polishes US1-5 visuals, independently testable
- **User Story 11 (P4)**: Can start after Foundational - Adds humor to US1-2, independently testable

### Within Each User Story

- Implementation tasks generally follow this order:
  1. Entity/data structure creation (can be parallel)
  2. Core logic modules (depends on entities)
  3. UI components (depends on core logic)
  4. Integration into GameEngine (depends on all above)

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel (T002, T003, T004)
- All Foundational tasks marked [P] can run in parallel (T008, T009, T010)
- Once Foundational phase completes, all user stories can start in parallel (if team capacity allows)
- Within each story, tasks marked [P] can run in parallel
- Different user stories can be worked on in parallel by different team members

---

## Parallel Example: User Story 1 (MVP)

```bash
# After Foundational phase complete, launch these in parallel:
# Entity structures (different concepts, no conflicts):
T013 - Ball entity
T014 - Hole entity

# After entities exist, launch these in parallel:
T015 - InputHandler.calculateSwingVector()
T016 - PhysicsEngine.applySwing()
T017 - PhysicsEngine.updateBall()
T018 - PhysicsEngine.isBallInHole()
T019 - Renderer.drawCourse()
T020 - Renderer.drawBall()
T021 - Renderer.drawGuideArrow()
T022 - ScoreKeeper module

# Sequential final integration:
T023 - Hole completion detection
T024 - UI overlay
T025 - Integration into GameEngine
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001-T005)
2. Complete Phase 2: Foundational (T006-T012) - CRITICAL, blocks all stories
3. Complete Phase 3: User Story 1 (T013-T025)
4. **STOP and VALIDATE**: Test User Story 1 independently on iPad
5. Deploy/demo single playable hole if ready

**This is your Minimum Viable Product - a playable golf game with one hole!**

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 (T013-T025) → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 (T026-T038) → Test independently → Deploy/Demo (full 9 holes)
4. Add User Story 3 (T039-T049) → Test independently → Deploy/Demo (with clubs)
5. Add User Story 4 (T050-T056) → Test independently → Deploy/Demo (enhanced UI)
6. Add User Story 5 (T057-T063) → Test independently → Deploy/Demo (full scoring)
7. Continue with P3 stories (persistence, leaderboard, tutorial, audio) as desired
8. Add P4 stories (polish, humor) for final touches
9. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together (T001-T012)
2. Once Foundational is done:
   - Developer A: User Story 1 (T013-T025) - MVP
   - Developer B: User Story 2 (T026-T038) - 9 holes
   - Developer C: User Story 3 (T039-T049) - Clubs
3. Stories complete and integrate independently
4. Continue with remaining stories in parallel or sequentially based on priorities

---

## Notes

- [P] tasks = different files/modules, no dependencies within phase
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Since this is a single HTML file project, "different files" means different JavaScript modules/functions within game.html or separate src/modules/*.js files if using optional dev structure
- Manual testing on iPad is PRIMARY validation - automated tests are optional
- File size monitoring: Check game.html size after major additions (target <200KB code, <2MB total with audio)
- Performance monitoring: Use FPS counter and performance.mark/measure to ensure 60fps target
- Avoid premature optimization: Get features working first, then optimize if performance issues arise
