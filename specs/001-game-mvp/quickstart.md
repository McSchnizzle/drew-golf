# Quickstart Guide: Cartoon Golf Chaos Development

**Feature**: 001-game-mvp
**Date**: 2025-12-06

## Overview

This guide helps you set up the development environment and start building the iPad golf game.

## Prerequisites

- **iPad (iOS 15+)** for testing (primary requirement)
- **macOS, Linux, or Windows** for development
- **Text editor** (VS Code, Sublime, Vim, etc.)
- **Web browser** for desktop testing (Safari, Chrome, Firefox)
- **Simple HTTP server** for local testing (optional but recommended)

## Quick Start (30 seconds)

### Option 1: Start from scratch

```bash
# 1. Create game.html
touch game.html

# 2. Open in your text editor
code game.html  # or vim, sublime, etc.

# 3. Copy the basic template (see below)

# 4. Open in browser
open game.html  # or double-click the file
```

### Option 2: Use modular development structure

```bash
# 1. Create development structure
mkdir -p src/modules src/styles src/assets/sounds tests

# 2. Create initial files
touch src/modules/game-engine.js
touch src/styles/main.css
touch build.sh

# 3. Make build script executable
chmod +x build.sh

# 4. Start coding in src/, run build.sh when ready to test
```

## Basic HTML Template

Save this as `game.html` to get started:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-status-bar-style" content="black-fullscreen">
  <title>Cartoon Golf Chaos</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
      -webkit-touch-callout: none;
      -webkit-user-select: none;
      user-select: none;
    }

    body {
      width: 100vw;
      height: 100vh;
      overflow: hidden;
      background: #87CEEB; /* Sky blue */
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
    }

    #game-canvas {
      display: block;
      width: 100%;
      height: 100%;
      touch-action: none; /* Prevent default touch behaviors */
    }

    #ui-overlay {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none; /* Let touches pass through to canvas */
    }

    #ui-overlay > * {
      pointer-events: auto; /* Re-enable for UI elements */
    }

    #scoreboard {
      position: absolute;
      top: 20px;
      left: 20px;
      background: rgba(255, 255, 255, 0.9);
      padding: 15px;
      border-radius: 10px;
      font-size: 16px;
    }

    #club-selector {
      position: absolute;
      bottom: 20px;
      left: 50%;
      transform: translateX(-50%);
      background: rgba(255, 255, 255, 0.9);
      padding: 10px;
      border-radius: 10px;
      display: none; /* Hidden by default */
    }

    .button {
      padding: 10px 20px;
      margin: 5px;
      background: #4CAF50;
      color: white;
      border: none;
      border-radius: 5px;
      font-size: 16px;
      cursor: pointer;
    }

    .button:active {
      background: #45a049;
    }
  </style>
</head>
<body>
  <canvas id="game-canvas"></canvas>

  <div id="ui-overlay">
    <div id="scoreboard">
      <div>Hole: <span id="hole-number">1</span>/9</div>
      <div>Par: <span id="hole-par">3</span></div>
      <div>Strokes: <span id="stroke-count">0</span></div>
      <div>Score: <span id="total-score">E</span></div>
    </div>

    <div id="club-selector">
      <button class="button" data-club="driver">Driver</button>
      <button class="button" data-club="putter">Putter</button>
    </div>
  </div>

  <script>
    // Your game code goes here
    console.log('Game loaded!');

    // Initialize canvas
    const canvas = document.getElementById('game-canvas');
    const ctx = canvas.getContext('2d');

    // Set canvas size to window size
    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Lock orientation to landscape (iOS Safari)
    if (screen.orientation && screen.orientation.lock) {
      screen.orientation.lock('landscape').catch(err => {
        console.log('Orientation lock not supported:', err);
      });
    }

    // Basic draw test
    ctx.fillStyle = '#228B22'; // Green
    ctx.fillRect(0, canvas.height - 100, canvas.width, 100); // Green at bottom

    ctx.fillStyle = '#FFFFFF'; // White
    ctx.beginPath();
    ctx.arc(canvas.width / 2, canvas.height / 2, 10, 0, Math.PI * 2); // Ball
    ctx.fill();

    ctx.fillStyle = '#000000';
    ctx.font = '24px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Touch screen to start development', canvas.width / 2, 50);

    // Basic touch test
    canvas.addEventListener('touchstart', (e) => {
      e.preventDefault();
      const touch = e.touches[0];
      console.log('Touch at:', touch.clientX, touch.clientY);

      // Draw circle at touch point
      ctx.fillStyle = '#FF0000';
      ctx.beginPath();
      ctx.arc(touch.clientX, touch.clientY, 20, 0, Math.PI * 2);
      ctx.fill();
    });

    console.log('Ready to build your golf game!');
  </script>
</body>
</html>
```

## Development Workflow

### 1. iPad Testing Setup

**Option A: Direct file access** (simplest)
1. Email `game.html` to yourself
2. Open email on iPad
3. Download attachment
4. Open in Safari

**Option B: Local HTTP server** (better for rapid iteration)
```bash
# On your development machine:
# Python 3
python3 -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000

