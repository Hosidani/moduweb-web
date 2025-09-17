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
export declare function createResourceBooking({ id, name, email }: {
    id: number;
    name: string;
    email: string;
}): Promise<any>;
export declare function deleteBooking({ slotId, name, email }: {
    slotId: number;
    name: string;
    email: string;
}): Promise<void>;
