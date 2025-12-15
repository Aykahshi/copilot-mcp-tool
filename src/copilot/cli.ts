/**
 * Copilot CLI interaction module
 *
 * Handles all communication with the GitHub Copilot CLI
 */

import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import { mkdir } from 'node:fs/promises';
import { PATHS, TIMEOUTS } from './constants.js';
import { addToCurrentSession } from './session.js';
import type { ExecuteCommandOptions } from './types.js';

/**
 * Initialize required directories for Copilot data
 */
export async function initDirectories(): Promise<void> {
  const directories = [PATHS.copilotDir, PATHS.logsDir, PATHS.sessionsDir];

  for (const dir of directories) {
    if (!existsSync(dir)) {
      await mkdir(dir, { recursive: true });
    }
  }
}

/**
 * Check if Copilot CLI is installed and accessible
 */
export async function checkCopilotInstalled(): Promise<boolean> {
  return new Promise((resolve) => {
    const child = spawn('copilot', ['--version'], {
      shell: true,
      stdio: 'pipe'
    });

    child.on('error', () => resolve(false));
    child.on('exit', (code) => resolve(code === 0));

    setTimeout(() => {
      child.kill();
      resolve(false);
    }, TIMEOUTS.versionCheckTimeout);
  });
}

/**
 * Build command arguments based on options
 */
function buildArgs(options: ExecuteCommandOptions): string[] {
  const args: string[] = [];

  if (options.model) {
    args.push('--model', options.model);
  }

  if (options.allowAllTools) {
    args.push('--allow-all-tools');
  }

  if (options.sessionId) {
    args.push('--resume', options.sessionId);
  }

  if (options.additionalArgs) {
    args.push(...options.additionalArgs);
  }

  return args;
}

/**
 * Execute a Copilot CLI command with the given prompt and options
 */
export async function executeCopilotCommand(
  prompt: string,
  options: ExecuteCommandOptions = {}
): Promise<string> {
  return new Promise((resolve, reject) => {
    const fullPrompt = options.context ? `${prompt}\n\nContext:\n${options.context}` : prompt;

    const args = buildArgs(options);

    const child = spawn('copilot', args, {
      shell: true,
      stdio: ['pipe', 'pipe', 'pipe'],
      cwd: options.cwd || process.cwd()
    });

    let stdout = '';
    let stderr = '';
    let hasReceivedOutput = false;

    child.stdout.on('data', (data) => {
      stdout += data.toString();
      hasReceivedOutput = true;
    });

    child.stderr.on('data', (data) => {
      stderr += data.toString();
    });

    child.on('error', (error) => {
      reject(new Error(`Failed to execute copilot: ${error.message}`));
    });

    // Wait for copilot to start, then send the prompt
    setTimeout(() => {
      try {
        if (child.stdin.writable) {
          child.stdin.write(`${fullPrompt}\n`);

          // Send exit command after waiting for response
          setTimeout(() => {
            if (child.stdin.writable) {
              child.stdin.write('/exit\n');
              child.stdin.end();
            }
          }, TIMEOUTS.responseWait);
        }
      } catch (error) {
        reject(error);
      }
    }, TIMEOUTS.startupDelay);

    child.on('exit', () => {
      // Check for authentication errors
      if (!hasReceivedOutput && stderr) {
        if (stderr.includes('login') || stderr.includes('authenticate')) {
          reject(
            new Error('GitHub Copilot CLI requires authentication. Please run: copilot /login')
          );
          return;
        }
      }

      const result = stdout.trim() || stderr.trim() || 'No response from Copilot CLI';

      // Save to session history
      addToCurrentSession(fullPrompt, result);

      resolve(result);
    });

    // Timeout after configured duration
    setTimeout(() => {
      if (child.stdin.writable) {
        child.stdin.write('/exit\n');
      }
      child.kill();

      if (hasReceivedOutput) {
        resolve(stdout.trim() || 'Copilot CLI timed out, but partial response received');
      } else {
        reject(new Error('Copilot CLI command timed out with no response'));
      }
    }, TIMEOUTS.commandTimeout);
  });
}

/**
 * Create an error result for when Copilot CLI is not installed
 */
export function createNotInstalledError(): {
  content: Array<{ type: 'text'; text: string }>;
  isError: true;
} {
  return {
    content: [
      {
        type: 'text',
        text: 'Error: GitHub Copilot CLI is not installed.\n\nInstall: npm install -g @github/copilot'
      }
    ],
    isError: true
  };
}

/**
 * Create an error result from an exception
 */
export function createErrorResult(error: unknown): {
  content: Array<{ type: 'text'; text: string }>;
  isError: true;
} {
  return {
    content: [
      {
        type: 'text',
        text: `Error: ${error instanceof Error ? error.message : String(error)}`
      }
    ],
    isError: true
  };
}
