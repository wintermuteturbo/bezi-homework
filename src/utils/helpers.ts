/**
 * Generates a simple unique ID for tracking messages in chat UI
 * @returns Unique ID
 */
export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
} 