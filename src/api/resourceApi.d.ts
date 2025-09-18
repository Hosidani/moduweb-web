export declare function findBookingResourceId({ slotId, name, email }: {
    slotId: number;
    name: string;
    email: string;
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
export declare function deleteBooking({ slotId, name, email }: {
    slotId: number;
    name: string;
    email: string;
}): Promise<void>;
