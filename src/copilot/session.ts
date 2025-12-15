/**
 * Session management for Copilot conversations
 */

import type { CopilotSession, HistoryEntry, SessionSummary } from './types.js';

/**
 * In-memory storage for sessions
 */
const sessions = new Map<string, CopilotSession>();

/**
 * Currently active session ID
 */
let currentSessionId: string | null = null;

/**
 * Generate a unique session ID
 */
function generateSessionId(): string {
  return `session-${Date.now()}`;
}

/**
 * Create a new session and set it as current
 */
export function createSession(): string {
  const sessionId = generateSessionId();
  const session: CopilotSession = {
    id: sessionId,
    startTime: new Date(),
    lastActivity: new Date(),
    history: []
  };

  sessions.set(sessionId, session);
  currentSessionId = sessionId;

  return sessionId;
}

/**
 * Get the current session ID
 */
export function getCurrentSessionId(): string | null {
  return currentSessionId;
}

/**
 * Get a session by ID
 */
export function getSession(sessionId: string): CopilotSession | undefined {
  return sessions.get(sessionId);
}

/**
 * Check if a session exists
 */
export function hasSession(sessionId: string): boolean {
  return sessions.has(sessionId);
}

/**
 * Add a history entry to a session
 */
export function addHistoryEntry(sessionId: string, prompt: string, response: string): void {
  const session = sessions.get(sessionId);
  if (session) {
    const entry: HistoryEntry = {
      prompt,
      response,
      timestamp: new Date()
    };
    session.history.push(entry);
    session.lastActivity = new Date();
  }
}

/**
 * Add history entry to the current session
 */
export function addToCurrentSession(prompt: string, response: string): void {
  if (currentSessionId) {
    addHistoryEntry(currentSessionId, prompt, response);
  }
}

/**
 * Get all sessions as summaries
 */
export function getAllSessionSummaries(): SessionSummary[] {
  return Array.from(sessions.values()).map((session) => ({
    id: session.id,
    startTime: session.startTime,
    lastActivity: session.lastActivity,
    messageCount: session.history.length
  }));
}

/**
 * Delete a session
 */
export function deleteSession(sessionId: string): boolean {
  const deleted = sessions.delete(sessionId);
  if (deleted && currentSessionId === sessionId) {
    currentSessionId = null;
  }
  return deleted;
}

/**
 * Clear all sessions
 */
export function clearAllSessions(): void {
  sessions.clear();
  currentSessionId = null;
}
