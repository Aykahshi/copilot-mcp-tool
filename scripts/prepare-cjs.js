#!/usr/bin/env node

import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

// Create dist/cjs directory
const cjsDir = join(projectRoot, 'dist', 'cjs');
mkdirSync(cjsDir, { recursive: true });

// Write package.json with type: commonjs
const packageJson = { type: 'commonjs' };
writeFileSync(join(cjsDir, 'package.json'), JSON.stringify(packageJson, null, 2));

console.log('✅ CJS directory prepared');
