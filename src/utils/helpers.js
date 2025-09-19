/**
 * Hitta bokningsnamn för en slot i ett resource-content-objekt
 */
export function getBookingName(contentObj, dayNum, slotKey) {
    if (contentObj.bookings && Array.isArray(contentObj.bookings)) {
        const found = contentObj.bookings.find((b) => b.day === dayNum && b.slot === slotKey);
        if (found)
            return found.name;
    }
    // Fallback: försök hitta namn direkt på slotten (om du sparar så)
    return '';
}
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
/**
 * Filters and returns all resources that represent bookings for a given parent resource.
 * A booking resource must have: resourceId, slot, name, and email.
 * @param resources Array of resource objects (with 'id' and 'content' properties)
 * @param parentResourceId The id of the parent resource to match
 * @returns Array of booking resource objects for the given parent
 */
export function getBookingsForParentResource(resources, parentResourceId) {
    return resources
        .map(resource => {
        let parsed = resource.content;
        while (typeof parsed === 'string') {
            try {
                parsed = JSON.parse(parsed);
            }
            catch {
                parsed = {};
                break;
            }
        }
        return { ...parsed, id: resource.id };
    })
        .filter(b => b &&
        b.resourceId === parentResourceId &&
        b.slot &&
        b.name &&
        b.email);
}
// Add more helper functions here as needed in the future.
