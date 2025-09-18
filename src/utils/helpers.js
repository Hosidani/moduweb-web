// src/utils/helpers.ts
/**
 * Safely parses a JSON string. Returns the parsed object, or fallback if parsing fails.
 * @param input The JSON string to parse
 * @param fallback The value to return if parsing fails (default: null)
 */
export function safeParseJSON(input, fallback = null) {
    try {
        return JSON.parse(input);
    }
    catch {
        return fallback;
    }
}
/**
 * Extracts and parses the content of a resource.
 * @param resource The resource object containing the content to parse
 * @returns The parsed content of the resource, or an empty object if parsing fails
 */
export function getResourceContent(resource) {
    let parsed = resource.content;
    // Parsea om och om tills vi får ett objekt
    while (typeof parsed === 'string') {
        try {
            parsed = JSON.parse(parsed);
        }
        catch {
            parsed = {};
            break;
        }
    }
    // Hantera availabilities som sträng eller array
    if (parsed.availabilities && typeof parsed.availabilities === 'string') {
        try {
            parsed.availabilities = JSON.parse(parsed.availabilities);
        }
        catch {
            parsed.availabilities = [];
        }
    }
    if (!Array.isArray(parsed.availabilities)) {
        parsed.availabilities = [];
    }
    if (typeof window !== 'undefined') {
        console.log('getResourceContent:', parsed);
    }
    return parsed;
}
// Add more helper functions here as needed in the future.
