/**
 * Hitta bokningsnamn för en slot i ett resource-content-objekt
 */
export declare function getBookingName(contentObj: any, dayNum: number, slotKey: string): string;
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
    content: any;
}): any;
/**
 * Filters and returns all resources that represent bookings for a given parent resource.
 * A booking resource must have: resourceId, slot, name, and email.
 * @param resources Array of resource objects (with 'id' and 'content' properties)
 * @param parentResourceId The id of the parent resource to match
 * @returns Array of booking resource objects for the given parent
 */
export declare function getBookingsForParentResource(resources: {
    id: string;
    content: any;
}[], parentResourceId: string): any[];
