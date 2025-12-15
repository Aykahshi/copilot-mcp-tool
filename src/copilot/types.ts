/**
 * Copilot-specific type definitions
 */

/**
 * Represents a single entry in the conversation history
 */
export interface HistoryEntry {
  prompt: string;
  response: string;
  timestamp: Date;
}

/**
 * Represents a Copilot conversation session
 */
export interface CopilotSession {
  id: string;
  startTime: Date;
  lastActivity: Date;
  history: HistoryEntry[];
}

/**
 * Options for executing a Copilot CLI command
 */
export interface ExecuteCommandOptions {
  context?: string;
  model?: string;
  allowAllTools?: boolean;
  sessionId?: string;
  additionalArgs?: string[];
  cwd?: string;
}

/**
 * Summary of a session for listing purposes
 */
export interface SessionSummary {
  id: string;
  startTime: Date;
  lastActivity: Date;
  messageCount: number;
}
