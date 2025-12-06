<!--
  SYNC IMPACT REPORT

  Version Change: NONE → 1.0.0
  Modified Principles: N/A (initial constitution)
  Added Sections: All (initial constitution)
  Removed Sections: None

  Templates Status:
  ✅ plan-template.md - Constitution Check section aligns with principles
  ✅ spec-template.md - User story prioritization aligns with Principle I
  ✅ tasks-template.md - User story organization aligns with principles
  ✅ checklist-template.md - No constitution-specific references needed
  ✅ agent-file-template.md - No constitution-specific references needed

  Follow-up TODOs: None
-->

# Cartoon Golf Chaos Constitution

## Core Principles

### I. Single-Page Simplicity

The entire game MUST exist as a single HTML page with embedded JavaScript and CSS. No build tools, bundlers, or transpilers are required for core functionality. The game MUST run directly in iPad Safari without external dependencies or server calls.

**Rationale**: Maximizes portability, eliminates deployment complexity, and ensures the game works offline. Players can download and play from a single file.

### II. Touch-First Design

All interactions MUST be optimized for finger input on iPad touchscreens. No mouse/keyboard controls are required. Touch gestures MUST provide clear visual feedback and feel responsive (target 60fps).

**Rationale**: The game is designed exclusively for iPad; touch controls are the primary interface. Desktop support is not a priority.

### III. Client-Only Architecture

All game logic, physics, rendering, and data persistence MUST execute client-side using browser APIs (Canvas/WebGL, localStorage/IndexedDB). No backend services, APIs, or authentication systems are permitted.

**Rationale**: Eliminates server costs, reduces complexity, and ensures the game works completely offline.

### IV. Progressive Feature Delivery

Features MUST be implemented in priority order (P1 → P2 → P3) as defined in user stories. Each priority level MUST be independently playable and testable before moving to the next. The P1 scope represents the Minimum Viable Product (MVP).

**Rationale**: Ensures early validation, allows incremental releases, and prevents scope creep by forcing prioritization decisions.

### V. Performance-First Rendering

The game MUST maintain smooth performance (target 60fps) on iPad devices. Optimize for:
- Efficient Canvas/WebGL rendering (minimize redraws)
- Lightweight physics calculations
- Minimal asset sizes (prefer SVG/procedural graphics over large images)
- Lazy loading of non-critical assets

**Rationale**: Performance directly impacts player experience in real-time gameplay. Choppy rendering breaks immersion.

### VI. Playful & Testable Randomness

Random elements (obstacle placement, streaker events, environmental effects) MUST be:
- Seeded for reproducibility during testing
- Configurable via debug flags
- Balanced to maintain fair gameplay

**Rationale**: Randomness adds variety and humor, but must not compromise testability or create unfair scenarios.

## Technical Constraints

### Browser & Platform Requirements

- **Target Platform**: iPad Safari (iOS 15+)
- **Primary API**: HTML5 Canvas for 2D rendering
- **Optional API**: WebGL for advanced effects (if performance permits)
- **Storage**: localStorage for settings, IndexedDB for game state/leaderboard
- **Audio**: Web Audio API or HTML5 Audio (mutable)

### Asset & Performance Standards

- **Frame Rate**: Target 60fps during gameplay
- **Asset Format**: SVG preferred for graphics; PNG/JPG only for textures
- **File Size**: Single HTML file should remain under 2MB (excluding optional future assets)
- **Load Time**: Playable within 3 seconds of page load on iPad

### Code Organization

While the game is a single HTML file, internal structure MUST follow modular patterns:
- Separate concerns: game engine, physics, rendering, UI, storage
- Use JavaScript modules or IIFEs for encapsulation
- Avoid global namespace pollution

## Development Workflow

### Feature Implementation Order

1. **Setup Phase**: Project structure, Canvas initialization, basic game loop
2. **Core Physics**: Ball movement, collision detection, club mechanics
3. **User Story Priority**: Implement P1 features first, then P2, then P3
4. **Polish Phase**: Animations, sound effects, visual feedback

### Testing Strategy

- **Manual Testing**: Primary validation method (iPad Safari testing)
- **Unit Tests**: Optional for complex physics/math functions
- **Integration Tests**: Optional for game state management
- **Visual Regression**: Screenshots of key game states for comparison

**Note**: Given the single-page nature and visual/interactive focus, automated testing is optional. Manual playtesting is the primary quality gate.

### Code Review Requirements

- Verify no external dependencies introduced (except optional CDN libraries for physics/audio)
- Confirm touch interactions work on iPad
- Validate performance (60fps) on reference iPad device
- Check localStorage persistence across sessions

## Governance

### Amendment Process

1. **Proposal**: Document the principle change with rationale
2. **Impact Analysis**: Identify affected features and templates
3. **Approval**: Requires project owner (Paul) sign-off
4. **Migration**: Update constitution.md, increment version, propagate to templates
5. **Commit**: Document change in git history

### Versioning Policy

Constitution follows semantic versioning (MAJOR.MINOR.PATCH):
- **MAJOR**: Backward-incompatible changes (e.g., removing Single-Page Simplicity principle)
- **MINOR**: New principles or sections added (e.g., adding a security principle)
- **PATCH**: Clarifications, typo fixes, non-semantic refinements

### Compliance Review

All feature specifications (spec.md) and implementation plans (plan.md) MUST verify compliance with these principles. Non-compliance requires explicit justification documented in the plan's "Complexity Tracking" section.

### Runtime Guidance

Development guidance for AI pair-coding is maintained separately in `.specify/templates/agent-file-template.md` and auto-generated from active feature plans.

**Version**: 1.0.0 | **Ratified**: 2025-12-06 | **Last Amended**: 2025-12-06
