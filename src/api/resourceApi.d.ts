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
export declare function createResourceBooking({ resourceId, day, slot, name, email }: {
    resourceId: string;
    day: number;
    slot: string;
    name: string;
    email: string;
}): Promise<any>;
