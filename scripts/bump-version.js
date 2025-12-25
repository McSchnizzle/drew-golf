#!/usr/bin/env node

/**
 * Bumps the version number and updates the build timestamp in game.html
 * Called automatically by the pre-commit hook
 */

const fs = require('fs');
const path = require('path');

const gameHtmlPath = path.join(__dirname, '..', 'game.html');

// Read the file
let content = fs.readFileSync(gameHtmlPath, 'utf8');

// Find and parse current version
const versionMatch = content.match(/id="version-footer">v(\d+)\.(\d+)\.(\d+)/);

if (!versionMatch) {
  console.error('Could not find version footer in game.html');
  process.exit(1);
}

let [, major, minor, patch] = versionMatch.map((v, i) => i === 0 ? v : parseInt(v));

// Increment patch version
patch++;

const newVersion = `${major}.${minor}.${patch}`;
const buildDate = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

// Update the version footer
const oldFooter = versionMatch[0];
const newFooter = `id="version-footer">v${newVersion}`;

content = content.replace(
  /id="version-footer">v[\d.]+\s*\|\s*Built:\s*[\d-]+/,
  `id="version-footer">v${newVersion} | Built: ${buildDate}`
);

// Write the file
fs.writeFileSync(gameHtmlPath, content, 'utf8');

console.log(`Version bumped to v${newVersion} (Built: ${buildDate})`);

// Stage the updated file
const { execSync } = require('child_process');
execSync('git add game.html', { stdio: 'inherit' });
