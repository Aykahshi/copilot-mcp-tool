#!/usr/bin/env node

import { mkdirSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

// Create dist/cjs directory
const cjsDir = join(projectRoot, 'dist', 'cjs');
mkdirSync(cjsDir, { recursive: true });

// Write package.json with type: commonjs
const packageJson = { type: 'commonjs' };
writeFileSync(
    join(cjsDir, 'package.json'),
    JSON.stringify(packageJson, null, 2)
);

console.log('✅ CJS directory prepared');