# Node.js (if you have http-server installed)
npx http-server -p 8000

# PHP
php -S localhost:8000
```

Then on iPad Safari: `http://YOUR_LOCAL_IP:8000/game.html`

**Option C: Cloud hosting** (best for real testing)
- Deploy to GitHub Pages, Netlify, or Vercel
- Access via HTTPS URL on iPad

### 2. Debugging on iPad

**Safari Web Inspector** (requires macOS):
1. On iPad: Settings → Safari → Advanced → Enable "Web Inspector"
2. On Mac: Safari → Develop → [Your iPad] → [Your page]
3. Full console, network, and DOM inspection available

**Console logging**:
```javascript
// Add visible debug output
const debugLog = (message) => {
  console.log(message);

  // Also show on screen
  const debugDiv = document.getElementById('debug') || (() => {
    const div = document.createElement('div');
    div.id = 'debug';
    div.style.position = 'absolute';
    div.style.bottom = '10px';
    div.style.right = '10px';
    div.style.background = 'rgba(0,0,0,0.7)';
    div.style.color = 'white';
    div.style.padding = '10px';
    div.style.fontSize = '12px';
    div.style.maxWidth = '300px';
    div.style.pointerEvents = 'none';
    document.body.appendChild(div);
    return div;
  })();

  debugDiv.innerHTML = message + '<br>' + debugDiv.innerHTML.split('<br>').slice(0, 10).join('<br>');
};

// Usage
debugLog('Ball position: ' + ball.x + ', ' + ball.y);
```

### 3. Build Script (Optional)

If using modular development, create `build.sh`:

```bash
#!/bin/bash
# build.sh - Concatenate modules into game.html

OUTPUT="game.html"

echo "Building $OUTPUT..."

# Start HTML
cat > "$OUTPUT" << 'EOF'
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <meta name="apple-mobile-web-app-capable" content="yes">
  <title>Cartoon Golf Chaos</title>
  <style>
EOF

# Add CSS
cat src/styles/main.css >> "$OUTPUT"

echo "  </style>" >> "$OUTPUT"
echo "</head>" >> "$OUTPUT"
echo "<body>" >> "$OUTPUT"
echo "  <canvas id=\"game-canvas\"></canvas>" >> "$OUTPUT"
echo "  <div id=\"ui-overlay\"></div>" >> "$OUTPUT"
echo "  <script>" >> "$OUTPUT"

# Add JavaScript modules
for file in src/modules/*.js; do
  echo "// === $file ===" >> "$OUTPUT"
  cat "$file" >> "$OUTPUT"
  echo "" >> "$OUTPUT"
done

# Close HTML
cat >> "$OUTPUT" << 'EOF'

  // Initialize game
  window.addEventListener('DOMContentLoaded', () => {
    const game = new GameEngine();
    game.start();
  });
  </script>
</body>
</html>
EOF

echo "Build complete! File size: $(wc -c < "$OUTPUT") bytes"
echo "Open $OUTPUT in your browser or deploy to iPad"
```

Make it executable and run:
```bash
chmod +x build.sh
./build.sh
```

## Testing Checklist

### Desktop Testing (Before iPad)

- [ ] Game loads without errors in browser console
- [ ] Canvas renders correctly at various window sizes
- [ ] Mouse events work (simulate touch with mouse)
- [ ] Visual elements display correctly
- [ ] No JavaScript errors in console

### iPad Testing (Required for shipping)

- [ ] Game loads in Safari iOS
- [ ] Touch events register correctly
- [ ] No scrolling/zooming occurs during gameplay
- [ ] Performance is smooth (visually 60fps)
- [ ] Audio plays correctly (after user interaction)
- [ ] Game state persists across browser restarts
- [ ] Landscape orientation locks correctly
- [ ] UI elements are appropriately sized for touch

### Performance Testing

```javascript
// Add FPS counter
let lastFrameTime = performance.now();
let fps = 60;

function updateFPS(currentTime) {
  const delta = currentTime - lastFrameTime;
  fps = Math.round(1000 / delta);
  lastFrameTime = currentTime;

  // Display FPS
  ctx.fillStyle = '#000';
  ctx.font = '16px Arial';
  ctx.fillText(`FPS: ${fps}`, 10, 20);
}

function gameLoop(timestamp) {
  updateFPS(timestamp);
  // ... rest of game loop
  requestAnimationFrame(gameLoop);
}
```

## Common Pitfalls & Solutions

### 1. Touch Events Not Working

**Problem**: Touch events don't register or cause page scrolling

**Solution**:
```javascript
canvas.addEventListener('touchstart', (e) => {
  e.preventDefault(); // CRITICAL: Prevents default touch behavior
  // ... your code
}, { passive: false }); // passive: false allows preventDefault
```

**Also add to CSS**:
```css
#game-canvas {
  touch-action: none; /* Prevents all default touch actions */
}
```

### 2. Audio Not Playing on iOS

