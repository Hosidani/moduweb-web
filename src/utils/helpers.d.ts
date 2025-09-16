/**
 * Safely parses a JSON string. Returns the parsed object, or fallback if parsing fails.
 * @param input The JSON string to parse
 * @param fallback The value to return if parsing fails (default: null)
 */
export declare function safeParseJSON<T = any>(input: string, fallback?: T | null): T | null;
/**
 * Extracts and parses the content of a resource.
 * @param resource The resource object containing the content to parse
 * @returns The parsed content of the resource, or an empty object if parsing fails
 */
export declare function getResourceContent(resource: {
    content: string;
}): any;
/**
 * Retrieves the name from the resource content.
 * @param resource The resource object
 * @returns The name from the resource content, or an empty string if not available
 */
export declare function getResourceName(resource: {
    content: string;
}): any;
/**
 * Retrieves the availabilities from the resource content.
 * @param resource The resource object
 * @returns The availabilities from the resource content, or an empty array if not available
 */
export declare function getAvailabilities(resource: {
    content: string;
}): any;
/**
 * Formats the slot time based on the start time, index, and length.
 * @param start The start time in HH:mm format
 * @param index The index of the slot
 * @param length The length of the slot in minutes
 * @returns The formatted slot time in HH:mm format
 */
export declare function formatSlotTime(start: string, index: number, length: number): string;
