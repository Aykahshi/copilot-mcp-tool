#!/usr/bin/env node

import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

// Create dist/esm directory
const esmDir = join(projectRoot, 'dist', 'esm');
mkdirSync(esmDir, { recursive: true });

// Write package.json with type: module
const packageJson = { type: 'module' };
writeFileSync(join(esmDir, 'package.json'), JSON.stringify(packageJson, null, 2));

console.log('✅ ESM directory prepared');
