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

/**
 * Extracts and parses the content of a resource.
 * @param resource The resource object containing the content to parse
 * @returns The parsed content of the resource, or an empty object if parsing fails
 */
export function getResourceContent(resource: { content: string }) {
  return safeParseJSON(resource.content) || {};
}

/**
 * Retrieves the name from the resource content.
 * @param resource The resource object
 * @returns The name from the resource content, or an empty string if not available
 */
export function getResourceName(resource: { content: string }) {
  const content = getResourceContent(resource);
  return content.name || '';
}

/**
 * Retrieves the availabilities from the resource content.
 * @param resource The resource object
 * @returns The availabilities from the resource content, or an empty array if not available
 */
export function getAvailabilities(resource: { content: string }) {
  const content = getResourceContent(resource);
  return content.availabilities || [];
}

/**
 * Formats the slot time based on the start time, index, and length.
 * @param start The start time in HH:mm format
 * @param index The index of the slot
 * @param length The length of the slot in minutes
 * @returns The formatted slot time in HH:mm format
 */
export function formatSlotTime(start: string, index: number, length: number) {
  const [h, m] = start.split(':').map(Number);
  const date = new Date(0, 0, 0, h, m + index * length);
  return date.toTimeString().slice(0, 5);
}

// Add more helper functions here as needed in the future.