**Problem**: Sounds don't play even though code is correct

**Solution**: iOS requires user interaction before audio plays
```javascript
// Create an unlock audio function
let audioUnlocked = false;

function unlockAudio() {
  if (audioUnlocked) return;

  const ctx = new (window.AudioContext || window.webkitAudioContext)();
  const buffer = ctx.createBuffer(1, 1, 22050);
  const source = ctx.createBufferSource();
  source.buffer = buffer;
  source.connect(ctx.destination);
  source.start(0);

  audioUnlocked = true;
  console.log('Audio unlocked!');
}

// Call on first touch
document.addEventListener('touchstart', unlockAudio, { once: true });
```

### 3. Canvas Blurry on High-DPI Screens

**Problem**: Canvas looks pixelated on iPad Retina display

**Solution**:
```javascript
function resizeCanvas() {
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();

  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;

  ctx.scale(dpr, dpr);

  canvas.style.width = rect.width + 'px';
  canvas.style.height = rect.height + 'px';
}
```

### 4. localStorage/IndexedDB Not Persisting

**Problem**: Data disappears after closing Safari

**Solution**: Check Safari settings
- Settings → Safari → Block All Cookies → OFF
- Settings → Safari → Prevent Cross-Site Tracking → Can stay ON
- Ensure you're not in Private Browsing mode

### 5. Performance Issues / Low FPS

**Diagnosis**:
```javascript
// Add performance markers
performance.mark('physics-start');
physicsEngine.update(ball, deltaTime, obstacles);
performance.mark('physics-end');
performance.measure('physics', 'physics-start', 'physics-end');

// Check measurements
const measurements = performance.getEntriesByType('measure');
measurements.forEach(m => {
  if (m.duration > 5) {
    console.warn(`${m.name} took ${m.duration}ms (too slow!)`);
  }
});
```

**Common fixes**:
- Reduce number of obstacles
- Use dirty rectangle rendering (only redraw changed areas)
- Cache static background
- Limit particle effects
- Avoid creating new objects in game loop

## Progressive Implementation Guide

Follow this order for manageable development:

### Phase P1: MVP (Single Hole)
1. ✅ Canvas setup and basic rendering
2. ✅ Touch input handling (drag to swing)
3. ✅ Ball physics (launch, gravity, roll)
4. ✅ Hole layout rendering (tee, fairway, green, cup)
5. ✅ Collision detection with hole boundary
6. ✅ Stroke counting
7. ✅ Hole completion detection

### Phase P2: Full Game
1. ✅ 9 hole templates
2. ✅ Course generator with random obstacles
3. ✅ Club system (11 clubs with different characteristics)
4. ✅ Club selector UI
5. ✅ Obstacle physics (sand, water, trees)
6. ✅ Scoreboard with cumulative scoring
7. ✅ Round progression (auto-advance holes)

### Phase P3: Enhanced Features
1. ✅ Game state persistence (localStorage + IndexedDB)
2. ✅ Save/resume functionality
3. ✅ Leaderboard storage and display
4. ✅ Tutorial system
5. ✅ Audio manager and sound effects

### Phase P4: Polish
1. ✅ Visual animations (flag waving, confetti)
2. ✅ Random events (streaker, wind, critters)
3. ✅ Enhanced visual effects
4. ✅ Sound effects for all actions

## File Size Monitoring

Keep track of file size to stay under 2MB limit:

```bash
# Check current size
ls -lh game.html

# Or more detailed
du -h game.html

# Track module sizes
for file in src/modules/*.js; do
  echo "$(wc -c < "$file") bytes - $file"
done | sort -n
```

**Size budget**:
- HTML/CSS: ~10KB
- JavaScript code: ~140KB
- Audio files (base64 embedded or separate): ~50KB
- Total target: <200KB (leaving room for growth)

## Deployment Options

### Option 1: Single File Email/AirDrop
- Works immediately
- No server needed
- Easy to share
- Limited to single device

### Option 2: GitHub Pages (Free)
```bash
# Push to GitHub
git add game.html
git commit -m "Initial game version"
git push origin main

# Enable GitHub Pages in repository settings
# Access at: https://yourusername.github.io/repo-name/game.html
```

### Option 3: Netlify/Vercel (Free)
- Drag-and-drop deployment
- HTTPS by default
- Good for testing on multiple devices
- Custom domain support

## Next Steps

1. **Start with the basic template above**
2. **Implement P1 MVP features first** (single playable hole)
3. **Test on actual iPad frequently** (at least daily)
4. **Use the contracts in `contracts/game-api.md`** as implementation guide
5. **Refer to `data-model.md`** for entity structures
6. **Check `research.md`** for technical decision rationale

## Questions?

Refer to:
- **spec.md**: What the game should do (user perspective)
- **plan.md**: How we're building it (technical overview)
- **research.md**: Why we made specific technical choices
- **data-model.md**: Data structures and state management
- **contracts/game-api.md**: Module interfaces and APIs

Happy coding! 🏌️‍♂️⛳️
