#!/usr/bin/env node

/**
 * Test script for GitHub Copilot MCP Server
 */

import { spawn } from 'child_process';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const serverPath = join(__dirname, 'dist/esm/examples/server/copilotMcpServer.js');

console.log('🧪 Testing GitHub Copilot MCP Server...\n');

const server = spawn('node', [serverPath], {
    stdio: ['pipe', 'pipe', 'pipe']
});

let responseBuffer = '';
let testsPassed = 0;
let testsFailed = 0;

server.stdout.on('data', (data) => {
    responseBuffer += data.toString();

    // Try to parse JSON-RPC responses
    const lines = responseBuffer.split('\n');
    responseBuffer = lines.pop() || '';

    for (const line of lines) {
        if (line.trim() && line.startsWith('{')) {
            try {
                const response = JSON.parse(line);
                console.log('✅ Response:', JSON.stringify(response, null, 2).substring(0, 500) + '...\n');
            } catch (e) {
                // Not JSON, ignore
            }
        }
    }
});

server.stderr.on('data', (data) => {
    console.log('📋 Server:', data.toString());
});

// Wait for server to start
setTimeout(() => {
    console.log('\n🔍 Test 1: Initialize Request');
    const initRequest = {
        jsonrpc: '2.0',
        id: 1,
        method: 'initialize',
        params: {
            protocolVersion: '2024-11-05',
            capabilities: {
                roots: { listChanged: true }
            },
            clientInfo: {
                name: 'test-client',
                version: '1.0.0'
            }
        }
    };
    server.stdin.write(JSON.stringify(initRequest) + '\n');
}, 1000);

setTimeout(() => {
    console.log('\n🔍 Test 2: List Tools');
    const toolsRequest = {
        jsonrpc: '2.0',
        id: 2,
        method: 'tools/list',
        params: {}
    };
    server.stdin.write(JSON.stringify(toolsRequest) + '\n');
}, 2000);

setTimeout(() => {
    console.log('\n🔍 Test 3: List Resources');
    const resourcesRequest = {
        jsonrpc: '2.0',
        id: 3,
        method: 'resources/list',
        params: {}
    };
    server.stdin.write(JSON.stringify(resourcesRequest) + '\n');
}, 3000);

setTimeout(() => {
    console.log('\n🔍 Test 4: List Prompts');
    const promptsRequest = {
        jsonrpc: '2.0',
        id: 4,
        method: 'prompts/list',
        params: {}
    };
    server.stdin.write(JSON.stringify(promptsRequest) + '\n');
}, 4000);

setTimeout(() => {
    console.log('\n✅ Tests completed!');
    server.kill();
    process.exit(0);
}, 6000);

server.on('error', (error) => {
    console.error('❌ Server error:', error);
    process.exit(1);
});
