export declare function findBookingResourceId({ resourceId, day, slot, name }: {
    resourceId: string;
    day: number;
    slot: string;
    name: string;
}): Promise<string | null>;
export declare function deleteBookingResource(id: string): Promise<void>;
export declare function updateResourceSlot({ id, content }: {
    id: string;
    content: string;
}): Promise<any>;
export declare function createResourceBooking(bookingObj: {
    [key: string]: any;
}): Promise<any>;
export declare function fetchAllResources(): Promise<any>;
export declare function sendBookingEmail({ to, subject, body }: {
    to: string;
    subject: string;
    body: string;
}): Promise<any>;
