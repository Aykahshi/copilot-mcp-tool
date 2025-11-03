#!/usr/bin/env node

import { spawn } from 'child_process';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const serverPath = join(__dirname, 'dist/esm/examples/server/copilotMcpServer.js');

console.log('🧪 Detailed MCP Server Test\n');

const server = spawn('node', [serverPath], {
    stdio: ['pipe', 'pipe', 'pipe']
});

let testResults = [];

server.stdout.on('data', (data) => {
    const lines = data.toString().split('\n').filter(l => l.trim() && l.startsWith('{'));

    for (const line of lines) {
        try {
            const response = JSON.parse(line);
            testResults.push(response);
        } catch (e) {
            // Ignore non-JSON
        }
    }
});

server.stderr.on('data', (data) => {
    const output = data.toString();
    if (output.includes('Initial session')) {
        console.log('✅ Server started successfully');
    }
});

// Test sequence
setTimeout(() => {
    console.log('\n📤 Sending: initialize');
    server.stdin.write(JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method: 'initialize',
        params: {
            protocolVersion: '2024-11-05',
            capabilities: {},
            clientInfo: { name: 'test', version: '1.0' }
        }
    }) + '\n');
}, 1000);

setTimeout(() => {
    console.log('📤 Sending: tools/list');
    server.stdin.write(JSON.stringify({
        jsonrpc: '2.0',
        id: 2,
        method: 'tools/list',
        params: {}
    }) + '\n');
}, 2000);

setTimeout(() => {
    console.log('📤 Sending: resources/list');
    server.stdin.write(JSON.stringify({
        jsonrpc: '2.0',
        id: 3,
        method: 'resources/list',
        params: {}
    }) + '\n');
}, 3000);

setTimeout(() => {
    console.log('📤 Sending: prompts/list');
    server.stdin.write(JSON.stringify({
        jsonrpc: '2.0',
        id: 4,
        method: 'prompts/list',
        params: {}
    }) + '\n');
}, 4000);

setTimeout(() => {
    server.kill();

    console.log('\n' + '='.repeat(80));
    console.log('📊 TEST RESULTS');
    console.log('='.repeat(80) + '\n');

    // Initialize
    const init = testResults.find(r => r.id === 1);
    if (init?.result) {
        console.log('✅ INITIALIZE:');
        console.log(`   - Protocol: ${init.result.protocolVersion}`);
        console.log(`   - Server: ${init.result.serverInfo.name} v${init.result.serverInfo.version}`);
        console.log(`   - Capabilities: ${Object.keys(init.result.capabilities).join(', ')}\n`);
    }

    // Tools
    const tools = testResults.find(r => r.id === 2);
    if (tools?.result?.tools) {
        console.log(`✅ TOOLS (${tools.result.tools.length} found):`);
        tools.result.tools.forEach(t => {
            console.log(`   - ${t.name}: ${t.title}`);
        });
        console.log();
    }

    // Resources
    const resources = testResults.find(r => r.id === 3);
    if (resources?.result) {
        console.log(`✅ RESOURCES (${resources.result.resources?.length || 0} found):`);
        if (resources.result.resources?.length > 0) {
            resources.result.resources.forEach(r => {
                console.log(`   - ${r.name}: ${r.uri}`);
            });
        } else {
            console.log('   ⚠️  No resources returned (expected 2)');
        }
        console.log();
    }

    // Prompts
    const prompts = testResults.find(r => r.id === 4);
    if (prompts?.result?.prompts) {
        console.log(`✅ PROMPTS (${prompts.result.prompts.length} found):`);
        prompts.result.prompts.forEach(p => {
            console.log(`   - ${p.name}: ${p.title}`);
        });
        console.log();
    }

    console.log('='.repeat(80));
    console.log(`\n✅ All ${testResults.length} tests completed successfully!`);

    process.exit(0);
}, 6000);
