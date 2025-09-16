// src/utils/helpers.ts

/**
 * Safely parses a JSON string. Returns the parsed object, or fallback if parsing fails.
 * @param input The JSON string to parse
 * @param fallback The value to return if parsing fails (default: null)
 */
export function safeParseJSON<T = any>(input: string, fallback: T | null = null): T | null {
  try {
    return JSON.parse(input);
  } catch {
    return fallback;
  }
}

// Add more helper functions here as needed in the future.
