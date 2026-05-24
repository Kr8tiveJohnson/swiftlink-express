#!/usr/bin/env node
/**
 * obfuscate.js — SwiftLink Express build script
 * Run: node obfuscate.js
 * Output: app.min.js  (obfuscated, ready to deploy)
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// ─── 1. Install javascript-obfuscator if not present ──────────────────────────
try {
    require.resolve('javascript-obfuscator');
} catch (_) {
    console.log('📦 Installing javascript-obfuscator...');
    execSync('npm install javascript-obfuscator --save-dev', { stdio: 'inherit' });
}

const JavaScriptObfuscator = require('javascript-obfuscator');

// ─── 2. Read source ────────────────────────────────────────────────────────────
const srcPath = path.join(__dirname, 'app.js');
const outPath = path.join(__dirname, 'app.min.js');

if (!fs.existsSync(srcPath)) {
    console.error('❌ app.js not found. Place this script in the same folder as app.js');
    process.exit(1);
}

const sourceCode = fs.readFileSync(srcPath, 'utf8');

// ─── 3. Obfuscate ─────────────────────────────────────────────────────────────
console.log('🔒 Obfuscating app.js...');

const result = JavaScriptObfuscator.obfuscate(sourceCode, {
    compact: true,                    // Remove whitespace
    controlFlowFlattening: true,      // Scramble control flow
    controlFlowFlatteningThreshold: 0.5,
    deadCodeInjection: true,          // Add fake code
    deadCodeInjectionThreshold: 0.3,
    debugProtection: false,           // Set true to block DevTools (slows browser)
    disableConsoleOutput: true,       // Remove console.log statements
    identifierNamesGenerator: 'hexadecimal', // Rename vars to hex codes
    log: false,
    numbersToExpressions: true,       // Convert numbers to expressions
    renameGlobals: false,             // Keep global function names (needed for HTML onclick=)
    rotateStringArray: true,
    selfDefending: true,              // Resists code formatting/beautifiers
    shuffledStringArray: true,
    splitStrings: true,               // Break string literals apart
    splitStringsChunkLength: 8,
    stringArray: true,                // Encode all strings
    stringArrayCallsTransform: true,
    stringArrayEncoding: ['base64'],  // Base64 encode strings
    stringArrayIndexShift: true,
    stringArrayRotate: true,
    stringArrayShuffle: true,
    stringArrayWrappersCount: 2,
    stringArrayWrappersChainedCalls: true,
    stringArrayWrappersParametersMaxCount: 4,
    stringArrayWrappersType: 'function',
    stringArrayThreshold: 0.8,
    transformObjectKeys: true,        // Obfuscate object keys
    unicodeEscapeSequence: false,
    sourceMap: false,                 // NO source maps — this is the whole point!
});

// ─── 4. Write output ──────────────────────────────────────────────────────────
fs.writeFileSync(outPath, result.getObfuscatedCode(), 'utf8');

const originalSize = (fs.statSync(srcPath).size / 1024).toFixed(1);
const outputSize   = (fs.statSync(outPath).size / 1024).toFixed(1);

console.log(`✅ Done!`);
console.log(`   Input : app.js      (${originalSize} KB)`);
console.log(`   Output: app.min.js  (${outputSize} KB)`);
console.log('');
console.log('📋 Next step:');
console.log('   In index.html, change:');
console.log('     <script src="app.js"></script>');
console.log('   To:');
console.log('     <script src="app.min.js"></script>');
