#!/usr/bin/env node

/**
 * Pre-commit validation script for Vercel deployment
 * Checks for common issues that would cause deployment to fail
 */

const fs = require('fs');
const path = require('path');

let hasErrors = false;

function error(msg) {
  console.error(`\x1b[31mError:\x1b[0m ${msg}`);
  hasErrors = true;
}

function warn(msg) {
  console.warn(`\x1b[33mWarning:\x1b[0m ${msg}`);
}

function success(msg) {
  console.log(`\x1b[32m✓\x1b[0m ${msg}`);
}

// Check package.json for platform-specific dependencies
function checkPackageJson() {
  const pkgPath = path.join(__dirname, '..', 'package.json');
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));

  const platformSpecific = ['fsevents'];

  // Check dependencies (not optionalDependencies)
  if (pkg.dependencies) {
    for (const dep of platformSpecific) {
      if (pkg.dependencies[dep]) {
        error(`"${dep}" is in dependencies but is platform-specific. Move to optionalDependencies.`);
      }
    }
  }

  // fsevents should be in optionalDependencies if present
  if (pkg.optionalDependencies?.fsevents) {
    success('fsevents is correctly in optionalDependencies');
  }

  success('package.json validated');
}

// Check that required files exist
function checkRequiredFiles() {
  const required = ['game.html', 'vercel.json'];

  for (const file of required) {
    const filePath = path.join(__dirname, '..', file);
    if (!fs.existsSync(filePath)) {
      error(`Required file missing: ${file}`);
    }
  }

  success('Required files present');
}

// Check vercel.json is valid
function checkVercelConfig() {
  const vercelPath = path.join(__dirname, '..', 'vercel.json');
  try {
    const config = JSON.parse(fs.readFileSync(vercelPath, 'utf8'));
    if (config.rewrites) {
      success('vercel.json is valid');
    }
  } catch (e) {
    error(`vercel.json is invalid: ${e.message}`);
  }
}

// Run all checks
console.log('\nValidating deployment configuration...\n');

checkPackageJson();
checkRequiredFiles();
checkVercelConfig();

console.log('');

if (hasErrors) {
  console.error('\x1b[31mValidation failed! Fix errors before committing.\x1b[0m\n');
  process.exit(1);
} else {
  console.log('\x1b[32mAll checks passed!\x1b[0m\n');
  process.exit(0);
}
