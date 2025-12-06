Here you go, Paul — a clean, tight PRD for your single-page, finger-controlled, cartoon-golf iPad game. It's fun, weird, and structured enough for you (or an AI pair-coder) to turn into an actual build.

⸻

Product Requirements Document (PRD)

Project: Single-Page iPad Golf Game ("Cartoon Golf Chaos")

Platform: iPad Safari (single HTML page)

Interaction: Touch-only (finger swing mechanic)

Visual Style: Cartoonish but recognizable as a real golf course; playful, bright, not photorealistic

⸻

1. Product Overview

A lightweight, single-page web golf game for the iPad. Players swipe to swing, choose clubs, and navigate through 9 holes with varied lengths and randomized obstacles. The game is intentionally fun, arcade-like, and unpredictable — including optional tutorials, random course events (like a streaker running across the fairway), and score tracking via a persistent leaderboard.

The game must run entirely in one HTML page using JavaScript and canvas/WebGL graphics, able to store local progress and high scores without server dependencies.

⸻

2. Core Gameplay Requirements

2.1 Holes
    •    Total: 9 holes
    •    Each hole must have:
    •    A uniquely generated layout
    •    A par value
    •    Variable length (short, medium, long mixes — not sequential difficulty)
    •    Random obstacles placed on load
    •    A driver-only first swing
    •    Difficulty is scattered, not progressive (e.g., hole 2 can be hard, hole 6 can be easy).

2.2 Obstacles

Randomized per hole from a pool (exact art TBD):
    •    Sand traps
    •    Water hazards
    •    Trees / shrubs
    •    Rocks or cartoon objects (e.g., boulders)
    •    Occasional dynamic "fun elements" like wind gusts or small moving creatures
    •    Special event: a random streaker (humorous, PG-friendly silhouette style) may run across the course on some strokes

Obstacles must affect ball physics.

⸻

3. Controls & Interaction

3.1 Swing Mechanic

Using only finger input:
    •    Player drags backward to set power
    •    Angle determined by swipe direction
    •    Visual guide arrow shows estimated vector
    •    Release to strike (launches ball via physics engine)

3.2 Club Selection

Player can switch clubs after the first swing:
    •    Driver
    •    3-wood
    •    5-wood
    •    Irons (4–9)
    •    Wedge
    •    Putter

Each club modifies:
    •    Max power
    •    Trajectory arc
    •    Spin and distance variance

3.3 Putting Mode

When ball is on green or close enough:
    •    Switch to putter-only
    •    Smoother stroke with lower power ceiling

⸻

4. Visual & Audio Design Requirements

4.1 Style
    •    Cartoonish, colorful, playful
    •    Recognizable golf-course elements: trees, greens, fairways, bunkers, flags

4.2 Animations
    •    Flag waving on the green
    •    Confetti when:
    •    Hole completed
    •    Birdie or better
    •    Streaker event animation (brief, comedic, non-explicit)
    •    Simple ball rolling & bounce animation

4.3 Sound Effects
    •    Club impact sound
    •    Ball landing (grass/sand/water variations)
    •    Cheer sound for great shots
    •    Unique sound cue when streaker appears
    •    Hole completion jingle

Mute toggle required.

⸻

5. Scoring & Progression

5.1 Scoreboard

Tracks:
    •    Strokes per hole
    •    Par difference (+1, –2, etc.)
    •    Cumulative score across 9 holes

5.2 Leaderboard

Local-only leaderboard stored in browser storage:
    •    Top 10 rounds
    •    Displays:
    •    Total score relative to par
    •    Date/time
    •    Player name or initials

⸻

6. Tutorial Mode

6.1 Optional Tutorial

At start of first launch:
    •    Prompt: "Play tutorial?" Yes / No
    •    Tutorial covers:
    •    Drag-to-swing
    •    Changing clubs
    •    Reading power/angle indicators
    •    Avoiding obstacles

Can also be accessed from pause menu.

⸻

7. Game Storage & Persistence

7.1 Local Data

Using localStorage or IndexedDB:
    •    Current round progress (hole, strokes, club selected, ball position)
    •    High scores
    •    Settings: sound on/off, tutorial completed

7.2 Save/Resume

Player can:
    •    Leave the page
    •    Return later
    •    Continue where they left off

⸻

8. Random Event System

8.1 Streaker Event

Occasional, unpredictable appearance:
    •    Triggers between random strokes
    •    Runs across screen in 1–2 seconds
    •    Does NOT interfere with ball physics
    •    Purely comedic visual

8.2 Environmental Variability

Optional (v1 or later):
    •    Wind that changes between holes
    •    Moving critters (birds, squirrels)
    •    Randomized sky color (light day/night variation)

⸻

9. Technical Requirements

9.1 Frontend Technology
    •    HTML5
    •    CSS (no frameworks required but allowed)
    •    JavaScript
    •    Canvas API for rendering
    •    Responsive design for iPad resolution

9.2 Performance Constraints
    •    Smooth gameplay at 60fps target
    •    Efficient physics calculations
    •    Lightweight assets (SVG/cartoon shapes preferred)

9.3 No Backend
    •    Entire game must run client-side
    •    No login or online features

⸻

10. Stretch Features (Nice-to-Haves)

Not required for v1, but can be added later:
    •    Wind meter
    •    Replay of last shot
    •    Alternate course themes
    •    Unlockable avatars or club skins
    •    Multiplayer pass-and-play mode
    •    "Chaos mode" with more frequent streaker or weird obstacles

⸻

11. Acceptance Criteria

The game is considered V1 complete when:
    •    All 9 holes load with randomized obstacles and correct physics.
    •    Player can complete a full 9-hole round using finger input.
    •    Club selection affects ball behavior.
    •    Scoreboard and leaderboard both function and persist.
    •    Streaker event appears occasionally and animates smoothly.
    •    Tutorial is optional, functional, and skippable.
    •    Player can quit and resume mid-round with correct state.
    •    Game runs smoothly on an iPad in Safari in a single page.

⸻

If you'd like, I can now generate:

👉 A feature breakdown
👉 A technical architecture plan
👉 A project timeline
👉 A file structure
👉 Starter code for the engine, physics, UI, and canvas rendering

Just tell me what you want next — and I'll say it with a wink and a little disdain for capitalism, as requested.
