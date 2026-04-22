/**
 * Constants for the Copilot MCP Server
 */

import { homedir } from 'node:os';
import { join } from 'node:path';

/**
 * Supported Copilot models.
 * Update this list when new models become available.
 */
export const SUPPORTED_MODELS = [
  'auto',
  'gpt-5.4',
  'gpt-5.3-codex',
  'gpt-5.2-codex',
  'gpt-5.2',
  'gpt-5.4-mini',
  'gpt-5-mini',
  'gpt-4.1',
  'claude-sonnet-4.6',
  'claude-sonnet-4.5',
  'claude-haiku-4.5',
  'claude-opus-4.7',
  'claude-sonnet-4'
] as const;

export type SupportedModel = (typeof SUPPORTED_MODELS)[number];

/**
 * Model preference types
 */
export type ModelPreference = 'claude' | 'gpt';

/**
 * Default models configuration by preference
 */
export const MODEL_DEFAULTS = {
  claude: {
    ask: 'claude-sonnet-4.6',
    explain: 'claude-sonnet-4.6',
    suggest: 'claude-sonnet-4.6',
    debug: 'claude-sonnet-4.6',
    refactor: 'claude-sonnet-4.6',
    review: 'claude-sonnet-4.6',
    testGenerate: 'claude-sonnet-4.6'
  },
  gpt: {
    ask: 'gpt-5.4',
    explain: 'gpt-5.4',
    suggest: 'gpt-5.4',
    debug: 'gpt-5.4',
    refactor: 'gpt-5.4',
    review: 'gpt-5.4',
    testGenerate: 'gpt-5.4'
  }
} as const;

/**
 * Global model preference (can be set at startup)
 */
let currentModelPreference: ModelPreference = 'claude';

/**
 * Set the global model preference
 */
export function setModelPreference(preference: ModelPreference): void {
  currentModelPreference = preference;
}

/**
 * Get the current model preference
 */
export function getModelPreference(): ModelPreference {
  return currentModelPreference;
}

/**
 * Get default model for a specific tool based on current preference
 */
export function getDefaultModel(tool: keyof typeof MODEL_DEFAULTS.claude): SupportedModel {
  return MODEL_DEFAULTS[currentModelPreference][tool] as SupportedModel;
}

/**
 * Directory paths for Copilot data
 */
export const PATHS = {
  copilotDir: join(homedir(), '.copilot'),
  logsDir: join(homedir(), '.copilot', 'logs'),
  sessionsDir: join(homedir(), '.copilot', 'mcp-sessions')
} as const;

/**
 * Timeout configurations (in milliseconds)
 */
export const TIMEOUTS = {
  /** Time to wait for Copilot CLI to start before sending prompt */
  startupDelay: 1000,
  /** Time to wait for response before sending exit command */
  responseWait: 5000,
  /** Maximum time to wait for command completion */
  commandTimeout: 60000,
  /** Maximum time to wait for version check */
  versionCheckTimeout: 5000
} as const;

/**
 * Server metadata
 */
export const SERVER_INFO = {
  name: 'copilot-mcp-server',
  version: '2.2.0',
  description: 'GitHub Copilot CLI integration with full MCP capabilities'
} as const;
